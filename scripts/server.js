import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = process.cwd();
const port = Number(process.env.PORT) || 5173;
const allowed = new Set(['/index.html', '/src/main.js', '/src/game.js', '/src/style.css']);
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8' };

createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    const pathname = normalize(decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname)).replaceAll('\\', '/');
    if (!allowed.has(pathname)) throw new Error('Not found');
    const body = await readFile(join(root, pathname.slice(1)));
    response.writeHead(200, { 'Content-Type': types[extname(pathname)], 'Cache-Control':'no-cache', 'X-Content-Type-Options':'nosniff' });
    response.end(body);
  } catch { response.writeHead(404); response.end('Not found'); }
}).listen(port, () => console.log(`Эпохи: http://localhost:${port}`));
