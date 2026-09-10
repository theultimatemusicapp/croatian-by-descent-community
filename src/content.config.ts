import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z
    .object({
      title: z.string().min(8),
      slug: z.string().regex(/^[a-z0-9-]+$/),
      description: z.string().min(30).max(180),
      category: z.enum([
        'croatia-news',
        'moving-to-croatia',
        'citizenship-by-descent',
        'cities-and-regions',
        'croatian-diaspora',
        'interviews',
        'property',
        'videos',
      ]),
      type: z
        .enum([
          'news',
          'guide',
          'city',
          'interview',
          'property',
          'diaspora',
          'video',
        ])
        .default('guide'),
      tags: z.array(z.string()).default([]),
      author: z.string().min(2),
      publishedDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      featuredImage: z.string().startsWith('/images/'),
      imageAlt: z.string().min(10),
      source: z.string().optional(),
      sourceUrl: z.url().optional(),
      youtubeUrl: z.url().optional(),
      location: z.string().optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(true),
      sample: z.boolean().default(false),
      reviewedDate: z.coerce.date().optional(),
      sensitive: z.boolean().default(false),
      officialSources: z
        .array(z.object({ label: z.string(), url: z.url() }))
        .default([]),
      personName: z.string().optional(),
      movedFrom: z.string().optional(),
      quotes: z.array(z.string()).default([]),
      relatedSlugs: z.array(z.string()).default([]),
    })
    .superRefine((d, ctx) => {
      if (d.type === 'news' && (!d.source || !d.sourceUrl))
        ctx.addIssue({
          code: 'custom',
          message: 'News requires source and sourceUrl.',
        });
      if (
        (d.sensitive ||
          d.category === 'citizenship-by-descent' ||
          d.type === 'property') &&
        (!d.reviewedDate || !d.officialSources.length)
      )
        ctx.addIssue({
          code: 'custom',
          message:
            'Legal, tax, visa, citizenship and property content requires reviewedDate and officialSources.',
        });
      if (
        d.type === 'interview' &&
        !d.sample &&
        (!d.personName || !d.movedFrom || !d.location || !d.youtubeUrl)
      )
        ctx.addIssue({
          code: 'custom',
          message:
            'Published interviews require a person, movedFrom, location and approved YouTube URL.',
        });
      if (d.sample && d.quotes.length)
        ctx.addIssue({
          code: 'custom',
          message: 'Samples must not contain invented attributed quotes.',
        });
    }),
});
const cities = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cities' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    updatedDate: z.coerce.date(),
    sample: z.boolean().default(true),
  }),
});
export const collections = { articles, cities };
