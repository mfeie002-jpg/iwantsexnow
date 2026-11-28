import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
test('import workflows have no scheduled or automatic publication',()=>{
  for(const name of ['hourly-swiss-sync.yml','swiss-delta-harvester.yml']){
    const s=fs.readFileSync(new URL('../.github/workflows/'+name,import.meta.url),'utf8');
    assert.doesNotMatch(s,/schedule:|contents:\s*write|git push|FIRECRAWL_API_KEY/);
    assert.match(s,/Import disabled/);
  }
});
test('legacy mutation handlers are on hold and do not write or fetch',()=>{
  for(const name of ['import','cron']){
    const s=fs.readFileSync(new URL('../src/pages/api/indexer/'+name+'.ts',import.meta.url),'utf8');
    assert.match(s,/IMPORT_PRIVACY_HOLD/);
    assert.match(s,/status\(503\)/);
    assert.doesNotMatch(s,/fetch\(|writeFile|readFile|child_process|req\.query\.pin/);
  }
});
