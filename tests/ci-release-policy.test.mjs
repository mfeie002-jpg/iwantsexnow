import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const workflow = fs.readFileSync(new URL('../.github/workflows/production-check.yml', import.meta.url), 'utf8');

test('CI runs on main pushes, pull requests and manual dispatch', () => {
  assert.match(workflow, /push:\s*\n\s*branches:\s*\[main\]/);
  assert.match(workflow, /pull_request:\s*\n\s*branches:\s*\[main\]/);
  assert.match(workflow, /workflow_dispatch:/);
});

test('CI installation, lint, typecheck and build must never ignore failures', () => {
  for (const command of [
    'npm ci --legacy-peer-deps',
    'npm run lint -- --quiet',
    'npx tsc --noEmit --pretty false',
    'npm run build',
    'node --test tests/*.test.mjs'
  ]) assert.ok(workflow.includes(command), 'required quality step missing: ' + command);
  assert.doesNotMatch(workflow, /npm\s+(?:ci|install|run\s+(?:build|lint))[^\n]*\|\|\s*true/i);
  assert.doesNotMatch(workflow, /node\s+--test[^\n]*\|\|\s*true/i);
});
