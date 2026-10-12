const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validate, PROJECT_ID } = require('./metadata.cjs');
const valid = () => ({
  pr: { title: 'GL-19: chore(workflow): adopt gates', head: {ref:'GL-19/chore-workflow'}, base:{ref:'main'}, body: ['Issue','Change','Verification','Risks and recovery','Handoff'].map(h => `## ${h}\nConcrete evidence for this section.\n`).join('\n') },
  issue: { number:19, title:'GL-19: Adopt workflow', state:'open' },
  commits: [{commit:{message:'GL-19: chore(workflow): adopt gates'}}], linked:[19], projects:[PROJECT_ID],
});
test('accepts a fully linked keyed change', () => assert.equal(validate(valid()), 'GL-19'));
for (const [name, change] of Object.entries({
  'missing real link': x => x.linked = [],
  'wrong Project': x => x.projects = ['other'],
  'wrong branch key': x => x.pr.head.ref = 'GL-20/chore-workflow',
  'wrong commit key': x => x.commits[0].commit.message = 'GL-20: chore: wrong',
  'missing issue': x => x.issue = null,
  'closed issue': x => x.issue.state = 'closed',
  'missing proof section': x => x.pr.body = 'Refs #19',
  'premature closure': x => x.pr.body += '\nCloses #19',
})) test(`rejects ${name}`, () => { const input=valid(); change(input); assert.throws(() => validate(input)); });
