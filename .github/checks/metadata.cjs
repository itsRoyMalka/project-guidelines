const assert = require('node:assert/strict');
const PROJECT_ID = 'PVT_kwHOBtsoNc4BmpwX';
const REPOSITORY = 'itsRoyMalka/project-guidelines';

function validate({ pr, issue, commits, linked, projects }) {
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
  for (const heading of ['Issue', 'Change', 'Verification', 'Risks and recovery', 'Handoff']) {
    const section = new RegExp(`^## ${heading}\\s*\\n([\\s\\S]*?)(?=^## |$)`, 'm').exec(pr.body || '');
    assert(section && section[1].trim().length >= 8, `Fill the ${heading} section`);
  }
  assert(!/\b(close[sd]?|fix(?:e[sd])?|resolve[sd]?)\s+(?:#[0-9]+|https:\/\/github\.com\/[^\s]+\/issues\/\d+)/i.test(pr.body), 'Use non-closing references; verify Done separately');
  return key;
}

async function run({ github, context, core, projectGithub }) {
  const number = Number(context.payload.pull_request?.number || context.payload.inputs?.pull_request);
  assert(Number.isSafeInteger(number) && number > 0, 'Valid PR number required');
  assert(`${context.repo.owner}/${context.repo.repo}` === REPOSITORY, 'Wrong repository');
  const coordinates = { ...context.repo, pull_number: number };
  const { data: pr } = await github.rest.pulls.get(coordinates);
  const status = (state, description) => github.rest.repos.createCommitStatus({
    ...context.repo, sha: pr.head.sha, context: 'ticket-metadata', state, description,
    target_url: `${context.serverUrl}/${REPOSITORY}/actions/runs/${context.runId}`,
  });
  await status('pending', 'Checking issue, Project, link, keys and PR sections');
  try {
    assert(projectGithub, 'Configure PROJECT_READ_TOKEN with read access to the private Project');
    const match = /^GL-([1-9]\d*):/.exec(pr.title);
    assert(match, 'PR title requires a GL issue key');
    const issueNumber = Number(match[1]);
    const { data: issue } = await github.rest.issues.get({ ...context.repo, issue_number: issueNumber });
    const commits = await github.paginate(github.rest.pulls.listCommits, { ...coordinates, per_page: 100 });
    assert(commits.length < 250, 'Split oversized PR before review');
    const data = await projectGithub.graphql(`query($owner:String!,$repo:String!,$pr:Int!,$issue:Int!){
      repository(owner:$owner,name:$repo){
        issue(number:$issue){projectItems(first:100){nodes{project{id}} pageInfo{hasNextPage}}}
        pullRequest(number:$pr){closingIssuesReferences(first:100){nodes{number repository{nameWithOwner}} pageInfo{hasNextPage}}}
      }
    }`, { owner: context.repo.owner, repo: context.repo.repo, pr: number, issue: issueNumber });
    const items = data.repository.issue.projectItems;
    const links = data.repository.pullRequest.closingIssuesReferences;
    assert(!items.pageInfo.hasNextPage && !links.pageInfo.hasNextPage, 'Too many links/items; inspect manually');
    validate({ pr, issue, commits, linked: links.nodes.filter(n => n.repository.nameWithOwner === REPOSITORY).map(n => n.number), projects: items.nodes.map(n => n.project.id) });
    const { data: latest } = await github.rest.pulls.get(coordinates);
    assert(latest.head.sha === pr.head.sha && latest.title === pr.title && latest.body === pr.body && latest.base.sha === pr.base.sha, 'PR changed during check; rerun');
    await status('success', 'Issue, Project membership, Development link and metadata verified');
  } catch (error) {
    await status('failure', 'Metadata verification failed; inspect trusted workflow log');
    core.setFailed(error.message);
  }
}
module.exports = { validate, run, PROJECT_ID };
