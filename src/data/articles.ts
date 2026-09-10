import { getCollection } from 'astro:content';
import { videos } from './videos';
export async function publishedArticles() {
  const all = await getCollection(
    'articles',
    ({ data }) => !data.draft && data.publishedDate <= new Date(),
  );
  const slugs = new Set<string>();
  for (const a of all) {
    if (slugs.has(a.data.slug))
      throw new Error(`Duplicate article slug: ${a.data.slug}`);
    slugs.add(a.data.slug);
    if (
      a.data.youtubeUrl &&
      !videos.some((v) => v.youtubeUrl === a.data.youtubeUrl)
    )
      throw new Error(`Article ${a.id} references an unapproved video`);
  }
  return all.sort(
    (a, b) =>
      b.data.publishedDate.valueOf() - a.data.publishedDate.valueOf() ||
      Number(b.data.featured) - Number(a.data.featured),
  );
}
