const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { validatePullRequest, runMetadataCheck, PROJECT_ID } = require('./metadata.cjs');
const valid = () => ({
  pr: { title: 'GL-19: chore(workflow): adopt gates', head: {ref:'GL-19/chore-workflow'}, base:{ref:'main'}, body: ['Issue','Change','Verification','Risks and recovery','Handoff'].map(h => `## ${h}\n${h === 'Issue' ? 'Refs #19. Concrete issue reference.' : 'Concrete evidence for this section.'}\n`).join('\n') },
  issue: { number:19, title:'GL-19: Adopt workflow', state:'open' },
  commits: [{commit:{message:'GL-19: chore(workflow): adopt gates'}}], linked:[19], projects:[PROJECT_ID],
});
test('accepts a fully linked keyed change', () => assert.equal(validatePullRequest(valid()), 'GL-19'));
for (const [name, change] of Object.entries({
  'untouched template': x => x.pr.body = fs.readFileSync(path.join(__dirname, '../PULL_REQUEST_TEMPLATE.md'), 'utf8'),
  'mismatched issue prose': x => x.pr.body = x.pr.body.replace('Refs #19', 'Refs #20'),
  'duplicate headings': x => x.pr.body += '\n## Verification\nContradictory proof.\n',
  'missing real link': x => x.linked = [],
  'wrong Project': x => x.projects = ['other'],
  'wrong branch key': x => x.pr.head.ref = 'GL-20/chore-workflow',
  'wrong commit key': x => x.commits[0].commit.message = 'GL-20: chore: wrong',
  'missing issue': x => x.issue = null,
  'closed issue': x => x.issue.state = 'closed',
  'missing proof section': x => x.pr.body = 'Refs #19',
  'premature closure': x => x.pr.body += '\nCloses #19',
})) test(`rejects ${name}`, () => { const input=valid(); change(input); assert.throws(() => validatePullRequest(input)); });

function createWorkflowHarness({ missingToken = false, apiFailure = false, moveHead = false, removeProject = false } = {}) {
  const input = valid();
  input.pr.state = 'open';
  input.pr.head.sha = 'candidate-sha';
  input.pr.base.sha = 'base-sha';
  let reads = 0;
  let relationshipReads = 0;
  const statuses = [];
  const failures = [];
  const github = {
    rest: {
      pulls: {
        get: async () => {
          reads += 1;
          const pr = structuredClone(input.pr);
          if (moveHead && reads > 1) pr.head.sha = 'newer-sha';
          return { data: pr };
        },
        listCommits: Symbol('listCommits'),
      },
      issues: { get: async () => ({ data: structuredClone(input.issue) }) },
      repos: { createCommitStatus: async value => statuses.push(value) },
    },
    paginate: async () => input.commits,
  };
  const projectGithub = missingToken ? null : {
    graphql: async () => {
      if (apiFailure) throw new Error('Project API unavailable');
      relationshipReads += 1;
      return { repository: {
        issue: { projectItems: {
          nodes: removeProject && relationshipReads > 1 ? [] : [{ project: { id: PROJECT_ID } }],
          pageInfo: { hasNextPage: false },
        } },
        pullRequest: { closingIssuesReferences: {
          nodes: [{ number: 19, repository: { nameWithOwner: 'itsRoyMalka/project-guidelines' } }],
          pageInfo: { hasNextPage: false },
        } },
      } };
    },
  };
  return {
    statuses, failures,
    options: {
      github, projectGithub,
      core: { setFailed: message => failures.push(message) },
      context: {
        repo: { owner: 'itsRoyMalka', repo: 'project-guidelines' },
        payload: { pull_request: { number: 21 } },
        serverUrl: 'https://github.com', runId: 123,
      },
    },
  };
}

test('workflow publishes success only for the checked candidate', async () => {
  const harness = createWorkflowHarness();
  await runMetadataCheck(harness.options);
  assert.deepEqual(harness.statuses.map(status => status.state), ['pending', 'success']);
  assert(harness.statuses.every(status => status.sha === 'candidate-sha'));
  assert.deepEqual(harness.failures, []);
});

for (const scenario of ['missingToken', 'apiFailure', 'moveHead', 'removeProject']) {
  test(`workflow fails closed for ${scenario}`, async () => {
    const harness = createWorkflowHarness({ [scenario]: true });
    await runMetadataCheck(harness.options);
    assert.deepEqual(harness.statuses.map(status => status.state), ['pending', 'failure']);
    assert.equal(harness.failures.length, 1);
  });
}
