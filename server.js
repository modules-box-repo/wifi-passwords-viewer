// .. http server
import { exec } from 'node:child_process';
import { createServer } from 'node:http';
import { stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const publicDir = root;
const port = Number(process.env.PORT || 3000);

const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.ico': 'image/x-icon' };

function sendJson(response, status, body) {
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  response.end(JSON.stringify(body));
}

function runWpv(response) {
  exec('sh wpv', { cwd: root, timeout: 10000, maxBuffer: 1024 * 1024 }, (error, stdout) => {
    if (error) return sendJson(response, 500, { output: stdout || '' });
    sendJson(response, 200, { output: stdout || '' });
  });
}

async function serveFile(requestPath, response) {
  const cleanPath = requestPath === '/' ? '/index.html' : requestPath;
  const filePath = normalize(join(publicDir, cleanPath));
  if (!filePath.startsWith(publicDir)) return sendJson(response, 404, { error: 'Not found' });
  try {
    const info = await stat(filePath);
    if (!info.isFile()) throw new Error('Not a file');
    response.writeHead(200, { 'content-type': types[extname(filePath)] || 'application/octet-stream' });
    createReadStream(filePath).pipe(response);
  } catch {
    if (requestPath !== '/') return serveFile('/', response);
    sendJson(response, 404, { error: 'Not found' });
  }
}

createServer((request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
  if (url.pathname === '/api/networks') return runWpv(response);
  return serveFile(url.pathname, response);
}).listen(port, () => console.log(`Wifi Passwords Viewer running at http://localhost:${port}`));
