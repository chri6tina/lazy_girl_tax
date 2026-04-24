import Head from 'next/head';
import { getAbsoluteSiteUrl } from '../lib/siteUrl';

const DEFAULT_OG_IMAGE = '/lazy_girls_hero.jpg';
const OG_IMAGE_WIDTH = 800;
const OG_IMAGE_HEIGHT = 800;
const SITE_NAME = 'Lazy Girls Tax';

const ORG_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  name: 'Lazy Girls Tax',
  description:
    'Judgment-free tax preparation and bookkeeping for content creators, OnlyFans creators, and independent contractors. Flat-rate packages, fast communication, and audit-ready records.',
  url: 'https://www.lazygirlstax.com',
  logo: 'https://www.lazygirlstax.com/lazy_girls_hero.jpg',
  image: 'https://www.lazygirlstax.com/lazy_girls_hero.jpg',
  priceRange: '$$',
  serviceType: 'Tax Preparation',
  areaServed: {
    '@type': 'Country',
    name: 'United States',
  },
  sameAs: [],
};

export default function StaticPage({ title, body, description, pathname }) {
  const base = getAbsoluteSiteUrl();
  const path = pathname || '/';
  const canonicalUrl = base ? `${base}${path === '/' ? '' : path}` : '';
  const metaDescription =
    description?.trim() ||
    `${title.replace(/\s*\|\s*Lazy Girls Tax\s*$/i, '').trim()}. Judgment-free tax prep and bookkeeping for creators and independent contractors.`;
  const ogImage = base ? `${base}${DEFAULT_OG_IMAGE}` : `https://www.lazygirlstax.com${DEFAULT_OG_IMAGE}`;

  const orgSchema = {
    ...ORG_SCHEMA,
    ...(canonicalUrl ? { url: canonicalUrl } : {}),
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={metaDescription} />
        {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDescription} />
        {canonicalUrl ? <meta property="og:url" content={canonicalUrl} /> : null}
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content={String(OG_IMAGE_WIDTH)} />
        <meta property="og:image:height" content={String(OG_IMAGE_HEIGHT)} />
        <meta property="og:image:alt" content="Lazy Girls Tax — judgment-free tax prep for creators" />

        {/* Twitter / X Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content="Lazy Girls Tax — judgment-free tax prep for creators" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </Head>
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </>
  );
}

