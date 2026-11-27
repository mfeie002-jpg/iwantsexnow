import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { IMAGE_VISIBILITY_BOOTSTRAP } from '../src/lib/night-image-visibility.ts';

test('a saved hidden-image preference is applied before page content', () => {
 const document={body:{dataset:{}}};
 vm.runInNewContext(IMAGE_VISIBILITY_BOOTSTRAP,{document,sessionStorage:{getItem:()=> '1'}});
 assert.equal(document.body.dataset.nightImagesHidden,'true');
});
test('image preference bootstrap does not enable hiding without explicit preference', () => {
 for(const value of [null,'0','true','garbage']){
  const document={body:{dataset:{}}};
  vm.runInNewContext(IMAGE_VISIBILITY_BOOTSTRAP,{document,sessionStorage:{getItem:()=>value}});
  assert.equal(document.body.dataset.nightImagesHidden,undefined);
 }
});
test('denied session storage does not break page rendering', () => {
 const document={body:{dataset:{}}};
 assert.doesNotThrow(()=>vm.runInNewContext(IMAGE_VISIBILITY_BOOTSTRAP,{document,sessionStorage:{getItem:()=>{throw Error('Denied');}}}));
 assert.equal(document.body.dataset.nightImagesHidden,undefined);
});
