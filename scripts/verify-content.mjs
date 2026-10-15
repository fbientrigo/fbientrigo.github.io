// Field shapes are validated by the Zod schema in src/content.config.ts; this checks cross-file rules only.
import { readFile, readdir } from 'node:fs/promises';
const directory = new URL('../src/content/projects/', import.meta.url);
const files = (await readdir(directory)).filter((file) => file.endsWith('.json'));
const projects = await Promise.all(files.map(async (file) => JSON.parse(await readFile(new URL(file, directory), 'utf8'))));
const featured = projects.filter(({ featuredOrder }) => featuredOrder != null);
if (featured.length > 3) throw new Error(`At most three projects may be featured (found ${featured.length})`);
if (new Set(featured.map(({ featuredOrder }) => featuredOrder)).size !== featured.length) throw new Error('Featured ordering must be unique');
console.log(`Content OK: ${projects.length} projects, ${featured.length} featured.`);
