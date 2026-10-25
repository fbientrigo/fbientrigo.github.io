import { readFile, access, readdir } from 'node:fs/promises';
import path from 'node:path';

const dist = path.resolve('dist');
const site = (process.env.SITE_URL || 'https://fbientrigo.github.io').replace(/\/$/, '');
const base = (process.env.BASE_PATH ?? '').replace(/^\/*|\/*$/g, '');
const prefix = base ? `/${base}` : '';
const routes = ['', 'research', 'projects', 'cv', 'contact', 'es', 'es/research', 'es/projects', 'es/cv', 'es/contact'];
const contentDir = path.resolve('src/content/projects');
const projectFiles = (await readdir(contentDir)).filter((file) => file.endsWith('.json'));
const projects = await Promise.all(projectFiles.map(async (file) => JSON.parse(await readFile(path.join(contentDir, file), 'utf8'))));
const featured = projects.filter(({ featuredOrder }) => featuredOrder != null).sort((a, b) => a.featuredOrder - b.featuredOrder);
const allOrdered = [...featured, ...projects.filter(({ featuredOrder }) => featuredOrder == null)];
const htmlByRoute = new Map();
const localTargets = new Set();

for (const route of routes) {
  const file = path.join(dist, route, 'index.html');
  await access(file);
  const html = await readFile(file, 'utf8');
  htmlByRoute.set(route, html);
  const locale = route.startsWith('es') ? 'es' : 'en';
  const pathName = route.replace(/^es\/?/, '').replace(/\/$/, '') || 'home';
  const expected = `${site}${prefix}${locale === 'es' ? '/es' : ''}${pathName === 'home' ? '/' : `/${pathName}/`}`;
  if (!html.includes(`rel="canonical" href="${expected}"`)) throw new Error(`Incorrect canonical for ${route || 'home'}; expected ${expected}`);
  if (['projects', 'es/projects'].includes(route)) {
    if (projects.length < 1 || (html.match(/class="project-card"/g) ?? []).length !== projects.length) throw new Error(`Expected ${projects.length} project cards on ${route}`);
    const title = allOrdered[0]?.title[route.startsWith('es') ? 'es' : 'en'];
    if (!html.includes(title)) throw new Error(`Project content missing from ${route}`);
  }
  if (['research', 'es/research'].includes(route)) {
    // The toy adaptive loop must show the search improving: generation 0 rarely hits, later generations hit far more often.
    const rates = [...html.matchAll(/data-gen="\d+" data-rate="(\d+)"/g)].map((m) => Number(m[1]));
    if (rates.length !== 6 || rates[0] < 1 || Math.min(...rates.slice(2)) < 5 * rates[0]) throw new Error(`Adaptive loop chart wrong on ${route}: ${rates}`);
  }
  if (['', 'es'].includes(route)) {
    const escaped = Number(html.match(/data-escapes="(\d+)"/)?.[1]);
    if (!(escaped >= 1 && escaped <= 10)) throw new Error(`Muon shield readout wrong on ${route || 'home'}: ${escaped}`);
    const dis = Number(html.match(/data-dis="(\d+)"/)?.[1]);
    const dangerous = Number(html.match(/data-dangerous="(\d+)"/)?.[1]);
    if (!(dis >= 1 && dangerous >= 1 && dangerous <= dis && dis <= 12)) throw new Error(`DIS funnel wrong on ${route || 'home'}: ${dis}/${dangerous}`);
    const expectedFeatured = Math.min(3, featured.length);
    if (expectedFeatured < 1 || (html.match(/class="work-item[" ]/g) ?? []).length !== expectedFeatured) throw new Error(`Expected ${expectedFeatured} featured project cards on ${route || 'home'}`);
    const title = featured[0]?.title[route === 'es' ? 'es' : 'en'];
    if (!html.includes(title)) throw new Error(`Project content missing from ${route || 'home'}`);
  }
  for (const language of ['en', 'es', 'x-default']) if (!html.includes(`hreflang="${language}"`)) throw new Error(`Missing ${language} alternate: ${route}`);
    for (const metadata of ['property="og:title"', 'property="og:description"', 'property="og:image"', 'name="description"', 'type="application/ld+json"']) {
    if (!html.includes(metadata)) throw new Error(`Missing ${metadata}: ${route}`);
  }
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const href = match[1].replaceAll('&amp;', '&');
    if (/^(https?:|mailto:|tel:|data:|#)/i.test(href)) continue;
    const url = new URL(href, `https://local.invalid${prefix}/${route}/`);
    const basePath = base ? `/${base}/` : '/';
    if (!url.pathname.startsWith(basePath)) throw new Error(`Internal link escapes base path: ${href} on ${route || 'home'}`);
    let target = url.pathname.slice(basePath.length);
    if (target.endsWith('/')) target += 'index.html';
    else if (!path.extname(target)) target += '/index.html';
    const absolute = path.join(dist, target);
    try { await access(absolute); } catch { throw new Error(`Dead internal link ${href} on ${route || 'home'}`); }
    localTargets.add(absolute);
    if (url.hash && target.endsWith('index.html')) {
      const targetRoute = target.replace(/\/index\.html$/, '').replace(/\\/g, '/');
      const targetHtml = htmlByRoute.get(targetRoute) ?? await readFile(absolute, 'utf8');
      if (!targetHtml.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`)) throw new Error(`Dead anchor ${href} on ${route || 'home'}`);
    }
  }
}
const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8');
if (!sitemap.includes(`${site}${prefix}/`) || !sitemap.includes(`${site}${prefix}/es/`)) throw new Error('Sitemap is missing locale URLs');
const og = path.join(dist, 'og.png');
await access(og);
localTargets.add(og);
const allFiles = async (directory) => (await Promise.all((await readdir(directory, { withFileTypes: true })).map(async (entry) => entry.isDirectory() ? allFiles(path.join(directory, entry.name)) : [path.join(directory, entry.name)]))).flat();
const cssFiles = (await allFiles(dist)).filter((file) => file.endsWith('.css'));
for (const cssFile of cssFiles) {
  const css = await readFile(cssFile, 'utf8');
  for (const [, ref] of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
    if (/^(data:|https?:|#)/.test(ref)) continue;
    const assetPath = decodeURIComponent(ref.split(/[?#]/)[0]);
    const asset = assetPath.startsWith(`${prefix}/`)
      ? path.join(dist, assetPath.slice(prefix.length + 1))
      : path.resolve(path.dirname(cssFile), assetPath);
    try { await access(asset); } catch { throw new Error(`Missing CSS asset ${ref} referenced by ${path.relative(dist, cssFile)}`); }
  }
}
console.log(`Build OK: ${routes.length} localized pages, links/anchors, canonicals, hreflang, OG/SEO metadata, CSS assets and sitemap.`);
