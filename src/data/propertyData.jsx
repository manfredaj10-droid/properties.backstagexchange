// ─── propertyData.js ────────────────────────────────────────────────────────
//
//  Single source of truth for all property listings.
//
//  Both PropertyShowcase and Gallery import from here — no more duplicated
//  or divergent data arrays.
//
//  Each property now includes a `galleryImages` array of additional photos
//  (used by the Gallery page and PropertyDetail lightbox). The first entry
//  intentionally mirrors `img` so callers can use either field.
//
//  ICON UPDATE: All emojis replaced with premium SVG React components.
//  Icons live in propertyIcons.jsx (JSX file) and are imported here.
//  Re-export them so consuming components only need one import source.
// ────────────────────────────────────────────────────────────────────────────

// ─── Icon imports & re-exports ───────────────────────────────────────────────
//  Components that previously used emoji can now import icons directly from
//  this file — same single import source as before.
export {
  IconBed,
  IconBath,
  IconSqft,
  IconMapPinCard,
  IconWave,
  IconPool,
  IconSeaView,
  IconCliffView,
  IconCityView,
  IconGarden,
  IconHeritage,
  IconMainRoad,
  IconSparkle,
} from './propertyIcons';

import {
  IconAllListings,
  IconBuy,
  IconRent,
  IconNewProject,
  IconCommercial,
  IconWave,
  IconPool,
  IconSeaView,
  IconCliffView,
  IconCityView,
  IconGarden,
  IconHeritage,
  IconMainRoad,
  IconSparkle,
} from './propertyIcons';

// ─── Property listings ───────────────────────────────────────────────────────

export const PROPERTIES = [
  {
    id: 1,
    title: 'Calangute Beachfront Villa',
    location: 'Calangute, North Goa',
    price: '₹ 4.20 Cr',
    priceRaw: 42000000,
    type: 'sale',
    category: 'Villa',
    bhk: '4 BHK+',
    bath: '4 Bath',
    sqft: '3,800 sqft',
    highlight: 'Beachfront',
    agent: { name: "Rohan D'Souza", initials: 'RD', color: '#c9922a' },
    img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    ],
  },
  {
    id: 2,
    title: 'Arpora Jungle Pool Retreat',
    location: 'Arpora, North Goa',
    price: '₹ 2.85 Cr',
    priceRaw: 28500000,
    type: 'sale',
    category: 'Villa',
    bhk: '3 BHK',
    bath: '3 Bath',
    sqft: '2,600 sqft',
    highlight: 'Pool',
    agent: { name: 'Priya Mascarenhas', initials: 'PM', color: '#5a6fd8' },
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80',
    ],
  },
  {
    id: 3,
    title: 'Vagator Clifftop Penthouse',
    location: 'Vagator, North Goa',
    price: '₹ 1.65 Cr',
    priceRaw: 16500000,
    type: 'sale',
    category: 'Apartment',
    bhk: '2 BHK',
    bath: '2 Bath',
    sqft: '1,400 sqft',
    highlight: 'Sea View',
    agent: { name: 'Sunita Rao', initials: 'SR', color: '#2a9d8f' },
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    ],
  },
  {
    id: 4,
    title: 'Candolim Beach Cottage',
    location: 'Candolim, North Goa',
    price: '₹ 65,000/mo',
    priceRaw: 65000,
    type: 'rent',
    category: 'Cottage',
    bhk: '2 BHK',
    bath: '2 Bath',
    sqft: '980 sqft',
    highlight: 'Beach Access',
    agent: { name: "Rohan D'Souza", initials: 'RD', color: '#c9922a' },
    img: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80',
      'https://images.unsplash.com/photo-1475855581690-80accde3ae2b?w=800&q=80',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80',
    ],
  },
  {
    id: 5,
    title: 'Aguada Clifftop Bungalow',
    location: 'Fort Aguada, Goa',
    price: '₹ 3.10 Cr',
    priceRaw: 31000000,
    type: 'sale',
    category: 'Bungalow',
    bhk: '4 BHK+',
    bath: '3 Bath',
    sqft: '2,600 sqft',
    highlight: 'Cliff View',
    agent: { name: 'Nisha Kumar', initials: 'NK', color: '#e76f51' },
    img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    ],
  },
  {
    id: 6,
    title: 'Anjuna Bohemian Villa',
    location: 'Anjuna, North Goa',
    price: '₹ 2.20 Cr',
    priceRaw: 22000000,
    type: 'sale',
    category: 'Villa',
    bhk: '3 BHK',
    bath: '3 Bath',
    sqft: '2,100 sqft',
    highlight: 'Pool',
    agent: { name: 'Sunita Rao', initials: 'SR', color: '#2a9d8f' },
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    ],
  },
  {
    id: 7,
    title: 'Morjim Beachfront Studio',
    location: 'Morjim, North Goa',
    price: '₹ 45,000/mo',
    priceRaw: 45000,
    type: 'rent',
    category: 'Apartment',
    bhk: '1 BHK',
    bath: '1 Bath',
    sqft: '620 sqft',
    highlight: 'Beach Access',
    agent: { name: 'Arjun Kamat', initials: 'AK', color: '#457b9d' },
    img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    ],
  },
  {
    id: 8,
    title: 'Panjim Heritage Apartment',
    location: 'Panaji, North Goa',
    price: '₹ 95 Lakh',
    priceRaw: 9500000,
    type: 'sale',
    category: 'Apartment',
    bhk: '2 BHK',
    bath: '2 Bath',
    sqft: '1,100 sqft',
    highlight: 'City View',
    agent: { name: 'Priya Mascarenhas', initials: 'PM', color: '#5a6fd8' },
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    ],
  },
  {
    id: 9,
    title: 'Vagator Hilltop Villa',
    location: 'Vagator, North Goa',
    price: '₹ 3.75 Cr',
    priceRaw: 37500000,
    type: 'sale',
    category: 'Villa',
    bhk: '4 BHK+',
    bath: '4 Bath',
    sqft: '3,200 sqft',
    highlight: 'Pool',
    agent: { name: "Rohan D'Souza", initials: 'RD', color: '#c9922a' },
    img: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
    ],
  },
  {
    id: 10,
    title: 'Assagao Garden Bungalow',
    location: 'Assagao, North Goa',
    price: '₹ 1.80 Cr',
    priceRaw: 18000000,
    type: 'sale',
    category: 'Bungalow',
    bhk: '3 BHK',
    bath: '2 Bath',
    sqft: '1,800 sqft',
    highlight: 'Garden',
    agent: { name: 'Nisha Kumar', initials: 'NK', color: '#e76f51' },
    img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
      'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80',
    ],
  },
  {
    id: 11,
    title: 'Baga Riverside Apartment',
    location: 'Baga, North Goa',
    price: '₹ 35,000/mo',
    priceRaw: 35000,
    type: 'rent',
    category: 'Apartment',
    bhk: '2 BHK',
    bath: '1 Bath',
    sqft: '850 sqft',
    highlight: 'River View',
    agent: { name: 'Arjun Kamat', initials: 'AK', color: '#457b9d' },
    img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    ],
  },
  {
    id: 12,
    title: 'Siolim Portuguese Estate',
    location: 'Siolim, North Goa',
    price: '₹ 5.50 Cr',
    priceRaw: 55000000,
    type: 'sale',
    category: 'Villa',
    bhk: '5 BHK+',
    bath: '5 Bath',
    sqft: '4,500 sqft',
    highlight: 'Heritage',
    agent: { name: 'Sunita Rao', initials: 'SR', color: '#2a9d8f' },
    img: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
    ],
  },
  {
    id: 13,
    title: 'Mapusa Commercial Hub',
    location: 'Mapusa, North Goa',
    price: '₹ 1.20 Cr',
    priceRaw: 12000000,
    type: 'sale',
    category: 'Commercial',
    bhk: 'Office',
    bath: '2 Bath',
    sqft: '1,200 sqft',
    highlight: 'Main Road',
    agent: { name: 'Nisha Kumar', initials: 'NK', color: '#e76f51' },
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    ],
  },
  {
    id: 14,
    title: 'Porvorim Sky Residency',
    location: 'Porvorim, North Goa',
    price: '₹ 78 Lakh',
    priceRaw: 7800000,
    type: 'sale',
    category: 'Apartment',
    bhk: '2 BHK',
    bath: '2 Bath',
    sqft: '1,050 sqft',
    highlight: 'New Project',
    agent: { name: 'Arjun Kamat', initials: 'AK', color: '#457b9d' },
    img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
    ],
  },
  {
    id: 15,
    title: 'Benaulim South Goa Villa',
    location: 'Benaulim, South Goa',
    price: '₹ 2.95 Cr',
    priceRaw: 29500000,
    type: 'sale',
    category: 'Villa',
    bhk: '4 BHK',
    bath: '3 Bath',
    sqft: '2,900 sqft',
    highlight: 'Beach Access',
    agent: { name: 'Priya Mascarenhas', initials: 'PM', color: '#5a6fd8' },
    img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80',
      'https://images.unsplash.com/photo-1475855581690-80accde3ae2b?w=800&q=80',
    ],
  },
];

// ─── CATEGORIES ───────────────────────────────────────────────────────────────
//  `icon` is a JSX element — render it directly: {cat.icon}
export const CATEGORIES = [
  { key: 'all',        label: 'All',          icon: <IconAllListings /> },
  { key: 'buy',        label: 'Buy',          icon: <IconBuy />         },
  { key: 'rent',       label: 'Rent',         icon: <IconRent />        },
  { key: 'newproject', label: 'New Projects', icon: <IconNewProject />  },
  { key: 'commercial', label: 'Commercial',   icon: <IconCommercial />  },
];

export const PROPERTY_TYPES = ['All Types', 'Villa', 'Apartment', 'Bungalow', 'Cottage', 'Commercial'];
export const BUDGETS        = ['Any Budget', 'Under ₹50L', '₹50L – ₹1Cr', '₹1Cr – ₹2Cr', '₹2Cr – ₹5Cr', '₹5Cr+'];
export const BEDROOMS       = ['Any', '1 BHK', '2 BHK', '3 BHK', '4 BHK+'];

// ─── highlightIcons ───────────────────────────────────────────────────────────
//  Keys unchanged. Values are JSX elements — render directly: {highlightIcons['Pool']}
export const highlightIcons = {
  'Beachfront':   <IconWave      />,
  'Beach Access': <IconWave      />,
  'Pool':         <IconPool      />,
  'Sea View':     <IconSeaView   />,
  'Cliff View':   <IconCliffView />,
  'City View':    <IconCityView  />,
  'Garden':       <IconGarden    />,
  'River View':   <IconWave      />,
  'Heritage':     <IconHeritage  />,
  'Main Road':    <IconMainRoad  />,
  'New Project':  <IconSparkle   />,
};

// ─── Gallery category labels → property category values ──────────────────────
export const GALLERY_CATEGORY_MAP = {
  'Luxury Villas':     { propType: 'Villa',     activeCategory: 'all'        },
  'Modern Apartments': { propType: 'Apartment', activeCategory: 'all'        },
  'Beach Cottages':    { propType: 'Cottage',   activeCategory: 'all'        },
  'New Projects':      { propType: 'All Types', activeCategory: 'newproject' },
};

// ─── Derive gallery label from a property ────────────────────────────────────
export const galleryLabelForProperty = (prop) => {
  if (prop.highlight === 'New Project') return 'New Projects';
  if (prop.category === 'Villa')        return 'Luxury Villas';
  if (prop.category === 'Apartment')    return 'Modern Apartments';
  if (prop.category === 'Cottage')      return 'Beach Cottages';
  return null;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Maps Gallery pill label → { activeCategory, propType } for PropertyShowcase */
export const resolveCategoryProp = (cat) => {
  if (!cat) return null;
  if (cat === 'New Projects') return { activeCategory: 'newproject', propType: 'All Types' };
  const known = PROPERTY_TYPES.includes(cat) ? cat : null;
  if (known) return { activeCategory: 'all', propType: known };
  return null;
};

/** Maps Home hero listing-type tab → activeCategory key */
export const listingTypeToCategory = (lt) => {
  switch (lt) {
    case 'Buy':          return 'buy';
    case 'Rent':         return 'rent';
    case 'New Projects': return 'newproject';
    case 'Commercial':   return 'commercial';
    default:             return 'all';
  }
};

/** Maps Home price-range labels → BUDGETS option strings */
export const mapPriceRange = (pr) => {
  switch (pr) {
    case 'Under ₹50L':   return 'Under ₹50L';
    case '₹50L – ₹1Cr': return '₹50L – ₹1Cr';
    case '₹1Cr – ₹3Cr': return '₹1Cr – ₹2Cr';
    case 'Above ₹3Cr':  return '₹2Cr – ₹5Cr';
    default:             return 'Any Budget';
  }
};