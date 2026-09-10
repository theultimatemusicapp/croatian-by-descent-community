import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
if (existsSync('.env')) process.loadEnvFile('.env');
import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { load } from 'cheerio';
const root = path.resolve('dist');
const site = process.env.SITE_URL || 'https://theultimatemusicapp.github.io';
const base = (
  process.env.SITE_BASE || '/croatian-by-descent-community'
).replace(/\/$/, '');
const files = [];
async function walk(dir) {
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) await walk(p);
    else files.push(p);
  }
}
await walk(root);
const errors = [];
const noindex = new Set();
const articleAudit = [];
const articlePhotos = new Map();
const photoSources = new Map();
const credits = JSON.parse(
  await readFile('src/data/image-credits.json', 'utf8'),
);
let pages = 0,
  links = 0,
  schemas = 0;
async function resolveLocal(url) {
  let p = decodeURIComponent(url.pathname);
  if (base && !p.startsWith(base + '/') && p !== base) return null;
  p = p.slice(base.length);
  let full = path.join(root, p);
  try {
    if ((await stat(full)).isDirectory()) full = path.join(full, 'index.html');
    await stat(full);
    return full;
  } catch {
    return null;
  }
}
for (const file of files.filter((p) => p.endsWith('.html'))) {
  pages++;
  const $ = load(await readFile(file, 'utf8'));
  const relative = path.relative(root, file).replaceAll(path.sep, '/');
  const expected = new URL(
    base +
      '/' +
      (relative === 'index.html'
        ? ''
        : relative === '404.html'
          ? '404.html'
          : relative.replace(/index\.html$/, '')),
    site,
  ).href;
  const canonical = $('link[rel=canonical]').attr('href');
  if (!canonical?.startsWith(site + base + '/'))
    errors.push(relative + ': canonical wrong');
  if ($('h1').length !== 1) errors.push(relative + ': expected one H1');
  if (!$('title').text() || !$('meta[name=description]').attr('content'))
    errors.push(relative + ': metadata missing');
  if ($('meta[name=robots]').attr('content')?.includes('noindex'))
    noindex.add(canonical);
  if (!$('meta[property="og:image"]').attr('content'))
    errors.push(relative + ': social image missing');
  for (const el of $('script[type="application/ld+json"]').toArray()) {
    try {
      const s = JSON.parse($(el).html());
      if (!s['@type']) throw 0;
      schemas++;
    } catch {
      errors.push(relative + ': invalid JSON-LD');
    }
  }
  for (const el of $('a[href],link[href],img[src],script[src]').toArray()) {
    const target = $(el).attr('href') || $(el).attr('src');
    if (!target || target.startsWith('mailto:') || target.startsWith('tel:'))
      continue;
    const url = new URL(target, expected);
    if (url.origin !== new URL(site).origin) continue;
    links++;
    const resolved = await resolveLocal(url);
    if (!resolved) {
      errors.push(relative + ': broken ' + target);
      continue;
    }
    if (url.hash && resolved.endsWith('.html')) {
      const targetDoc = load(await readFile(resolved, 'utf8'));
      if (
        !targetDoc('[id]')
          .toArray()
          .some(
            (el) =>
              targetDoc(el).attr('id') ===
              decodeURIComponent(url.hash.slice(1)),
          )
      )
        errors.push(relative + ': missing anchor ' + target);
    }
  }
  for (const img of $('img').toArray()) {
    if (!$(img).attr('alt')) errors.push(relative + ': missing alt');
    if (!$(img).attr('width') || !$(img).attr('height'))
      errors.push(relative + ': missing image dimensions');
  }
  if (
    relative.startsWith('articles/') &&
    $('script[type="application/ld+json"]').length < 2
  )
    errors.push(relative + ': missing article/breadcrumb schema');
  if (relative.startsWith('articles/') && relative.endsWith('/index.html')) {
    const body = $('.article-body').clone();
    body.find('h1,h2,h3,h4,h5,h6,script,style').remove();
    const wordCount = (
      body.text().match(/[\p{L}\p{N}]+(?:[’'\-][\p{L}\p{N}]+)*/gu) || []
    ).length;
    if (wordCount < 2500)
      errors.push(
        `${relative}: ${wordCount} article body words; at least 2500 required`,
      );
    const photo = $('.article-image img').attr('src');
    let photoHash = null;
    let sourceUrl = null;
    if (photo) {
      const file = await resolveLocal(new URL(photo, expected));
      if (file) {
        photoHash = createHash('sha256')
          .update(await readFile(file))
          .digest('hex');
        if (articlePhotos.has(photoHash))
          errors.push(
            `${relative}: hero photo duplicates ${articlePhotos.get(photoHash)}`,
          );
        articlePhotos.set(photoHash, relative);
      }
      const credit = credits.find(
        (c) =>
          new URL(base + c.localFile, site).href ===
          new URL(photo, expected).href,
      );
      if (!credit?.sourceUrl || !credit?.license || !credit?.creator)
        errors.push(relative + ': missing photo attribution');
      sourceUrl = credit?.sourceUrl;
      if (sourceUrl && photoSources.has(sourceUrl))
        errors.push(
          `${relative}: photo source duplicates ${photoSources.get(sourceUrl)}`,
        );
      if (sourceUrl) photoSources.set(sourceUrl, relative);
    } else errors.push(relative + ': missing article hero photograph');
    articleAudit.push({
      path: relative,
      wordCount,
      photo,
      photoHash,
      sourceUrl,
    });
  }
  if ($('iframe[src*="youtube"]').length)
    errors.push(relative + ': player must wait for user click');
}
// Never advertise noindex sample/framework pages in the sitemap.
for (const file of files.filter((p) => /sitemap-\d+\.xml$/.test(p))) {
  const $ = load(await readFile(file, 'utf8'), { xmlMode: true });
  $('url').each((_, el) => {
    if (noindex.has($(el).find('loc').text())) $(el).remove();
  });
  await writeFile(file, $.xml());
  for (const el of $('loc').toArray()) {
    const url = new URL($(el).text());
    if (!(await resolveLocal(url))) errors.push('Sitemap: missing ' + url.href);
  }
}
const rss = load(await readFile(path.join(root, 'rss.xml'), 'utf8'), {
  xmlMode: true,
});
for (const link of rss('item > link').toArray()) {
  const value = rss(link).text();
  if (noindex.has(value)) errors.push('RSS contains sample ' + value);
  if (!(await resolveLocal(new URL(value))))
    errors.push('RSS broken link ' + value);
}
const robots = await readFile(path.join(root, 'robots.txt'), 'utf8');
if (!robots.includes(site + base + '/sitemap-index.xml'))
  errors.push('robots sitemap URL wrong');
for (const name of [
  'index.html',
  '404.html',
  'sitemap-index.xml',
  'rss.xml',
  'robots.txt',
])
  if (!files.includes(path.join(root, name))) errors.push('Missing ' + name);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(
  `Article requirements passed: ${articleAudit.length} articles, minimum ${Math.min(...articleAudit.map((a) => a.wordCount))} body words, ${articlePhotos.size} unique photographs and ${photoSources.size} unique licensed sources.`,
);
console.log(
  `Validated ${pages} pages, ${links} local links/assets and ${schemas} JSON-LD blocks. Removed ${noindex.size} noindex URLs from sitemap. RSS, robots, image alt text and canonical URLs passed.`,
);
