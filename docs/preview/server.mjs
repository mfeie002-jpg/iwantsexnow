import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const HOST = '127.0.0.1';
const PORT = 4182;
const indexPath = fileURLToPath(new URL('./index.html', import.meta.url));
const server = http.createServer(async (request, response) => {
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Referrer-Policy', 'no-referrer');
  response.setHeader('X-Robots-Tag', 'noindex, nofollow');
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; frame-src http://127.0.0.1:4181; img-src 'self' data:; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'");
  if (!['GET', 'HEAD'].includes(request.method || '')) {
    response.writeHead(405, { Allow: 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Read-only review gallery.');
    return;
  }
  let pathname;
  try { pathname = new URL(request.url || '/', `http://${HOST}:${PORT}`).pathname; }
  catch { response.writeHead(400); response.end(); return; }
  if (pathname === '/favicon.ico') { response.writeHead(204); response.end(); return; }
  if (!['/', '/index.html'].includes(pathname)) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end(request.method === 'HEAD' ? undefined : 'Not found.');
    return;
  }
  try {
    const html = await readFile(indexPath);
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Content-Length': html.length });
    response.end(request.method === 'HEAD' ? undefined : html);
  } catch {
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end(request.method === 'HEAD' ? undefined : 'Review page could not be read.');
  }
});
server.on('error', error => { console.error(`Review gallery: ${error.message}`); process.exitCode = 1; });
server.listen(PORT, HOST, () => console.log(`Swiss Night V2 review: http://${HOST}:${PORT} (read-only, loopback only)`));
