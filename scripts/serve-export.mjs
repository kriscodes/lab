import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../out/', import.meta.url));
const port = Number(process.env.LAB_PREVIEW_PORT ?? 4174);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
};

// Serve the actual export, with deep links and real 404 responses; this is a local review tool only.
const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? '/', 'http://127.0.0.1');
    let target = resolve(root, `.${decodeURIComponent(url.pathname)}`);
    if (target !== resolve(root) && !target.startsWith(`${resolve(root)}${sep}`)) {
      response.writeHead(400);
      response.end('Invalid path');
      return;
    }
    if ((await stat(target)).isDirectory()) {
      if (!url.pathname.endsWith('/')) {
        response.writeHead(308, { Location: `${url.pathname}/${url.search}` });
        response.end();
        return;
      }
      target = resolve(target, 'index.html');
    }
    const content = await readFile(target);
    response.writeHead(200, {
      'Content-Type': mime[extname(target)] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    try {
      response.end(await readFile(resolve(root, '404.html')));
    } catch {
      response.end('Build Lab before previewing it.');
    }
  }
});

server.listen(port, '127.0.0.1', () => console.log(`Lab local preview: http://127.0.0.1:${port}/`));
