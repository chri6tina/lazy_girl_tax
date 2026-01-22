import '../styles.css';
import Script from 'next/script';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Script src="/script.js" strategy="afterInteractive" />
      <Component {...pageProps} />
    </>
  );
}
