/**
 * Smoke tests for production SEO endpoints. Skips remote checks when no base URL is set.
 *
 * Usage:
 *   PRODUCTION_URL=https://yoursite.com node scripts/seo-health.mjs
 *   node scripts/seo-health.mjs https://yoursite.com
 *
 * Optional: PAGESPEED_API_KEY — logs PageSpeed performance score for the homepage.
 */

const argvBase = process.argv[2]?.replace(/\/$/, '');
const base = (process.env.PRODUCTION_URL || argvBase || '').replace(/\/$/, '');

async function checkUrl(url, method = 'HEAD') {
  const res = await fetch(url, {
    method,
    redirect: 'follow',
    headers: { 'user-agent': 'lazy-girl-tax-seo-health/1.0' }
  });
  if (res.ok) return res;
  if (method === 'HEAD' && (res.status === 405 || res.status === 501)) {
    return checkUrl(url, 'GET');
  }
  return res;
}

function extractLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function main() {
  if (!base) {
    console.log(
      'seo-health: skipping remote checks. Set PRODUCTION_URL or pass the site origin as the first argument.'
    );
    return;
  }

  const robotsRes = await checkUrl(`${base}/robots.txt`);
  if (!robotsRes.ok) {
    throw new Error(`robots.txt failed: HTTP ${robotsRes.status}`);
  }
  const robotsText = await robotsRes.text();
  if (!/sitemap:\s*\S+/i.test(robotsText)) {
    console.warn('seo-health: robots.txt has no Sitemap line');
  }

  const smRes = await checkUrl(`${base}/sitemap.xml`);
  if (!smRes.ok) {
    throw new Error(`sitemap.xml failed: HTTP ${smRes.status}`);
  }
  const xml = await smRes.text();
  const locs = extractLocs(xml);
  if (locs.length < 5) {
    throw new Error(`sitemap looks too small (${locs.length} URLs)`);
  }

  const homeRes = await checkUrl(base, 'GET');
  if (!homeRes.ok) {
    throw new Error(`homepage failed: HTTP ${homeRes.status}`);
  }
  const homeHtml = await homeRes.text();
  if (!homeHtml.includes('property="og:title"') && !homeHtml.includes("property='og:title'")) {
    console.warn('seo-health: homepage HTML may be missing og:title');
  }

  const max = Math.min(locs.length, 60);
  let failed = 0;
  for (let i = 0; i < max; i++) {
    const r = await checkUrl(locs[i]);
    if (!r.ok) {
      console.error(`seo-health: ${locs[i]} -> HTTP ${r.status}`);
      failed += 1;
    }
  }
  if (failed) {
    throw new Error(`seo-health: ${failed} of ${max} sampled sitemap URLs failed`);
  }

  const apiKey = process.env.PAGESPEED_API_KEY;
  if (apiKey) {
    const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
      base
    )}&key=${encodeURIComponent(apiKey)}&category=performance`;
    const psiRes = await fetch(psiUrl);
    if (!psiRes.ok) {
      console.warn(`seo-health: PageSpeed API HTTP ${psiRes.status}`);
    } else {
      const json = await psiRes.json();
      const score = json?.lighthouseResult?.categories?.performance?.score;
      if (typeof score === 'number') {
        console.log(
          `seo-health: PageSpeed performance score (lab): ${Math.round(score * 100)} / 100`
        );
      }
    }
  } else {
    console.log(
      'seo-health: set PAGESPEED_API_KEY in CI to log homepage lab performance (Core Web Vitals proxy).'
    );
  }

  console.log(`seo-health: ok (${locs.length} sitemap URLs, sampled ${max})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
