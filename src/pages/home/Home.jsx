import { useState, useEffect } from 'react';
import './Home.css';
 
// ─── Luxury Hero CSS (injected via <style> so hero-specific
//     mood overrides stay co-located with this component) ───
const LUXURY_HERO_CSS = `
  .luxury-hero {
    position: relative;
    width: 100%;
    /* Hero starts at the very top — 0px — so it flows behind
       the fixed transparent navbar. The content inside is
       padded down to clear the 72px navbar height. */
    min-height: 92vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .luxury-hero-bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center 30%;
    background-repeat: no-repeat;
    transform: scale(1.04);
    animation: heroZoom 18s ease-in-out infinite alternate;
    transition: filter 1.2s ease;
  }
  @keyframes heroZoom {
    from { transform: scale(1.04); }
    to   { transform: scale(1.12); }
  }
  .luxury-hero-overlay {
    position: absolute;
    inset: 0;
    transition: background 1.2s ease;
  }
  .luxury-hero-content {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    /* Top padding ensures content clears the 72px navbar */
    padding: 8rem 2rem 5rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
  }
 
  /* ── Time-of-Day Mood Badge ─────────────────────────── */
  .time-mood-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    padding: 0.3rem 0.85rem;
    border-radius: 100px;
    margin-bottom: 1.1rem;
    border: 1px solid;
    transition: all 0.6s ease;
  }
  .time-mood-badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    animation: moodPulse 2.4s ease-in-out infinite;
  }
  @keyframes moodPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.5; transform: scale(1.6); }
  }
 
  /* ── DEFAULT (morning) overlay ── */
  .luxury-hero-overlay {
    background: rgba(15, 41, 74, 0.65);
  }
 
  /* ── MORNING mode (05:00–11:59) ─────────────────────── */
  [data-time="morning"] .luxury-hero-overlay {
    background: rgba(15, 41, 74, 0.65);
  }
  [data-time="morning"] .luxury-hero-bg {
    filter: brightness(1.05) saturate(1.1);
  }
  [data-time="morning"] .time-mood-badge {
    background: rgba(125, 214, 200, 0.18);
    border-color: rgba(125, 214, 200, 0.45);
    color: #7dd6c8;
  }
  [data-time="morning"] .time-mood-badge-dot { background: #7dd6c8; }
  [data-time="morning"] .luxury-hero-heading em { color: #7dd6c8; }
  [data-time="morning"] .hero-eyebrow { color: #7dd6c8; }
  [data-time="morning"] .hero-eyebrow-dot { background: #7dd6c8; }
  [data-time="morning"] .hhs-search-btn {
    background: linear-gradient(135deg, #0b7c72 0%, #0a5e56 100%);
    box-shadow: 0 4px 14px rgba(10, 94, 86, 0.35);
  }
 
  /* ── AFTERNOON mode (12:00–16:59) ───────────────────── */
  [data-time="afternoon"] .luxury-hero-overlay {
    background: rgba(15, 41, 74, 0.65);
  }
  [data-time="afternoon"] .luxury-hero-bg {
    filter: brightness(1.08) saturate(1.15);
  }
  [data-time="afternoon"] .time-mood-badge {
    background: rgba(100, 200, 240, 0.16);
    border-color: rgba(100, 200, 240, 0.40);
    color: #64c8f0;
  }
  [data-time="afternoon"] .time-mood-badge-dot { background: #64c8f0; }
  [data-time="afternoon"] .luxury-hero-heading em { color: #64c8f0; }
  [data-time="afternoon"] .hero-eyebrow { color: #64c8f0; }
  [data-time="afternoon"] .hero-eyebrow-dot { background: #64c8f0; }
  [data-time="afternoon"] .hhs-search-btn {
    background: linear-gradient(135deg, #0a6e9e 0%, #085980 100%);
    box-shadow: 0 4px 14px rgba(10, 90, 140, 0.35);
  }
 
  /* ── SUNSET mode (17:00–19:00) ──────────────────────── */
  [data-time="sunset"] .luxury-hero-overlay {
    background: linear-gradient(
      160deg,
      rgba(60, 20, 5, 0.72) 0%,
      rgba(90, 35, 10, 0.62) 40%,
      rgba(140, 60, 20, 0.50) 100%
    );
  }
  [data-time="sunset"] .luxury-hero-bg {
    filter: brightness(0.95) saturate(1.35) sepia(0.18);
  }
  [data-time="sunset"] .time-mood-badge {
    background: rgba(229, 152, 29, 0.18);
    border-color: rgba(229, 152, 29, 0.55);
    color: #f0a830;
  }
  [data-time="sunset"] .time-mood-badge-dot { background: #f0a830; }
  [data-time="sunset"] .luxury-hero-heading { color: #fff5e6; }
  [data-time="sunset"] .luxury-hero-heading em { color: #f0a830; }
  [data-time="sunset"] .luxury-hero-sub { color: rgba(255, 235, 200, 0.82); }
  [data-time="sunset"] .hero-eyebrow { color: #f0a830; }
  [data-time="sunset"] .hero-eyebrow-dot { background: #f0a830; }

  [data-time="sunset"] .hhs-search-btn {
    background: linear-gradient(135deg, #c96a10 0%, #a34f08 100%);
    box-shadow: 0 4px 14px rgba(180, 80, 10, 0.42);
  }
  [data-time="sunset"] .hhs-cat-pill--active {
    background: #a34f08;
    border-color: #a34f08;
  }
 
  /* ── NIGHT mode (19:01–04:59) ───────────────────────── */
  [data-time="night"] .luxury-hero-overlay {
    background: linear-gradient(
      160deg,
      rgba(4, 8, 22, 0.85) 0%,
      rgba(10, 18, 50, 0.78) 50%,
      rgba(6, 12, 38, 0.72) 100%
    );
  }
  [data-time="night"] .luxury-hero-bg {
    filter: brightness(0.72) saturate(0.75) hue-rotate(10deg);
  }
  [data-time="night"] .time-mood-badge {
    background: rgba(160, 140, 255, 0.14);
    border-color: rgba(160, 140, 255, 0.42);
    color: #b8aaff;
  }
  [data-time="night"] .time-mood-badge-dot { background: #b8aaff; }
  [data-time="night"] .luxury-hero-heading { color: #f0eeff; letter-spacing: 0.005em; }
  [data-time="night"] .luxury-hero-heading em { color: #b8aaff; }
  [data-time="night"] .luxury-hero-sub { color: rgba(220, 215, 255, 0.80); }
  [data-time="night"] .hero-eyebrow { color: #b8aaff; }
  [data-time="night"] .hero-eyebrow-dot { background: #b8aaff; }

  [data-time="night"] .hhs-search-btn {
    background: linear-gradient(135deg, #4a3aaa 0%, #362888 100%);
    box-shadow: 0 4px 14px rgba(70, 55, 180, 0.42);
  }
  [data-time="night"] .hhs-cat-pill--active {
    background: #362888;
    border-color: #362888;
  }
  [data-time="night"] .hhs-glass {
    background: rgba(14, 18, 40, 0.88);
    box-shadow: 0 24px 60px rgba(0,0,0,0.55), 0 4px 16px rgba(0,0,0,0.30);
  }
  [data-time="night"] .hhs-search-row {
    background: #111428;
    border-color: rgba(255,255,255,0.08);
  }
  [data-time="night"] .hhs-input,
  [data-time="night"] .hhs-select {
    color: #d0ccff;
  }
  [data-time="night"] .hhs-input::placeholder { color: #5a5880; }
  [data-time="night"] .hhs-cat-pill {
    color: rgba(200,195,255,0.70);
  }
  [data-time="night"] .hhs-field-label { color: #5a5880; }
  [data-time="night"] .hhs-divider { background: rgba(255,255,255,0.08); }
 
  /* ── Hero Eyebrow ────────────────────────────────────── */
  .hero-eyebrow {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #7dd6c8;
    margin-bottom: 1.3rem;
    transition: color 0.6s ease;
  }
  .hero-eyebrow-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #7dd6c8;
    display: inline-block;
    animation: pulse 2.4s ease-in-out infinite;
    transition: background 0.6s ease;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.5; transform: scale(1.5); }
  }
 
  /* ── Hero Heading & Body ─────────────────────────────── */
  .luxury-hero-heading {
    font-family: 'Georgia', 'Times New Roman', serif;
    font-size: clamp(2.6rem, 5.5vw, 4.8rem);
    font-weight: 700;
    line-height: 1.12;
    color: #ffffff;
    margin: 0 0 1.4rem;
    letter-spacing: -0.01em;
    max-width: 800px;
    transition: color 0.6s ease;
  }
  .luxury-hero-heading em {
    font-style: italic;
    color: #7dd6c8;
    transition: color 0.6s ease;
  }
  .luxury-hero-sub {
    font-size: clamp(0.95rem, 1.6vw, 1.15rem);
    line-height: 1.7;
    color: rgba(255,255,255,0.78);
    max-width: 560px;
    margin: 0 0 1.6rem;
    font-weight: 400;
    transition: color 0.6s ease;
  }
  /* ── Hero Stat Cards (glassmorphic) ─────────────────── */
  .hero-stat-cards {
    display: inline-flex;
    align-items: stretch;
    margin-bottom: 2.8rem;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(18px) saturate(1.6);
    -webkit-backdrop-filter: blur(18px) saturate(1.6);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 18px;
    overflow: hidden;
    box-shadow:
      0 12px 40px rgba(0, 0, 0, 0.22),
      0 1px 0 rgba(255, 255, 255, 0.10) inset;
    transition: border-color 0.6s ease, box-shadow 0.6s ease;
  }
  .hero-stat-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 1.25rem 2rem 1.2rem;
    gap: 0.22rem;
    min-width: 150px;
  }
  .hero-stat-v-divider {
    width: 1px;
    background: rgba(255, 255, 255, 0.14);
    align-self: stretch;
    flex-shrink: 0;
  }
  .hero-stat-number {
    font-family: 'Georgia', 'Times New Roman', serif;
    font-size: clamp(2rem, 3.8vw, 2.9rem);
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.02em;
    color: #7dd6c8;
    transition: color 0.6s ease;
  }
  .hero-stat-label {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.55);
    transition: color 0.6s ease;
  }

  /* time-of-day accent on numbers */
  [data-time="morning"]   .hero-stat-number { color: #7dd6c8; }
  [data-time="morning"]   .hero-stat-cards  { border-color: rgba(125, 214, 200, 0.28); box-shadow: 0 12px 40px rgba(0,0,0,0.22), 0 0 0 1px rgba(125,214,200,0.10) inset; }
  [data-time="afternoon"] .hero-stat-number { color: #64c8f0; }
  [data-time="afternoon"] .hero-stat-cards  { border-color: rgba(100, 200, 240, 0.28); box-shadow: 0 12px 40px rgba(0,0,0,0.22), 0 0 0 1px rgba(100,200,240,0.10) inset; }
  [data-time="sunset"]    .hero-stat-number { color: #f0a830; }
  [data-time="sunset"]    .hero-stat-cards  { border-color: rgba(240, 168, 48, 0.30); box-shadow: 0 12px 40px rgba(0,0,0,0.28), 0 0 0 1px rgba(240,168,48,0.10) inset; }
  [data-time="sunset"]    .hero-stat-label  { color: rgba(255, 230, 180, 0.55); }
  [data-time="night"]     .hero-stat-number { color: #b8aaff; }
  [data-time="night"]     .hero-stat-cards  { background: rgba(14, 18, 40, 0.50); border-color: rgba(184, 170, 255, 0.28); box-shadow: 0 12px 40px rgba(0,0,0,0.38), 0 0 0 1px rgba(184,170,255,0.10) inset; }
  [data-time="night"]     .hero-stat-label  { color: rgba(200, 195, 255, 0.50); }

  @media (max-width: 480px) {
    .hero-stat-card { padding: 1rem 1.4rem; min-width: 120px; }
    .hero-stat-number { font-size: 2rem; }
  }
 
  /* ── Home Hero Glass Search Card ────────────────────── */
  /* Scoped .hhs-* prefix keeps these isolated from        */
  /* the .props-* classes used on the Properties page.     */
  .hhs-glass {
    background: rgba(255, 255, 255, 0.82);
    backdrop-filter: blur(20px) saturate(1.8);
    -webkit-backdrop-filter: blur(20px) saturate(1.8);
    border: 1px solid rgba(255, 255, 255, 0.60);
    border-radius: 16px;
    padding: 1.25rem 1.5rem 1.5rem;
    box-shadow:
      0 8px 40px rgba(13, 27, 50, 0.22),
      0 1px 0 rgba(255, 255, 255, 0.80) inset;
    width: 100%;
    max-width: 900px;
    transition: background 0.6s ease, box-shadow 0.6s ease;
  }

  /* Category pills row */
  .hhs-cat-pills {
    display: flex;
    gap: 0.45rem;
    flex-wrap: wrap;
    margin-bottom: 1.1rem;
  }
  .hhs-cat-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.38rem;
    padding: 0.44rem 1.05rem;
    border-radius: 100px;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    background: rgba(13, 27, 50, 0.07);
    border: 1.5px solid transparent;
    color: rgba(255,255,255,0.88);
    cursor: pointer;
    transition: all 0.22s ease;
    font-family: inherit;
  }
  .hhs-cat-pill:hover {
    background: rgba(201, 168, 76, 0.18);
    border-color: rgba(201, 168, 76, 0.55);
    color: #e5c96e;
  }
  .hhs-cat-pill--active {
    background: #1a2b3c;
    border-color: #1a2b3c;
    color: #e5c96e;
    box-shadow: 0 2px 12px rgba(13, 27, 50, 0.28);
  }

  /* Search row — the horizontal inputs bar */
  .hhs-search-row {
    display: flex;
    align-items: center;
    background: #fff;
    border: 1.5px solid rgba(13, 27, 50, 0.12);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(13, 27, 50, 0.07);
  }
  .hhs-field {
    flex: 1;
    padding: 0.65rem 1.05rem 0.7rem;
    min-width: 0;
  }
  .hhs-field--wide { flex: 2; }
  .hhs-field-label {
    display: block;
    font-size: 0.60rem;
    font-weight: 700;
    letter-spacing: 0.13em;
    color: #8a9ab0;
    margin-bottom: 0.18rem;
    text-transform: uppercase;
  }
  .hhs-input {
    width: 100%;
    border: none;
    outline: none;
    font-size: 0.86rem;
    font-weight: 500;
    color: #1a2b3c;
    background: transparent;
    padding: 0;
    font-family: inherit;
    transition: color 0.6s ease;
  }
  .hhs-input::placeholder { color: #aab4c0; }
  .hhs-select {
    width: 100%;
    border: none;
    outline: none;
    font-size: 0.86rem;
    font-weight: 500;
    color: #1a2b3c;
    background: transparent;
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
    padding: 0;
    font-family: inherit;
    transition: color 0.6s ease;
  }
  .hhs-select option { color: #1a2b3c; }
  .hhs-divider {
    width: 1px;
    height: 34px;
    background: rgba(13, 27, 50, 0.09);
    flex-shrink: 0;
    transition: background 0.6s ease;
  }
  .hhs-search-btn {
    display: flex;
    align-items: center;
    gap: 0.48rem;
    background: #1a2b3c;
    color: #fff;
    border: none;
    padding: 0 1.55rem;
    height: 54px;
    font-size: 0.80rem;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    cursor: pointer;
    flex-shrink: 0;
    font-family: inherit;
    transition: background 0.22s ease, box-shadow 0.6s ease;
  }
  .hhs-search-btn:hover {
    background: #c9922a;
    color: #fff;
  }
 
  /* ── Category Card hover arrow ──────────────────────── */
  .category-card-arrow {
    position: absolute;
    bottom: 1.1rem;
    right: 1.1rem;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(255,255,255,0.18);
    border: 1px solid rgba(255,255,255,0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    color: #fff;
    opacity: 0;
    transform: translateY(6px);
    transition: opacity 0.3s, transform 0.3s;
  }
  .category-card:hover .category-card-arrow {
    opacity: 1;
    transform: translateY(0);
  }
  .category-card:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 20px 50px rgba(0,0,0,0.35);
  }
 
  @media (max-width: 860px) {
    .luxury-hero { min-height: 100svh; }
    .hhs-search-row {
      flex-direction: column;
      border-radius: 10px;
    }
    .hhs-field { width: 100%; flex: none; }
    .hhs-field--wide { flex: none; }
    .hhs-divider { width: 100%; height: 1px; }
    .hhs-search-btn { width: 100%; height: 48px; justify-content: center; border-radius: 0 0 8px 8px; }
    .luxury-hero-content { padding: 6.5rem 1.2rem 3rem; }
  }
  @media (max-width: 640px) {
    .hhs-cat-pills { gap: 0.35rem; }
    .hhs-cat-pill { padding: 0.38rem 0.8rem; font-size: 0.75rem; }
    .hhs-glass { padding: 1rem; }
  }
`;
 
// ═══════════════════════════════════════════════════════════
//  TIME-OF-DAY HELPERS
// ═══════════════════════════════════════════════════════════
const getMoodFromHour = (hour) => {
  if (hour >= 5  && hour <= 11) return 'morning';
  if (hour >= 12 && hour <= 16) return 'afternoon';
  if (hour >= 17 && hour <= 19) return 'sunset';
  return 'night';
};
 
const getHourFromURL = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const mock = params.get('mockTime');
    if (mock !== null) {
      const h = parseInt(mock, 10);
      if (!isNaN(h) && h >= 0 && h <= 23) return h;
    }
  } catch (_) {}
  return null;
};
 
const getCurrentHour = () => {
  const override = getHourFromURL();
  return override !== null ? override : new Date().getHours();
};
 
const TIME_MOOD_LABELS = {
  morning:   { icon: 'sun',  label: 'Good Morning — Explore Goa' },
  afternoon: { icon: 'cloud',  label: 'Good Afternoon — Explore Goa' },
  sunset:    { icon: 'sunset',  label: 'Good Evening — Golden Hour' },
  night:     { icon: 'moon',  label: 'Good Night — Night Mode' },
};
 
// ═══════════════════════════════════════════════════════════
//  CATEGORY DEFINITIONS
//  name must match PropertyShowcase's initialCategory lookup.
//  For type-based categories, name === the PropertyShowcase
//  propType value ('Villa', 'Apartment', etc.).
//  For New Projects, name === 'New Projects' which maps to
//  the 'newproject' category pill in PropertyShowcase.
// ═══════════════════════════════════════════════════════════
const CATEGORIES = [
  {
    name: 'Villa',
    img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80',
    label: 'Villas',
  },
  {
    name: 'Apartment',
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
    label: 'Apartments',
  },
  {
    name: 'Cottage',
    img: 'https://images.unsplash.com/photo-1475855581690-80accde3ae2b?w=600&q=80',
    label: 'Cottages',
  },
  {
    name: 'Penthouse',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
    label: 'Penthouses',
  },
  {
    name: 'New Projects',
    img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
    label: 'New Projects',
  },
];
 
// ═══════════════════════════════════════════════════════════
//  NORMALIZER
//  Converts a FEATURED_PROPERTIES entry (Home's card shape)
//  into the shape that PropertyDetail expects, which mirrors
//  a PROPERTIES entry from PropertyShowcase.
//
//  Home card shape        → PropertyDetail / PropertyShowcase shape
//  ─────────────────────────────────────────────────────────
//  p.name                 → title
//  p.type ('Villa',…)     → category
//  p.badge ('For Sale',…) → type ('sale' | 'rent')
//  p.beds (string '5')    → bhk ('5 Beds')
//  p.baths (string '4')   → bath ('4 Baths')
//  p.sqft ('3,800')       → sqft ('3,800 sqft')  ← no double-suffix
//  p.agent (initials)     → agent.initials
//  p.agentName            → agent.name
//  p.badge                → highlight  ← BUG WAS HERE: previously set to
//                                         'For Sale'/'For Rent' which shows
//                                         as the feature tag in detail view.
//                                         Now defaults to '' so detail page
//                                         does not show a nonsensical tag.
// ═══════════════════════════════════════════════════════════
const toDetailShape = (p) => ({
  // Spread last so explicit keys below always win.
  ...p,
 
  // Title: Home cards use `name`; PropertyDetail reads `title`.
  title: p.name,
 
  // Category: Home cards use `type` for the property kind ('Villa', etc.).
  // PropertyShowcase / PropertyDetail also call this field `category`.
  category: p.type,
 
  // Listing type: convert badge string to the 'sale'/'rent' enum
  // that PropertyDetail's badge renderer expects.
  type: p.badge === 'For Rent' ? 'rent' : 'sale',
 
  // Specs: format them to match PropertyShowcase strings exactly.
  // Guard against undefined so we don't produce 'undefined Beds'.
  bhk:  p.beds  ? `${p.beds} Beds`   : '',
  bath: p.baths ? `${p.baths} Baths` : '',
 
  // FIX: p.sqft is already a bare number string like '3,800'.
  // Adding 'sqft' produces '3,800 sqft' — correct.
  // The old code was fine here but we make the intent explicit.
  sqft: p.sqft  ? `${p.sqft} sqft`   : '',
 
  // FIX: highlight should be a feature tag ('Beachfront', 'Pool', …),
  // not the listing badge. Home's featured cards have no highlight field,
  // so we default to empty string. PropertyDetail should handle '' gracefully.
  highlight: p.highlight || '',
 
  // Agent: PropertyDetail reads agent as an object with name/initials/color.
  agent: {
    name:     p.agentName  || '',
    initials: p.agent      || '',   // Home cards store the initials in `agent`
    color:    '#c9922a',
  },
});
 
// ═══════════════════════════════════════════════════════════
//  FEATURED PROPERTIES
//  These are displayed on the Home page. Keys deliberately use
//  Home's own naming convention (name, beds, baths, badge, etc.)
//  and are normalised via toDetailShape() before navigating.
// ═══════════════════════════════════════════════════════════
const FEATURED_PROPERTIES = [
  {
    id: 1,
    badge: 'For Sale',
    img: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=700&q=80',
    price: '₹ 4.20 Cr',
    name: 'Seabreeze Infinity Villa',
    location: 'Calangute Beach Road, North Goa',
    beds: '5', baths: '4', sqft: '3,800',
    type: 'Villa',
    agent: 'SR', agentName: 'Sunita Rao',
  },
  {
    id: 2,
    badge: 'For Sale',
    img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=700&q=80',
    price: '₹ 2.85 Cr',
    name: 'Palm Grove Eco Retreat',
    location: 'Assagao, North Goa',
    beds: '4', baths: '3', sqft: '2,950',
    type: 'Villa',
    agent: 'AK', agentName: 'Arjun Kamat',
  },
  {
    id: 3,
    badge: 'For Rent',
    img: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=700&q=80',
    price: '₹ 85,000/mo',
    name: 'Candolim Beach Cottage',
    location: 'Candolim, North Goa',
    beds: '2', baths: '2', sqft: '980',
    type: 'Cottage',
    agent: 'RD', agentName: "Rohan D'Souza",
  },
  {
    id: 4,
    badge: 'For Sale',
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80',
    price: '₹ 3.10 Cr',
    name: 'Aguada Clifftop Bungalow',
    location: 'Fort Aguada, Goa',
    beds: '4', baths: '3', sqft: '2,600',
    type: 'Villa',
    agent: 'NK', agentName: 'Nisha Kumar',
  },
];
 
// ═══════════════════════════════════════════════════════════
//  HOME COMPONENT
// ═══════════════════════════════════════════════════════════

/* ─── Premium SVG Icon Helpers ─────────────────────────────────────────────── */
const HOME_ICONS = {
  sun: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{display:'inline',verticalAlign:'middle',marginRight:'6px'}}>
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.3"/>
      <line x1="8" y1="1" x2="8" y2="3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="8" y1="13" x2="8" y2="15" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="1" y1="8" x2="3" y2="8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="13" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="2.9" y1="2.9" x2="4.3" y2="4.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="11.7" y1="11.7" x2="13.1" y2="13.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="2.9" y1="13.1" x2="4.3" y2="11.7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="11.7" y1="4.3" x2="13.1" y2="2.9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  cloud: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{display:'inline',verticalAlign:'middle',marginRight:'6px'}}>
      <path d="M3 11C1.9 11 1 10.1 1 9C1 8 1.7 7.1 2.7 7C2.9 5.3 4.3 4 6 4C7.2 4 8.3 4.7 8.8 5.7C9.2 5.3 9.8 5 10.5 5C11.9 5 13 6.1 13 7.5C13 7.7 13 7.8 12.9 8H13.5C14.3 8 15 8.7 15 9.5C15 10.3 14.3 11 13.5 11H3Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    </svg>
  ),
  sunset: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{display:'inline',verticalAlign:'middle',marginRight:'6px'}}>
      <path d="M2 12C2 12 3.5 8 8 8C12.5 8 14 12 14 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="8" y1="2" x2="8" y2="5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="2.5" y1="4.5" x2="4" y2="6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="13.5" y1="4.5" x2="12" y2="6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="1" y1="14" x2="15" y2="14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  moon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{display:'inline',verticalAlign:'middle',marginRight:'6px'}}>
      <path d="M13 9C12.3 10.8 10.5 12 8.5 12C6 12 4 10 4 7.5C4 5.5 5.2 3.7 7 3C5.6 3.3 4.4 4 3.5 5C2.6 6 2 7.3 2 8.8C2 11.7 4.3 14 7.2 14C9.5 14 11.5 12.6 12.5 10.6L13 9Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  ),
  home: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{display:'inline',verticalAlign:'middle',marginRight:'4px'}}>
      <path d="M1.5 7L7 2L12.5 7V13H9V9.5H5V13H1.5V7Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    </svg>
  ),
  key: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{display:'inline',verticalAlign:'middle',marginRight:'4px'}}>
      <circle cx="5" cy="5.5" r="3.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M7.5 7.5L12.5 12.5M10 10L11.5 11.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  crane: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{display:'inline',verticalAlign:'middle',marginRight:'4px'}}>
      <line x1="4" y1="2" x2="4" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="4" y1="2" x2="12" y2="2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="12" y1="2" x2="12" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="4" y1="4" x2="12" y2="2" stroke="currentColor" strokeWidth="1.1"/>
      <rect x="2" y="12" width="4" height="2" rx="0.5" stroke="currentColor" strokeWidth="1.1"/>
    </svg>
  ),
  office: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{display:'inline',verticalAlign:'middle',marginRight:'4px'}}>
      <rect x="2" y="1" width="7" height="12" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M9 5H12V13H9" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      <line x1="4" y1="4" x2="6" y2="4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      <line x1="4" y1="7" x2="6" y2="7" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  grid: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{display:'inline',verticalAlign:'middle',marginRight:'4px'}}>
      <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  ),
};
const renderHomeIcon = (key) => HOME_ICONS[key] || null;

const Home = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('Buy');
  const [timeMood,  setTimeMood]  = useState(() => getMoodFromHour(getCurrentHour()));
 
  const tabs = ['Buy', 'Rent', 'New Projects', 'Commercial', 'All'];
 
  // ── Search bar state (all controlled inputs) ──────────────
  // Each field is its own string state variable.
  // setKeyword coerces its argument to a string so that if a
  // caller accidentally passes an object the input never shows
  // '[object Object]'.
  const [keyword,    setKeywordRaw]  = useState('');
  const setKeyword = (val) =>
    setKeywordRaw(typeof val === 'string' ? val : String(val?.keyword ?? ''));
 
  const [propType,   setPropType]   = useState('');
  const [location,   setLocation]   = useState('');
  const [priceRange, setPriceRange] = useState('');
 
  // ── Real-time mood — re-checks every 60 s ───────────────
  useEffect(() => {
    setTimeMood(getMoodFromHour(getCurrentHour()));
    const id = setInterval(() => setTimeMood(getMoodFromHour(getCurrentHour())), 60_000);
    return () => clearInterval(id);
  }, []);
 
  // ── Category chip → Properties with a type filter ────────
  // cat.name is the exact string PropertyShowcase recognises
  // (e.g. 'Villa', 'Apartment', 'New Projects').
  const handleCategoryClick = (cat) => {
    onNavigate('properties', { category: cat.name });
  };
 
  // ── Search button → Properties with all filter values ────
  // listingType ('Buy'/'Rent'/…) is passed along so
  // PropertyShowcase can set the correct category pill.
  const handleSearch = () => {
    onNavigate('properties', {
      searchFilters: {
        keyword,                // safe string — coerced above
        type:        propType,  // 'Villa' | 'Apartment' | … | ''
        location,               // free-text string
        priceRange,             // 'Under ₹50L' | '₹50L – ₹1Cr' | …
        listingType: activeTab, // 'Buy' | 'Rent' | 'New Projects' | 'Commercial' | 'All'
      },
    });
  };
 
  // ── Featured card → PropertyDetail directly ──────────────
  // toDetailShape() converts Home's card keys to what
  // PropertyDetail expects before we hand the object to App.
  const handleViewFeatured = (prop) => {
    onNavigate('propertydetail', { property: toDetailShape(prop) });
  };
 
  const mood = TIME_MOOD_LABELS[timeMood];
 
  return (
    <div className="home-page" data-time={timeMood}>
      <style>{LUXURY_HERO_CSS}</style>
 
      {/* ═══════════════ LUXURY HERO ═══════════════════════ */}
      <section className="luxury-hero">
        <div
          className="luxury-hero-bg"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=80')" }}
        />
        <div className="luxury-hero-overlay" />
 
        <div className="luxury-hero-content">
 
          {/* ── Time-of-Day mood badge ── */}
          <div className="time-mood-badge">
            <span className="time-mood-badge-dot" />
            {renderHomeIcon(mood.icon)} {mood.label}
          </div>
 
          <p className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            Goa's Most Trusted Property Partner
          </p>
 
          <h1 className="luxury-hero-heading">
            Find Your Dream<br />
            <em>Property in Goa</em>
          </h1>
 
          <p className="luxury-hero-sub">
            Exclusive villas, sea-facing apartments &amp; curated new projects.
            RERA-certified guidance from search to possession.
          </p>
 
          {/* ── Hero Stat Cards ── */}
          <div className="hero-stat-cards">
            <div className="hero-stat-card">
              <span className="hero-stat-number">12+</span>
              <span className="hero-stat-label">Years of Excellence</span>
            </div>
            <div className="hero-stat-v-divider" />
            <div className="hero-stat-card">
              <span className="hero-stat-number">120+</span>
              <span className="hero-stat-label">Premium Listings</span>
            </div>
          </div>
 
          {/* ── New Properties-style Glass Search Card ─────────────
              Scoped under .hhs-* (Home Hero Search) to avoid any
              collision with .props-* classes on the Properties page.
              All inputs remain CONTROLLED — values live in state so
              handleSearch() can read them reliably.
          ── */}
          <div className="hhs-glass">

            {/* ── Category Pills ── */}
            <div className="hhs-cat-pills">
              {[
                { key: 'Buy',          icon: 'home' },
                { key: 'Rent',         icon: 'key' },
                { key: 'New Projects', icon: 'crane' },
                { key: 'Commercial',   icon: 'office' },
                { key: 'All',          icon: 'grid' },
              ].map(({ key, icon }) => (
                <button
                  key={key}
                  className={`hhs-cat-pill${activeTab === key ? ' hhs-cat-pill--active' : ''}`}
                  onClick={() => setActiveTab(key)}
                >
                  <span>{renderHomeIcon(icon)}</span> {key}
                </button>
              ))}
            </div>

            {/* ── Search Row ── */}
            <div className="hhs-search-row">

              {/* Location */}
              <div className="hhs-field hhs-field--wide">
                <label className="hhs-field-label">LOCATION OR PROJECT</label>
                <select
                  className="hhs-select"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
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
              <div className="hhs-divider" />

              {/* Property Type */}
              <div className="hhs-field">
                <label className="hhs-field-label">PROPERTY TYPE</label>
                <select
                  className="hhs-select"
                  value={propType}
                  onChange={e => setPropType(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="Villa">Villa</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Cottage">Cottage</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>
              <div className="hhs-divider" />

              {/* Budget */}
              <div className="hhs-field">
                <label className="hhs-field-label">BUDGET</label>
                <select
                  className="hhs-select"
                  value={priceRange}
                  onChange={e => setPriceRange(e.target.value)}
                >
                  <option value="">Any Budget</option>
                  <option value="Under ₹50L">Under ₹50L</option>
                  <option value="₹50L – ₹1Cr">₹50L – ₹1Cr</option>
                  <option value="₹1Cr – ₹2Cr">₹1Cr – ₹2Cr</option>
                  <option value="₹2Cr – ₹5Cr">₹2Cr – ₹5Cr</option>
                  <option value="₹5Cr+">₹5Cr+</option>
                </select>
              </div>
              <div className="hhs-divider" />

             

              {/* Search Button */}
              <button className="hhs-search-btn" onClick={handleSearch}>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                  <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Search
              </button>
            </div>

          </div>
        </div>
      </section>
 
      {/* ═══════════════ PROPERTY CATEGORIES ═══════════════ */}
      <section className="categories-section">
        <div className="section-container">
          <h2 className="section-title">
            Explore <em>Property</em> Categories
          </h2>
          <p className="section-sub">
            Find your ideal property across Goa's most sought-after types
          </p>
 
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <div
                key={cat.name}
                className="category-card"
                style={{ backgroundImage: `url(${cat.img})` }}
                onClick={() => handleCategoryClick(cat)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && handleCategoryClick(cat)}
              >
                <div className="category-card-overlay" />
                <span className="category-card-label">| {cat.label}</span>
                <span className="category-card-arrow">→</span>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* ═══════════════ FEATURED PROPERTIES ══════════════ */}
      <section className="featured-section">
        <div className="section-container">
          <h2 className="section-title">
            Featured <em>Properties</em>
          </h2>
 
          <div className="featured-grid">
            {FEATURED_PROPERTIES.map((prop) => (
              <div key={prop.id} className="property-card">
                <div className="property-card-img-wrap">
                  <img src={prop.img} alt={prop.name} className="property-card-img" />
                  <span className={`property-badge ${prop.badge === 'For Rent' ? 'badge-rent' : 'badge-sale'}`}>
                    {prop.badge}
                  </span>
                </div>
                <div className="property-card-body">
                  <div className="property-price-tag">{prop.price}</div>
                  <h3 className="property-card-title">{prop.name}</h3>
                  <p className="property-card-location"><svg width="11" height="13" viewBox="0 0 11 13" fill="none" style={{display:'inline',verticalAlign:'middle',marginRight:'4px'}}><path d="M5.5 0C3.015 0 1 2.015 1 4.5c0 3.375 4.5 8.5 4.5 8.5S10 7.875 10 4.5C10 2.015 7.985 0 5.5 0zm0 6.5a2 2 0 110-4 2 2 0 010 4z" fill="currentColor"/></svg>{prop.location}</p>
                  <div className="property-card-specs">
                    <span><svg width="13" height="10" viewBox="0 0 13 10" fill="none" style={{display:'inline',verticalAlign:'middle',marginRight:'3px'}}><rect x="0.5" y="4.5" width="12" height="5" rx="1" stroke="currentColor"/><path d="M2 4.5V2a1.5 1.5 0 013 0v2.5M8 4.5V2a1.5 1.5 0 013 0v2.5" stroke="currentColor" strokeLinecap="round"/></svg>{prop.beds} Beds</span>
                    <span><svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{display:'inline',verticalAlign:'middle',marginRight:'3px'}}><path d="M1 9h10M2 9V4a1 1 0 012 0v5M6 9V6.5A1.5 1.5 0 019 6.5V9" stroke="currentColor" strokeLinecap="round"/></svg>{prop.baths} Baths</span>
                    <span><svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{display:'inline',verticalAlign:'middle',marginRight:'3px'}}><rect x="1" y="1" width="10" height="10" rx="1" stroke="currentColor"/><path d="M1 5h10M5 1v10" stroke="currentColor"/></svg>{prop.sqft} sqft</span>
                  </div>
                  <div className="property-card-footer">
                    <div className="agent-info">
                      <div className="agent-avatar">{prop.agent}</div>
                      <span className="agent-name">{prop.agentName}</span>
                    </div>
                    {/* Normalises Home card shape → PropertyDetail shape */}
                    <button
                      className="btn-view-prop"
                      onClick={() => handleViewFeatured(prop)}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
 
          <div className="view-all-wrap">
            <button className="btn-view-all" onClick={() => onNavigate('properties')}>
              View All Properties →
            </button>
          </div>
        </div>
      </section>
 
      {/* ═══════════════ STATS STRIP ══════════════════════ */}
      <section className="stats-strip">
        <div className="stats-inner">
          {[
            { num: '650+',  label: 'Happy Buyers' },
            { num: '120+',  label: 'Premium Listings' },
            { num: '12+',   label: 'Years Experience' },
            { num: '100%',   label: 'Client Satisfaction' },
          ].map((s, i) => (
            <div key={i} className="stat-item">
              <span className="stat-num">{s.num}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>
 
      {/* ═══════════════ CTA BANNER ═══════════════════════ */}
      <section className="cta-banner">
        <div className="cta-banner-inner">
          <div className="cta-text-block">
            <p className="cta-eyebrow">· Contact Us</p>
            <h2 className="cta-title">
              Let's Find Your Dream<br />Property in <em>Goa</em>
            </h2>
            <p className="cta-sub">
              Whether you're buying, investing, or just exploring — our
              RERA-certified agents are ready to guide you every step of the way.
            </p>
            <button className="btn-gold" onClick={() => onNavigate('contact')}>
              Book Consultation
            </button>
          </div>
 
          <div className="cta-img-block">
            <img
              src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80"
              alt="Dream Property in Goa"
              className="cta-property-img"
            />
            <div className="cta-trust-badge">Trusted by 650+ Buyers</div>
          </div>
        </div>
      </section>
    </div>
  );
};
 
export default Home;