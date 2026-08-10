// ─────────────────────────────────────────────────────────────────────────────
// DROP-IN PATCH — Role Badge Icons for "Join the Discussion" comment form
//
// HOW TO USE:
//   1. Open your Blog / BlogPost JSX component file.
//   2. Find the ROLES array (it currently holds emoji strings like '🔑', '🏡', etc.)
//   3. Replace that entire ROLES array with the one below.
//   4. Add the four SVG icon components anywhere above the component that renders
//      the badges (e.g. just above the `const Blog = ...` or `const BlogPost = ...`
//      declaration).
//   5. Nothing else changes — inputs, button, layout, CSS classes all stay identical.
// ─────────────────────────────────────────────────────────────────────────────


// ── 1. Premium inline SVG icon components ────────────────────────────────────
//    Stroke color: #1a2b3c (deep navy) — matches the site's luxury palette.
//    All icons: 24 × 24 px, strokeWidth 1.5, strokeLinecap/Join round.

const IconKey = () => (
  <svg
    width="24" height="24" viewBox="0 0 24 24"
    fill="none" xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Circular bow */}
    <circle cx="8.5" cy="8.5" r="4.5" stroke="#1a2b3c" strokeWidth="1.5" />
    {/* Shaft */}
    <path
      d="M13 13L20.5 20.5"
      stroke="#1a2b3c" strokeWidth="1.5" strokeLinecap="round"
    />
    {/* First notch */}
    <path
      d="M17.5 17.5L17.5 20"
      stroke="#1a2b3c" strokeWidth="1.5" strokeLinecap="round"
    />
    {/* Second notch */}
    <path
      d="M19.5 19.5L19.5 21.5"
      stroke="#1a2b3c" strokeWidth="1.5" strokeLinecap="round"
    />
  </svg>
);

const IconHome = () => (
  <svg
    width="24" height="24" viewBox="0 0 24 24"
    fill="none" xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Roof */}
    <path
      d="M3 10.5L12 3L21 10.5"
      stroke="#1a2b3c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    />
    {/* Walls */}
    <path
      d="M5 9V20H19V9"
      stroke="#1a2b3c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    />
    {/* Door */}
    <rect
      x="9.5" y="14" width="5" height="6"
      rx="0.75"
      stroke="#1a2b3c" strokeWidth="1.5"
    />
  </svg>
);

const IconTrendingUp = () => (
  <svg
    width="24" height="24" viewBox="0 0 24 24"
    fill="none" xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Rising line */}
    <polyline
      points="3,17 9,11 13,15 21,7"
      stroke="#1a2b3c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    />
    {/* Arrow head */}
    <polyline
      points="16,7 21,7 21,12"
      stroke="#1a2b3c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

const IconBuilding = () => (
  <svg
    width="24" height="24" viewBox="0 0 24 24"
    fill="none" xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Main structure */}
    <rect
      x="3" y="5" width="11" height="16"
      rx="0.75"
      stroke="#1a2b3c" strokeWidth="1.5" strokeLinejoin="round"
    />
    {/* Wing */}
    <path
      d="M14 9H20V21H14"
      stroke="#1a2b3c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    />
    {/* Left windows */}
    <line x1="7" y1="9"  x2="10" y2="9"  stroke="#1a2b3c" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="7" y1="13" x2="10" y2="13" stroke="#1a2b3c" strokeWidth="1.5" strokeLinecap="round" />
    {/* Right windows */}
    <line x1="16.5" y1="13" x2="18.5" y2="13" stroke="#1a2b3c" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="16.5" y1="17" x2="18.5" y2="17" stroke="#1a2b3c" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);


// ── 2. Updated ROLES array — swap this for your existing one ─────────────────
//    Each object: { icon: <SVGComponent />, label: 'Role Name' }
//    The badge renderer just needs to use `role.icon` instead of `role.emoji`.

const ROLES = [
  { icon: <IconKey />,        label: 'Prospective Buyer' },
  { icon: <IconHome />,       label: 'Local Resident'    },
  { icon: <IconTrendingUp />, label: 'Investor'          },
  { icon: <IconBuilding />,   label: 'Real Estate Fan'   },
];


// ── 3. Example badge renderer — update your existing .map() to match ─────────
//    If your current code looks like:
//
//      {ROLES.map(role => (
//        <button key={role.label} className={`role-badge ${selectedRole === role.label ? 'active' : ''}`}
//                onClick={() => setSelectedRole(role.label)}>
//          <span className="role-emoji">{role.emoji}</span>   ← OLD
//          <span className="role-label">{role.label}</span>
//        </button>
//      ))}
//
//    Change it to:
//
//      {ROLES.map(role => (
//        <button key={role.label} className={`role-badge ${selectedRole === role.label ? 'active' : ''}`}
//                onClick={() => setSelectedRole(role.label)}>
//          <span className="role-icon">{role.icon}</span>     ← NEW
//          <span className="role-label">{role.label}</span>
//        </button>
//      ))}
//
//    And in your CSS, ensure `.role-icon` centres the SVG:
//
//      .role-icon {
//        display: flex;
//        align-items: center;
//        justify-content: center;
//        margin-bottom: 6px;   /* space between icon and label — adjust to taste */
//      }
//
//    The SVGs inherit no color from `currentColor` — they use #1a2b3c directly,
//    so they'll render correctly whether or not the badge is selected.
//    If you want the icons to switch to gold (#c9922a) on the active badge,
//    replace stroke="#1a2b3c" with stroke="currentColor" in each SVG and
//    control the color via the `.role-badge.active` CSS class.
// ─────────────────────────────────────────────────────────────────────────────
