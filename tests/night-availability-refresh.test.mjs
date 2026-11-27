import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

test('expiry and tab resume refresh once, remove listeners on close and ignore a repeated stale deadline', () => {
  let now = 10_000, timer, delay, calls = 0, slot = 0;
  const slots = [], browser = new EventTarget(), doc = new EventTarget();
  doc.hidden = false;
  browser.setTimeout = (callback, timeout) => {timer=callback;delay=timeout;return 1;};
  browser.clearTimeout = () => {timer=undefined;};
  const hooks = {
    useRef(initial) {const i=slot++;return slots[i] ??= {current:initial};},
    useEffect(body,deps) {
      const i=slot++, old=slots[i];
      if(old && deps.every((v,k)=>v===old.deps[k]))return;
      old?.cleanup?.();
      slots[i]={deps,cleanup:body()};
    }
  };
  const file = new URL('../src/components/night/use-availability-refresh.ts',import.meta.url);
  const {outputText} = ts.transpileModule(readFileSync(file,'utf8'),{
    compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}
  });
  const context={exports:{},require:()=>hooks,Date:{now:()=>now},document:doc,window:browser};
  vm.runInNewContext(outputText,context);
  function render(active,expiry) {
    slot=0;context.exports.useAvailabilityRefresh(active,'/search?available=1',expiry,()=>calls++);
  }
  render(true,11_000);
  assert.equal(delay,1001);
  doc.hidden=true;now=11_001;timer();
  assert.equal(calls,0);
  doc.hidden=false;doc.dispatchEvent(new Event('visibilitychange'));browser.dispatchEvent(new Event('focus'));
  assert.equal(calls,1);
  render(true,undefined);render(true,11_000);
  assert.equal(timer,undefined);
  now=12_100;browser.dispatchEvent(new Event('focus'));
  assert.equal(calls,2);
  render(true,13_000);now=13_001;timer();
  assert.equal(calls,3);
  render(false,13_000);now+=2000;browser.dispatchEvent(new Event('focus'));
  assert.equal(calls,3);assert.equal(timer,undefined);
});
