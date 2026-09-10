export const brand = 'Croatian By Descent';
export const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const href = (path = '') => `${base}/${path.replace(/^\//, '')}`;
export const channels = [
  {
    name: 'Carl Tomich',
    url: 'https://www.youtube.com/@thecarltomich',
    detail: 'Life, ancestry & conversations',
  },
  {
    name: 'Globe Travel Adventures',
    url: 'https://www.youtube.com/@globetraveladventures',
    detail: 'Places, people & the journey',
  },
];
export const sections = [
  {
    slug: 'croatia-news',
    title: 'Croatia News',
    intro:
      'The stories shaping Croatia. Our news desk is being prepared, with source-led reporting and a clear distinction between news and opinion.',
    topics: [
      'Croatia news',
      'Business',
      'Tourism',
      'Politics',
      'Culture',
      'Sport',
      'Infrastructure',
      'Made in Croatia',
    ],
  },
  {
    slug: 'moving-to-croatia',
    title: 'Moving to Croatia',
    intro:
      'A new chapter starts with good questions. Practical guides for planning the move, finding your feet and understanding everyday life.',
    topics: [],
  },
  {
    slug: 'citizenship-by-descent',
    title: 'Citizenship by Descent',
    intro:
      'From a family connection to a clearer path forward. Understand the questions to ask, the records to gather and where to find official guidance.',
    topics: [
      'Who may qualify',
      'Croatian ancestry',
      'Documents',
      'Birth certificates',
      'Marriage certificates',
      'Apostilles',
      'Translations',
      'Consulates and applications',
      'Common delays',
      'Common mistakes',
      'Passport after approval',
      'Personal application stories',
      'Applicant interviews',
    ],
  },
  {
    slug: 'cities-and-regions',
    title: 'Cities & Regions',
    intro:
      'Find your corner of Croatia. Look beyond a holiday itinerary and explore what a place could mean for your everyday life.',
    topics: [],
  },
  {
    slug: 'croatian-diaspora',
    title: 'Croatian Diaspora',
    intro:
      'Many starting points. A shared connection. Stories of family, return, belonging and making a life between places.',
    topics: [
      'Returnee stories',
      'Moving because of ancestry',
      'Restoring family homes',
      'Buying property',
      'Croatian Australians',
      'Croatian Americans',
      'Croatian Canadians',
      'Croatian New Zealanders',
      'Communities around the world',
      'Family history',
      'Villages and relatives',
      'Starting businesses',
      'Retirement and semi-retirement',
    ],
  },
  {
    slug: 'interviews',
    title: 'Interviews',
    intro:
      'The people behind the move. Honest conversations about identity, expectations and the everyday reality of a Croatian chapter.',
    topics: [],
  },
  {
    slug: 'property',
    title: 'Property & Real Estate',
    intro:
      'A home is more than a view. Start with careful questions about renting, buying and looking after property in Croatia.',
    topics: [
      'Buying property',
      'Renting property',
      'Renovations',
      'Inheritance',
      'Coastal property',
      'Inland property',
      'Property scams',
      'Taxes and fees',
      'Long-term rental issues',
      'Regional comparisons',
    ],
  },
  {
    slug: 'videos',
    title: 'Watch Croatia',
    intro:
      'Croatia through a personal lens. Explore Carl’s channels for the journeys, places and conversations behind the stories.',
    topics: [],
  },
];
export const places = [
  'Zagreb',
  'Split',
  'Zadar',
  'Rijeka',
  'Dubrovnik',
  'Trogir',
  'Šibenik',
  'Korčula',
  'Istria',
  'Dalmatia',
  'Kvarner',
  'Slavonia',
  'Continental Croatia',
];
export const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
export const dateLabel = (d: Date) =>
  d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
