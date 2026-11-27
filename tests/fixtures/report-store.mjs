// Local-only PostgREST contract fixture for manual browser QA. No external I/O.
// node tests/fixtures/report-store.mjs 4187
import http from 'node:http';

const port = Number(process.argv[2] || 4187);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw Error('Invalid fixture port');
const rows = new Map();
const calls = [];
let loseNextResponse = true;
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  const reply = (status, value) => {
    if (res.destroyed) return;
    res.writeHead(status, {'Content-Type': 'application/json', 'Cache-Control': 'no-store'});
    res.end(JSON.stringify(value));
  };
  if (req.method === 'GET' && url.pathname === '/__test/state') {
    return reply(200, {rowCount: rows.size, caseIds: [...rows.keys()], calls});
  }
  if (req.headers.apikey !== 'synthetic-report-qa-only' || req.headers.authorization !== 'Bearer synthetic-report-qa-only') {
    return reply(403, {error: 'Synthetic fixture credentials required'});
  }
  if (req.method === 'GET' && url.pathname === '/rest/v1/managed_profile_states') return reply(200, []);
  if (url.pathname !== '/rest/v1/iwsn_report_cases') return reply(404, {error: 'Unsupported fixture route'});
  if (req.method === 'GET') {
    const id = url.searchParams.get('case_id')?.replace(/^eq\./, '');
    const select = url.searchParams.get('select');
    calls.push({method: 'GET', caseId: id, select});
    const row = rows.get(id);
    return reply(200, row ? [Object.fromEntries(select.split(',').map(key => [key, row[key]]))] : []);
  }
  if (req.method !== 'POST' || url.searchParams.get('on_conflict') !== 'case_id' || req.headers.prefer !== 'resolution=ignore-duplicates,return=representation') {
    return reply(400, {error: 'Expected atomic ignore-duplicate request'});
  }
  let text = '';
  for await (const chunk of req) {
    text += chunk;
    if (text.length > 10000) return reply(413, {error: 'Oversize fixture payload'});
  }
  let row;
  try { row = JSON.parse(text); } catch { return reply(400, {error: 'Invalid JSON'}); }
  if (row.profile_id !== 'synthetic-report-idempotency' || row.contact !== '') return reply(400, {error: 'Use only the synthetic QA reference and no contact'});
  const duplicate = rows.has(row.case_id);
  if (!duplicate) rows.set(row.case_id, structuredClone(row));
  calls.push({method: 'POST', caseId: row.case_id, duplicate, committed: true});
  if (!duplicate && loseNextResponse) {
    loseNextResponse = false;
    // Commit is visible, but the first response arrives after the app's 10s limit.
    const timer = setTimeout(() => reply(201, [row]), 11000);
    timer.unref();
    return;
  }
  return reply(201, duplicate ? [] : [row]);
});
server.listen(port, '127.0.0.1', () => console.log(`Synthetic report fixture listening on 127.0.0.1:${port}; first write response is delayed.`));
