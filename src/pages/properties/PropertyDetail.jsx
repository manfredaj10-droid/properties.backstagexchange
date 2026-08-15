import { useState, useEffect, useCallback, useRef } from 'react';
import './PropertyDetail.css';

// ─── Static detail images (first slot replaced by prop.img at runtime) ───────
// ─── Fallback detail images ───────────────────────────────────────────────────
// Used only when the API does not provide enough property photos.
const DETAIL_IMAGES = [
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=85',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80',
];

// ─── Generic amenity icon ────────────────────────────────────────────────────
// Keeps the existing amenity-card design without changing your CSS.
const DEFAULT_AMENITY_ICON = (
  <svg  width="18"  height="18"  viewBox="0 0 18 18"  fill="none">
    <path  d="M3 9.5L9 3L15 9.5V15H3V9.5Z"  stroke="currentColor"  strokeWidth="1.3"  strokeLinejoin="round"/>
    <path   d="M7 15V10H11V15"   stroke="currentColor"   strokeWidth="1.3" />
  </svg>
);

// ─── Helpers for API data ─────────────────────────────────────────────────────
const getApiData = (prop) => prop?.apiData || {};
const parseApiArray = (value) => {
  if (Array.isArray(value)) return value;

  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // Not JSON — treat comma-separated text as a list.
    }

    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const getPropertyDescription = (prop) => {
  const api = getApiData(prop);
  return (
    api.description ||
    api.property_description ||
    api.propertyDescription ||
    api.about ||
    api.details ||
    ''
  );
};

const getPropertyAmenities = (prop) => {
  const api = getApiData(prop);

  const raw =
    api.amenities ||
    api.amenity ||
    api.features ||
    api.facilities ||
    [];

  return parseApiArray(raw);
};

const getPropertyPhotos = (prop) => {
  const api = getApiData(prop);

  let photos = [];

  if (Array.isArray(api.photos)) {
    photos = api.photos;
  } else if (typeof api.photos === 'string' && api.photos.trim()) {
    try {
      const parsed = JSON.parse(api.photos);
      if (Array.isArray(parsed)) {
        photos = parsed;
      } else {
        photos = [api.photos];
      }
    } catch {
      photos = [api.photos];
    }
  }

  return photos.filter(
    (photo) => typeof photo === 'string' && photo.trim() !== ''
  );
};

// ─── Fallback nearby places ──────────────────────────────────────────────────
// Kept only when the API doesn't provide nearby information.
const DEFAULT_NEARBY = [
  {
    label: 'Calangute Beach',
    dist: '200 m',
  },
  {
    label: 'Goa International Airport',
    dist: '38 km',
  },
  {
    label: 'Apollo Clinic',
    dist: '2.1 km',
  },
  {
    label: 'Market & Grocery',
    dist: '600 m',
  },
  {
    label: 'Fine Dining Strip',
    dist: '400 m',
  },
  {
    label: 'Our Lady of Hope Church',
    dist: '900 m',
  },
];

// ─── Fallback specifications ─────────────────────────────────────────────────
const DEFAULT_SPECS = [
  ['Plot Area', 'Not specified'],
  ['Built-up Area', 'Not specified'],
  ['Floor Count', 'Not specified'],
  ['Year Built', 'Not specified'],
  ['Furnishing', 'Not specified'],
  ['Parking', 'Not specified'],
  ['Flooring', 'Not specified'],
  ['Water Supply', 'Not specified'],
  ['Power Backup', 'Not specified'],
  ['RERA No.', 'Not specified'],
];

const getPropertySpecs = (prop) => {
  const api = getApiData(prop);

  return [
    ['Plot Area', api.plot_area || api.plotArea],
    ['Built-up Area', api.built_up_area || api.builtUpArea || prop.sqft],
    ['Floor Count', api.floor_count || api.floorCount],
    ['Year Built', api.year_built || api.yearBuilt],
    ['Furnishing', api.furnishing],
    ['Parking', api.parking],
    ['Flooring', api.flooring],
    ['Water Supply', api.water_supply || api.waterSupply],
    ['Power Backup', api.power_backup || api.powerBackup],
    ['RERA No.', api.rera_no || api.reraNumber || api.rera],
  ].map(([label, value], index) => [
    label,
    value || DEFAULT_SPECS[index][1],
  ]);
};

const TABS = ['Overview', 'Amenities', 'Nearby', 'Specs'];

const SIMILAR = [
  { title: 'Palm Grove Eco Retreat',    price: '₹ 2.85 Cr',    badge: 'For Sale', img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=75' },
  { title: 'Aguada Clifftop Bungalow',  price: '₹ 3.10 Cr',    badge: 'For Sale', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=75' },
  { title: 'Candolim Beach Cottage',    price: '₹ 85,000/mon', badge: 'For Rent', img: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&q=75' },
];

// ─── EMI Calculator ───────────────────────────────────────────────────────────
// Parses "₹ 4.20 Cr" / "₹ 1.45 Cr" / "₹ 95 L" → rupees, then
// estimates monthly EMI at 8.5% for 20 years with 20% down.
const calcEMI = (priceStr) => {
  if (!priceStr) return null;
  const s = priceStr.replace(/[₹,\s]/g, '');
  let principal;
  if (/Cr/i.test(s))  principal = parseFloat(s) * 1e7;
  else if (/L/i.test(s)) principal = parseFloat(s) * 1e5;
  else return null;

  const loanAmt = principal * 0.80;            // 20% down
  const r       = 8.5 / 100 / 12;             // monthly rate
  const n       = 20 * 12;                     // 240 months
  const emi     = loanAmt * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  const lakhs   = emi / 1e5;
  return lakhs >= 1
    ? `~ ₹ ${lakhs.toFixed(1)} L / mo`
    : `~ ₹ ${Math.round(emi / 1000)}K / mo`;
};

// ─── Gallery Modal (stable component, defined outside parent) ─────────────────
const GalleryModal = ({ images, galleryIdx, setGalleryIdx, onClose, propTitle }) => {
  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft')  setGalleryIdx(i => (i - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') setGalleryIdx(i => (i + 1) % images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [images.length, onClose, setGalleryIdx]);

  return (
    <div className="pd-gallery-modal" onClick={onClose} role="dialog" aria-modal="true" aria-label="Image gallery">
      <button className="pd-gallery-close" onClick={onClose} aria-label="Close gallery"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><line x1="2" y1="2" x2="12" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="12" y1="2" x2="2" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg></button>
      <button
        className="pd-gallery-nav pd-gallery-nav--prev"
        aria-label="Previous image"
        onClick={e => { e.stopPropagation(); setGalleryIdx(i => (i - 1 + images.length) % images.length); }}
      >‹</button>
      <img
        src={images[galleryIdx]}
        alt={`${propTitle} — image ${galleryIdx + 1}`}
        className="pd-gallery-fullimg"
        onClick={e => e.stopPropagation()}
        loading="lazy"
      />
      <button
        className="pd-gallery-nav pd-gallery-nav--next"
        aria-label="Next image"
        onClick={e => { e.stopPropagation(); setGalleryIdx(i => (i + 1) % images.length); }}
      >›</button>
      <div className="pd-gallery-dots" role="tablist">
        {images.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === galleryIdx}
            aria-label={`Go to image ${i + 1}`}
            className={`pd-gallery-dot${i === galleryIdx ? ' active' : ''}`}
            onClick={e => { e.stopPropagation(); setGalleryIdx(i); }}
          />
        ))}
      </div>
    </div>
  );
};

// ─── Tab Panels (stable components, defined outside parent) ──────────────────
const OverviewPanel = ({ prop, isRent }) => {
  const description = getPropertyDescription(prop);

  const fallbackDescription = `Nestled in ${prop.location}, this exceptional ${
    prop.category?.toLowerCase() || 'property'
  } offers a distinctive opportunity for comfortable Goan living. The property combines its location, generous proportions and thoughtfully planned spaces to create an attractive residential experience.`;

  return (
    <div className="pd-tab-content tab-enter">
      <div className="pd-overview-badges">
        <span
          className={`pd-badge pd-badge--type ${
            isRent ? 'pd-badge--rent' : 'pd-badge--sale'
          }`}
        >
          {isRent ? 'For Rent' : 'For Sale'}
        </span>

        <span className="pd-badge pd-badge--gold">
          {prop.highlight || 'Verified Property'}
        </span>

        <span className="pd-badge pd-badge--glass">
          {prop.category || 'Property'}
        </span>
      </div>

      <h2 className="pd-section-heading">About this Property</h2>

      {description ? (
        <p className="pd-body-text">{description}</p>
      ) : (
        <p className="pd-body-text">{fallbackDescription}</p>
      )}

      <div className="pd-highlights-strip">
        {[
          prop.highlight || 'Verified Property',
          prop.type === 'rent' ? 'Available for Rent' : 'Available for Sale',
          prop.category || 'Property',
          prop.bhk || 'BHK Available',
          prop.sqft || 'Area Available',
        ].map((h) => (
          <div key={h} className="pd-highlight-chip">
            <span className="pd-check">
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
              >
                <circle
                  cx="6.5"
                  cy="6.5"
                  r="5.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <path
                  d="M4 6.5L6 8.5L9.5 5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            {h}
          </div>
        ))}
      </div>
    </div>
  );
};

const AmenitiesPanel = ({ prop }) => {
  const amenities = getPropertyAmenities(prop);

  return (
    <div className="pd-tab-content tab-enter">
      <h2 className="pd-section-heading">Property Amenities</h2>

      <div className="pd-amenities-grid">
        {amenities.length > 0 ? (
          amenities.map((amenity, index) => {
            const label =
              typeof amenity === 'string'
                ? amenity
                : amenity?.name ||
                  amenity?.label ||
                  amenity?.title ||
                  `Amenity ${index + 1}`;

            return (
              <div key={`${label}-${index}`} className="pd-amenity-card">
                <span className="pd-amenity-icon" aria-hidden="true">
                  {DEFAULT_AMENITY_ICON}
                </span>

                <span className="pd-amenity-label">
                  {label}
                </span>
              </div>
            );
          })
        ) : (
          <div className="pd-amenity-card">
            <span className="pd-amenity-icon" aria-hidden="true">
              {DEFAULT_AMENITY_ICON}
            </span>

            <span className="pd-amenity-label">
              Amenities not specified
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const NearbyPanel = ({ location }) => (
  <div className="pd-tab-content tab-enter">
    <h2 className="pd-section-heading">Neighbourhood &amp; Surroundings</h2>

    <div className="pd-nearby-list" role="list">
      <div className="pd-nearby-row" role="listitem">
        <span className="pd-nearby-icon" aria-hidden="true">
          📍
        </span>

        <span className="pd-nearby-label">
          Property Location
        </span>

        <span className="pd-nearby-dist">
          {location}
        </span>
      </div>
    </div>

    <div className="pd-map-block">
      <div className="pd-map-pin-wrap">
        <span className="pd-map-pin-icon" aria-hidden="true">
          <svg
            width="13"
            height="16"
            viewBox="0 0 13 16"
            fill="none"
          >
            <path
              d="M6.5 0C3.46 0 1 2.46 1 5.5C1 9.625 6.5 16 6.5 16C6.5 16 12 9.625 12 5.5C12 2.46 9.54 0 6.5 0zm0 7.5a2 2 0 110-4 2 2 0 010 4z"
              fill="currentColor"
              fillOpacity="0.7"
            />
          </svg>
        </span>

        <div>
          <p className="pd-map-address">{location}</p>
          <p className="pd-map-note">
            Interactive Google Maps available on live deployment
          </p>
        </div>
      </div>
    </div>
  </div>
);

const SpecsPanel = ({ prop }) => {
  const specs = getPropertySpecs(prop);

  return (
    <div className="pd-tab-content tab-enter">
      <h2 className="pd-section-heading">  Architectural Specifications</h2>
      <div className="pd-specs-table" role="table" aria-label="Property specifications">
        {specs.map(([label, val], i) => (
          <div  key={label}  className={`pd-spec-row${    i % 2 === 0 ? ' pd-spec-row--shaded' : ''  }`}  role="row">
            <span className="pd-spec-label" role="rowheader">  {label}</span>
            <span className="pd-spec-val">  {val}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Agent Info (shared between enquiry block and sticky card) ────────────────
const AgentInfo = ({ agent, variant = 'dark' }) => {
  const isDark = variant === 'dark';
  return (
    <div className="pd-agent-row">
      <div
        className="pd-agent-avatar"
        style={{ background: (agent?.color || '#c9922a') + '22', color: agent?.color || '#c9922a' }}
        aria-label={`Agent ${agent?.name || 'Sunita Rao'}`}
      >
        {agent?.initials || 'SR'}
      </div>
      <div>
        <p className={isDark ? 'pd-agent-name' : 'pd-sticky-agent-name'}>
          {agent?.name || 'Sunita Rao'}
        </p>
        <p className={isDark ? 'pd-agent-role' : 'pd-sticky-agent-role'}>
          North Goa Luxury Specialist
        </p>
        <div className={isDark ? 'pd-agent-stars' : 'pd-sticky-stars'} aria-label="Rating: 4.9 out of 5">
          {'12345'.split('').map((s, i) => (
            <span key={i} className="pd-star" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1L7.5 4.5L11.5 5L8.5 7.8L9.5 12L6 10L2.5 12L3.5 7.8L0.5 5L4.5 4.5L6 1Z" fill="currentColor"/></svg></span>
          ))}
          <span className={isDark ? 'pd-agent-rating' : 'pd-sticky-rating-txt'}>4.9 (186 deals)</span>
        </div>
      </div>
      {isDark && (
        <div className="pd-agent-stats">
          <div className="pd-agent-stat"><strong>186</strong><span>Deals</span></div>
          <div className="pd-agent-stat"><strong>12yr</strong><span>Exp.</span></div>
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const PropertyDetail = ({ property, onBack, onNavigate }) => {
  const prop = property || {
    title: 'Calangute Beachfront Villa',
    location: 'Calangute Beach Road, North Goa',
    price: '₹ 4.20 Cr',
    type: 'sale',
    category: 'Villa',
    bhk: '4 BHK+',
    bath: '4 Bath',
    sqft: '3,800 sqft',
    highlight: 'Beachfront',
    agent: { name: "Rohan D'Souza", initials: 'RD', color: '#c9922a' },
    img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=85',
  };

  // Build image list: prop's own image first, then fallback gallery for remaining slots
const apiPhotos = getPropertyPhotos(prop);
const images =
  apiPhotos.length > 0
    ? apiPhotos
    : prop.img
    ? [prop.img, ...DETAIL_IMAGES.slice(1)]
    : DETAIL_IMAGES;

  const [activeTab,   setActiveTab]   = useState('Overview');
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIdx,  setGalleryIdx]  = useState(0);
  const [formData,    setFormData]    = useState({
    name: '', phone: '', email: '', intent: 'Book a Site Visit', message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const isRent = prop.type === 'rent';
  const emiStr = !isRent ? calcEMI(prop.price) : null;

  // FIX: stable callback reference so GalleryModal useEffect doesn't re-fire
  const closeGallery = useCallback(() => setGalleryOpen(false), []);

  const openGallery = useCallback((idx = 0) => {
    setGalleryIdx(idx);
    setGalleryOpen(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  // Render correct tab panel — stable component references, no re-mount flicker
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':  return <OverviewPanel prop={prop} isRent={isRent} />;
      case 'Amenities': return <AmenitiesPanel prop={prop} />;
      case 'Nearby':    return <NearbyPanel location={prop.location} />;
      case 'Specs':     return <SpecsPanel prop={prop} />;
      default:          return null;
    }
  };

  return (
    <div className="pd-page">
      {galleryOpen && (
        <GalleryModal
          images={images}
          galleryIdx={galleryIdx}
          setGalleryIdx={setGalleryIdx}
          onClose={closeGallery}
          propTitle={prop.title}
        />
      )}

      {/* ── Back Bar ── */}
      <div className="pd-back-bar">
        <div className="pd-container pd-back-inner">
          <button className="pd-back-btn" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            All Properties
          </button>
          <nav className="pd-breadcrumb" aria-label="Breadcrumb">
            <span onClick={() => onNavigate?.('home')} className="pd-crumb pd-crumb--link">Home</span>
            <span className="pd-crumb-sep" aria-hidden="true">/</span>
            <span onClick={onBack} className="pd-crumb pd-crumb--link">Properties</span>
            <span className="pd-crumb-sep" aria-hidden="true">/</span>
            <span className="pd-crumb" aria-current="page">{prop.title}</span>
          </nav>
        </div>
      </div>

      {/* ═══════ HERO — Asymmetric Photo Mosaic ═══════ */}
      <section className="pd-hero" aria-label="Property photos">
        <div className="pd-container">
          <div className="pd-photo-grid">

            {/* Main large photo */}
            <div className="pd-photo-main" onClick={() => openGallery(0)}>
              <img
                src={images[0]}
                alt={prop.title}
                className="pd-photo-main-img"
              />
              <div className="pd-photo-overlay" aria-hidden="true" />
              <span className={`pd-type-badge ${isRent ? 'pd-type-badge--rent' : 'pd-type-badge--sale'}`}>
                {isRent ? 'For Rent' : 'For Sale'}
              </span>
              <div className="pd-photo-actions">
                <button className="pd-photo-action-btn" title="Save property" aria-label="Save property">
                  <svg viewBox="0 0 24 24" fill="none" width="16" height="16" aria-hidden="true">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className="pd-photo-action-btn" title="Share property" aria-label="Share property">
                  <svg viewBox="0 0 24 24" fill="none" width="16" height="16" aria-hidden="true">
                    <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.8"/>
                    <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
                    <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49" stroke="currentColor" strokeWidth="1.8"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Right stack */}
            <div className="pd-photo-stack">
              <div className="pd-photo-secondary" onClick={() => openGallery(1)}>
                <img src={images[1]} alt="Property exterior detail" className="pd-photo-stack-img" loading="lazy" />
                <div className="pd-photo-overlay" aria-hidden="true" />
              </div>
              <div className="pd-photo-secondary pd-photo-secondary--last" onClick={() => openGallery(2)}>
                <img src={images[2]} alt="Property interior" className="pd-photo-stack-img" loading="lazy" />
                <div className="pd-photo-overlay" aria-hidden="true" />
                <button
                  className="pd-explore-gallery-btn"
                  onClick={e => { e.stopPropagation(); openGallery(0); }}
                  aria-label={`View all ${images.length} photos`}
                >
                  <svg viewBox="0 0 24 24" fill="none" width="14" height="14" aria-hidden="true">
                    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
                    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
                    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
                    <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
                  </svg>
                  All {images.length} Photos
                </button>
              </div>
            </div>
          </div>

          {/* Thumbnail strip — FIX: tracks galleryIdx for active state */}
          <div className="pd-thumb-strip" role="list" aria-label="Photo thumbnails">
            {images.map((img, i) => (
              <button
                key={i}
                role="listitem"
                className={`pd-thumb${i === galleryIdx ? ' pd-thumb--active' : ''}`}
                onClick={() => openGallery(i)}
                aria-label={`View photo ${i + 1}`}
                aria-pressed={i === galleryIdx}
              >
                <img src={img} alt="" className="pd-thumb-img" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ BODY — 60/40 Sticky Split Layout ═══════ */}
      <div className="pd-body-wrap">
        <div className="pd-container pd-split">

          {/* ── LEFT: Scrollable Content ── */}
          <div className="pd-left">

            {/* Property Header */}
            <div className="pd-prop-header">
              <div className="pd-prop-header-top">
                <div>
                  <h1 className="pd-prop-title">{prop.title}</h1>
                  <p className="pd-prop-location">
                    <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
                      <path d="M6 0C3.79 0 2 1.79 2 4c0 3 4 9 4 9s4-6 4-9c0-2.21-1.79-4-4-4zm0 5.5A1.5 1.5 0 114.5 4 1.5 1.5 0 016 5.5z" fill="currentColor"/>
                    </svg>
                    {prop.location}
                  </p>
                </div>
                {/* FIX: label is conditional on rent vs sale */}
                <div className="pd-price-display-mobile">
                  <span className="pd-price-label-mobile">{isRent ? 'Monthly Rent' : 'Asking Price'}</span>
                  <span className="pd-price-value-mobile">{prop.price}</span>
                </div>
              </div>

              <div className="pd-specs-row">
                <div className="pd-spec-pill">
                  <span className="pd-spec-pill-icon" aria-hidden="true"><svg width="14" height="12" viewBox="0 0 14 12" fill="none"><rect x="0.5" y="5" width="13" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/><path d="M2 5V3a2 2 0 014 0v2M8 5V3a2 2 0 014 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg></span>
                  <span className="pd-spec-pill-val">{prop.bhk}</span>
                </div>
                <div className="pd-spec-pill">
                  <span className="pd-spec-pill-icon" aria-hidden="true"><svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 10h11M2 10V5a1 1 0 012 0v5M7 10V7.5A2 2 0 0111 7.5V10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg></span>
                  <span className="pd-spec-pill-val">{prop.bath}</span>
                </div>
                <div className="pd-spec-pill">
                  <span className="pd-spec-pill-icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.3"/><path d="M1 5h12M5 1v12" stroke="currentColor" strokeWidth="1.1"/></svg></span>
                  <span className="pd-spec-pill-val">{prop.sqft}</span>
                </div>
                <div className="pd-spec-pill">
                  <span className="pd-spec-pill-icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.5 7L7 2L12.5 7V13H9.5V9H4.5V13H1.5V7Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg></span>
                  <span className="pd-spec-pill-val">{prop.category || 'Villa'}</span>
                </div>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="pd-tabs-wrap">
              <div className="pd-tabs" role="tablist" aria-label="Property information">
                {TABS.map(tab => (
                  <button
                    key={tab}
                    role="tab"
                    className={`pd-tab${activeTab === tab ? ' pd-tab--active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                    aria-selected={activeTab === tab}
                    aria-controls={`tabpanel-${tab.toLowerCase()}`}
                  >
                    {tab}
                    {activeTab === tab && <span className="pd-tab-indicator" aria-hidden="true" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Panel — FIX: key forces re-mount so animation re-triggers on tab change */}
            <div
              className="pd-tab-panel"
              role="tabpanel"
              id={`tabpanel-${activeTab.toLowerCase()}`}
              aria-label={activeTab}
            >
              {/* key on a wrapper ensures CSS animation fires on every tab switch */}
              <div key={activeTab}>
                {renderTabContent()}
              </div>
            </div>

            {/* ── Enquiry Form ── */}
            <div className="pd-enquiry-block">
              <div className="pd-enquiry-header">
                <AgentInfo agent={prop.agent} variant="dark" />
              </div>

              <form className="pd-enquiry-form" onSubmit={handleSubmit} noValidate>
                <h3 className="pd-enquiry-title">Send an Enquiry</h3>
                <div className="pd-form-row">
                  <input
                    type="text"
                    className="pd-form-input"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={e => setFormData(d => ({ ...d, name: e.target.value }))}
                    required
                    autoComplete="name"
                  />
                  <input
                    type="tel"
                    className="pd-form-input"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={e => setFormData(d => ({ ...d, phone: e.target.value }))}
                    required
                    autoComplete="tel"
                  />
                </div>
                <input
                  type="email"
                  className="pd-form-input"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={e => setFormData(d => ({ ...d, email: e.target.value }))}
                  required
                  autoComplete="email"
                />
                <select
                  className="pd-form-input pd-form-select"
                  value={formData.intent}
                  onChange={e => setFormData(d => ({ ...d, intent: e.target.value }))}
                  aria-label="Enquiry type"
                >
                  <option>Book a Site Visit</option>
                  <option>Request a Callback</option>
                  <option>Get Brochure</option>
                  <option>Make an Offer</option>
                  <option>General Enquiry</option>
                </select>
                <textarea
                  className="pd-form-input pd-form-textarea"
                  placeholder="Any specific questions about this property?"
                  rows={3}
                  value={formData.message}
                  onChange={e => setFormData(d => ({ ...d, message: e.target.value }))}
                  aria-label="Additional message"
                />
                <button
                  type="submit"
                  className={`pd-form-submit${submitted ? ' pd-form-submit--sent' : ''}`}
                >
                  {submitted ? 'Enquiry Sent!' : 'Submit Enquiry →'}
                </button>
              </form>
            </div>
          </div>

          {/* ── RIGHT: Sticky Price Card ── */}
          <div className="pd-right">
            <div className="pd-sticky-card">

              <div className="pd-sticky-price-block">
                <p className="pd-sticky-price-label">
                  {isRent ? 'Monthly Rent' : 'Asking Price'}
                </p>
                <p className="pd-sticky-price">{prop.price}</p>
                {!isRent && (
                  <p className="pd-sticky-price-note">+ Registration &amp; Stamp Duty applicable</p>
                )}
              </div>

              <div className="pd-sticky-actions">
                <button className="pd-btn-tour" onClick={() => onNavigate?.('contact')}>
                  <svg viewBox="0 0 24 24" fill="none" width="16" height="16" aria-hidden="true">
                    <path d="M8 2v3M16 2v3M3 8h18M5 4h14a2 2 0 012 2v13a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Book Private Tour
                </button>

                <button className="pd-btn-download">
                  <svg viewBox="0 0 24 24" fill="none" width="16" height="16" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Download Brochure
                </button>

                <button className="pd-btn-whatsapp">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Chat on WhatsApp
                </button>
              </div>

              <div className="pd-sticky-divider" />

              {/* Agent compact — FIX: uses shared AgentInfo component */}
              <div className="pd-sticky-agent">
                <p className="pd-sticky-agent-label">LISTED BY</p>
                <AgentInfo agent={prop.agent} variant="light" />
                <div className="pd-sticky-agent-btns">
                  <button className="pd-sticky-agent-btn" aria-label={`Call ${prop.agent?.name || 'agent'}`}>
                    <svg viewBox="0 0 24 24" fill="none" width="13" height="13" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.18 9.81 19.79 19.79 0 01.12 1.18 2 2 0 012.1 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92v2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                    Call
                  </button>
                  <button className="pd-sticky-agent-btn" aria-label={`Email ${prop.agent?.name || 'agent'}`}>
                    <svg viewBox="0 0 24 24" fill="none" width="13" height="13" aria-hidden="true">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.8"/>
                      <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                    Email
                  </button>
                  <button className="pd-sticky-agent-btn pd-sticky-agent-btn--wa" aria-label="WhatsApp the agent">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </button>
                </div>
              </div>

              <div className="pd-sticky-divider" />

              {/* FIX: EMI is calculated from prop.price, not hardcoded */}
              {!isRent && emiStr && (
                <div className="pd-emi-teaser">
                  <p className="pd-emi-label">Est. Monthly EMI</p>
                  <p className="pd-emi-value">{emiStr}</p>
                  <p className="pd-emi-note">at 8.5% for 20 yrs · 20% down payment</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Similar Properties ── */}
      {/* FIX: similar cards now navigate back to listing, not to a dead route */}
      <div className="pd-similar-section">
        <div className="pd-container">
          <p className="pd-similar-eyebrow">• YOU MIGHT ALSO LIKE</p>
          <h2 className="pd-similar-heading">Similar <em>Properties</em></h2>
          <div className="pd-similar-grid">
            {SIMILAR.map((s) => (
              <div
                key={s.title}
                className="pd-similar-card"
                onClick={onBack}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && onBack?.()}
                aria-label={`View ${s.title}`}
              >
                <div className="pd-similar-img-wrap">
                  <img src={s.img} alt={s.title} className="pd-similar-img" loading="lazy" />
                  <span className={`pd-similar-badge ${s.badge === 'For Rent' ? 'pd-similar-badge--rent' : 'pd-similar-badge--sale'}`}>
                    {s.badge}
                  </span>
                </div>
                <div className="pd-similar-body">
                  <p className="pd-similar-price">{s.price}</p>
                  <p className="pd-similar-title">{s.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;