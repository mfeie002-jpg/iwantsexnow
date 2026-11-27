import test from 'node:test';
import assert from 'node:assert/strict';
import { chooseComparisonProfile, nextProfileImage, profileImageCandidates, profileImageSource, reconcileComparisonPair, resolveSelectedProfiles } from '../src/components/night/profile-image-model.ts';

test('real source candidates survive while AI, stock, site backgrounds and unsafe targets do not', () => {
  const original='https://images.xdate.ch/cache/insertion_gallery/real-photo.jpg';
  const candidates=profileImageCandidates(['/images/ai/portraits/p1.webp','https://images.unsplash.com/photo-123.jpg','https://www.xdate.ch/img/bg_blur.jpg','https://www.fgirl.ch/static/avatar-default.jpg','https://example.com/image.jpg','javascript:alert(1)','http://127.0.0.1/image.jpg','https://user:pass@images.xdate.ch/a.jpg','/images/brand/v2/hero.png',original,original]);
  assert.deepEqual(candidates,['/api/img?u='+encodeURIComponent(original)]);
});
test('an unavailable original advances only to another real candidate then neutral absence', () => {
  const candidates=profileImageCandidates(['https://images.xdate.ch/one.jpg','https://images.xdate.ch/two.jpg']);
  const failed=new Set();assert.equal(nextProfileImage(candidates,failed),candidates[0]);
  failed.add(candidates[0]);assert.equal(nextProfileImage(candidates,failed),candidates[1]);
  failed.add(candidates[1]);assert.equal(nextProfileImage(candidates,failed),null);
});
test('real uploaded files are retained and traversal/encoded substitutions are rejected', () => {
  assert.equal(profileImageSource('/uploads/owner/photo.webp'),'/uploads/owner/photo.webp');
  assert.equal(profileImageSource('/uploads/../images/ai/portraits/p1.webp'),null);
  assert.equal(profileImageSource('https://cdn.example.org/%62g_blur.jpg'),null);
  assert.equal(profileImageSource('//attacker.example/image.jpg'),null);
});
test('proxy source normalization is idempotent and preserves useful source parameters', () => {
  const source=profileImageSource('https://images.xdate.ch/photo.jpg?size=large&iwsn_clean=1&crop=5&mask=bottom');
  assert.equal(source,'/api/img?u='+encodeURIComponent('https://images.xdate.ch/photo.jpg?size=large'));
  assert.equal(profileImageSource(source),source);
});
test('selection is user supplied, stable, unique and excludes invisible/unknown profiles', () => {
  const offers=[{id:'a'},{id:'b'},{id:'c'}];
  assert.deepEqual(resolveSelectedProfiles(offers,[],o=>o.id),[]);
  assert.deepEqual(resolveSelectedProfiles(offers,['c','a','c','blocked'],o=>o.id).map(o=>o.id),['c','a']);
});
test('mobile comparison keeps two distinct selected profiles and handles removal', () => {
  assert.deepEqual(reconcileComparisonPair(['a','b','c'],[]),['a','b']);
  assert.deepEqual(chooseComparisonProfile(['a','b','c'],['a','b'],0,'b'),['b','a']);
  assert.deepEqual(chooseComparisonProfile(['a','b','c'],['a','b'],1,'c'),['a','c']);
  assert.deepEqual(reconcileComparisonPair(['b','c'],['a','c']),['c','b']);
  assert.deepEqual(chooseComparisonProfile(['a','b'],['a','b'],0,'unknown'),['a','b']);
});
