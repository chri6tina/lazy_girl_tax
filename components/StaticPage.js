import Head from 'next/head';
import { getAbsoluteSiteUrl } from '../lib/siteUrl';

const DEFAULT_OG_IMAGE = '/lazy_girls_hero.jpg';
const SITE_NAME = 'Lazy Girls Tax';

export default function StaticPage({ title, body, description, pathname }) {
  const base = getAbsoluteSiteUrl();
  const path = pathname || '/';
  const canonicalUrl = base ? `${base}${path === '/' ? '' : path}` : '';
  const metaDescription =
    description?.trim() ||
    `${title.replace(/\s*\|\s*Lazy Girls Tax\s*$/i, '').trim()}. Judgment-free tax prep and bookkeeping for creators and independent contractors.`;
  const ogImage = base ? `${base}${DEFAULT_OG_IMAGE}` : '';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={metaDescription} />
        {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDescription} />
        {canonicalUrl ? <meta property="og:url" content={canonicalUrl} /> : null}
        {ogImage ? <meta property="og:image" content={ogImage} /> : null}
      </Head>
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </>
  );
}
