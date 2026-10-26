// Internal aggregate audit only. Never emits listing identities or contact data.
const fs = require('node:fs');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');

const files = ['harvested-offers.json', 'swiss-establishments-vault.json',
  'approved-public-offers.json', 'rosalon-scale-vault.jsonl'];
const inventories = files.map(file => {
  const bytes = fs.readFileSync('src/data/' + file);
  const rows = file.endsWith('.jsonl')
    ? bytes.toString('utf8').split(/\r?\n/).filter(line => line.trim()).map(line => JSON.parse(line))
    : JSON.parse(bytes.toString('utf8'));
  if (!Array.isArray(rows)) throw new Error('Expected array: ' + file);
  const urls = rows.map(row => row.sourceUrl).filter(value => typeof value === 'string' && value);
  const parsed = urls.map(value => { try { return new URL(value); } catch { return null; } });
  return {
    file, rows: rows.length,
    distinctSourceUrlStrings: new Set(urls).size,
    rowsWithoutHttpSourceUrl: rows.length - parsed.filter(url => url && ['http:', 'https:'].includes(url.protocol)).length,
    exampleHostRows: parsed.filter(url => url && (url.hostname === 'example.com' || url.hostname.endsWith('.example.com'))).length,
    missingThumbnailRows: rows.some(row => Object.hasOwn(row, 'thumbnail'))
      ? rows.filter(row => !row.thumbnail).length : null,
    gitBlob: crypto.createHash('sha1').update('blob ' + bytes.length + '\0').update(bytes).digest('hex'),
  };
});
console.log(JSON.stringify({
  auditedSourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  countingUnit: 'source observations; never verified people or independently verified establishments',
  liveSourceAvailabilityChecked: false,
  imageRightsOrCurrentImageAvailabilityChecked: false,
  inventories,
}, null, 2));
