import { useState, useEffect } from 'react';
import './Properties.css';
import {mapProperty} from '../../utils/propertyMapper';

// ─── Spotlight content per category ─────────────────────────────────────────

/* ─── Premium Spotlight Icons ──────────────────────────────────────────────── */
const SPOTLIGHT_ICONS = {
  villa: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path d="M5 22L20 8L35 22V36H26V27H14V36H5V22Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <rect x="16" y="27" width="8" height="9" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    </svg>
  ),
  apartment: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect x="8" y="6" width="16" height="28" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M24 14H32V34H24" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <line x1="12" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="12" y1="17" x2="16" y2="17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="12" y1="22" x2="16" y2="22" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="27" y1="19" x2="29" y2="19" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="27" y1="24" x2="29" y2="24" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  cottage: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path d="M5 22L20 8L35 22V36H5V22Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M5 18L20 5L35 18" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <rect x="15" y="26" width="10" height="10" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <rect x="9" y="24" width="7" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.1"/>
    </svg>
  ),
  penthouse: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect x="8" y="8" width="24" height="26" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M12 8L20 2L28 8" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M14 34V22H26V34" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <line x1="20" y1="22" x2="20" y2="34" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="12" y1="14" x2="16" y2="14" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="24" y1="14" x2="28" y2="14" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
    </svg>
  ),
  rocket: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path d="M20 5C20 5 30 8 32 18C34 28 26 34 26 34L21 29C21 29 24 26 23 20C22 14 18 11 18 11L20 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M14 28L10 32M20 20L13 27" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="24" cy="16" r="2" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  ),
};
const renderSpotlightIcon = (key) => SPOTLIGHT_ICONS[key] || null;

const SPOTLIGHT_DATA = {
  Villas: {
    themeClass: 'spotlight-villas',
    icon: '',
    eyebrow: 'Exclusive Standalone Residences',
    tagline: <>Timeless <em>Villa</em> Living in Goa</>,
    desc: 'Private, freehold, and utterly yours. Our villa collection spans architect-designed coastal retreats and heritage Portuguese estates — each offering unmatched land ownership, lush outdoor spaces, and the freedom to live life on your own terms.',
    pills: ['Private Pools', 'Freehold Land', 'Sea-Facing Plots', 'Landscaped Gardens', 'RERA Approved'],
  },
  Apartments: {
    themeClass: 'spotlight-apartments',
    icon: '️',
    eyebrow: 'Modern High-Rise Residences',
    tagline: <>Elevated <em>Apartment</em> Living</>,
    desc: "From panoramic sea-view floors to sleek city-centre studios — our apartment portfolio is curated for those who demand smart design, curated amenities, and seamless urban connectivity without compromising on Goa's laid-back charm.",
    pills: ['City & Sea Views', 'Rooftop Amenities', 'Concierge Services', 'Smart Home Ready', '24/7 Security'],
  },
  Cottages: {
    themeClass: 'spotlight-cottages',
    icon: '',
    eyebrow: 'Boutique Getaway Homes',
    tagline: <>Cosy <em>Cottage</em> Escapes</>,
    desc: 'Nestled among swaying palms and quiet village lanes, our cottage listings are for those who crave a slower pace without sacrificing character. Each property tells a story — terracotta tiles, wooden rafters, secret garden courtyards.',
    pills: ['Scenic Settings', 'Heritage Architecture', 'Peaceful Lanes', 'Garden Plots', 'Short-Let Friendly'],
  },
  Penthouses: {
    themeClass: 'spotlight-penthouses',
    icon: '',
    eyebrow: 'Ultra-Luxury Rooftop Residences',
    tagline: <>Above It All — <em>Penthouse</em> Collection</>,
    desc: "Reserved for the few who accept nothing less. Our penthouse portfolio occupies the crown of Goa's finest towers — sweeping 270° panoramas, private terraces the size of estates, and interiors that read like a design editorial.",
    pills: ['Panoramic Views', 'Private Terraces', 'Exclusive Floors', 'Sommelier Cellars', 'Helipad Access'],
  },
  'New Projects': {
    themeClass: 'spotlight-newprojects',
    icon: 'rocket',
    eyebrow: 'Pre-Launch & Under Construction',
    tagline: <>Invest at the <em>Cutting Edge</em></>,
    desc: 'Get in early. Our new project listings are handpicked from master-planned developments with visionary architecture, green building certifications, and pre-launch pricing that rewards forward-thinking investors.',
    pills: ['Pre-Launch Prices', 'Modern Master Plans', 'Green Certified', 'High ROI Zones', 'RERA Registered'],
  },
};

// ─── Property data ────────────────────────────────────────────────────────────
// const allProperties = [
//   {
//     id: 1,
//     badge: 'For Sale',
//     img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=700&q=80',
//     price: '₹ 4.20 Cr',
//     name: 'Seabreeze Infinity Villa',
//     location: 'Calangute Beach Road, North Goa',
//     beds: '5', baths: '4', sqft: '3,800',
//     type: 'Villa',
//     agent: 'SR', agentName: 'Sunita Rao',
//   },
//   {
//     id: 2,
//     badge: 'For Sale',
//     img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=700&q=80',
//     price: '₹ 2.85 Cr',
//     name: 'Palm Grove Eco Retreat',
//     location: 'Assagao, North Goa',
//     beds: '4', baths: '3', sqft: '2,950',
//     type: 'Villa',
//     agent: 'AK', agentName: 'Arjun Kamat',
//   },
//   {
//     id: 3,
//     badge: 'For Rent',
//     img: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=700&q=80',
//     price: '₹ 85,000/mo',
//     name: 'Candolim Beach Cottage',
//     location: 'Candolim, North Goa',
//     beds: '2', baths: '2', sqft: '980',
//     type: 'Cottage',
//     agent: 'RD', agentName: "Rohan D'Souza",
//   },
//   {
//     id: 4,
//     badge: 'For Sale',
//     img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80',
//     price: '₹ 3.10 Cr',
//     name: 'Aguada Clifftop Bungalow',
//     location: 'Fort Aguada, Goa',
//     beds: '4', baths: '3', sqft: '2,600',
//     type: 'Villa',
//     agent: 'NK', agentName: 'Nisha Kumar',
//   },
//   {
//     id: 5,
//     badge: 'For Sale',
//     img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=700&q=80',
//     price: '₹ 1.45 Cr',
//     name: 'Skyline Residences 3BHK',
//     location: 'Porvorim, North Goa',
//     beds: '3', baths: '2', sqft: '1,450',
//     type: 'Apartment',
//     agent: 'SR', agentName: 'Sunita Rao',
//   },
//   {
//     id: 6,
//     badge: 'For Rent',
//     img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&q=80',
//     price: '₹ 1.20L/mo',
//     name: 'Azure Heights Penthouse',
//     location: 'Margao, South Goa',
//     beds: '3', baths: '3', sqft: '1,800',
//     type: 'Penthouse',
//     agent: 'AK', agentName: 'Arjun Kamat',
//   },
//   {
//     id: 7,
//     badge: 'New Project',
//     img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=700&q=80',
//     price: '₹ 95 L',
//     name: 'Marina Bay Towers',
//     location: 'Panaji, Goa',
//     beds: '2', baths: '2', sqft: '1,100',
//     type: 'Apartment',
//     agent: 'NK', agentName: 'Nisha Kumar',
//   },
//   {
//     id: 8,
//     badge: 'For Sale',
//     img: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=700&q=80',
//     price: '₹ 5.50 Cr',
//     name: 'Sunrise Enclave Mega Villa',
//     location: 'Siolim, North Goa',
//     beds: '6', baths: '5', sqft: '5,200',
//     type: 'Villa',
//     agent: 'RD', agentName: "Rohan D'Souza",
//   },
// ];

const mapProperty = (p) => ({
  id: p.id,
  badge: p.listing,
  img: Array.isArray(p.photos) && p.photos.length > 0
    ? p.photos[0]
    : '',
  price: `₹ ${p.price}`,
  name: p.title,
  location: p.location,
  beds: p.beds,
  baths: p.baths,
  sqft: p.sqft,
  type: p.type,
  agent: p.agent_name
    ? p.agent_name
        .split(' ')
        .map(word => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'AG',
  agentName: p.agent_name,
});

// ─── Shape normalizer ─────────────────────────────────────────────────────────
//  Converts the flat card schema → the object shape PropertyDetail expects.
//  allProperties:   { name, type (category), badge, beds, baths, agent (initials), agentName }
//  PropertyDetail:  { title, category, type, bhk, bath, agent: { name, initials, color } }
const toDetailShape = (p) => ({
  ...p,
  title:     p.name,
  category:  p.type,
  type:      p.badge === 'For Rent' ? 'rent' : 'sale',
  bhk:       `${p.beds} Beds`,
  bath:      `${p.baths} Baths`,
  sqft:      `${p.sqft} sqft`,
  highlight: p.badge,
  agent: {
    name:     p.agentName,
    initials: p.agent,
    color:    '#c9922a',
  },
});

// ─── Price range helpers ──────────────────────────────────────────────────────
//  Parses "₹ 4.20 Cr" / "₹ 95 L" → lakhs for range comparison.
//  Monthly rent strings (containing '/mo') return null and are excluded from
//  price filtering so rental listings always remain visible.
const parsePriceToLakhs = (priceStr) => {
  if (/\/mo/i.test(priceStr)) return null;           // skip monthly rents
  const s = priceStr.replace(/[₹,\s]/g, '');
  if (/Cr/i.test(s))  return parseFloat(s) * 100;   // crores → lakhs
  if (/L/i.test(s))   return parseFloat(s);          // already lakhs
  return null;
};

const matchesPriceRange = (prop, range) => {
  if (!range) return true;
  const price = parsePriceToLakhs(prop.price);
  if (price === null) return true;
  switch (range) {
    case 'Under ₹50L':   return price < 50;
    case '₹50L – ₹1Cr': return price >= 50  && price <= 100;
    case '₹1Cr – ₹3Cr': return price > 100  && price <= 300;
    case 'Above ₹3Cr':  return price > 300;
    default:             return true;
  }
};

// ─── Category → filter-state mapping ─────────────────────────────────────────
const categoryToFilters = (categoryName) => {
  switch (categoryName) {
    case 'Villas':       return { filter: 'All',          typeFilter: 'Villa'     };
    case 'Apartments':   return { filter: 'All',          typeFilter: 'Apartment' };
    case 'Cottages':     return { filter: 'All',          typeFilter: 'Cottage'   };
    case 'Penthouses':   return { filter: 'All',          typeFilter: 'Penthouse' };
    case 'New Projects': return { filter: 'New Projects', typeFilter: 'All'       };
    default:             return { filter: 'All',          typeFilter: 'All'       };
  }
};

// Maps the Home hero search bar's "listingType" labels → badge values in data
const listingTypeToBadge = (listingType) => {
  switch (listingType) {
    case 'Buy':          return 'For Sale';
    case 'Rent':         return 'For Rent';
    case 'New Projects': return 'New Projects';
    default:             return 'All';
  }
};

// ─── Category Spotlight sub-component ────────────────────────────────────────
const CategorySpotlight = ({ categoryName }) => {
  const data = SPOTLIGHT_DATA[categoryName];
  if (!data) return null;

  return (
    <div className={`cat-spotlight ${data.themeClass}`}>
      <div className="cat-spotlight-inner">
        <div className="cat-spotlight-icon-col" aria-hidden="true">
          {renderSpotlightIcon(data.icon)}
        </div>
        <div className="cat-spotlight-text">
          <p className="cat-spotlight-eyebrow">{data.eyebrow}</p>
          <h2 className="cat-spotlight-tagline">{data.tagline}</h2>
          <p className="cat-spotlight-desc">{data.desc}</p>
          <div className="cat-spotlight-pills">
            {data.pills.map(pill => (
              <span key={pill} className="cat-spotlight-pill">{pill}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Properties Component ────────────────────────────────────────────────
//
//  Props:
//    onViewDetail(prop)  — called with toDetailShape(prop) when a card is clicked
//    initialCategory     — category name string from Home category chips
//    initialFilters      — { keyword, type, location, priceRange, listingType }
//
const Properties = ({ onViewDetail, initialCategory, initialFilters }) => {
  const initFilters = initialCategory
    ? categoryToFilters(initialCategory)
    : { filter: 'All', typeFilter: 'All' };

  const [filter,       setFilter]       = useState(initFilters.filter);
  const [typeFilter,   setTypeFilter]   = useState(initFilters.typeFilter);
  const [spotlightCat, setSpotlightCat] = useState(initialCategory || null);
  const [keyword,      setKeyword]      = useState('');
  const [locationQ,    setLocationQ]    = useState('');
  const [priceRange,   setPriceRange]   = useState('');
  const [properties, setProperties] = useState([]);

  useEffect(() => {
      const fetchProperties = async () => {
        try {
          const response = await fetch(
            'http://localhost/backstage-api/get_property.php'
          );
        
          const data = await response.json();
          if (data.success) {
            const mappedProperties = data.properties.map(mapProperty);
            console.log("Mapped properties:", mappedProperties);
            setProperties(mappedProperties);
          } else {
            console.error(data.message);
          }
        } catch (error) {
          console.error('Error fetching properties:', error);
        }
      };
    
      fetchProperties();
    }, []);


  // ── React to category changes from Home ──────────────────────────────────
  useEffect(() => {
    if (initialCategory) {
      const f = categoryToFilters(initialCategory);
      setFilter(f.filter);
      setTypeFilter(f.typeFilter);
      setSpotlightCat(initialCategory);
      setKeyword('');
      setLocationQ('');
      setPriceRange('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [initialCategory]);

  // ── React to search-bar submissions from Home ────────────────────────────
  useEffect(() => {
    if (!initialFilters) return;
    const {
      keyword: kw   = '',
      type: t       = '',
      location: loc = '',
      priceRange: pr = '',
      listingType: lt = 'All',
    } = initialFilters;

    setFilter(listingTypeToBadge(lt));
    setTypeFilter(t || 'All');
    setKeyword(kw);
    setLocationQ(loc);
    setPriceRange(pr);
    setSpotlightCat(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialFilters]);

  // ── Manual filter changes clear the spotlight banner ────────────────────
  const handleFilterChange = (value) => {
    setFilter(value);
    setSpotlightCat(null);
  };

  const handleTypeFilterChange = (value) => {
    setTypeFilter(value);
    setSpotlightCat(null);
  };

  const clearSearch = () => {
    setKeyword('');
    setLocationQ('');
    setPriceRange('');
  };

  const hasActiveSearch = keyword || locationQ || priceRange;

  // ── Filter logic ─────────────────────────────────────────────────────────
  const filtered = properties.filter(p => {
    const matchBadge =
      filter === 'All' ||
      p.badge === filter ||
      (filter === 'New Projects' && p.badge === 'New Project');

    const matchType =
      typeFilter === 'All' || p.type === typeFilter;

    const kw = keyword.trim().toLowerCase();
    const matchKeyword =
      !kw ||
      p.name.toLowerCase().includes(kw) ||
      p.location.toLowerCase().includes(kw);

    const lq = locationQ.trim().toLowerCase();
    const matchLocation =
      !lq || p.location.toLowerCase().includes(lq);

    const matchPrice = matchesPriceRange(p, priceRange);

    return matchBadge && matchType && matchKeyword && matchLocation && matchPrice;
  });

  return (
    <div className="properties-page">
      {/* ── Page Hero ── */}
      <div className="page-hero properties-hero">
        <div className="page-hero-overlay" />
        <div className="page-hero-content" style={{ paddingLeft: '5vw', paddingBottom: '3rem' }}>
          <p className="page-eyebrow">• Goa's Premier Real Estate Portal</p>
          <h1 className="page-hero-title">Discover Your <em>Dream Property</em></h1>
          <p className="page-hero-sub">
            Handpicked villas, apartments &amp; cottages across Goa's finest locations.
          </p>
        </div>
      </div>

      {/* ── Category Spotlight ── */}
      {spotlightCat && <CategorySpotlight categoryName={spotlightCat} />}

      {/* ── Active Search Summary Bar ── */}
      {hasActiveSearch && (
        <div className="search-summary-bar" role="status" aria-live="polite">
          <span className="search-summary-label">Filtering by</span>
          <div className="search-summary-chips">
            {keyword    && <span className="search-summary-chip"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{display:'inline',verticalAlign:'middle',marginRight:'4px'}}><circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.3"/><line x1="7.5" y1="7.5" x2="11" y2="11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>{keyword}</span>}
            {locationQ  && <span className="search-summary-chip"> {locationQ}</span>}
            {priceRange && <span className="search-summary-chip">{priceRange}</span>}
          </div>
          <button className="search-summary-clear" onClick={clearSearch} aria-label="Clear all search filters">
            Clear search <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{display:'inline',verticalAlign:'middle',marginLeft:'4px'}}><line x1="1.5" y1="1.5" x2="8.5" y2="8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="8.5" y1="1.5" x2="1.5" y2="8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
      )}

      {/* ── Filter Bar ── */}
      <section className="properties-filter-bar-section" aria-label="Filter properties">
        <div className="properties-container">
          <div className="properties-filter-row">

            <div className="prop-filter-group">
              <span className="prop-filter-label" id="listing-type-label">Listing Type</span>
              <div className="prop-filter-buttons" role="group" aria-labelledby="listing-type-label">
                {['All', 'For Sale', 'For Rent', 'New Projects'].map(f => (
                  <button
                    key={f}
                    className={`prop-filter-btn${filter === f ? ' active' : ''}`}
                    onClick={() => handleFilterChange(f)}
                    aria-pressed={filter === f}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="prop-filter-group">
              <span className="prop-filter-label" id="property-type-label">Property Type</span>
              <div className="prop-filter-buttons" role="group" aria-labelledby="property-type-label">
                {['All', 'Villa', 'Apartment', 'Penthouse', 'Cottage'].map(t => (
                  <button
                    key={t}
                    className={`prop-filter-btn${typeFilter === t ? ' active' : ''}`}
                    onClick={() => handleTypeFilterChange(t)}
                    aria-pressed={typeFilter === t}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="prop-results-count" aria-live="polite" aria-atomic="true">
              <span className="prop-results-count-num">{filtered.length}</span>{' '}
              {filtered.length === 1 ? 'Property' : 'Properties'} Found
            </div>

          </div>
        </div>
      </section>

      {/* ── Property Grid ── */}
      <section className="properties-list-section" aria-label="Property listings">
        <div className="properties-container">
          {filtered.length === 0 ? (
            <div className="prop-empty-state" role="status">
              <p className="prop-empty-title">No properties match your filters.</p>
              <p className="prop-empty-sub">Try a different category or clear the filters above.</p>
              {hasActiveSearch && (
                <button className="prop-empty-clear-btn" onClick={clearSearch}>
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="properties-grid">
              {filtered.map(prop => (
                <article key={prop.id} className="property-card">
                  <div className="property-card-img-wrap">
                    <img
                      src={prop.img}
                      alt={prop.name}
                      className="property-card-img"
                      loading="lazy"
                    />
                    <span
                      className={`property-badge ${
                        prop.badge === 'For Rent'
                          ? 'badge-rent'
                          : prop.badge === 'New Project'
                          ? 'badge-new'
                          : 'badge-sale'
                      }`}
                    >
                      {prop.badge}
                    </span>
                  </div>

                  <div className="property-card-body">
                    <div className="property-price-tag">{prop.price}</div>
                    <h3 className="property-card-title">{prop.name}</h3>
                    <p className="property-card-location">
                      <span aria-hidden="true"></span> <svg width="11" height="13" viewBox="0 0 11 13" fill="none" style={{display:'inline',verticalAlign:'middle',marginRight:'4px'}}><path d="M5.5 0C3.015 0 1 2.015 1 4.5c0 3.375 4.5 8.5 4.5 8.5S10 7.875 10 4.5C10 2.015 7.985 0 5.5 0zm0 6.5a2 2 0 110-4 2 2 0 010 4z" fill="currentColor"/></svg>{prop.location}
                    </p>
                    <div className="property-card-specs">
                      <span><span aria-hidden="true"></span> {prop.beds} Beds</span>
                      <span><span aria-hidden="true"></span> {prop.baths} Baths</span>
                      <span><span aria-hidden="true"></span> {prop.sqft} sqft</span>
                    </div>
                    <div className="property-card-footer">
                      <div className="agent-info">
                        <div className="agent-avatar" aria-label={`Agent ${prop.agentName}`}>{prop.agent}</div>
                        <span className="agent-name">{prop.agentName}</span>
                      </div>
                      <button
                        className="btn-view-prop"
                        onClick={() => onViewDetail && onViewDetail(toDetailShape(prop))}
                        aria-label={`View ${prop.name}`}
                      >
                        View Property
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Properties;