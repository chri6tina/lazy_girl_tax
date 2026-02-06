export const locations = [
  {
    slug: 'los-angeles-ca',
    city: 'Los Angeles',
    state: 'CA',
    county: 'Los Angeles County',
    population: '3.8 million',
    serviceAreas: ['Hollywood', 'Downtown LA', 'Silver Lake', 'West LA'],
    landmarks: ['Griffith Observatory', 'LA Live', 'The Grove'],
    hero: {
      title: 'Creator-friendly tax support in Los Angeles, CA',
      subtitle:
        'Flat-rate bookkeeping, tax prep, and business support tailored for LA creators, freelancers, and digital entrepreneurs.'
    },
    overview: [
      'Los Angeles is home to a fast-moving creator economy with brand deals, multiple income streams, and complex write-offs.',
      'We help LA-based creators stay organized, maximize deductions, and stay compliant without the stress.'
    ],
    highlights: [
      'Guidance for 1099, brand deals, affiliate income, and platform payouts.',
      'Clean bookkeeping setup that keeps you audit-ready year-round.',
      'Tax strategy built around California requirements and local filings.'
    ],
    faqs: [
      {
        question: 'Do you work with creators who have multiple income streams?',
        answer:
          'Yes. We organize platform payouts, brand deals, affiliate revenue, and digital product income into clear categories.'
      },
      {
        question: 'Can you help with California quarterly taxes?',
        answer:
          'Absolutely. We plan and track quarterly estimates so you are prepared for California deadlines.'
      }
    ]
  },
  {
    slug: 'atlanta-ga',
    city: 'Atlanta',
    state: 'GA',
    county: 'Fulton County',
    population: '498,000',
    serviceAreas: ['Midtown', 'Buckhead', 'Old Fourth Ward', 'Decatur'],
    landmarks: ['Piedmont Park', 'Mercedes-Benz Stadium', 'BeltLine'],
    hero: {
      title: 'Stress-free tax prep for Atlanta creators',
      subtitle:
        'We keep Atlanta creators organized with flat-rate tax prep, bookkeeping, and business support.'
    },
    overview: [
      'Atlanta creators need clean records to keep up with fast growth and new income opportunities.',
      'We create a simple system that keeps your business compliant and your tax savings on track.'
    ],
    highlights: [
      'Clear categorization for brand deals, sponsorships, and creator payouts.',
      'Monthly bookkeeping that stays aligned with your cash flow.',
      'Tax prep that reflects Georgia filing needs and creator-specific deductions.'
    ],
    faqs: [
      {
        question: 'Do you support S-corps for Georgia creators?',
        answer:
          'Yes. We handle tax prep for S-corps and help you stay compliant with payroll and quarterly filings.'
      },
      {
        question: 'Can you help me get organized before tax season?',
        answer:
          'Yes. We can set up your bookkeeping and document checklist so tax season is smooth.'
      }
    ]
  }
];

export const getLocationBySlug = (slug) =>
  locations.find((location) => location.slug === slug);
