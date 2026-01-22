import Head from 'next/head';

export default function StaticPage({ title, body }) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </>
  );
}
