import { readdir, readFile } from 'node:fs/promises';
import { dirname, extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ORIGIN = 'https://lab.kristiansalmeron.com';
const ROUTES = ['/', '/experiments/', '/experiments/pdf-rendering/', '/methodology/'];

/** Decode resource and metadata values without requiring a runtime HTML parser. */
function decode(value) {
  return value.replace(
    /&(?:amp|quot|apos|lt|gt);/gu,
    (entity) => ({ '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>' })[entity],
  );
}

/** Ignore script payloads so serialized React markup is not mistaken for real tags. */
function readTags(html) {
  const markup = html
    .replace(/<!--[\s\S]*?-->/gu, '')
    .replace(/(<script\b[^>]*>)[\s\S]*?<\/script>/giu, '$1</script>');
  return [...markup.matchAll(/<([a-z][\w:-]*)\b((?:"[^"]*"|'[^']*'|[^'">])*)>/giu)].map((match) => {
    const attributes = Object.fromEntries(
      [...match[2].matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/gu)].map(
        (attribute) => [
          attribute[1].toLowerCase(),
          decode(attribute[2] ?? attribute[3] ?? attribute[4] ?? ''),
        ],
      ),
    );
    return { name: match[1].toLowerCase(), attributes };
  });
}

/** Enumerate only files inside the publish directory; do not follow symbolic links. */
async function listFiles(directory, root = directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isSymbolicLink())
      throw new Error(`Public export contains a symbolic link: ${relative(root, path)}`);
    if (entry.isDirectory()) files.push(...(await listFiles(path, root)));
    else files.push(relative(root, path).replaceAll('\\', '/'));
  }
  return files;
}

/** Audit generated static documents and their local dependencies without network requests. */
export async function verifyExport(
  directory = resolve(dirname(fileURLToPath(import.meta.url)), '../out'),
) {
  const root = resolve(directory);
  const errors = [];
  let files;
  try {
    files = await listFiles(root);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return {
      errors: ['Static export is missing. Run the production build first.'],
      pageCount: 0,
      assetCount: 0,
    };
  }
  const names = new Set(files);
  const documents = new Map();
  const assets = new Set();
  for (const name of files.filter((name) => name.endsWith('.html'))) {
    const html = await readFile(resolve(root, name), 'utf8');
    documents.set(name, { html, tags: readTags(html) });
  }

  /** Map an on-site URL to the file emitted by a trailing-slash static export. */
  function localFile(pathname) {
    const path = decodeURIComponent(pathname).replace(/^\/+|\/+$/gu, '');
    if (!path) return 'index.html';
    return extname(path) ? path : `${path}/index.html`;
  }

  /** Check real local resources and page destinations, including static fragment targets. */
  function checkReference(value, source, { resource = true, local = false } = {}) {
    if (!value || /^(?:data:|mailto:|tel:)/iu.test(value)) return;
    let url;
    try {
      url = new URL(value, `${ORIGIN}/${source}`);
    } catch {
      errors.push(`${source}: invalid URL ${value}`);
      return;
    }
    if (!['http:', 'https:'].includes(url.protocol)) {
      errors.push(`${source}: unsupported URL ${value}`);
      return;
    }
    if (url.origin !== ORIGIN) {
      if (local) errors.push(`${source}: expected a local resource (${value})`);
      return;
    }
    let target;
    try {
      target = localFile(url.pathname);
    } catch {
      errors.push(`${source}: invalid URL encoding ${value}`);
      return;
    }
    if (!names.has(target)) {
      errors.push(`${source}: missing local target ${value}`);
      return;
    }
    if (resource) assets.add(target);
    if (!resource && url.hash && documents.has(target)) {
      let fragment;
      try {
        fragment = decodeURIComponent(url.hash.slice(1));
      } catch {
        errors.push(`${source}: invalid fragment ${value}`);
        return;
      }
      if (!documents.get(target).tags.some((tag) => tag.attributes.id === fragment))
        errors.push(`${source}: missing fragment target ${value}`);
    }
  }

  for (const route of ROUTES) {
    const name = localFile(route);
    const document = documents.get(name);
    if (!document) {
      errors.push(`${route}: exported page is missing`);
      continue;
    }
    const { tags, html } = document;
    const title = html.match(/<title\b[^>]*>([^<]+)<\/title>/iu)?.[1]?.trim();
    if (!title || !/Lab/iu.test(title)) errors.push(`${route}: meaningful Lab title is missing`);
    if (tags.filter((tag) => tag.name === 'h1').length !== 1)
      errors.push(`${route}: expected one visible page heading`);
    if (!tags.some((tag) => tag.name === 'main')) errors.push(`${route}: main landmark is missing`);
    if (!tags.some((tag) => tag.name === 'html' && tag.attributes.lang))
      errors.push(`${route}: document language is missing`);
    const canonical = tags.filter(
      (tag) => tag.name === 'link' && tag.attributes.rel === 'canonical',
    );
    if (canonical.length !== 1 || canonical[0].attributes.href !== `${ORIGIN}${route}`)
      errors.push(`${route}: canonical URL must match the public route`);
    for (const key of [
      'description',
      'og:title',
      'og:description',
      'og:url',
      'og:image',
      'twitter:card',
      'twitter:image',
    ]) {
      const values = tags.filter(
        (tag) => tag.name === 'meta' && (tag.attributes.name ?? tag.attributes.property) === key,
      );
      if (values.length !== 1 || !values[0].attributes.content?.trim()) {
        errors.push(`${route}: expected one nonempty ${key} value`);
        continue;
      }
      const value = values[0].attributes.content;
      if (key === 'og:url' && value !== `${ORIGIN}${route}`)
        errors.push(`${route}: og:url does not match its canonical`);
      if (key === 'twitter:card' && value !== 'summary_large_image')
        errors.push(`${route}: Twitter card should include the social preview`);
      if (key.endsWith('image')) checkReference(value, name, { local: true });
    }
    if (
      tags.some(
        (tag) =>
          tag.name === 'meta' &&
          tag.attributes.name === 'robots' &&
          /noindex|none/iu.test(tag.attributes.content ?? ''),
      )
    )
      errors.push(`${route}: public content is marked noindex`);
  }

  const notFound = documents.get('404.html');
  if (!notFound) errors.push('404.html: not-found page is missing');
  else if (
    !notFound.tags.some(
      (tag) =>
        tag.name === 'meta' &&
        tag.attributes.name === 'robots' &&
        /noindex/iu.test(tag.attributes.content ?? ''),
    )
  )
    errors.push('404.html: not-found document must be noindex');

  for (const [name, { tags }] of documents) {
    for (const { name: tag, attributes: attrs } of tags) {
      if (attrs.src) checkReference(attrs.src, name);
      if (attrs.poster) checkReference(attrs.poster, name);
      if (attrs.srcset && !attrs.srcset.startsWith('data:'))
        for (const entry of attrs.srcset.split(','))
          checkReference(entry.trim().split(/\s+/u)[0], name);
      if (tag === 'a' && attrs.href) checkReference(attrs.href, name, { resource: false });
      if (
        tag === 'link' &&
        /(?:^|\s)(?:stylesheet|icon|preload|modulepreload)(?:\s|$)/iu.test(attrs.rel ?? '')
      )
        checkReference(attrs.href, name);
    }
  }
  for (const name of files.filter((name) => name.endsWith('.css'))) {
    const css = await readFile(resolve(root, name), 'utf8');
    for (const match of css.matchAll(/url\(\s*(?:"([^"]+)"|'([^']+)'|([^\s)]+))\s*\)/giu))
      checkReference(match[1] ?? match[2] ?? match[3], name);
  }
  const sitemap = names.has('sitemap.xml')
    ? await readFile(resolve(root, 'sitemap.xml'), 'utf8')
    : '';
  const locations = [...sitemap.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/giu)].map((match) =>
    decode(match[1]),
  );
  if (
    locations.length !== ROUTES.length ||
    ROUTES.some((route) => !locations.includes(`${ORIGIN}${route}`))
  )
    errors.push('sitemap.xml: expected exactly the public content routes');
  const robots = names.has('robots.txt') ? await readFile(resolve(root, 'robots.txt'), 'utf8') : '';
  if (
    !/^User-agent:\s*\*\s*$/imu.test(robots) ||
    /^Disallow:\s*\/\s*$/imu.test(robots) ||
    !robots.includes(`Sitemap: ${ORIGIN}/sitemap.xml`)
  )
    errors.push('robots.txt: expected crawlable content and the canonical sitemap');
  return { errors, pageCount: ROUTES.length, assetCount: assets.size };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await verifyExport(process.argv[2]);
  if (result.errors.length) {
    console.error(
      `Static export audit failed:\n${result.errors.map((error) => `- ${error}`).join('\n')}`,
    );
    process.exitCode = 1;
  } else
    console.log(
      `Static export audit passed: ${result.pageCount} content routes, custom 404, ${result.assetCount} local assets.`,
    );
}
