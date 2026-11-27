import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const workflow = readFileSync(new URL('../.github/workflows/production-check.yml', import.meta.url), 'utf8');

test('the production check runs on main pushes, pull requests and manual dispatch', () => {
  for (const trigger of ['push', 'pull_request']) {
    assert.match(workflow, new RegExp('^  ' + trigger + ':\\s*\\n\\s*branches: *\\[main\\]', 'm'));
  }
  assert.match(workflow, /^  workflow_dispatch:/m);
});

test('installation, build and regression failures propagate to the GitHub check', () => {
  assert.match(workflow, /^\s*run: npm ci --legacy-peer-deps\s*$/m);
  assert.match(workflow, /^\s*run: npm run build\s*$/m);
  assert.match(workflow, /^\s*node --test tests\/\*\.test\.mjs\s*$/m);
  assert.doesNotMatch(workflow, /continue-on-error:\s*true/i);
});
