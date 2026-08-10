import React, { useState, useEffect, useMemo } from 'react';
import './PropertyShowcase.css';
 
// ─── Single source of truth ──────────────────────────────────────────────────
import {
  PROPERTIES,
  CATEGORIES,
  PROPERTY_TYPES,
  BUDGETS,
  BEDROOMS,
  highlightIcons,
  resolveCategoryProp,
  listingTypeToCategory,
  mapPriceRange,
} from '../../data/propertyData';
 
// ─── Property Card ────────────────────────────────────────────────────────────
const PropertyCard = ({ prop, onView }) => (
  <article className="prop-card" onClick={() => onView && onView(prop)}>
    <div className="prop-card-img-wrap">
      <img src={prop.img} alt={prop.title} className="prop-card-img" loading="lazy" />
      <div className="prop-card-overlay" />
      <span className={`prop-badge prop-badge--${prop.type}`}>
        {prop.type === 'sale' ? 'For Sale' : 'For Rent'}
      </span>
      <div className="prop-price-pill">{prop.price}</div>
    </div>
    <div className="prop-card-body">
      <h3 className="prop-card-title">{prop.title}</h3>
      <p className="prop-card-loc">
        <svg width="11" height="13" viewBox="0 0 11 13" fill="none">
          <path d="M5.5 0C3.015 0 1 2.015 1 4.5c0 3.375 4.5 8.5 4.5 8.5S10 7.875 10 4.5C10 2.015 7.985 0 5.5 0zm0 6.5a2 2 0 110-4 2 2 0 010 4z" fill="currentColor"/>
        </svg>
        {prop.location}
      </p>
      <div className="prop-specs">
        <span>
          <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
            <rect x="0.5" y="4.5" width="12" height="5" rx="1" stroke="currentColor"/>
            <path d="M2 4.5V2a1.5 1.5 0 013 0v2.5M8 4.5V2a1.5 1.5 0 013 0v2.5" stroke="currentColor" strokeLinecap="round"/>
          </svg>
          {prop.bhk}
        </span>
        <span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 9h10M2 9V4a1 1 0 012 0v5M6 9V6.5A1.5 1.5 0 019 6.5V9" stroke="currentColor" strokeLinecap="round"/>
          </svg>
          {prop.bath}
        </span>
        <span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="1" y="1" width="10" height="10" rx="1" stroke="currentColor"/>
            <path d="M1 5h10M5 1v10" stroke="currentColor"/>
          </svg>
          {prop.sqft}
        </span>
      </div>
      <div className="prop-highlight-row">
        {prop.highlight && (
          <span className="prop-highlight-tag">
            {highlightIcons[prop.highlight] || (<svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{display:'inline',verticalAlign:'middle',marginRight:'3px'}}><path d="M6 1L7.5 4.5L11.5 5L8.5 7.8L9.5 12L6 10L2.5 12L3.5 7.8L0.5 5L4.5 4.5L6 1Z" fill="currentColor"/></svg>)} {prop.highlight}
          </span>
        )}
      </div>
      <div className="prop-card-footer">
        <div className="prop-agent">
          <div
            className="prop-agent-avatar"
            style={{ background: prop.agent.color + '22', color: prop.agent.color }}
          >
            {prop.agent.initials}
          </div>
          <span className="prop-agent-name">{prop.agent.name}</span>
        </div>
        <button
          className="prop-view-btn"
          onClick={e => { e.stopPropagation(); onView && onView(prop); }}
        >
          View →
        </button>
      </div>
    </div>
  </article>
);
 
// ─── Main Component ───────────────────────────────────────────────────────────
//
//  Props
//  ─────
//  onViewDetail      (prop) => void   — called when a card is clicked
//  initialCategory   string | null    — category string from App
//                                       e.g. 'Villa', 'Cottage', 'New Projects'
//  initialFilters    object | null    — search bar object from App
//                                       { keyword, type, location,
//                                         priceRange, listingType }
//
//  Note: App passes key={showcaseKey} so this component remounts cleanly
//  whenever new filters arrive, preventing stale state from a prior visit.
//
const PropertyShowcase = ({ onViewDetail, initialCategory, initialFilters }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search,         setSearch]         = useState('');
  const [locationQ,      setLocationQ]      = useState('');
  const [propType,       setPropType]       = useState('All Types');
  const [budget,         setBudget]         = useState('Any Budget');
  const [bedrooms,       setBedrooms]       = useState('Any');
 
  // ── Workflow 2: initialCategory (from Gallery pills and Home category chips)
  useEffect(() => {
    if (!initialCategory) return;
    const resolved = resolveCategoryProp(initialCategory);
    if (!resolved) return;
    setActiveCategory(resolved.activeCategory);
    setPropType(resolved.propType);
    setSearch('');
    setLocationQ('');
    setBudget('Any Budget');
    setBedrooms('Any');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialCategory]);
 
  // ── Workflow 1: initialFilters (from Home hero search bar)
  useEffect(() => {
    if (!initialFilters) return;
    const {
      keyword:     kw = '',
      location:    loc = '',
      type:        t  = '',
      priceRange:  pr = '',
      listingType: lt = 'All',
    } = initialFilters;
 
    setSearch(typeof kw  === 'string' ? kw  : '');
    setLocationQ(typeof loc === 'string' ? loc : '');
    setActiveCategory(listingTypeToCategory(lt));
    setPropType(t || 'All Types');
    setBudget(mapPriceRange(pr));
    setBedrooms('Any');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialFilters]);
 
  // ── Filtered result set
  const filtered = useMemo(() => {
    return PROPERTIES.filter(p => {
      if (activeCategory === 'buy'        && p.type     !== 'sale')        return false;
      if (activeCategory === 'rent'       && p.type     !== 'rent')        return false;
      if (activeCategory === 'commercial' && p.category !== 'Commercial')  return false;
      if (activeCategory === 'newproject' && p.highlight !== 'New Project') return false;
 
      const q = search.trim().toLowerCase();
      if (q && !p.title.toLowerCase().includes(q) && !p.location.toLowerCase().includes(q))
        return false;
 
      const lq = locationQ.trim().toLowerCase();
      if (lq && !p.location.toLowerCase().includes(lq)) return false;
 
      if (propType !== 'All Types' && p.category !== propType) return false;
 
      if (budget === 'Under ₹50L'   && p.priceRaw >= 5000000)                            return false;
      if (budget === '₹50L – ₹1Cr' && (p.priceRaw < 5000000  || p.priceRaw >= 10000000)) return false;
      if (budget === '₹1Cr – ₹2Cr' && (p.priceRaw < 10000000 || p.priceRaw >= 20000000)) return false;
      if (budget === '₹2Cr – ₹5Cr' && (p.priceRaw < 20000000 || p.priceRaw >= 50000000)) return false;
      if (budget === '₹5Cr+'        && p.priceRaw < 50000000)                             return false;
 
      if (bedrooms === '1 BHK'  && !p.bhk.startsWith('1')) return false;
      if (bedrooms === '2 BHK'  && !p.bhk.startsWith('2')) return false;
      if (bedrooms === '3 BHK'  && !p.bhk.startsWith('3')) return false;
      if (bedrooms === '4 BHK+' && !p.bhk.startsWith('4') && !p.bhk.startsWith('5')) return false;
 
      return true;
    });
  }, [activeCategory, search, locationQ, propType, budget, bedrooms]);
 
  const handleSearchClick = () => {
    document.querySelector('.props-results-section')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
 
  return (
    <div className="props-page">
      {/* ── Hero Banner ── */}
      <section className="props-hero">
        <div className="props-hero-overlay" />
        <div className="props-hero-content">
          <p className="props-hero-eyebrow">• Goa's Premier Real Estate Portal</p>
          <h1 className="props-hero-title">Discover Your <em>Dream Property</em></h1>
          <p className="props-hero-sub">
            Handpicked villas, apartments &amp; cottages across Goa's finest locations.
          </p>
        </div>
      </section>
 
      {/* ── Floating Filter Bar ── */}
      <div className="props-filter-wrap">
        <div className="props-filter-glass">
 
          {/* Category Pills */}
          <div className="props-cat-pills">
            {CATEGORIES.map(c => (
              <button
                key={c.key}
                className={`props-cat-pill${activeCategory === c.key ? ' active' : ''}`}
                onClick={() => {
                  setActiveCategory(c.key);
                  if (c.key !== 'all') setPropType('All Types');
                }}
              >
                <span>{c.icon}</span> {c.label}
              </button>
            ))}
          </div>
 
          {/* Search + Dropdowns */}
          <div className="props-search-row">
            <div className="props-search-field props-search-field--wide">
              <label className="props-field-label">LOCATION OR PROJECT</label>
              <select
                className="props-search-select"
                value={locationQ}
                onChange={e => setLocationQ(e.target.value)}
              >
                <option value="">Select Location</option>
                <optgroup label="By Region">
                  <option value="North Goa">North Goa</option>
                  <option value="South Goa">South Goa</option>
                </optgroup>
                <optgroup label="Popular Areas">
                  <option value="Calangute">Calangute</option>
                  <option value="Candolim">Candolim</option>
                  <option value="Baga">Baga</option>
                  <option value="Anjuna">Anjuna</option>
                  <option value="Vagator">Vagator</option>
                  <option value="Porvorim">Porvorim</option>
                  <option value="Panjim">Panjim</option>
                  <option value="Mapusa">Mapusa</option>
                  <option value="Morjim">Morjim</option>
                  <option value="Assagao">Assagao</option>
                  <option value="Margao">Margao</option>
                  <option value="Colva">Colva</option>
                  <option value="Benaulim">Benaulim</option>
                  <option value="Vasco da Gama">Vasco da Gama</option>
                </optgroup>
              </select>
            </div>
            <div className="props-search-divider" />
            <div className="props-search-field">
              <label className="props-field-label">PROPERTY TYPE</label>
              <select
                className="props-search-select"
                value={propType}
                onChange={e => setPropType(e.target.value)}
              >
                {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="props-search-divider" />
            <div className="props-search-field">
              <label className="props-field-label">BUDGET</label>
              <select
                className="props-search-select"
                value={budget}
                onChange={e => setBudget(e.target.value)}
              >
                {BUDGETS.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="props-search-divider" />
            <div className="props-search-field">
              <label className="props-field-label">BEDROOMS</label>
              <select
                className="props-search-select"
                value={bedrooms}
                onChange={e => setBedrooms(e.target.value)}
              >
                {BEDROOMS.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <button className="props-search-btn" onClick={handleSearchClick}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Search
            </button>
          </div>
        </div>
      </div>
 
      {/* ── Results Section ── */}
      <section className="props-results-section">
        <div className="props-results-header">
          <p className="props-count">
            <strong>{filtered.length}</strong> {filtered.length === 1 ? 'Property' : 'Properties'} Found
          </p>
        </div>
 
        {filtered.length === 0 ? (
          <div className="props-empty">
            <p>No properties match your filters. Try adjusting your search.</p>
          </div>
        ) : (
          <div className="props-grid">
            {filtered.map(p => (
              <PropertyCard key={p.id} prop={p} onView={onViewDetail} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
 
export default PropertyShowcase;