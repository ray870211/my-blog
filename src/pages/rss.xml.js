import rss from '@astrojs/rss';
import { getPublishedPosts } from '@/utils/posts';
import { SITE } from '@/config/site';

export async function GET(context) {
  const posts = await getPublishedPosts();

  return rss({
    title: SITE.name,
    description: SITE.rssDescription,
    site: context.site,
    items: posts.map(post => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/blog/${post.slug}/`,
      author: post.data.author,
      categories: post.data.tags || [],
    })),
  });
}
