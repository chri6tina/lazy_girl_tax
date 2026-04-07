import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import '../styles.css';
import '../styles/admin.css';
import Script from 'next/script';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      if (typeof window === 'undefined') return;
      try {
        window.initSiteScripts?.();
      } catch {
        /* public/script.js must not break navigation */
      }
    };

    handleRouteChange();
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router.events]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Script src="/script.js" strategy="afterInteractive" />
      <Component {...pageProps} />
    </>
  );
}
