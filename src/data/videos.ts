import raw from './approved-videos.json';
import { z } from 'astro/zod';
export const youtubeId = (url: string) => {
  const u = new URL(url);
  const id =
    u.hostname === 'youtu.be' ? u.pathname.slice(1) : u.searchParams.get('v');
  if (
    !['youtu.be', 'youtube.com', 'www.youtube.com'].includes(u.hostname) ||
    !id ||
    !/^[\w-]{11}$/.test(id)
  )
    throw new Error(`Invalid YouTube URL: ${url}`);
  return id;
};
const schema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(5),
  youtubeUrl: z.url(),
  description: z.string().min(20),
  channel: z.enum([
    'Carl Tomich',
    'Globe Travel Adventures',
    'Croatian By Descent Community',
  ]),
  date: z.coerce.date(),
  category: z.string(),
  location: z.string(),
  approved: z.literal(true),
  relatedArticles: z.array(z.string()).default([]),
});
export const videos = z.array(schema).parse(raw);
for (const video of videos) youtubeId(video.youtubeUrl);
if (new Set(videos.map((v) => v.slug)).size !== videos.length)
  throw new Error('Duplicate video slug');
