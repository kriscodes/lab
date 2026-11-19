/** @file Serves the built static site locally with direct routes, uncached assets, and real 404s. */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const exportDirectory = fileURLToPath(new URL('../out/', import.meta.url));
const previewPort = Number(process.env.LAB_PREVIEW_PORT ?? 4174);
const contentTypesByExtension = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
};

/** Resolves one preview request inside the export directory and returns the matching static file. */
async function serveExportedFile(request, response) {
  try {
    const requestedUrl = new URL(request.url ?? '/', 'http://127.0.0.1');
    let requestedFilePath = resolve(
      exportDirectory,
      `.${decodeURIComponent(requestedUrl.pathname)}`,
    );
    if (
      requestedFilePath !== resolve(exportDirectory) &&
      !requestedFilePath.startsWith(`${resolve(exportDirectory)}${sep}`)
    ) {
      response.writeHead(400);
      response.end('Invalid path');
      return;
    }
    if ((await stat(requestedFilePath)).isDirectory()) {
      if (!requestedUrl.pathname.endsWith('/')) {
        response.writeHead(308, { Location: `${requestedUrl.pathname}/${requestedUrl.search}` });
        response.end();
        return;
      }
      requestedFilePath = resolve(requestedFilePath, 'index.html');
    }
    const fileContent = await readFile(requestedFilePath);
    response.writeHead(200, {
      'Content-Type':
        contentTypesByExtension[extname(requestedFilePath)] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    response.end(request.method === 'HEAD' ? undefined : fileContent);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    try {
      response.end(await readFile(resolve(exportDirectory, '404.html')));
    } catch {
      response.end('Build Lab before previewing it.');
    }
  }
}

/** Prints the loopback address after the preview server begins accepting requests. */
function announcePreviewAddress() {
  console.log(`Lab local preview: http://127.0.0.1:${previewPort}/`);
}

const previewServer = createServer(serveExportedFile);
previewServer.listen(previewPort, '127.0.0.1', announcePreviewAddress);
