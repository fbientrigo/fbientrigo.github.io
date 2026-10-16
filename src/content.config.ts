import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const translations = z.object({ en: z.string(), es: z.string() });
const projects = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/projects' }),
  schema: z.object({
    title: translations,
    description: translations,
    contribution: translations,
    origin: translations,
    glyph: z.enum(['tracks', 'histogram', 'network', 'pulse', 'control', 'grid']),
    status: z.enum(['active-research', 'prototype', 'educational', 'archived']),
    statusText: translations,
    tags: z.array(z.string()),
    repositoryUrl: z.url(),
    demoUrl: z.url().optional(),
    featuredOrder: z.number().int().positive().optional(),
  }),
});

export const collections = { projects };
