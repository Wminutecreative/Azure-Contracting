import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { sectorIds } from '@/data/sectors';

// Entry ids come from file names and are used as URL slugs (e.g. projects/morrison-hotel.md → /projects/morrison-hotel).

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    // Edited in Keystatic (keystatic.config.ts) — keep the two schemas in sync.
    // Keystatic writes empty optional fields as '' / null, hence the nullish handling.
    z.object({
      title: z.string(),
      sector: z.enum(sectorIds),
      excerpt: z.string(),
      cover: image(),
      coverAlt: z.string(),
      gallery: z.array(z.object({ src: image(), alt: z.string() })).nullish().transform((g) => g ?? []),
      client: z.string().nullish().transform((v) => v || undefined),
      location: z.string().nullish().transform((v) => v || undefined),
      role: z.string().nullish().transform((v) => v || undefined),
      year: z.number().int().nullish().transform((v) => v ?? undefined),
      featured: z.boolean().default(false),
      order: z.number().default(99),
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      author: z.string(),
      cover: image(),
      coverAlt: z.string(),
      excerpt: z.string(),
      tags: z.array(z.string()).default([]),
    }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/testimonials' }),
  schema: ({ image }) =>
    z.object({
      // Edited in Keystatic (keystatic.config.ts) — keep the two schemas in sync
      name: z.string(),
      role: z.string().default(''),
      company: z.string(),
      photo: image(),
      quote: z.string(),
      rating: z.number().int().min(1).max(5).default(5),
      showOnPage: z.boolean().default(true),
      featured: z.boolean().default(false),
      order: z.number().default(99),
    }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/services' }),
  // Edited in Keystatic (keystatic.config.ts) — keep the two schemas in sync
  schema: ({ image }) =>
    z.object({
      category: z.string(),
      order: z.number().default(99),
      items: z.array(z.string()).default([]),
      description: z.string().nullish().transform((v) => v || undefined),
      image: image(),
      imageAlt: z.string().default(''),
    }),
});

const faqs = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/faqs' }),
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    /** Which pages show this FAQ: home, about, testimonials, contact */
    pages: z.array(z.string()).default([]),
    order: z.number().default(99),
  }),
});

const team = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/team' }),
  // Edited in Keystatic (keystatic.config.ts) — keep the two schemas in sync
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      photo: image(),
      linkedin: z.string().nullish().transform((v) => v || undefined),
      order: z.number().default(99),
    }),
});

export const collections = { projects, blog, testimonials, services, faqs, team };
