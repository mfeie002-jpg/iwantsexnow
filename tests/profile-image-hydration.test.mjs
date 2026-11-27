import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import * as imageModel from '../src/components/night/profile-image-model.ts';

const componentCode = ts.transpileModule(
  fs.readFileSync(new URL('../src/components/night/ProfileImage.tsx', import.meta.url), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.React, esModuleInterop: true } },
).outputText;

// Exercise the real component's rendered props, ref and effects. The image's
// completion state stands in for the DOM state already present at hydration.
function mount(photos, imageState) {
  const slots = [];
  let cursor = 0, effects = [], dirty = false, rendered;
  const hooks = {
    ...React,
    useMemo: calculate => calculate(),
    useCallback: callback => callback,
    useRef(initial) { const index = cursor++; return slots[index] ||= { current: initial }; },
    useEffect(effect) { effects.push(effect); },
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = typeof initial === 'function' ? initial() : initial;
      return [slots[index], update => {
        const next = typeof update === 'function' ? update(slots[index]) : update;
        if (!Object.is(next, slots[index])) { slots[index] = next; dirty = true; }
      }];
    },
  };
  const exports = {};
  vm.runInNewContext(componentCode, { exports, require: id => {
    if (id === 'react') return hooks;
    if (id === 'lucide-react') return { ImageOff: () => null };
    if (id === './profile-image-model') return imageModel;
    throw new Error(`Unexpected component dependency: ${id}`);
  } });
  function settle() {
    for (let attempt = 0; attempt < 10; attempt++) {
      cursor = 0; effects = []; dirty = false;
      rendered = exports.ProfileImage({ photos, alt: 'Original profile photo' });
      if (rendered.type === 'img' && rendered.ref) {
        const node = imageState(rendered.props.src);
        if (typeof rendered.ref === 'function') rendered.ref(node);
        else rendered.ref.current = node;
      }
      for (const effect of effects) effect();
      if (!dirty) return rendered;
    }
    throw new Error('Image component failed to settle');
  }
  settle();
  return { current: () => rendered, settle };
}

test('an image that failed before hydration becomes neutral without a new error event', () => {
  const view = mount(['/uploads/provider/one.jpg'], () => ({ complete: true, naturalWidth: 0 }));
  assert.equal(view.current().type, 'div');
  assert.equal(view.current().props.role, 'img');
  assert.equal(view.current().props['aria-label'], 'Profilfoto derzeit nicht verfügbar');
});

test('a pre-hydration failure advances to the next original source', () => {
  const view = mount(['/uploads/provider/one.jpg', '/uploads/provider/two.jpg'], src => ({ complete: true, naturalWidth: src.endsWith('/two.jpg') ? 640 : 0 }));
  assert.equal(view.current().type, 'img');
  assert.equal(view.current().props.src, '/uploads/provider/two.jpg');
});

test('a pending lazy image is not mistaken for a failed image', () => {
  const view = mount(['/uploads/provider/one.jpg'], () => ({ complete: false, naturalWidth: 0 }));
  assert.equal(view.current().type, 'img');
  assert.equal(view.current().props.src, '/uploads/provider/one.jpg');
});

test('a successfully loaded image remains visible after hydration', () => {
  const view = mount(['/uploads/provider/one.jpg'], () => ({ complete: true, naturalWidth: 640 }));
  assert.equal(view.current().type, 'img');
  assert.equal(view.current().props.alt, 'Original profile photo');
});

test('later and duplicate errors exhaust only the supplied originals before neutral fallback', () => {
  const view = mount(['/uploads/provider/one.jpg', '/uploads/provider/two.jpg'], () => ({ complete: false, naturalWidth: 0 }));
  const firstFailure = view.current().props.onError;
  firstFailure(); firstFailure();
  assert.equal(view.settle().props.src, '/uploads/provider/two.jpg');
  view.current().props.onError();
  assert.equal(view.settle().type, 'div');
});
