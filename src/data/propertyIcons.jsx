// ─── propertyIcons.jsx ───────────────────────────────────────────────────────
//
//  All premium thin-line SVG icon components for the property platform.
//  Imported by propertyData.js and usable directly in any component.
//
//  Every icon:
//    • 16×16 default (overridable via the `size` prop)
//    • stroke="currentColor" — inherits CSS color automatically
//    • strokeWidth 1.6, rounded caps/joins — elegant thin-line style
//    • aria-hidden="true" — decorative, screen readers skip them
// ────────────────────────────────────────────────────────────────────────────

// ─── Shared base props ───────────────────────────────────────────────────────
const IC = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '1.6',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

// ─── Category filter icons ───────────────────────────────────────────────────

/** All listings — two overlapping house silhouettes */
export const IconAllListings = () => (
  <svg {...IC}>
    <path d="M3 10.5 8 5l5 5.5" />
    <path d="M4 10v7h4v-4h2v4h4v-7" />
    <path d="M13 9.5 17 5l4 4.5" />
    <path d="M14 9v8h3v-4h1v4h3V9" />
  </svg>
);

/** Buy — a clean single-home silhouette */
export const IconBuy = () => (
  <svg {...IC}>
    <path d="M3 11.5 12 3l9 8.5" />
    <path d="M5 10v9h5v-5h4v5h5V10" />
  </svg>
);

/** Rent — a minimal key with round bow and two teeth */
export const IconRent = () => (
  <svg {...IC}>
    <circle cx="8" cy="9" r="4" />
    <path d="M12 9h8" />
    <path d="M18 9v2.5" />
    <path d="M15.5 9v1.8" />
  </svg>
);

/** New Projects — a construction hard-hat profile */
export const IconNewProject = () => (
  <svg {...IC}>
    <path d="M4 17h16" />
    <path d="M5 17v-2a7 7 0 0 1 14 0v2" />
    <path d="M12 10V6" />
    <path d="M9.5 7.5 12 6l2.5 1.5" />
  </svg>
);

/** Commercial — office tower with gridded windows */
export const IconCommercial = () => (
  <svg {...IC}>
    <rect x="3" y="3" width="12" height="18" rx="1" />
    <path d="M15 8h4a1 1 0 0 1 1 1v12H15" />
    <path d="M7 7h2v2H7zM11 7h2v2h-2zM7 11h2v2H7zM11 11h2v2h-2zM7 15h2v2H7zM11 15h2v2h-2z" />
  </svg>
);

// ─── Highlight / badge icons ──────────────────────────────────────────────────

/** Beachfront / Beach Access / River View — undulating wave lines */
export const IconWave = () => (
  <svg {...IC}>
    <path d="M2 12c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" />
    <path d="M2 17c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" />
  </svg>
);

/** Pool — tiled rectangle with ladder and water ripple */
export const IconPool = () => (
  <svg {...IC}>
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <path d="M6 6V4" />
    <path d="M18 6V4" />
    <path d="M6 4h12" />
    <path d="M2 13c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
  </svg>
);

/** Sea View — horizon line with minimalist sun arc */
export const IconSeaView = () => (
  <svg {...IC}>
    <path d="M2 15h20" />
    <path d="M12 15V9" />
    <path d="M7 15c0-2.76 2.24-5 5-5s5 2.24 5 5" />
    <path d="M5.5 10.5 4 9" />
    <path d="M18.5 10.5 20 9" />
    <path d="M12 7V5" />
  </svg>
);

/** Cliff View — layered mountain peaks with baseline */
export const IconCliffView = () => (
  <svg {...IC}>
    <path d="M2 20 9 8l4 5 3-3 6 10H2z" />
    <path d="M16 5l1.5-2.5L19 5" />
  </svg>
);

/** City View — three-building skyline at varying heights */
export const IconCityView = () => (
  <svg {...IC}>
    <rect x="2"  y="10" width="5"  height="11" rx="0.5" />
    <rect x="9"  y="5"  width="6"  height="16" rx="0.5" />
    <rect x="17" y="8"  width="5"  height="13" rx="0.5" />
    <path d="M10 5V3h4v2" />
    <path d="M4 10V8h1v2" />
    <path d="M19 8V6h1v2" />
  </svg>
);

/** Garden — branching stem with organic leaf forms */
export const IconGarden = () => (
  <svg {...IC}>
    <path d="M12 22V12" />
    <path d="M12 12C12 12 7 10 7 5c3 0 5 2.5 5 7z" />
    <path d="M12 12c0 0 5-2 5-7-3 0-5 2.5-5 7z" />
    <path d="M12 17c0 0-3-1.5-3-5 2 0 3 2 3 5z" />
  </svg>
);

/** Heritage — classical arcade with two pillars and a pediment */
export const IconHeritage = () => (
  <svg {...IC}>
    <path d="M3 21h18" />
    <path d="M3 7h18" />
    <path d="M3 7 12 3l9 4" />
    <path d="M6 7v14" />
    <path d="M18 7v14" />
    <path d="M10 7v14" />
    <path d="M14 7v14" />
  </svg>
);

/** Main Road — straight dual-lane road with centre dashes */
export const IconMainRoad = () => (
  <svg {...IC}>
    <path d="M5 21 7 3" />
    <path d="M19 21 17 3" />
    <path d="M12 6v3" />
    <path d="M12 12v3" />
    <path d="M12 18v2" />
  </svg>
);

/** New Project — four-point sparkle / star mark */
export const IconSparkle = () => (
  <svg {...IC}>
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    <path d="M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

// ─── Property card detail icons ───────────────────────────────────────────────
//  Used in PropertyShowcase cards and PropertyDetail.
//  All accept an optional `size` prop (default 16).

/** Bed — platform bed with pillow and headboard */
export const IconBed = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
    <path d="M2 14h20" />
    <path d="M2 20h20" />
    <path d="M6 10V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4" />
  </svg>
);

/** Bath — deep-soak bathtub with tap and drain feet */
export const IconBath = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 6V4a2 2 0 0 1 4 0v2" />
    <path d="M2 13h20v2a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5v-2Z" />
    <path d="M2 13V9a1 1 0 0 1 1-1h4" />
    <path d="M7 20v2M17 20v2" />
  </svg>
);

/** Sqft — bordered square with tick-marks indicating measurement */
export const IconSqft = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="1.5" />
    <path d="M3 9h3M3 15h3" />
    <path d="M9 3v3M15 3v3" />
    <path d="M9 21v-3M15 21v-3" />
    <path d="M21 9h-3M21 15h-3" />
  </svg>
);

/** Map pin for property cards — teardrop with a centre dot */
export const IconMapPinCard = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 10c0 6-8 13-8 13S4 16 4 10a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);
