import { useEffect, useRef } from 'react';
import { ShieldCheck, Compass, Scale, TreePalm } from 'lucide-react';
import './About.css';

/* ─── Premium SVG Icon Components ────────────────────────────────────────── */

const IconHome = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 13L14 3L25 13V25H18V18H10V25H3V13Z" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="11" y="18" width="6" height="7" stroke="#C9A84C" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

const IconBuilding = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="12" height="20" stroke="#C9A84C" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M16 10H24V24H16" stroke="#C9A84C" strokeWidth="1.5" strokeLinejoin="round"/>
    <line x1="8" y1="9" x2="11" y2="9" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="8" y1="13" x2="11" y2="13" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="8" y1="17" x2="11" y2="17" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="19" y1="14" x2="21" y2="14" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="19" y1="18" x2="21" y2="18" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconCalendar = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="5" width="22" height="20" rx="2" stroke="#C9A84C" strokeWidth="1.5"/>
    <line x1="3" y1="11" x2="25" y2="11" stroke="#C9A84C" strokeWidth="1.5"/>
    <line x1="9" y1="3" x2="9" y2="8" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="19" y1="3" x2="19" y2="8" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="9" cy="17" r="1" fill="#C9A84C"/>
    <circle cx="14" cy="17" r="1" fill="#C9A84C"/>
    <circle cx="19" cy="17" r="1" fill="#C9A84C"/>
    <circle cx="9" cy="21" r="1" fill="#C9A84C"/>
    <circle cx="14" cy="21" r="1" fill="#C9A84C"/>
  </svg>
);

const IconStar = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 3L16.8 10.2L24.5 10.9L18.9 16L20.7 23.5L14 19.6L7.3 23.5L9.1 16L3.5 10.9L11.2 10.2L14 3Z" stroke="#C9A84C" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);



/* ─── Static data ─────────────────────────────────────────────────────────── */

const STATS = [
  { num: '650+', label: 'Happy Buyers',        Icon: IconHome },
  { num: '120+', label: 'Premium Listings',    Icon: IconBuilding },
  { num: '12+',  label: 'Years of Experience', Icon: IconCalendar },
  { num: '100%', label: 'Client Satisfaction', Icon: IconStar },
];

const VALUES = [
  {
    Icon: ShieldCheck,
    title: 'Trusted Guidance',
    desc:  'Decades of combined expertise in Goa\'s property market, ensuring every decision you make is backed by honest, informed counsel.',
  },
  {
    Icon: Compass,
    title: 'Deep Local Knowledge',
    desc:  'From Anjuna\'s bohemian lanes to Benaulim\'s tranquil shores — we know every micro-market, price trend, and hidden gem.',
  },
  {
    Icon: Scale,
    title: 'RERA Compliance',
    desc:  'All our listings and transactions are fully RERA-registered, protecting your investment with complete legal transparency.',
  },
  {
    Icon: TreePalm,
    title: 'Coastal Specialists',
    desc:  'We live and breathe coastal living. Our team specialises exclusively in Goa\'s unique seaside and hinterland property landscape.',
  },
];

const MILESTONES = [
  { year: '2012', event: 'Founded in Calangute with a team of 3 and a mission to bring transparency to Goa\'s property market.' },
  { year: '2015', event: 'Crossed 100 successful transactions and expanded into luxury villa listings.' },
  { year: '2018', event: 'Became one of Goa\'s first RERA-certified real estate agencies.' },
  { year: '2021', event: 'Launched dedicated NRI services, helping overseas clients invest remotely with confidence.' },
  { year: '2024', event: 'Surpassed ₹500 Cr in total transaction value and opened our South Goa branch.' },
];

const AGENTS = [
  { initials: 'SR', name: 'Sunita Rao',     role: 'Senior Property Consultant', exp: '8 Years Experience', sales: '120+ Deals Closed' },
  { initials: 'AK', name: 'Arjun Kamat',    role: 'Luxury Villa Specialist',    exp: '10 Years Experience', sales: '95+ Deals Closed'  },
  { initials: 'RD', name: "Rohan D'Souza",  role: 'Rental & Investment Advisor', exp: '6 Years Experience', sales: '80+ Deals Closed'  },
  { initials: 'NK', name: 'Nisha Kumar',    role: 'RERA Certified Agent',        exp: '9 Years Experience', sales: '110+ Deals Closed' },
];

/* ─── Inline SVGs for agent stats ─────────────────────────────────────────── */
const IconCalendarSmall = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ display:'inline', verticalAlign:'middle', marginRight:'5px' }}>
    <rect x="1" y="2" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
    <line x1="1" y1="5.5" x2="13" y2="5.5" stroke="currentColor" strokeWidth="1.2"/>
    <line x1="4.5" y1="1" x2="4.5" y2="3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="9.5" y1="1" x2="9.5" y2="3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const IconDeals = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ display:'inline', verticalAlign:'middle', marginRight:'5px' }}>
    <path d="M1 5L5 2H8L10 5H12L13 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1 9L5 12H7L11 8H12L13 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 2L6.5 3.5M10 5L8 7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M7 12L8.5 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

/* ─── Component ───────────────────────────────────────────────────────────── */

const About = ({ onNavigate }) => {
  const timelineSectionRef = useRef(null);
  const timelineItemRefs   = useRef([]);

  useEffect(() => {
    /* ── 1. Grow the vertical line when the section enters view ── */
    const lineObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('timeline-line-animate');
          lineObserver.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (timelineSectionRef.current) lineObserver.observe(timelineSectionRef.current);

    /* ── 2. Animate each milestone item as it scrolls into view ── */
    const itemObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('timeline-item-visible');
            itemObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25, rootMargin: '0px 0px -40px 0px' }
    );
    timelineItemRefs.current.forEach((el) => { if (el) itemObserver.observe(el); });

    return () => {
      lineObserver.disconnect();
      itemObserver.disconnect();
    };
  }, []);

  return (
    <div className="about-page">

      {/* ── Hero ── */}
      <section className="page-hero about-hero" aria-label="About BackstageXchange Property">
        <div className="page-hero-overlay" aria-hidden="true" />
        <div className="about-container page-hero-content">
          <p className="page-eyebrow">• Who We Are</p>
          <h1 className="page-hero-title">
            About <em>BackstageXchange</em><br />Property
          </h1>
          <p className="page-hero-sub">
            Goa's most trusted coastal real estate specialists since 2012.
          </p>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="about-mission-section" aria-labelledby="mission-heading">
        <div className="about-container">
          <div className="about-mission-grid">
            <div className="about-mission-text">
              <p className="section-eyebrow teal">• OUR MISSION</p>
              <h2 id="mission-heading" className="about-section-title">
                Redefining Coastal<br />Real Estate in Goa
              </h2>
              <p className="about-para">
                BackstageXchange Property is Goa's most trusted luxury real estate platform,
                connecting discerning buyers, sellers, and investors with the finest coastal
                properties across North and South Goa.
              </p>
              <p className="about-para">
                Founded by RERA-certified professionals with over 12 years of combined
                experience, we provide end-to-end guidance — from property discovery and
                site visits to legal documentation and post-purchase support.
              </p>
              <button
                className="btn-navy"
                onClick={() => onNavigate('contact')}
                aria-label="Talk to a BackstageXchange expert"
              >
                Talk to an Expert
              </button>
            </div>

            <div className="about-mission-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700&q=80"
                alt="Aerial view of a luxury coastal property in Goa with palm trees and swimming pool"
                className="about-mission-img"
                loading="lazy"
                width="700"
                height="467"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="about-stats-section" aria-label="Company statistics">
        <div className="about-container">
          <dl className="about-stats-grid">
            {STATS.map((s) => (
              <div key={s.label} className="about-stat-card">
                <div className="about-stat-icon" aria-hidden="true"><s.Icon /></div>
                <dt className="about-stat-num">{s.num}</dt>
                <dd className="about-stat-label">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="about-values-section" aria-labelledby="values-heading">
        <div className="about-container">
          <p className="section-eyebrow gold centered">• WHY CHOOSE US</p>
          <h2 id="values-heading" className="about-section-title centered values-heading">
            Our Core <em>Values</em>
          </h2>
          <div className="values-grid">
            {VALUES.map((v) => (
              <div key={v.title} className="value-card">
                <div className="value-card-icon" aria-hidden="true">
                  <v.Icon size={26} strokeWidth={1.5} />
                </div>
                <h3 className="value-card-title">{v.title}</h3>
                <p className="value-card-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Milestones ── */}
      <section className="about-timeline-section" aria-labelledby="timeline-heading" ref={timelineSectionRef}>
        <div className="about-container">
          <p className="section-eyebrow teal centered">• OUR JOURNEY</p>
          <h2 id="timeline-heading" className="about-section-title centered">A Decade of Milestones</h2>
          <ol className="timeline-list" aria-label="Company history milestones">
            {MILESTONES.map((m, i) => (
              <li
                key={m.year}
                className="timeline-item"
                ref={(el) => (timelineItemRefs.current[i] = el)}
                style={{ '--stagger-delay': `${i * 0.18}s` }}
              >
                <div className="timeline-year" aria-label={`Year ${m.year}`}>{m.year}</div>
                <div className="timeline-connector" aria-hidden="true">
                  <span className="timeline-dot">
                    <span className="timeline-dot-ring" aria-hidden="true" />
                  </span>
                  {i < MILESTONES.length - 1 && <span className="timeline-line" />}
                </div>
                <p className="timeline-event">{m.event}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Agents ── */}
      <section className="agents-section" aria-labelledby="agents-heading">
        <div className="about-container">
          <p className="section-eyebrow teal centered">• OUR TEAM</p>
          <h2 id="agents-heading" className="about-section-title centered">Meet Our Expert Agents</h2>
          <div className="agents-grid">
            {AGENTS.map((agent) => (
              <article key={agent.name} className="agent-card">
                <div
                  className="agent-card-avatar"
                  aria-label={`${agent.name} avatar`}
                >
                  {agent.initials}
                </div>
                <h3 className="agent-card-name">{agent.name}</h3>
                <p className="agent-card-role">{agent.role}</p>
                <dl className="agent-card-stats">
                  <div className="agent-stat-row">
                    <dt className="visually-hidden">Experience</dt>
                    <dd><IconCalendarSmall />{agent.exp}</dd>
                  </div>
                  <div className="agent-stat-row">
                    <dt className="visually-hidden">Deals closed</dt>
                    <dd><IconDeals />{agent.sales}</dd>
                  </div>
                </dl>
                <button
                  className="btn-outline-gold"
                  onClick={() => onNavigate('contact')}
                  aria-label={`Contact ${agent.name}`}
                >
                  Contact Agent
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;