import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const translations = z.object({ en: z.string(), es: z.string() });
const projects = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/projects' }),
  schema: z.object({
    id: z.string(),
    title: translations,
    description: translations,
    contribution: translations,
    origin: translations,
    status: z.enum(['active-research', 'prototype', 'educational', 'archived']),
    statusText: z.object({ en: z.string(), es: z.string() }),
    tags: z.array(z.string()),
    repositoryUrl: z.url(),
    demoUrl: z.url().optional(),
    featuredOrder: z.number().int().positive().optional(),
  }),
});

export const collections = { projects };
