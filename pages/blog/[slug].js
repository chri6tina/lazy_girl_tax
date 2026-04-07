import BlogArticleTemplate from '../../components/blog/BlogArticleTemplate';
import BlogMarkdown from '../../components/blog/BlogMarkdown';
import BlogShell from '../../components/blog/BlogShell';
import { extractMarkdownToc } from '../../lib/blogToc';
import { getPublishedPostBySlug, listPublishedPosts } from '../../lib/blogDb';

export default function BlogPost({ post, recentPosts }) {
  const description = post.excerpt || post.title;
  const canonicalPath = `/blog/${post.slug}`;
  const toc = extractMarkdownToc(post.body);

  return (
    <BlogShell title={post.title} description={description} canonicalPath={canonicalPath}>
      <BlogArticleTemplate post={post} recentPosts={recentPosts} toc={toc}>
        <BlogMarkdown body={post.body} toc={toc} />
      </BlogArticleTemplate>
    </BlogShell>
  );
}

export async function getServerSideProps({ params }) {
  const slug = params?.slug;
  if (!slug || typeof slug !== 'string') {
    return { notFound: true };
  }

  const { data, error } = await getPublishedPostBySlug(slug);
  if (error || !data) {
    return { notFound: true };
  }

  const { data: allPosts } = await listPublishedPosts();
  const recentPosts = (allPosts || []).filter((p) => p.slug !== slug).slice(0, 8);

  return {
    props: {
      post: data,
      recentPosts
    }
  };
}
