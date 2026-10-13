import { readFile, readdir } from 'node:fs/promises';
const directory = new URL('../src/content/projects/', import.meta.url);
const files = (await readdir(directory)).filter((file) => file.endsWith('.json'));
const projects = await Promise.all(files.map(async (file) => JSON.parse(await readFile(new URL(file, directory), 'utf8'))));
const required = ['id', 'title', 'description', 'contribution', 'origin', 'status', 'statusText', 'tags', 'repositoryUrl'];
for (const project of projects) {
  for (const field of required) if (!(field in project)) throw new Error(`${project.id ?? 'Project'} lacks ${field}`);
  for (const field of ['title', 'description', 'contribution', 'origin', 'statusText']) {
    for (const locale of ['en', 'es']) if (!project[field][locale]) throw new Error(`${project.id}.${field}.${locale} is required`);
  }
  if (!/^https:\/\//.test(project.repositoryUrl)) throw new Error(`${project.id} has an invalid repository URL`);
  if (project.demoUrl && !/^https:\/\//.test(project.demoUrl)) throw new Error(`${project.id} has an invalid demo URL`);
}
const featured = projects.filter(({ featuredOrder }) => featuredOrder != null);
if (featured.length > 4) throw new Error(`At most four projects may be featured (found ${featured.length})`);
if (new Set(featured.map(({ featuredOrder }) => featuredOrder)).size !== featured.length) throw new Error('Featured ordering must be unique');
console.log(`Content OK: ${projects.length} projects, ${featured.length} featured.`);
