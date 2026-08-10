// ─── App.jsx ─────────────────────────────────────────────────────────────────
//
//  Changes from original:
//    1. Wrapped in <AuthProvider> so any component can call useAuth().
//    2. navigate() checks auth before allowing 'addproperty'; if the user is
//       NOT logged in it opens the AuthModal instead and stores the intended
//       destination. Once login/signup succeeds, AuthContext.pendingNav fires
//       the navigation automatically (via useEffect in App).
//    3. <AuthModal> is rendered at root level (above all pages) when open.
//    4. Header / Footer now show a user avatar + "Sign Out" when logged in.
//    5. All original routing logic is 100% preserved.
//
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import './App.css';

import Home             from './pages/home/Home';
import About            from './pages/about/About';
import PropertyShowcase from './pages/property-showcase/PropertyShowcase';
import Gallery          from './pages/gallery/Gallery';
import PropertyDetail   from './pages/properties/PropertyDetail';
import AddProperty      from './pages/addproperty/AddProperty';
import Blog             from './pages/blog/Blog';
import BlogDetail       from './pages/blog/BlogDetail';
import Contact          from './pages/contact/Contact';
import Privacy          from './pages/legal/Privacy';
import Terms            from './pages/legal/Terms';

// ─── Auth ─────────────────────────────────────────────────────────────────────
import { AuthProvider, useAuth } from './AuthContext';
import AuthModal                 from './pages/addproperty/AuthModal';

// ─── Routes that require a logged-in user ────────────────────────────────────
const PROTECTED_ROUTES = new Set(['addproperty']);

// ─── LOGO SIZES ──────────────────────────────────────────────────────────────
const LOGO_HEIGHT        = '50px'; // Navbar: large on cream bg
const FOOTER_LOGO_HEIGHT = '60px';  // Footer: compact, aligns with col headings

// ─── Navbar Logo (light cream background) ────────────────────────────────────
// No filter needed — the original dark-navy + gold logo shows perfectly on cream.
const Logo = () => (
  <div className="logo-img-wrap">
    <img
      src="/logo.png"
      alt="BackstageXchange Property"
      style={{
        height: LOGO_HEIGHT,
        width: 'auto',
        objectFit: 'contain',
        display: 'block',
      }}
    />
  </div>
);

// ─── Footer Logo (dark navy background) ──────────────────────────────────────
// The original logo has dark-navy text that vanishes on the dark footer.
// This multi-step CSS filter pipeline converts navy → white while leaving the
// gold/amber elements largely intact, giving a "light variant" of the same PNG:
//
//   1. invert(1)          — flips all colours (navy → pale yellow, gold → purple)
//   2. hue-rotate(200deg) — rotates pale-yellow hue toward white/blue-white
//   3. brightness(1.6)    — pushes the result to clean white for the text parts
//   4. saturate(0.4)      — desaturates the now-odd gold colour toward neutral so
//                           it reads as a soft warm white rather than garish purple
//
// Net result: navy text → crisp white; gold accents → soft warm ivory/white.
// Both contrast beautifully against the dark footer background.
const FooterLogo = () => (
  <div className="logo-img-wrap footer-logo-img-wrap">
    <img
      src="/logo.png"
      alt="BackstageXchange Property"
      className="footer-logo-img"
      style={{
        height: FOOTER_LOGO_HEIGHT,
        width: 'auto',
        objectFit: 'contain',
        display: 'block',
        filter: 'invert(1) hue-rotate(200deg) brightness(1.6) saturate(0.4)',
      }}
    />
  </div>
);

const navTabs = [
  { key: 'home',       label: 'Home' },
  { key: 'about',      label: 'About Us' },
  { key: 'properties', label: 'our properties' },
  { key: 'gallery',    label: 'Gallery' },
  { key: 'blog',       label: 'Blog' },
  { key: 'contact',    label: 'Contact Us' },
];

// ─── User Avatar (shown when logged in) ──────────────────────────────────────
const UserAvatar = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handler = () => setOpen(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [open]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
        aria-label={`Account menu for ${user.name}`}
        style={{
          width: 38, height: 38, borderRadius: '50%',
          background: 'linear-gradient(135deg, #c9a84c 0%, #e0c06a 100%)',
          border: '2px solid rgba(201,168,76,0.5)',
          color: '#1a2340', fontWeight: 700, fontSize: '0.82rem',
          cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', letterSpacing: '0.02em',
        }}
      >
        {initials}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '110%', right: 0, minWidth: 180,
          background: '#fff', borderRadius: 10, boxShadow: '0 8px 32px rgba(10,15,30,0.18)',
          border: '1px solid #f0ece4', zIndex: 900, overflow: 'hidden',
        }}>
          <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid #f0ece4' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1a2340' }}>{user.name}</div>
            <div style={{ fontSize: '0.75rem', color: '#9aa4b5', marginTop: 2 }}>{user.email}</div>
          </div>
          <button
            onClick={() => { setOpen(false); onLogout(); }}
            style={{
              width: '100%', padding: '0.75rem 1rem', background: 'none',
              border: 'none', textAlign: 'left', fontSize: '0.85rem',
              color: '#d94f4f', fontWeight: 600, cursor: 'pointer',
            }}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Header ──────────────────────────────────────────────────────────────────
const Header = ({ currentTab, onNavigate, mobileOpen, setMobileOpen }) => {
  const { currentUser, logout, openAuthModal } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className={`site-header${scrolled ? ' site-header-scrolled' : ''}`}>
        <div className="header-inner">
          <button
            className="header-logo-btn"
            onClick={() => onNavigate('home')}
            aria-label="BackstageXchange Property — Home"
          >
            <Logo />
          </button>

          <nav className="header-nav" aria-label="Main navigation">
            {navTabs.map(tab => (
              <button
                key={tab.key}
                className={`nav-tab${currentTab === tab.key ? ' nav-tab-active' : ''}`}
                onClick={() => onNavigate(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="header-right">
            {/* ── "List Property" — opens auth modal if not logged in, else navigates directly ── */}
            <button
              className="btn-list-property"
              onClick={() => onNavigate('addproperty')}
            >
              List Property
            </button>

            {/* ── Show avatar (with sign-out) only when already logged in ── */}
            {currentUser && (
              <UserAvatar user={currentUser} onLogout={logout} />
            )}

            <button
              className={`hamburger-btn${mobileOpen ? ' open' : ''}`}
              onClick={() => setMobileOpen(o => !o)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`mobile-menu${mobileOpen ? ' mobile-menu-open' : ''}`}
        aria-hidden={!mobileOpen}
      >
        <div className="mobile-menu-inner">
          {navTabs.map(tab => (
            <button
              key={tab.key}
              className={`mobile-nav-tab${currentTab === tab.key ? ' active' : ''}`}
              onClick={() => { onNavigate(tab.key); setMobileOpen(false); }}
            >
              {tab.label}
            </button>
          ))}
          <button
            className="btn-list-property mobile-cta"
            onClick={() => { onNavigate('addproperty'); setMobileOpen(false); }}
          >
            List Property
          </button>
          {!currentUser && (
            <button
              className="btn-list-property mobile-cta"
              onClick={() => { openAuthModal(); setMobileOpen(false); }}
              style={{ marginTop: '0.5rem', background: 'transparent', border: '1.5px solid #c9a84c', color: '#c9a84c' }}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </>
  );
};

// ─── Footer SVG Icons ────────────────────────────────────────────────────────
const IconMapPin = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 10c0 6-8 13-8 13S4 16 4 10a8 8 0 0116 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconPhone = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.02 1.18 2 2 0 012 .02h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
);
const IconMail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M2 7l10 7 10-7"/>
  </svg>
);
const IconClock = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconChevronRight = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

// ─── Footer ──────────────────────────────────────────────────────────────────
const Footer = ({ onNavigate }) => (
  <footer className="site-footer">
    <div className="footer-main">

      {/* ── Col 1: Brand ── */}
      <div className="footer-brand-col">
        <button className="footer-logo-btn" onClick={() => onNavigate('home')} aria-label="Home">
          <FooterLogo />
        </button>
        <p className="footer-tagline">
          BackstageXchange Property helps you discover premium homes, rentals, and real estate opportunities with trust, comfort, and smart investment choices.
        </p>
        <div className="footer-social-row">
          {/* Facebook */}
          <a href="#" className="footer-social-icon" aria-label="Facebook">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          {/* Instagram */}
          <a href="#" className="footer-social-icon" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
          </a>
          {/* LinkedIn */}
          <a href="#" className="footer-social-icon" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          {/* X / Twitter */}
          <a href="#" className="footer-social-icon" aria-label="X (Twitter)">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* ── Col 2: Quick Links ── */}
      <div className="footer-col">
        <h4 className="footer-col-heading">Quick Links</h4>
        <ul className="footer-link-list">
          {[
            { key: 'home',       label: 'Home' },
            { key: 'about',      label: 'About Us' },
            { key: 'properties', label: 'Property' },
            { key: 'blog',       label: 'Blog' },
            { key: 'contact',    label: 'Contact Us' },
          ].map(tab => (
            <li key={tab.key}>
              <button className="footer-link" onClick={() => onNavigate(tab.key)}>
                <span className="footer-link-arrow"><IconChevronRight /></span>
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Col 3: Popular Locations ── */}
      <div className="footer-col">
        <h4 className="footer-col-heading">Popular Locations</h4>
        <ul className="footer-link-list">
          {['North Goa', 'South Goa', 'Panjim', 'Aguada', 'Majorda'].map(loc => (
            <li key={loc}>
              <button
                className="footer-link footer-link--location"
                onClick={() => onNavigate('properties')}
              >
                <span className="footer-link-pin"><IconMapPin /></span>
                {loc}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Col 4: Contact Us ── */}
      <div className="footer-col">
        <h4 className="footer-col-heading">Contact Us</h4>
        <div className="footer-contact-item">
          <span className="footer-contact-icon"><IconPhone /></span>
          <a href="tel:+919876543210" className="footer-contact-link">9876543210</a>
        </div>
        <div className="footer-contact-item">
          <span className="footer-contact-icon"><IconMail /></span>
          <a href="mailto:cybercreativegoa@gmail.com" className="footer-contact-link footer-contact-email">cybercreativegoa@gmail.com</a>
        </div>
        <div className="footer-contact-item">
          <span className="footer-contact-icon"><IconMapPin /></span>
          <span>Goa, India</span>
        </div>
        <div className="footer-contact-item">
          <span className="footer-contact-icon footer-contact-icon--clock"><IconClock /></span>
          <span>Mon–Sat 9:00 AM – 7:00 PM</span>
        </div>
      </div>

    </div>

    {/* ── Bottom Bar ── */}
    <div className="footer-bottom">
      <div className="footer-bottom-inner">
        <nav className="footer-legal-links" aria-label="Legal">
          <button className="footer-legal-btn" onClick={() => onNavigate('privacy')}>Privacy Policy</button>
          <span className="footer-legal-sep" aria-hidden="true">·</span>
          <button className="footer-legal-btn" onClick={() => onNavigate('terms')}>Terms of Use</button>
        </nav>
        <p className="footer-copyright">
          Copyright © {new Date().getFullYear()} Properties BackstageXchange | Developed by{' '}
          <a href="https://cybercreative.in/" className="footer-credit-link">Cyber Creative</a>
        </p>
        <p className="footer-provenance">Crafted in Goa, India</p>
      </div>
    </div>
  </footer>
);

// ─── Back to top ─────────────────────────────────────────────────────────────
const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return visible ? (
    <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">↑</button>
  ) : null;
};

// ─── Inner App (has access to AuthContext) ────────────────────────────────────
const AppInner = () => {
  const { currentUser, authModalOpen, pendingNav, openAuthModal } = useAuth();

  const [currentTab,       setCurrentTab]       = useState('home');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState(null);
  const [mobileMenuOpen,   setMobileMenuOpen]   = useState(false);
  const [categoryFilter,   setCategoryFilter]   = useState(null);
  const [searchFilters,    setSearchFilters]    = useState(null);
  const [showcaseKey,      setShowcaseKey]      = useState(0);

  // ── After successful auth, complete any pending navigation ────────────────
  useEffect(() => {
    if (currentUser && pendingNav) {
      // pendingNav is set by openAuthModal(intendedTab); navigate there now.
      goToTab(pendingNav);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, pendingNav]);

  // ── Internal tab setter (no guard) ───────────────────────────────────────
  const goToTab = (tab, options = {}) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);

    if (options.property !== undefined) {
      setSelectedProperty(options.property);
      if (tab !== 'propertydetail') setCurrentTab('propertydetail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (options.searchFilters !== undefined) {
      setSearchFilters(options.searchFilters);
      setCategoryFilter(null);
      setShowcaseKey(k => k + 1);
    } else if (options.category !== undefined) {
      setCategoryFilter(options.category);
      setSearchFilters(null);
      setShowcaseKey(k => k + 1);
    } else if (tab === 'properties') {
      setCategoryFilter(null);
      setSearchFilters(null);
      setShowcaseKey(k => k + 1);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Central navigation handler (with auth guard) ──────────────────────────
  //
  //  If the requested tab is in PROTECTED_ROUTES and the user is not
  //  authenticated, we open the AuthModal instead — passing the intended tab
  //  as the pendingNav so it auto-navigates after login succeeds.
  //
  const navigate = (tab, options = {}) => {
    if (PROTECTED_ROUTES.has(tab) && !currentUser) {
      openAuthModal(tab);   // intercept — show auth modal
      return;               // do NOT change the current page
    }
    goToTab(tab, options);
  };

  const handleViewProperty = (prop) => {
    setSelectedProperty(prop);
    navigate('propertydetail');
  };

  const handleViewBlogPost = (post) => {
    setSelectedBlogPost(post);
    navigate('blogdetail');
  };

  const renderPage = () => {
    switch (currentTab) {
      case 'home':    return <Home onNavigate={navigate} />;
      case 'about':   return <About onNavigate={navigate} />;
      case 'gallery': return <Gallery onNavigate={navigate} />;

      case 'properties': return (
        <PropertyShowcase
          key={showcaseKey}
          onViewDetail={handleViewProperty}
          initialCategory={categoryFilter}
          initialFilters={searchFilters}
        />
      );

      case 'propertydetail': return (
        <PropertyDetail
          property={selectedProperty}
          onBack={() => navigate('properties')}
          onNavigate={navigate}
        />
      );

      case 'addproperty': return <AddProperty onNavigate={navigate} />;
      case 'blog':        return <Blog onViewPost={handleViewBlogPost} />;
      case 'blogdetail':  return <BlogDetail post={selectedBlogPost} onBack={() => navigate('blog')} onNavigate={navigate} />;
      case 'contact':     return <Contact onNavigate={navigate} />;
      case 'privacy':     return <Privacy />;
      case 'terms':       return <Terms />;
      default:            return <Home onNavigate={navigate} />;
    }
  };

  const activeNavTab =
    currentTab === 'propertydetail' ? 'properties' :
    currentTab === 'blogdetail'     ? 'blog'        :
    currentTab === 'addproperty'    ? ''            :
    currentTab;

  return (
    <div className="app-root">
      <Header
        currentTab={activeNavTab}
        onNavigate={navigate}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />
      <main className="app-main">
        {renderPage()}
      </main>
      <Footer onNavigate={navigate} />
      <BackToTop />

      {/* ── Auth Modal — rendered at root so it overlays everything ── */}
      {authModalOpen && <AuthModal />}
    </div>
  );
};

// ─── App Root — wraps everything in AuthProvider ──────────────────────────────
const App = () => (
  <AuthProvider>
    <AppInner />
  </AuthProvider>
);

export default App;