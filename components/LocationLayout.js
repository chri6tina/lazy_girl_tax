import Head from 'next/head';

const joinList = (items) => items.filter(Boolean).join(', ');

const LocationLayout = ({ location }) => {
  const defaultTitle = `${location.city}, ${location.state} Sex Work Tax Services | Lazy Girls Tax`;
  const defaultDescription = `Sex work tax help and flat-rate tax prep for sex workers in ${location.city}, ${location.state}. Local support for ${joinList(
    location.serviceAreas
  )}.`;
  const title = location.seo?.title || defaultTitle;
  const description = location.seo?.description || defaultDescription;
  const canonical = `/locations/${location.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: `Lazy Girls Tax - ${location.city}`,
    areaServed: `${location.city}, ${location.state}`,
    serviceType: 'Sex Work Tax Preparation and Bookkeeping',
    url: canonical
  };

  const hasServices = location.services?.length;
  const hasTestimonials = location.testimonials?.length;
  const hasMap = location.map?.embedUrl;
  const hasNearbyCities = location.nearbyCities?.length;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <nav className="navbar">
        <div className="container">
          <div className="nav-brand">
            <div className="nav-logo-wrap">
              <a href="/" className="nav-logo-text">Lazy Girls Tax</a>
              <span className="logo-sparkle logo-sparkle-1" aria-hidden="true"></span>
              <span className="logo-sparkle logo-sparkle-2" aria-hidden="true"></span>
              <span className="logo-sparkle logo-sparkle-3" aria-hidden="true"></span>
            </div>
          </div>
          <ul className="nav-menu">
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/pricing">Pricing</a></li>
            <li><a href="/contact" className="cta-nav">Start Here</a></li>
          </ul>
          <button className="mobile-menu-toggle" aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      <main>
        <section className="hero location-hero">
          <div className="container location-hero-content">
            <div>
              <div className="hero-badge">Location-specific support</div>
              <h1 className="hero-title">{location.hero.title}</h1>
              <p className="hero-subtitle">{location.hero.subtitle}</p>
              <div className="hero-cta">
                <a href="/contact" className="btn btn-primary">Start Here</a>
                <a href="/pricing" className="btn btn-secondary">View Pricing</a>
              </div>
            </div>
            <div className="location-hero-card">
              <h3>{location.city} Snapshot</h3>
              <ul>
                <li><strong>County:</strong> {location.county}</li>
                <li><strong>Population:</strong> {location.population}</li>
                <li><strong>Service Areas:</strong> {joinList(location.serviceAreas)}</li>
                <li><strong>Landmarks:</strong> {joinList(location.landmarks)}</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="location-section">
          <div className="container">
            <h2 className="section-title">Why creators in {location.city} work with us</h2>
            <div className="location-grid">
              {location.overview.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="location-section location-section-alt">
          <div className="container">
            <h2 className="section-title">What you get in {location.city}</h2>
            <div className="location-highlights">
              {location.highlights.map((item) => (
                <div key={item} className="highlight-card">
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {hasServices && (
          <section className="location-section">
            <div className="container">
              <h2 className="section-title">Services for {location.city} creators</h2>
              <div className="location-services">
                {location.services.map((service) => (
                  <div key={service} className="location-service-card">
                    <p>{service}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {hasTestimonials && (
          <section className="location-section location-section-alt">
            <div className="container">
              <h2 className="section-title">What {location.city} creators say</h2>
              <div className="location-testimonials">
                {location.testimonials.map((testimonial) => (
                  <div key={testimonial.name} className="testimonial-card">
                    <p>"{testimonial.quote}"</p>
                    <p>
                      <strong>{testimonial.name}</strong>
                      {testimonial.role ? `, ${testimonial.role}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {hasMap && (
          <section className="location-section">
            <div className="container">
              <h2 className="section-title">Serving creators across {location.city}</h2>
              <div className="location-map">
                <iframe
                  title={`${location.city} service area map`}
                  src={location.map.embedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                {location.map.caption && <p>{location.map.caption}</p>}
              </div>
            </div>
          </section>
        )}

        {hasNearbyCities && (
          <section className="location-section location-section-alt">
            <div className="container">
              <h2 className="section-title">Nearby cities we support</h2>
              <div className="location-nearby">
                {location.nearbyCities.map((city) => (
                  <span key={city}>{city}</span>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="location-section">
          <div className="container">
            <h2 className="section-title">{location.city} creator FAQs</h2>
            <div className="location-faqs">
              {location.faqs.map((faq) => (
                <div key={faq.question} className="faq-card">
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <div className="cta-card">
              <h2>Ready to get started in {location.city}?</h2>
              <p>Tell us about your business and we will recommend the right package.</p>
              <div className="cta-buttons">
                <a href="/contact" className="btn btn-primary">Start Here</a>
                <a href="/pricing" className="btn btn-secondary">View Pricing</a>
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
                Organized, accurate tax preparation and business support for content creators and influencers.
              </p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="/about">About Us</a></li>
                <li><a href="/services">Services</a></li>
                <li><a href="/pricing">Pricing</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Resources</h4>
              <ul>
                <li><a href="/how-it-works">How It Works</a></li>
                <li><a href="/resources">Free Resources</a></li>
                <li><a href="/reviews">Reviews</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Legal</h4>
              <ul>
                <li><a href="/legal">Privacy Policy</a></li>
                <li><a href="/legal">Terms of Service</a></li>
                <li><a href="/legal">Disclosures</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Lazy Girls Tax. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default LocationLayout;
