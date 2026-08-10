// Blog.jsx
// Fixes applied:
//   #1  — e.stopPropagation() on Read Article / Read More buttons
//   #4  — Empty state guard before accessing blogPosts[0]
//   #6  — blogPosts imported from data file (no longer defined here)
//   #11 — Clickable divs have role="button", tabIndex={0}, onKeyDown, aria-label

import './Blog.css';
import blogPosts from "../../data/blogPosts"; // Issue #6: imported from dedicated data file

// Issue #11: reusable keyboard handler — fires callback on Enter or Space
const handleKeyActivate = (callback) => (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    callback();
  }
};

/* ─── Premium SVG Meta Icons ──────────────────────────────────────────────── */
const IconAuthor = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ display:'inline', verticalAlign:'middle', marginRight:'4px' }}>
    <circle cx="6.5" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M1.5 12C1.5 9.5 3.7 7.5 6.5 7.5C9.3 7.5 11.5 9.5 11.5 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const IconDate = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ display:'inline', verticalAlign:'middle', marginRight:'4px' }}>
    <rect x="1" y="2" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
    <line x1="1" y1="5.5" x2="12" y2="5.5" stroke="currentColor" strokeWidth="1.2"/>
    <line x1="4" y1="1" x2="4" y2="3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="9" y1="1" x2="9" y2="3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const IconReadTime = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ display:'inline', verticalAlign:'middle', marginRight:'4px' }}>
    <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M6.5 4V6.5L8.5 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconNewspaper = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <rect x="6" y="8" width="30" height="32" rx="2" stroke="#C9A84C" strokeWidth="1.5"/>
    <rect x="10" y="16" width="22" height="2" rx="1" fill="#C9A84C" opacity="0.5"/>
    <rect x="10" y="21" width="22" height="2" rx="1" fill="#C9A84C" opacity="0.5"/>
    <rect x="10" y="26" width="14" height="2" rx="1" fill="#C9A84C" opacity="0.5"/>
    <rect x="10" y="10" width="22" height="4" rx="1" fill="#C9A84C" opacity="0.3"/>
    <path d="M36 14H40C41.1 14 42 14.9 42 16V34C42 35.1 41.1 36 40 36H36" stroke="#C9A84C" strokeWidth="1.5"/>
  </svg>
);

const Blog = ({ onViewPost }) => {
  // Issue #4: Guard against empty / undefined blogPosts
  if (!blogPosts || blogPosts.length === 0) {
    return (
      <div className="blog-page">
        <div className="page-hero blog-hero">
          <div className="page-hero-overlay"></div>
          <div className="page-hero-content" style={{ paddingLeft: '5vw', paddingBottom: '3rem' }}>
            <p className="page-eyebrow">• Property Intelligence</p>
            <h1 className="page-hero-title">News &amp; <em>Insights</em></h1>
          </div>
        </div>
        <section className="blog-section">
          <div className="blog-container">
            <div className="blog-empty-state">
              <div className="blog-empty-icon"><IconNewspaper /></div>
              <h2 className="blog-empty-title">No Articles Yet</h2>
              <p className="blog-empty-text">
                Our editorial team is working on fresh insights. Check back soon for the latest
                Goa property news, guides, and investment analysis.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const featured = blogPosts[0];
  const rest = blogPosts.slice(1);

  return (
    <div className="blog-page">
      <div className="page-hero blog-hero">
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content" style={{ paddingLeft: '5vw', paddingBottom: '3rem' }}>
          <p className="page-eyebrow">• Property Intelligence</p>
          <h1 className="page-hero-title">News &amp; <em>Insights</em></h1>
        </div>
      </div>

      <section className="blog-section">
        <div className="blog-container">
          {/* Featured Post */}
          {/* Issue #11: role, tabIndex, onKeyDown, aria-label on the clickable div */}
          <div
            className="blog-featured"
            onClick={() => onViewPost && onViewPost(featured)}
            role="button"
            tabIndex={0}
            onKeyDown={handleKeyActivate(() => onViewPost && onViewPost(featured))}
            aria-label={`Read featured article: ${featured.title}`}
          >
            <div className="blog-featured-img-wrap">
              <img src={featured.img} alt={featured.title} className="blog-featured-img" />
              <span className="blog-category-tag">{featured.category}</span>
            </div>
            <div className="blog-featured-content">
              <div className="blog-meta">
                <span className="blog-author"><IconAuthor />{featured.author}</span>
                <span className="blog-date"><IconDate />{featured.date}</span>
                <span className="blog-read-time"><IconReadTime />{featured.readTime}</span>
              </div>
              <h2 className="blog-featured-title">{featured.title}</h2>
              <p className="blog-featured-excerpt">{featured.excerpt}</p>
              {/* Issue #1: stopPropagation prevents double-fire with parent onClick */}
              <button
                className="btn-blog-read"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewPost && onViewPost(featured);
                }}
              >
                Read Article →
              </button>
            </div>
          </div>

          {/* Blog Grid */}
          <h3 className="blog-grid-heading">Latest Articles</h3>
          <div className="blog-grid">
            {rest.map((post) => (
              // Issue #11: role, tabIndex, onKeyDown, aria-label on each card div
              <div
                key={post.id}
                className="blog-card"
                onClick={() => onViewPost && onViewPost(post)}
                role="button"
                tabIndex={0}
                onKeyDown={handleKeyActivate(() => onViewPost && onViewPost(post))}
                aria-label={`Read article: ${post.title}`}
              >
                <div className="blog-card-img-wrap">
                  <img src={post.img} alt={post.title} className="blog-card-img" />
                  <span className="blog-category-tag blog-card-cat">{post.category}</span>
                </div>
                <div className="blog-card-body">
                  <div className="blog-card-meta">
                    <span><IconAuthor />{post.author}</span>
                    <span><IconDate />{post.date}</span>
                    <span><IconReadTime />{post.readTime}</span>
                  </div>
                  <h3 className="blog-card-title">{post.title}</h3>
                  <p className="blog-card-excerpt">{post.excerpt}</p>
                  {/* Issue #1: stopPropagation prevents double-fire with parent onClick */}
                  <button
                    className="btn-blog-card-read"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewPost && onViewPost(post);
                    }}
                  >
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;