import Head from 'next/head';
import { states } from '../data/states';

const chunkStates = (items, size) => {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

const buildFaqs = (stateName) => {
  const location = stateName ? `in ${stateName}` : 'nationwide';
  const stateContext = stateName ? `${stateName} ` : '';

  return [
    {
      question: 'Do sex workers have to file taxes?',
      answer:
        `Yes. The IRS requires all income to be reported unless it is specifically exempted. ` +
        `If you are self-employed ${location}, you generally must file a return if your net ` +
        `earnings are $400 or more.`
    },
    {
      question: 'What if I never got a 1099?',
      answer:
        `You still report income you earned ${location}, even without a 1099. Payers are only ` +
        `required to issue a 1099-NEC at $600+, but your reporting obligation is based on your ` +
        `income and business activity, not the form.`
    },
    {
      question: 'Which tax forms do sex workers file?',
      answer:
        `Most file Schedule C to report business income and expenses, plus Schedule SE for ` +
        `self-employment tax. We also review your ${stateContext}state filings and any local ` +
        `business requirements.`
    },
    {
      question: 'Do I need to pay quarterly estimated taxes?',
      answer:
        'Usually, yes. If you expect to owe $1,000 or more in tax for the year, estimated payments ' +
        'are typically due in April, June, September, and January. We calculate these for you.'
    },
    {
      question: 'What expenses can I deduct?',
      answer:
        'You can deduct ordinary and necessary business expenses such as supplies, platform fees, ' +
        'professional services, home office use, travel for work, equipment, and marketing. We’ll ' +
        'review your spending to ensure it is compliant and well documented.'
    },
    {
      question: 'How should I track cash tips and payments?',
      answer:
        'Keep a daily log or spreadsheet with dates, amounts, and sources. Consistent recordkeeping ' +
        'protects you during audits and helps you claim accurate deductions.'
    },
    {
      question: 'Do you work with OnlyFans, fansites, and other platforms?',
      answer:
        'Yes. We understand platform payout reports, chargebacks, and fee breakdowns, and we’ll ' +
        'reconcile your payouts to keep your Schedule C clean.'
    },
    {
      question: 'Can you help if I have multiple income streams?',
      answer:
        'Absolutely. We organize earnings from platforms, in-person work, brand deals, and side ' +
        'businesses so your tax return matches your actual cash flow.'
    },
    {
      question: 'Should I choose an LLC or S-corp?',
      answer:
        'It depends on your income level, payroll needs, and compliance goals. We can help you ' +
        'evaluate the tax impact and the ongoing requirements before you decide.'
    },
    {
      question: 'What if I worked in multiple states?',
      answer:
        'Multi-state income may require additional state filings. We help track where the income ' +
        'was earned and coordinate the right state returns.'
    },
    {
      question: 'Is my information confidential?',
      answer:
        'Yes. Your financial information is handled with strict confidentiality and only used to ' +
        'prepare your tax filings and compliance documents.'
    },
    {
      question: 'Do you offer audit defense?',
      answer:
        'Yes. Audit defense is included in our tax prep packages, and we help you prepare ' +
        'documentation to support your return.'
    },
    {
      question: 'Can you help with past-due returns?',
      answer:
        'Yes. We can prepare prior-year returns, set up a compliance plan, and help you get back on ' +
        'track with estimated taxes.'
    },
    {
      question: 'How do you handle cash apps and payout platforms?',
      answer:
        'We reconcile platform reports, bank deposits, and cash app summaries to keep your income ' +
        'tracking clean and audit-ready.'
    },
    {
      question: 'What records should I keep for my business?',
      answer:
        'Keep income reports, receipts, mileage logs, equipment purchases, and proof of business ' +
        'expenses. We’ll help you build a simple system to organize everything.'
    },
    {
      question: `Do I need a business license in ${stateContext}my area?`,
      answer:
        'Some cities or counties require business registrations or local filings. We’ll review ' +
        'your situation and guide you on what applies to your business.'
    },
    {
      question: 'Can you help with entity setup and compliance?',
      answer:
        'Yes. We can help you evaluate whether an LLC or S-corp makes sense and outline the ' +
        'ongoing compliance steps if you choose to form an entity.'
    },
    {
      question: 'What if I have both W-2 and self-employment income?',
      answer:
        'We coordinate both income types so your return is accurate and your estimated payments ' +
        'are right-sized.'
    }
  ];
};

export default function PricingPage({ state }) {
  const stateName = state?.name;
  const faqs = buildFaqs(stateName);
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
  const title = stateName ? `${stateName} Pricing - Lazy Girls Tax` : 'Pricing - Lazy Girls Tax';
  const description = stateName
    ? `Sex work tax preparation and bookkeeping in ${stateName} for creators, dancers, escorts, and independent contractors. Transparent pricing, audit defense, and judgment-free support.`
    : 'Sex work tax preparation and bookkeeping for creators, OnlyFans, dancers, and independent contractors. Transparent pricing, audit defense, and judgment-free support.';
  const heroTitle = stateName
    ? `${stateName} Pricing for Sex Work Tax Prep`
    : 'Pricing that keeps creators organized, compliant, and stress-free';
  const heroSubtitle = stateName
    ? `Sex work tax preparation in ${stateName} for OnlyFans creators, dancers, escorts, and adult entertainers. Choose the package that fits your income level and business structure.`
    : 'Sex work tax preparation for OnlyFans creators, dancers, escorts, and adult entertainers. Choose the package that fits your income level and business structure.';
  const leadText = stateName
    ? `We specialize in sex work tax prep, bookkeeping, and compliance support for ${stateName} independent contractors, content creators, and adult entertainers.`
    : 'We specialize in sex work tax prep, bookkeeping, and compliance support for independent contractors, content creators, and adult entertainers.';
  const stateRows = chunkStates(states, 4);
  const stateIntro = stateName
    ? `We provide sex work tax preparation and bookkeeping support across ${stateName}. ` +
      `Every return is built around accurate reporting, clear recordkeeping, and stress-free ` +
      `compliance that fits your real income and work style.`
    : null;
  const stateChecklist = [
    'Platform payout reports and summaries',
    'Cash tips and cash app tracking',
    'Expense receipts and subscriptions',
    'Mileage and travel logs',
    'Equipment and supplies purchases',
    'Prior-year tax returns (if available)',
    'Entity documents (LLC/S-corp, if applicable)'
  ];
  const stateSupport = [
    `State and local filings review for ${stateName || 'your area'}`,
    'Self-employment tax planning and estimates',
    'Audit-ready documentation and recordkeeping',
    'Income reconciliation across platforms and payment methods'
  ];

  const handleStateChange = (event) => {
    const next = event.target.value;
    if (next) {
      window.location.href = next;
    }
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>

      <nav className="navbar">
        <div className="container">
          <div className="nav-brand">
            <div className="nav-logo-wrap">
              <a href="index.html" className="nav-logo-text">
                Lazy Girls Tax
              </a>
              <span className="logo-sparkle logo-sparkle-1" aria-hidden="true"></span>
              <span className="logo-sparkle logo-sparkle-2" aria-hidden="true"></span>
              <span className="logo-sparkle logo-sparkle-3" aria-hidden="true"></span>
            </div>
          </div>
          <ul className="nav-menu">
            <li>
              <a href="index.html">Home</a>
            </li>
            <li>
              <a href="about.html">About</a>
            </li>
            <li>
              <a href="services.html">Services</a>
            </li>
            <li>
              <a href="/pricing">Pricing</a>
            </li>
            <li>
              <a href="contact.html" className="cta-nav">
                Start Here
              </a>
            </li>
          </ul>
          <button className="mobile-menu-toggle" aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      <main>
        <section className="hero pricing-hero">
          <div className="container">
            <div className="pricing-hero-content">
              <div className="pricing-hero-text">
                <div className="hero-badge">Flat-rate, transparent pricing</div>
                <h1 className="hero-title">
                  {heroTitle.includes('stress-free') ? (
                    <>
                      Pricing that keeps creators organized, compliant, and{' '}
                      <span className="text-accent">stress-free</span>
                    </>
                  ) : (
                    heroTitle
                  )}
                </h1>
                <p className="hero-subtitle">
                  {heroSubtitle} Every plan is judgment-free, detail‑oriented, and built for
                  creators.
                </p>
                <div className="hero-cta">
                  <a href="contact.html" className="btn btn-primary">
                    Start Here
                  </a>
                  <a href="core-package.html" className="btn btn-secondary">
                    View Core Package
                  </a>
                </div>
              </div>
              <div className="pricing-hero-card">
                <h3>Quick Guide</h3>
                <ul className="quick-guide-list">
                  <li>
                    <strong>Business Clients:</strong> S‑corp or $100k+ annual earnings
                  </li>
                  <li>
                    <strong>Small Business:</strong> LLCs or under $100k
                  </li>
                  <li>
                    <strong>Tax Prep Only:</strong> 1 year of prep + audit defense
                  </li>
                  <li>
                    <strong>Core Comprehensive:</strong> 2 years + ongoing support
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="pricing-section">
          <div className="container">
            {!stateName && (
              <div className="state-selector">
                <label htmlFor="state-select">Choose your state</label>
                <select id="state-select" onChange={handleStateChange} value="">
                  <option value="">Select a state</option>
                  {states.map((item) => (
                    <option key={item.slug} value={`/pricing/${item.slug}`}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <h2 className="section-title">Business Clients (S-corps or earnings over $100k)</h2>
            <div className="pricing-card">
              <table className="pricing-compare pricing-compare-plans">
                <thead>
                  <tr>
                    <th>Feature Category</th>
                    <th>
                      <div className="plan-header">
                        <span className="plan-name">Tax Prep Only</span>
                        <span className="plan-price">$500</span>
                      </div>
                    </th>
                    <th>
                      <div className="plan-header">
                        <span className="plan-name">Core Monthly</span>
                        <span className="plan-price">$300/mo</span>
                      </div>
                    </th>
                    <th className="featured">
                      <div className="plan-header">
                        <span className="plan-name">Core Paid in Full</span>
                        <span className="plan-price">$3,000</span>
                      </div>
                    </th>
                    <th>
                      <div className="plan-header">
                        <span className="plan-name">Custom Quote</span>
                        <span className="plan-price">Custom</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Best for</td>
                    <td>Best for one year of filing support.</td>
                    <td>Ongoing support for growing S-corps.</td>
                    <td>One payment for full-year coverage.</td>
                    <td>Built for complex or multi-entity needs.</td>
                  </tr>
                  <tr className="row-highlight">
                    <td>Included</td>
                    <td>
                      <ul>
                        <li>Tax prep (1 year)</li>
                        <li>Audit defense included</li>
                      </ul>
                    </td>
                    <td>
                      <ul>
                        <li>Tax prep (1 year)</li>
                        <li>Audit defense included</li>
                      </ul>
                    </td>
                    <td>
                      <ul>
                        <li>Tax prep (1 year)</li>
                        <li>Audit defense included</li>
                        <li>Tax prep (2 years, personal + business)</li>
                        <li>Bookkeeping support</li>
                        <li>Payroll processing (owner only)</li>
                        <li>Compliance + virtual mailbox setup*</li>
                        <li>Unlimited Q&amp;A</li>
                      </ul>
                    </td>
                    <td>
                      <ul>
                        <li>Tax prep (1 year)</li>
                        <li>Audit defense included</li>
                        <li>Tax prep (2 years, personal + business)</li>
                        <li>Bookkeeping support</li>
                        <li>Payroll processing (owner only)</li>
                        <li>Compliance + virtual mailbox setup*</li>
                        <li>Unlimited Q&amp;A</li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td>New in this package</td>
                    <td className="muted">—</td>
                    <td>
                      <ul>
                        <li>Tax prep (2 years, personal + business)</li>
                        <li>Bookkeeping support</li>
                        <li>Payroll processing (owner only)</li>
                        <li>Compliance + virtual mailbox setup*</li>
                        <li>Unlimited Q&amp;A</li>
                      </ul>
                    </td>
                    <td>
                      <ul>
                        <li>Save $600 vs. monthly billing</li>
                        <li>Single upfront payment</li>
                      </ul>
                    </td>
                    <td>
                      <ul>
                        <li>Custom scope for multi-entity or multi-state filing</li>
                        <li>Expanded payroll support</li>
                        <li>High-volume creator revenue tracking</li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <a href="contact.html" className="btn btn-primary">
                        Start Here
                      </a>
                    </td>
                    <td>
                      <a href="contact.html" className="btn btn-primary">
                        Start Here
                      </a>
                    </td>
                    <td>
                      <a href="contact.html" className="btn btn-primary">
                        Start Here
                      </a>
                    </td>
                    <td>
                      <a href="contact.html" className="btn btn-secondary">
                        Request
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="pricing-packages">
                <article className="package-card">
                  <div className="package-card-header">
                    <h3>Tax Prep Only</h3>
                    <p className="package-price">$500</p>
                    <p className="package-subtitle">Best for one year of filing support.</p>
                  </div>
                  <div className="package-included">
                    <h4>Included in this package</h4>
                    <ul>
                      <li>Tax prep (1 year)</li>
                      <li>Audit defense included</li>
                    </ul>
                  </div>
                  <div className="package-cta">
                    <a href="contact.html" className="btn btn-primary">
                      Start Here
                    </a>
                  </div>
                </article>
                <article className="package-card">
                  <div className="package-card-header">
                    <h3>Core Monthly</h3>
                    <p className="package-price">$300/mo</p>
                    <p className="package-subtitle">Ongoing support for growing S-corps.</p>
                  </div>
                  <div className="package-included">
                    <h4>Included in this package</h4>
                    <ul>
                      <li>Tax prep (1 year)</li>
                      <li>Audit defense included</li>
                    </ul>
                  </div>
                  <div className="package-plus">
                    <h4>New in this package</h4>
                    <ul>
                      <li>Tax prep (2 years, personal + business)</li>
                      <li>Bookkeeping support</li>
                      <li>Payroll processing (owner only)</li>
                      <li>Compliance + virtual mailbox setup*</li>
                      <li>Unlimited Q&amp;A</li>
                    </ul>
                  </div>
                  <div className="package-cta">
                    <a href="contact.html" className="btn btn-primary">
                      Start Here
                    </a>
                  </div>
                </article>
                <article className="package-card featured">
                  <div className="package-card-header">
                    <h3>Core Paid in Full</h3>
                    <p className="package-price">$3,000</p>
                    <p className="package-subtitle">One payment for full-year coverage.</p>
                  </div>
                  <div className="package-included">
                    <h4>Included in this package</h4>
                    <ul>
                      <li>Tax prep (1 year)</li>
                      <li>Audit defense included</li>
                      <li>Tax prep (2 years, personal + business)</li>
                      <li>Bookkeeping support</li>
                      <li>Payroll processing (owner only)</li>
                      <li>Compliance + virtual mailbox setup*</li>
                      <li>Unlimited Q&amp;A</li>
                    </ul>
                  </div>
                  <div className="package-plus">
                    <h4>New in this package</h4>
                    <ul>
                      <li>Save $600 vs. monthly billing</li>
                      <li>Single upfront payment</li>
                    </ul>
                  </div>
                  <div className="package-cta">
                    <a href="contact.html" className="btn btn-primary">
                      Start Here
                    </a>
                  </div>
                </article>
                <article className="package-card">
                  <div className="package-card-header">
                    <h3>Custom Quote</h3>
                    <p className="package-price">Custom</p>
                    <p className="package-subtitle">Built for complex or multi-entity needs.</p>
                  </div>
                  <div className="package-included">
                    <h4>Included in this package</h4>
                    <ul>
                      <li>Tax prep (1 year)</li>
                      <li>Audit defense included</li>
                      <li>Tax prep (2 years, personal + business)</li>
                      <li>Bookkeeping support</li>
                      <li>Payroll processing (owner only)</li>
                      <li>Compliance + virtual mailbox setup*</li>
                      <li>Unlimited Q&amp;A</li>
                    </ul>
                  </div>
                  <div className="package-plus">
                    <h4>New in this package</h4>
                    <ul>
                      <li>Custom scope for multi-entity or multi-state filing</li>
                      <li>Expanded payroll support</li>
                      <li>High-volume creator revenue tracking</li>
                    </ul>
                  </div>
                  <div className="package-cta">
                    <a href="contact.html" className="btn btn-secondary">
                      Request
                    </a>
                  </div>
                </article>
              </div>
              <p className="pricing-note">
                <em>
                  *Additional third-party fees apply: Registered agent (~$125/year), Virtual
                  mailbox (~$20/month). Government fees are client&apos;s responsibility.
                </em>
              </p>
            </div>
          </div>
        </section>

        <section className="pricing-section pricing-section-alt">
          <div className="container">
            <h2 className="section-title">Small Business Clients (LLCs or earnings under $100k)</h2>
            <div className="pricing-card">
              <table className="pricing-compare pricing-compare-plans">
                <thead>
                  <tr>
                    <th>Feature Category</th>
                    <th>
                      <div className="plan-header">
                        <span className="plan-name">Tax Prep Only</span>
                        <span className="plan-price">$500</span>
                      </div>
                    </th>
                    <th>
                      <div className="plan-header">
                        <span className="plan-name">Core Monthly</span>
                        <span className="plan-price">$100/mo</span>
                      </div>
                    </th>
                    <th className="featured">
                      <div className="plan-header">
                        <span className="plan-name">Core Paid in Full</span>
                        <span className="plan-price">$1,000</span>
                      </div>
                    </th>
                    <th>
                      <div className="plan-header">
                        <span className="plan-name">Custom Quote</span>
                        <span className="plan-price">Custom</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Best for</td>
                    <td>Best for one year of filing support.</td>
                    <td>Monthly support for growing LLCs.</td>
                    <td>One payment for full-year coverage.</td>
                    <td>Built for complex or multi-entity needs.</td>
                  </tr>
                  <tr className="row-highlight">
                    <td>Included</td>
                    <td>
                      <ul>
                        <li>Tax prep (1 year)</li>
                        <li>Audit defense included</li>
                      </ul>
                    </td>
                    <td>
                      <ul>
                        <li>Tax prep (1 year)</li>
                        <li>Audit defense included</li>
                      </ul>
                    </td>
                    <td>
                      <ul>
                        <li>Tax prep (1 year)</li>
                        <li>Audit defense included</li>
                        <li>Tax prep (2 years, personal + business)</li>
                        <li>Bookkeeping template</li>
                        <li>Compliance + virtual mailbox setup*</li>
                        <li>Unlimited Q&amp;A</li>
                      </ul>
                    </td>
                    <td>
                      <ul>
                        <li>Tax prep (1 year)</li>
                        <li>Audit defense included</li>
                        <li>Tax prep (2 years, personal + business)</li>
                        <li>Bookkeeping template</li>
                        <li>Compliance + virtual mailbox setup*</li>
                        <li>Unlimited Q&amp;A</li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td>New in this package</td>
                    <td className="muted">—</td>
                    <td>
                      <ul>
                        <li>Tax prep (2 years, personal + business)</li>
                        <li>Bookkeeping template</li>
                        <li>Compliance + virtual mailbox setup*</li>
                        <li>Unlimited Q&amp;A</li>
                      </ul>
                    </td>
                    <td>
                      <ul>
                        <li>Save $200 vs. monthly billing</li>
                        <li>Single upfront payment</li>
                      </ul>
                    </td>
                    <td>
                      <ul>
                        <li>Custom scope for multi-entity or multi-state filing</li>
                        <li>Expanded support for additional filings</li>
                        <li>High-volume creator revenue tracking</li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <a href="contact.html" className="btn btn-primary">
                        Start Here
                      </a>
                    </td>
                    <td>
                      <a href="contact.html" className="btn btn-primary">
                        Start Here
                      </a>
                    </td>
                    <td>
                      <a href="contact.html" className="btn btn-primary">
                        Start Here
                      </a>
                    </td>
                    <td>
                      <a href="contact.html" className="btn btn-secondary">
                        Request
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="pricing-packages">
                <article className="package-card">
                  <div className="package-card-header">
                    <h3>Tax Prep Only</h3>
                    <p className="package-price">$500</p>
                    <p className="package-subtitle">Best for one year of filing support.</p>
                  </div>
                  <div className="package-included">
                    <h4>Included in this package</h4>
                    <ul>
                      <li>Tax prep (1 year)</li>
                      <li>Audit defense included</li>
                    </ul>
                  </div>
                  <div className="package-cta">
                    <a href="contact.html" className="btn btn-primary">
                      Start Here
                    </a>
                  </div>
                </article>
                <article className="package-card">
                  <div className="package-card-header">
                    <h3>Core Monthly</h3>
                    <p className="package-price">$100/mo</p>
                    <p className="package-subtitle">Monthly support for growing LLCs.</p>
                  </div>
                  <div className="package-included">
                    <h4>Included in this package</h4>
                    <ul>
                      <li>Tax prep (1 year)</li>
                      <li>Audit defense included</li>
                    </ul>
                  </div>
                  <div className="package-plus">
                    <h4>New in this package</h4>
                    <ul>
                      <li>Tax prep (2 years, personal + business)</li>
                      <li>Bookkeeping template</li>
                      <li>Compliance + virtual mailbox setup*</li>
                      <li>Unlimited Q&amp;A</li>
                    </ul>
                  </div>
                  <div className="package-cta">
                    <a href="contact.html" className="btn btn-primary">
                      Start Here
                    </a>
                  </div>
                </article>
                <article className="package-card featured">
                  <div className="package-card-header">
                    <h3>Core Paid in Full</h3>
                    <p className="package-price">$1,000</p>
                    <p className="package-subtitle">One payment for full-year coverage.</p>
                  </div>
                  <div className="package-included">
                    <h4>Included in this package</h4>
                    <ul>
                      <li>Tax prep (1 year)</li>
                      <li>Audit defense included</li>
                      <li>Tax prep (2 years, personal + business)</li>
                      <li>Bookkeeping template</li>
                      <li>Compliance + virtual mailbox setup*</li>
                      <li>Unlimited Q&amp;A</li>
                    </ul>
                  </div>
                  <div className="package-plus">
                    <h4>New in this package</h4>
                    <ul>
                      <li>Save $200 vs. monthly billing</li>
                      <li>Single upfront payment</li>
                    </ul>
                  </div>
                  <div className="package-cta">
                    <a href="contact.html" className="btn btn-primary">
                      Start Here
                    </a>
                  </div>
                </article>
                <article className="package-card">
                  <div className="package-card-header">
                    <h3>Custom Quote</h3>
                    <p className="package-price">Custom</p>
                    <p className="package-subtitle">Built for complex or multi-entity needs.</p>
                  </div>
                  <div className="package-included">
                    <h4>Included in this package</h4>
                    <ul>
                      <li>Tax prep (1 year)</li>
                      <li>Audit defense included</li>
                      <li>Tax prep (2 years, personal + business)</li>
                      <li>Bookkeeping template</li>
                      <li>Compliance + virtual mailbox setup*</li>
                      <li>Unlimited Q&amp;A</li>
                    </ul>
                  </div>
                  <div className="package-plus">
                    <h4>New in this package</h4>
                    <ul>
                      <li>Custom scope for multi-entity or multi-state filing</li>
                      <li>Expanded support for additional filings</li>
                      <li>High-volume creator revenue tracking</li>
                    </ul>
                  </div>
                  <div className="package-cta">
                    <a href="contact.html" className="btn btn-secondary">
                      Request
                    </a>
                  </div>
                </article>
              </div>
              <p className="pricing-note">
                <em>
                  *Additional third-party fees may apply for registered agent and virtual mailbox
                  services. Government fees are client&apos;s responsibility.
                </em>
              </p>
            </div>
            <div className="state-context">
              <p className="section-lead">{leadText}</p>
              {stateIntro && <p className="section-lead">{stateIntro}</p>}
            </div>
          </div>
        </section>

        <section className="seo-section faq-section">
          <div className="container">
            <h2 className="section-title">
              {stateName ? `${stateName} Sex Work Tax Prep FAQs` : 'Sex Work Tax Prep FAQs'}
            </h2>
            <p className="section-lead">
              We specialize in sex work tax preparation for independent contractors, OnlyFans
              creators, dancers, escorts, and adult entertainers. Our goal is to make compliance
              simple and judgment-free while protecting your income and peace of mind.
            </p>
            <p className="section-lead">
              The IRS treats sex work income the same as other self-employed income, which means
              Schedule C reporting, self-employment tax, and accurate recordkeeping. Whether you
              receive 1099s, platform payouts, or cash tips, our team helps you stay organized,
              maximize legal deductions, and plan for quarterly taxes.
            </p>
            {stateName && (
              <div className="faq-state-grid">
                <div>
                  <h3 className="faq-subtitle">{stateName} tax prep checklist</h3>
                  <ul className="faq-list">
                    {stateChecklist.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="faq-subtitle">How we support {stateName} clients</h3>
                  <ul className="faq-list">
                    {stateSupport.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            <div className="faq-grid">
              {faqs.map((faq) => (
                <details className="faq-item" key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="pricing-section">
          <div className="container">
            <h2 className="section-title">Browse Pricing by State</h2>
            <div className="state-table-wrap">
              <table className="state-table">
                <tbody>
                  {stateRows.map((row) => (
                    <tr key={row.map((item) => item.slug).join('-')}>
                      {row.map((item) => (
                        <td key={item.slug}>
                          <a href={`/pricing/${item.slug}`}>{item.name}</a>
                        </td>
                      ))}
                      {row.length < 4 &&
                        Array.from({ length: 4 - row.length }).map((_, index) => (
                          <td key={`empty-${index}`} />
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <div className="cta-card">
              <h2>Ready to Get Started?</h2>
              <p>Choose a package or request a custom quote tailored to your needs.</p>
              <div className="cta-buttons">
                <a href="contact.html" className="btn btn-primary">
                  Start Here
                </a>
                <a href="core-package.html" className="btn btn-secondary">
                  Learn More About Packages
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Lazy Girls Tax</h3>
              <p>Trusted by creators and small business owners nationwide.</p>
              <p className="footer-tagline">
                Organized, accurate tax preparation and business support for content creators and
                influencers.
              </p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li>
                  <a href="about.html">About Us</a>
                </li>
                <li>
                  <a href="services.html">Services</a>
                </li>
                <li>
                  <a href="/pricing">Pricing</a>
                </li>
                <li>
                  <a href="contact.html">Contact</a>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Resources</h4>
              <ul>
                <li>
                  <a href="how-it-works.html">How It Works</a>
                </li>
                <li>
                  <a href="resources.html">Free Resources</a>
                </li>
                <li>
                  <a href="reviews.html">Reviews</a>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Legal</h4>
              <ul>
                <li>
                  <a href="legal.html">Privacy Policy</a>
                </li>
                <li>
                  <a href="legal.html">Terms of Service</a>
                </li>
                <li>
                  <a href="legal.html">Disclosures</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Lazy Girls Tax. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
