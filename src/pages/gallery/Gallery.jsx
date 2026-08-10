import React, { useState, useMemo } from 'react';
import './Gallery.css';
 
// ─── Single source of truth — same data array PropertyShowcase uses ──────────
import {
  PROPERTIES,
  GALLERY_CATEGORY_MAP,
  galleryLabelForProperty,
} from '../../data/propertyData';
 
// ─── Gallery filter tab labels ───────────────────────────────────────────────
//  'All' is implicit; the rest come from GALLERY_CATEGORY_MAP keys.
const GALLERY_TABS = ['All', ...Object.keys(GALLERY_CATEGORY_MAP)];
 
// ─── Derive gallery items directly from the shared PROPERTIES array ──────────
//
//  Each property may contribute one item per image in `galleryImages`.
//  Properties whose category has no gallery tab (Bungalow, Commercial) still
//  appear under the "All" tab — they just never match a specific pill.
//
const buildGalleryItems = () =>
  PROPERTIES.flatMap(prop => {
    const label = galleryLabelForProperty(prop);
    return prop.galleryImages.map((src, idx) => ({
      propertyId: prop.id,
      property:   prop,
      src,
      title:      prop.title,
      location:   prop.location,
      category:   label,               // null for types with no gallery tab
      isHero:     idx === 0,           // first image per property = hero shot
    }));
  });
 
// Build once outside the component (stable reference, no useEffect needed).
const ALL_GALLERY_ITEMS = buildGalleryItems();
 
// ─── Gallery Component ───────────────────────────────────────────────────────
const Gallery = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('All');
 
  // ── Filtered items — derived from shared data, no local array to maintain ──
  const displayed = useMemo(() => {
    if (activeTab === 'All') return ALL_GALLERY_ITEMS;
    return ALL_GALLERY_ITEMS.filter(item => item.category === activeTab);
  }, [activeTab]);
 
  // ── Tab click: update local filter state only — no page navigation ──────────
  //
  //  BUG FIX: The previous handler called onNavigate() for every tab click,
  //  routing the user away to the Properties page instead of filtering locally.
  //  The useMemo-derived `displayed` array already handles all filtering
  //  reactively — a plain setActiveTab() is the only call needed here.
  //
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
 
  // ── Image click: navigate to the specific PropertyDetail page ───────────────
  const handleImageClick = (item) => {
    onNavigate('propertydetail', { property: item.property });
  };
 
  return (
    <div className="gallery-page">
      {/* ── Hero ── */}
      <div className="page-hero gallery-hero">
        <div className="page-hero-overlay" />
        <div className="page-hero-content" style={{ paddingLeft: '5vw', paddingBottom: '3rem' }}>
          <p className="page-eyebrow">• Visual Showcase</p>
          <h1 className="page-hero-title">Property <em>Gallery</em></h1>
        </div>
      </div>
 
      <section className="gallery-section">
        <div className="gallery-container">
 
          {/* ── Filter tabs ── */}
          <div className="gallery-filter-tabs">
            {GALLERY_TABS.map(tab => (
              <button
                key={tab}
                className={`gallery-filter-btn${activeTab === tab ? ' active' : ''}`}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
 
          {/* ── Count line (same pattern as PropertyShowcase) ── */}
          <p className="gallery-count">
            <strong>{displayed.length}</strong>{' '}
            {displayed.length === 1 ? 'Photo' : 'Photos'}
            {activeTab !== 'All' && <> · <span className="gallery-count-filter">{activeTab}</span></>}
          </p>
 
          {/* ── Masonry grid ── */}
          <div className="gallery-grid">
            {displayed.map((item, i) => (
              <GalleryItem
                key={`${item.propertyId}-${i}`}
                item={item}
                isLarge={i === 0}
                onClick={handleImageClick}
              />
            ))}
          </div>
 
        </div>
      </section>
    </div>
  );
};
 
// ─── Gallery Item Card ───────────────────────────────────────────────────────
//
//  Mirrors the same visual treatment as PropertyCard in PropertyShowcase —
//  badge, price pill, location — so both pages feel like one system.
//
const GalleryItem = ({ item, isLarge, onClick }) => {
  const { property: prop } = item;
 
  return (
    <div
      className={`gallery-item${isLarge ? ' gallery-item-large' : ''}`}
      onClick={() => onClick(item)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick(item)}
      aria-label={`View details for ${prop.title}`}
    >
      <img src={item.src} alt={item.title} className="gallery-img" loading="lazy" />
 
      <div className="gallery-item-overlay">
        {/* Sale / Rent badge — same logic as prop-badge in PropertyShowcase */}
        <span className={`gallery-badge gallery-badge--${prop.type}`}>
          {prop.type === 'sale' ? 'For Sale' : 'For Rent'}
        </span>
 
        <div className="gallery-item-meta">
          {item.category && (
            <p className="gallery-item-category">{item.category}</p>
          )}
          <h3 className="gallery-item-title">{item.title}</h3>
 
          <div className="gallery-item-footer">
            <span className="gallery-item-location">
              {/* Location pin SVG — same one used in PropertyCard */}
              <svg width="9" height="11" viewBox="0 0 11 13" fill="none">
                <path d="M5.5 0C3.015 0 1 2.015 1 4.5c0 3.375 4.5 8.5 4.5 8.5S10 7.875 10 4.5C10 2.015 7.985 0 5.5 0zm0 6.5a2 2 0 110-4 2 2 0 010 4z" fill="currentColor"/>
              </svg>
              {prop.location}
            </span>
            <span className="gallery-item-price">{prop.price}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default Gallery;