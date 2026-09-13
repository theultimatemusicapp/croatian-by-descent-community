import { z } from 'astro/zod';
import raw from './cost-evidence.json';
import { places, slugify } from './site';
const row = z.object({
  category: z.enum(['rent', 'utilities']),
  label: z.string().min(3),
  amount: z.string().min(1),
  period: z.string().min(3),
  scope: z.string().min(3),
  note: z.string().min(3),
  url: z.url().refine((u) => u.startsWith('https://')),
  source: z.string().min(2),
});
export const costEvidence = z
  .array(
    z.object({
      slug: z.string(),
      rows: z.array(row),
    }),
  )
  .parse(raw);
if (
  new Set(costEvidence.map((g) => g.slug)).size !== places.length ||
  costEvidence.length !== places.length ||
  places.some((p) => !costEvidence.some((g) => g.slug === slugify(p)))
) {
  throw new Error(
    'Cost evidence must cover all thirteen city and region guides.',
  );
}
export type CostRow = z.infer<typeof row>;
