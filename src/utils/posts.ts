import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog', ({ data }) => data.draft !== true);
  return sortByDateDesc(posts);
}

export function sortByDateDesc(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}

export function filterByTag(posts: BlogPost[], tag: string): BlogPost[] {
  return posts.filter(post => post.data.tags?.includes(tag));
}

export function getTagCounts(posts: BlogPost[]): Record<string, number> {
  return posts
    .flatMap(post => post.data.tags ?? [])
    .reduce<Record<string, number>>((acc, tag) => {
      acc[tag] = (acc[tag] ?? 0) + 1;
      return acc;
    }, {});
}

export function getUniqueTags(posts: BlogPost[]): string[] {
  return Object.keys(getTagCounts(posts)).sort();
}
