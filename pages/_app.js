import { useEffect } from 'react';
import { useRouter } from 'next/router';
import '../styles.css';
import Script from 'next/script';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      if (typeof window !== 'undefined' && window.initSiteScripts) {
        window.initSiteScripts();
      }
    };

    handleRouteChange();
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router.events]);

  return (
    <>
      <Script src="/script.js" strategy="afterInteractive" />
      <Component {...pageProps} />
    </>
  );
}
