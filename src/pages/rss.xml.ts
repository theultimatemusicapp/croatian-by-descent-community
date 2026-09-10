import rss from '@astrojs/rss';
import { publishedArticles } from '../data/articles';
import { href } from '../data/site';
import type { APIContext } from 'astro';
export async function GET(context: APIContext) {
  return rss({
    title: 'Croatian By Descent Community',
    description:
      'Original stories and guides connecting Croatia and its diaspora.',
    site: new URL(href(), context.site).href,
    items: (await publishedArticles())
      .filter((a) => !a.data.sample)
      .map((a) => ({
        title: a.data.title,
        description: a.data.description,
        pubDate: a.data.publishedDate,
        link: href('articles/' + a.data.slug + '/'),
      })),
    customData: '<language>en</language>',
  });
}
