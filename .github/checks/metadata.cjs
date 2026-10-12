const assert = require('node:assert/strict');
const PROJECT_ID = 'PVT_kwHOBtsoNc4BmpwX';
const REPOSITORY = 'itsRoyMalka/project-guidelines';
const REQUIRED_SECTIONS = ['Issue', 'Change', 'Verification', 'Risks and recovery', 'Handoff'];
const STATUS = { Pending: 'pending', Success: 'success', Failure: 'failure' };

function readSections(body) {
  const headings = [...body.matchAll(/^## ([^\n]+)\n/gm)];
  const sections = new Map();
  for (let index = 0; index < headings.length; index += 1) {
    const heading = headings[index];
    const name = heading[1].trim();
    assert(!sections.has(name), `Duplicate PR section: ${name}`);
    const end = headings[index + 1]?.index ?? body.length;
    const content = body.slice(heading.index + heading[0].length, end)
      .replace(/<!--[\s\S]*?-->/g, '').trim();
    sections.set(name, content);
  }
  return sections;
}


function validatePullRequest({ pr, issue, commits, linked, projects }) {
  const match = /^GL-([1-9]\d*): (feat|fix|chore|docs|refactor|test|perf)(\([a-z0-9-]+\))?: .+/.exec(pr.title);
  assert(match, 'PR title must be GL-<number>: type(scope): outcome');
  const key = `GL-${match[1]}`;
  assert(pr.base.ref === 'main', 'Target must be main');
  assert(pr.head.ref.startsWith(`${key}/`) && /^GL-\d+\/(feat|fix|chore|docs|refactor|test|perf)-[a-z0-9-]+$/.test(pr.head.ref), 'Branch must use the matching key/type');
  assert(issue && !issue.pull_request && issue.number === Number(match[1]), 'Matching real issue required');
  assert(issue.state === 'open' && issue.title.startsWith(`${key}: `), 'Issue must be open and keyed');
  assert(linked.includes(issue.number), 'Link the matching issue in the PR Development sidebar');
  assert(projects.includes(PROJECT_ID), 'Issue must belong to the authoritative Project');
  assert(commits.length && commits.every(c => new RegExp(`^${key}: (feat|fix|chore|docs|refactor|test|perf)(\\([a-z0-9-]+\\))?: .+`).test(c.commit.message.split('\n')[0])), 'Every commit must use the matching key/type');
  const sections = readSections((pr.body || '').replace(/\r\n/g, '\n'));
  for (const heading of REQUIRED_SECTIONS) {
    assert((sections.get(heading) || '').length >= 8, `Fill the ${heading} section`);
  }
  assert(new RegExp(`\\bRefs #${issue.number}\\b`).test(sections.get('Issue')), 'Issue section must reference the matching issue');
  assert(!/\b(close[sd]?|fix(?:e[sd])?|resolve[sd]?)\s+(?:#[0-9]+|https:\/\/github\.com\/[^\s]+\/issues\/\d+)/i.test(pr.body), 'Use non-closing references; verify Done separately');
  return key;
}

async function runMetadataCheck({ github, context, core, projectGithub }) {
  const number = Number(context.payload.pull_request?.number || context.payload.inputs?.pull_request);
  assert(Number.isSafeInteger(number) && number > 0, 'Valid PR number required');
  assert(`${context.repo.owner}/${context.repo.repo}` === REPOSITORY, 'Wrong repository');
  const coordinates = { ...context.repo, pull_number: number };
  const { data: pr } = await github.rest.pulls.get(coordinates);
  const status = (state, description) => github.rest.repos.createCommitStatus({
    ...context.repo, sha: pr.head.sha, context: 'ticket-metadata', state, description,
    target_url: `${context.serverUrl}/${REPOSITORY}/actions/runs/${context.runId}`,
  });
  await status(STATUS.Pending, 'Checking issue, Project, link, keys and PR sections');
  try {
    assert(projectGithub, 'Configure PROJECT_READ_TOKEN with read access to the private Project');
    const match = /^GL-([1-9]\d*):/.exec(pr.title);
    assert(match, 'PR title requires a GL issue key');
    const issueNumber = Number(match[1]);
    const { data: issue } = await github.rest.issues.get({ ...context.repo, issue_number: issueNumber });
    const commits = await github.paginate(github.rest.pulls.listCommits, { ...coordinates, per_page: 100 });
    assert(commits.length < 250, 'Split oversized PR before review');
    const readRelationships = () => projectGithub.graphql(`query($owner:String!,$repo:String!,$pr:Int!,$issue:Int!){
      repository(owner:$owner,name:$repo){
        issue(number:$issue){projectItems(first:100){nodes{project{id}} pageInfo{hasNextPage}}}
        pullRequest(number:$pr){closingIssuesReferences(first:100){nodes{number repository{nameWithOwner}} pageInfo{hasNextPage}}}
      }
    }`, { owner: context.repo.owner, repo: context.repo.repo, pr: number, issue: issueNumber });
    const data = await readRelationships();
    const items = data.repository.issue.projectItems;
    const links = data.repository.pullRequest.closingIssuesReferences;
    assert(!items.pageInfo.hasNextPage && !links.pageInfo.hasNextPage, 'Too many links/items; inspect manually');
    validatePullRequest({ pr, issue, commits, linked: links.nodes.filter(n => n.repository.nameWithOwner === REPOSITORY).map(n => n.number), projects: items.nodes.map(n => n.project.id) });
    const { data: latest } = await github.rest.pulls.get(coordinates);
    assert(
      latest.state === 'open' && latest.head.sha === pr.head.sha &&
      latest.title === pr.title && latest.body === pr.body &&
      latest.base.sha === pr.base.sha && latest.base.ref === pr.base.ref &&
      latest.head.ref === pr.head.ref,
      'PR changed during check; rerun',
    );
    const { data: currentIssue } = await github.rest.issues.get({ ...context.repo, issue_number: issueNumber });
    const currentRelationships = await readRelationships();
    assert(currentIssue.state === issue.state && currentIssue.title === issue.title &&
      JSON.stringify(currentRelationships) === JSON.stringify(data),
      'Issue or Project relationship changed during check; rerun');
    await status(STATUS.Success, 'Issue, Project membership, Development link and metadata verified');
  } catch (error) {
    await status(STATUS.Failure, 'Metadata verification failed; inspect trusted workflow log');
    core.setFailed(error.message);
  }
}
module.exports = { validatePullRequest, runMetadataCheck, PROJECT_ID };
