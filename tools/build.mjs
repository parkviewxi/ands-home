// 정적 페이지 빌드: src/pages/*.html (프런트매터 + 본문) → 루트 *.html
// 사용: node tools/build.mjs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

const headTpl = read('src/partials/head.html');
const headerTpl = read('src/partials/header.html');
const footerTpl = read('src/partials/footer.html');

const SITE = 'https://www.andsquare.co.kr';

function parse(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error('front matter missing');
  const meta = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { meta, body: m[2] };
}

function fill(tpl, vars) {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => (vars[k] ?? ''));
}

function header(nav) {
  // aria-current 표시
  return headerTpl.replace(/data-nav="(\w+)"/g, (m, k) =>
    k === nav ? `data-nav="${k}" aria-current="page"` : m);
}

const pages = readdirSync(join(root, 'src/pages')).filter((f) => f.endsWith('.html'));
const built = [];
for (const f of pages) {
  const { meta, body } = parse(read(`src/pages/${f}`));
  const file = meta.file || f;
  const vars = {
    title: meta.title ? `${meta.title} | 앤드스퀘어` : '앤드스퀘어',
    description: meta.description || '',
    canonical: `${SITE}/${file === 'index.html' ? '' : file}`,
    ogimage: `${SITE}/${meta.ogimage || 'img/hero-logistics-960.webp'}`,
    bodyclass: meta.bodyclass || '',
  };
  const html = fill(headTpl, vars) + header(meta.nav || '') + body + footerTpl;
  writeFileSync(join(root, file), html);
  built.push(file);
}

// sitemap.xml
const today = new Date().toISOString().slice(0, 10);
const urls = built
  .filter((f) => !f.startsWith('nf1'))
  .map((f) => `  <url><loc>${SITE}/${f === 'index.html' ? '' : f}</loc><lastmod>${today}</lastmod></url>`)
  .join('\n');
writeFileSync(join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
console.log('built:', built.join(', '));
