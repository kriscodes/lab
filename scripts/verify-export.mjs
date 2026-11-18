/** @file Audits exported routes, metadata, links, and assets before a static build is published. */

import { readdir, readFile } from 'node:fs/promises';
import { dirname, extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_ORIGIN = 'https://lab.kristiansalmeron.com';
const CONTENT_ROUTES = [
  '/',
  '/experiments/',
  '/experiments/pdf-rendering/',
  '/methodology/',
  '/privacy/',
  '/experiments/pdf-first-page/',
  '/experiments/pdf-first-page/evidence/',
  '/experiments/pdf-first-page/replicate/',
];

/** Decode resource and metadata values without requiring a runtime HTML parser. */
function decodeHtmlEntities(attributeValue) {
  return attributeValue.replace(
    /&(?:amp|quot|apos|lt|gt);/gu,
    (entity) => ({ '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>' })[entity],
  );
}

/** Ignore script payloads so serialized React markup is not mistaken for real tags. */
function readHtmlTags(htmlMarkup) {
  const markupWithoutScripts = htmlMarkup
    .replace(/<!--[\s\S]*?-->/gu, '')
    .replace(/(<script\b[^>]*>)[\s\S]*?<\/script>/giu, '$1</script>');
  return [
    ...markupWithoutScripts.matchAll(/<([a-z][\w:-]*)\b((?:"[^"]*"|'[^']*'|[^'">])*)>/giu),
  ].map((matchedTag) => {
    const attributes = Object.fromEntries(
      [...matchedTag[2].matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/gu)].map(
        (matchedAttribute) => [
          matchedAttribute[1].toLowerCase(),
          decodeHtmlEntities(
            matchedAttribute[2] ?? matchedAttribute[3] ?? matchedAttribute[4] ?? '',
          ),
        ],
      ),
    );
    return { name: matchedTag[1].toLowerCase(), attributes };
  });
}

/** Enumerate only files inside the publish directory; do not follow symbolic links. */
async function listExportedFiles(exportDirectory, exportRoot = exportDirectory) {
  const exportedFiles = [];
  for (const directoryEntry of await readdir(exportDirectory, { withFileTypes: true })) {
    const filePath = resolve(exportDirectory, directoryEntry.name);
    if (directoryEntry.isSymbolicLink())
      throw new Error(`Public export contains a symbolic link: ${relative(exportRoot, filePath)}`);
    if (directoryEntry.isDirectory())
      exportedFiles.push(...(await listExportedFiles(filePath, exportRoot)));
    else exportedFiles.push(relative(exportRoot, filePath).replaceAll('\\', '/'));
  }
  return exportedFiles;
}

/** Audit generated static documents and their local dependencies without network requests. */
export async function verifyExport(
  exportDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '../out'),
) {
  const exportRoot = resolve(exportDirectory);
  const errors = [];
  let exportedFiles;
  try {
    exportedFiles = await listExportedFiles(exportRoot);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return {
      errors: ['Static export is missing. Run the production build first.'],
      pageCount: 0,
      assetCount: 0,
    };
  }
  const exportedFileNames = new Set(exportedFiles);
  const exportedDocuments = new Map();
  const referencedAssets = new Set();
  for (const fileName of exportedFiles.filter((fileName) => fileName.endsWith('.html'))) {
    const htmlMarkup = await readFile(resolve(exportRoot, fileName), 'utf8');
    exportedDocuments.set(fileName, { html: htmlMarkup, tags: readHtmlTags(htmlMarkup) });
  }

  /** Map an on-site URL to the file emitted by a trailing-slash static export. */
  function getExportedFilePath(pathname) {
    const filePath = decodeURIComponent(pathname).replace(/^\/+|\/+$/gu, '');
    if (!filePath) return 'index.html';
    return extname(filePath) ? filePath : `${filePath}/index.html`;
  }

  /** Check real local resources and page destinations, including static fragment targets. */
  function validateLocalReference(
    attributeValue,
    sourceFileName,
    { resource: isResource = true, local: requiresLocalResource = false } = {},
  ) {
    if (!attributeValue || /^(?:data:|mailto:|tel:)/iu.test(attributeValue)) return;
    let referenceUrl;
    try {
      referenceUrl = new URL(attributeValue, `${SITE_ORIGIN}/${sourceFileName}`);
    } catch {
      errors.push(`${sourceFileName}: invalid URL ${attributeValue}`);
      return;
    }
    if (!['http:', 'https:'].includes(referenceUrl.protocol)) {
      errors.push(`${sourceFileName}: unsupported URL ${attributeValue}`);
      return;
    }
    if (referenceUrl.origin !== SITE_ORIGIN) {
      if (requiresLocalResource)
        errors.push(`${sourceFileName}: expected a local resource (${attributeValue})`);
      return;
    }
    let targetFileName;
    try {
      targetFileName = getExportedFilePath(referenceUrl.pathname);
    } catch {
      errors.push(`${sourceFileName}: invalid URL encoding ${attributeValue}`);
      return;
    }
    if (!exportedFileNames.has(targetFileName)) {
      errors.push(`${sourceFileName}: missing local target ${attributeValue}`);
      return;
    }
    if (isResource) referencedAssets.add(targetFileName);
    if (!isResource && referenceUrl.hash && exportedDocuments.has(targetFileName)) {
      let fragmentId;
      try {
        fragmentId = decodeURIComponent(referenceUrl.hash.slice(1));
      } catch {
        errors.push(`${sourceFileName}: invalid fragment ${attributeValue}`);
        return;
      }
      if (
        !exportedDocuments.get(targetFileName).tags.some((tag) => tag.attributes.id === fragmentId)
      )
        errors.push(`${sourceFileName}: missing fragment target ${attributeValue}`);
    }
  }

  for (const route of CONTENT_ROUTES) {
    const fileName = getExportedFilePath(route);
    const exportedDocument = exportedDocuments.get(fileName);
    if (!exportedDocument) {
      errors.push(`${route}: exported page is missing`);
      continue;
    }
    const { tags, html: htmlMarkup } = exportedDocument;
    const pageTitle = htmlMarkup.match(/<title\b[^>]*>([^<]+)<\/title>/iu)?.[1]?.trim();
    if (!pageTitle || !/Lab/iu.test(pageTitle))
      errors.push(`${route}: meaningful Lab title is missing`);
    if (tags.filter((tag) => tag.name === 'h1').length !== 1)
      errors.push(`${route}: expected one visible page heading`);
    if (!tags.some((tag) => tag.name === 'main')) errors.push(`${route}: main landmark is missing`);
    if (!tags.some((tag) => tag.name === 'html' && tag.attributes.lang))
      errors.push(`${route}: document language is missing`);
    const canonicalLinks = tags.filter(
      (tag) => tag.name === 'link' && tag.attributes.rel === 'canonical',
    );
    if (
      canonicalLinks.length !== 1 ||
      canonicalLinks[0].attributes.href !== `${SITE_ORIGIN}${route}`
    )
      errors.push(`${route}: canonical URL must match the public route`);
    for (const metadataKey of [
      'description',
      'og:title',
      'og:description',
      'og:url',
      'og:image',
      'twitter:card',
      'twitter:image',
    ]) {
      const matchingMetadata = tags.filter(
        (tag) =>
          tag.name === 'meta' && (tag.attributes.name ?? tag.attributes.property) === metadataKey,
      );
      if (matchingMetadata.length !== 1 || !matchingMetadata[0].attributes.content?.trim()) {
        errors.push(`${route}: expected one nonempty ${metadataKey} value`);
        continue;
      }
      const attributeValue = matchingMetadata[0].attributes.content;
      if (metadataKey === 'og:url' && attributeValue !== `${SITE_ORIGIN}${route}`)
        errors.push(`${route}: og:url does not match its canonical`);
      if (metadataKey === 'twitter:card' && attributeValue !== 'summary_large_image')
        errors.push(`${route}: Twitter card should include the social preview`);
      if (metadataKey.endsWith('image'))
        validateLocalReference(attributeValue, fileName, { local: true });
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

  const notFoundDocument = exportedDocuments.get('404.html');
  if (!notFoundDocument) errors.push('404.html: not-found page is missing');
  else if (
    !notFoundDocument.tags.some(
      (tag) =>
        tag.name === 'meta' &&
        tag.attributes.name === 'robots' &&
        /noindex/iu.test(tag.attributes.content ?? ''),
    )
  )
    errors.push('404.html: not-found document must be noindex');

  for (const [fileName, { tags }] of exportedDocuments) {
    for (const { name: tagName, attributes } of tags) {
      if (attributes.src) validateLocalReference(attributes.src, fileName);
      if (attributes.poster) validateLocalReference(attributes.poster, fileName);
      if (attributes.srcset && !attributes.srcset.startsWith('data:'))
        for (const imageCandidate of attributes.srcset.split(','))
          validateLocalReference(imageCandidate.trim().split(/\s+/u)[0], fileName);
      if (tagName === 'a' && attributes.href)
        validateLocalReference(attributes.href, fileName, { resource: false });
      if (
        tagName === 'link' &&
        /(?:^|\s)(?:stylesheet|icon|preload|modulepreload)(?:\s|$)/iu.test(attributes.rel ?? '')
      )
        validateLocalReference(attributes.href, fileName);
    }
  }
  for (const fileName of exportedFiles.filter((fileName) => fileName.endsWith('.css'))) {
    const stylesheetContent = await readFile(resolve(exportRoot, fileName), 'utf8');
    for (const matchedResource of stylesheetContent.matchAll(
      /url\(\s*(?:"([^"]+)"|'([^']+)'|([^\s)]+))\s*\)/giu,
    ))
      validateLocalReference(
        matchedResource[1] ?? matchedResource[2] ?? matchedResource[3],
        fileName,
      );
  }
  const sitemapMarkup = exportedFileNames.has('sitemap.xml')
    ? await readFile(resolve(exportRoot, 'sitemap.xml'), 'utf8')
    : '';
  const sitemapUrls = [...sitemapMarkup.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/giu)].map(
    (matchedLocation) => decodeHtmlEntities(matchedLocation[1]),
  );
  if (
    sitemapUrls.length !== CONTENT_ROUTES.length ||
    CONTENT_ROUTES.some((route) => !sitemapUrls.includes(`${SITE_ORIGIN}${route}`))
  )
    errors.push('sitemap.xml: expected exactly the public content routes');
  const robotsContent = exportedFileNames.has('robots.txt')
    ? await readFile(resolve(exportRoot, 'robots.txt'), 'utf8')
    : '';
  if (
    !/^User-agent:\s*\*\s*$/imu.test(robotsContent) ||
    /^Disallow:\s*\/\s*$/imu.test(robotsContent) ||
    !robotsContent.includes(`Sitemap: ${SITE_ORIGIN}/sitemap.xml`)
  )
    errors.push('robots.txt: expected crawlable content and the canonical sitemap');
  return { errors, pageCount: CONTENT_ROUTES.length, assetCount: referencedAssets.size };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const auditResult = await verifyExport(process.argv[2]);
  if (auditResult.errors.length) {
    console.error(
      `Static export audit failed:\n${auditResult.errors.map((error) => `- ${error}`).join('\n')}`,
    );
    process.exitCode = 1;
  } else
    console.log(
      `Static export audit passed: ${auditResult.pageCount} content routes, custom 404, ${auditResult.assetCount} local assets.`,
    );
}
