import test from 'node:test';
import assert from 'node:assert/strict';
import {matchesRasterSignature as valid} from '../src/lib/image-file.ts';
const bytes=(prefix)=>Uint8Array.from([...prefix,...Array(40).fill(0)]);
const ascii=s=>Array.from(s,c=>c.charCodeAt(0));
test('real raster signatures are accepted for their matching MIME type',()=>{
 assert.ok(valid(bytes([255,216,255]),'image/jpeg'));
 assert.ok(valid(bytes([137,80,78,71,13,10,26,10]),'image/png'));
 assert.ok(valid(bytes(ascii('RIFF0000WEBP')),'image/webp'));
 assert.ok(valid(bytes(ascii('GIF89a')),'image/gif'));
 assert.ok(valid(bytes([0,0,0,24,...ascii('ftypavif')]),'image/avif'));
});
test('HTML, SVG and mismatched payloads cannot pass an image MIME label',()=>{
 for(const type of ['image/jpeg','image/png','image/webp','image/gif','image/avif'])for(const data of ['<!DOCTYPE html>','<svg onload="alert(1)">','access denied'])assert.equal(valid(bytes(ascii(data)),type),false);
 assert.equal(valid(bytes([255,216,255]),'image/png'),false);
});
