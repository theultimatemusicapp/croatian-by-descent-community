import raw from './city-guides.json';
import { z } from 'astro/zod';
import { places, slugify } from './site';

export const cityTopicTitles = [
  'Cost of living',
  'Rental prices',
  'Property',
  'Transport',
  'Beaches and nature',
  'Work opportunities',
  'Lifestyle',
  'Pros and cons',
] as const;

const guideSchema = z
  .object({
    slug: z.string(),
    name: z.string(),
    intro: z.array(z.string().min(30)).min(1),
    topics: z
      .array(
        z.object({
          title: z.enum(cityTopicTitles),
          paragraphs: z.array(z.string().min(30)).min(2),
          bullets: z.array(z.string()).default([]),
          sources: z
            .array(z.object({ label: z.string().min(3), url: z.url() }))
            .min(1),
        }),
      )
      .length(cityTopicTitles.length),
  })
  .superRefine((guide, ctx) => {
    if (guide.slug !== slugify(guide.name))
      ctx.addIssue({
        code: 'custom',
        message: 'City guide slug must match place name.',
      });
    if (
      !guide.topics.every(
        (topic, index) => topic.title === cityTopicTitles[index],
      )
    )
      ctx.addIssue({
        code: 'custom',
        message:
          'All eight city topics must appear once, in the expected order.',
      });
  });

export const cityGuides = z.array(guideSchema).parse(raw);
if (new Set(cityGuides.map((g) => g.slug)).size !== cityGuides.length)
  throw new Error('Duplicate city guide.');
for (const name of places) {
  if (!cityGuides.some((g) => g.name === name))
    throw new Error(`Missing city guide: ${name}`);
}
if (cityGuides.length !== places.length)
  throw new Error('City guides must match the place directory.');
