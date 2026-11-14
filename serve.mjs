// A tiny static file server for playing Fairllion locally: `node serve.mjs`.
// No dependencies. It serves this folder on http://localhost:5173.

import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)));
const port = Number(process.env.PORT) || 5173;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    let path = decodeURIComponent(url.pathname);
    if (path.endsWith('/')) path += 'index.html';
    const file = normalize(join(root, path));
    // Never serve anything outside this folder, or dot-files inside it.
    if (file !== root && !file.startsWith(root + sep)) throw Object.assign(new Error('Forbidden'), { code: 403 });
    if (path.split('/').some((part) => part.startsWith('.'))) throw Object.assign(new Error('Not found'), { code: 404 });
    const info = await stat(file);
    if (!info.isFile()) throw Object.assign(new Error('Not found'), { code: 404 });
    res.writeHead(200, {
      'Content-Type': TYPES[extname(file).toLowerCase()] || 'application/octet-stream',
      'Content-Length': info.size,
      'Cache-Control': 'no-cache',
    });
    if (req.method === 'HEAD') return res.end();
    createReadStream(file).pipe(res);
  } catch (error) {
    const code = error.code === 403 ? 403 : 404;
    res.writeHead(code, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(code === 403 ? 'Forbidden' : 'Not found');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Fairllion is running at http://localhost:${port}`);
});
