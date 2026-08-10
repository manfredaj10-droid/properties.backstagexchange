// BlogDetail.jsx
// Features added:
//   [Comments] — Full Comments & Engagement section with:
//     • Article helpfulness vote (thumbs up / down)
//     • Hardcoded verified-agent seed comments with premium badge
//     • Dynamic comment submission with user-type tag selector
//     • Per-comment like reactions
//     • Floating-label form inputs matching luxury branding

import { useState } from 'react';
import './BlogDetail.css';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getInitials = (name) => {
  if (!name || typeof name !== 'string' || name.trim() === '') return '?';
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

const renderBodyBlock = (block, index) => {
  switch (block.type) {
    case 'lead':
      return <p key={index} className="blogdetail-lead">{block.text}</p>;
    case 'heading':
      return <h2 key={index}>{block.text}</h2>;
    case 'paragraph':
      return <p key={index} dangerouslySetInnerHTML={{ __html: block.text }} />;
    case 'list':
      return (
        <ul key={index}>
          {block.items.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      );
    case 'quote':
      return (
        <blockquote key={index} className="blogdetail-quote">
          {block.text}
          {block.cite && <cite>{block.cite}</cite>}
        </blockquote>
      );
    default:
      return null;
  }
};

// ─── User type role icons (premium inline SVGs) ───────────────────────────────
// All icons: 24×24 px · strokeWidth 1.5 · strokeLinecap/Join round
// Default color: #1a2b3c (deep navy); active badge overrides via CSS currentColor

const RoleIconKey = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
       xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {/* Bow */}
    <circle cx="9" cy="9" r="5" stroke="currentColor" strokeWidth="1.5" />
    {/* Shaft */}
    <line x1="13.5" y1="13.5" x2="21" y2="21"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Notch 1 */}
    <line x1="18" y1="18" x2="18" y2="21"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Notch 2 */}
    <line x1="20.5" y1="20.5" x2="20.5" y2="23"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const RoleIconHome = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
       xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {/* Roof */}
    <path d="M3 10.5L12 3L21 10.5"
          stroke="currentColor" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round" />
    {/* Walls */}
    <path d="M5 9V20H19V9"
          stroke="currentColor" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round" />
    {/* Door */}
    <rect x="9.5" y="14" width="5" height="6" rx="0.75"
          stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const RoleIconTrendingUp = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
       xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {/* Rising line */}
    <polyline points="3,17 8,11 13,14 21,6"
              stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round" />
    {/* Arrow */}
    <polyline points="16,6 21,6 21,11"
              stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const RoleIconBuilding = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
       xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {/* Main block */}
    <rect x="3" y="5" width="11" height="16" rx="0.75"
          stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    {/* Wing */}
    <path d="M14 9H20V21H14"
          stroke="currentColor" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round" />
    {/* Left windows */}
    <line x1="7" y1="9"  x2="10" y2="9"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="7" y1="13" x2="10" y2="13"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Right windows */}
    <line x1="16.5" y1="13" x2="18.5" y2="13"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="16.5" y1="17" x2="18.5" y2="17"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// ─── User type options ────────────────────────────────────────────────────────

const USER_TYPES = [
  { value: 'prospective-buyer', label: 'Prospective Buyer', icon: <RoleIconKey /> },
  { value: 'local-resident',    label: 'Local Resident',    icon: <RoleIconHome /> },
  { value: 'investor',          label: 'Investor',          icon: <RoleIconTrendingUp /> },
  { value: 're-fan',            label: 'Real Estate Fan',   icon: <RoleIconBuilding /> },
];

// ─── Seed comments (hardcoded) ────────────────────────────────────────────────

const SEED_COMMENTS = [
  {
    id: 'seed-1',
    name: 'Rohan Mehta',
    userType: 'investor',
    userTypeLabel: 'Investor',
    userTypeIcon: <RoleIconTrendingUp />,
    date: 'June 14, 2025',
    text: `Fantastic breakdown of the Calangute micro-market. The rental yield data aligns perfectly with what I've been tracking. One thing I'd add \u2014 the post-monsoon window (Oct\u2013Nov) often has 12\u201315% softer asking prices before the season peaks. Worth timing your entry around that.`,
    likes: 18,
    likedByMe: false,
    isVerified: false,
  },
  {
    id: 'seed-2',
    name: 'Priya & Ajit Nair',
    userType: 'prospective-buyer',
    userTypeLabel: 'Prospective Buyer',
    userTypeIcon: <RoleIconKey />,
    date: 'June 15, 2025',
    text: `We've been shortlisting villas in Assagao for six months and this article finally gave us language to talk to sellers with. The RERA checklist especially \u2014 saved us from making a potentially costly mistake with an unregistered project.`,
    likes: 11,
    likedByMe: false,
    isVerified: false,
  },
  {
    id: 'seed-agent-1',
    name: 'Vikram Albuquerque',
    agentTitle: 'Senior Property Advisor · BackstageXchange',
    date: 'June 16, 2025',
    text: `Great questions coming in on this one. To add official context: stamp duty in Goa currently sits at 3.5% for women buyers and 5% for men \u2014 this differential is actively encouraging co-ownership registrations. If you're purchasing as a couple, registering jointly could save you \u20b91.5\u20132L on a typical \u20b92Cr villa. Happy to walk you through the paperwork specifics \u2014 just reach out via the property enquiry form.`,
    likes: 34,
    likedByMe: false,
    isVerified: true,
    verifiedRole: 'Verified Agent',
  },
  {
    id: 'seed-3',
    name: 'Sandeep Kulkarni',
    userType: 're-fan',
    userTypeLabel: 'Real Estate Fan',
    userTypeIcon: <RoleIconBuilding />,
    date: 'June 17, 2025',
    text: `Been following Goa real estate casually for two years now. The comparison between South Goa farmhouse plots and North Goa villa prices is eye-opening. Would love a follow-up piece on Canacona \u2014 I feel it's completely under-reported.`,
    likes: 7,
    likedByMe: false,
    isVerified: false,
  },
  {
    id: 'seed-agent-2',
    name: 'Ananya Desai',
    agentTitle: 'Market Research Analyst · BackstageXchange',
    date: 'June 18, 2025',
    text: `Canacona is on our editorial radar, Sandeep \u2014 stay tuned. On the data side: the Q1 2025 registrations show a 22% YoY increase in sub-\u20b980L residential plots in South Goa, which tells a very different story from the luxury segment. We'll have a deep-dive piece out before August.`,
    likes: 29,
    likedByMe: false,
    isVerified: true,
    verifiedRole: 'Market Expert',
  },
];

// ─── ArticleHelpfulness ──────────────────────────────────────────────────────

const ArticleHelpfulness = () => {
  const [vote, setVote]         = useState(null); // 'up' | 'down' | null
  const [upCount, setUpCount]   = useState(47);
  const [downCount, setDownCount] = useState(5);

  const handleVote = (type) => {
    if (vote === type) {
      // toggle off
      setVote(null);
      type === 'up' ? setUpCount(c => c - 1) : setDownCount(c => c - 1);
    } else {
      // switching vote
      if (vote === 'up')   setUpCount(c => c - 1);
      if (vote === 'down') setDownCount(c => c - 1);
      type === 'up' ? setUpCount(c => c + 1) : setDownCount(c => c + 1);
      setVote(type);
    }
  };

  return (
    <div className="article-helpfulness">
      <p className="helpfulness-label">Was this article helpful?</p>
      <div className="helpfulness-actions">
        <button
          className={`helpfulness-btn${vote === 'up' ? ' helpfulness-btn--active-up' : ''}`}
          onClick={() => handleVote('up')}
          aria-label="Mark article as helpful"
          aria-pressed={vote === 'up'}
        >
          <span className="helpfulness-icon">👍</span>
          <span className="helpfulness-count">{upCount}</span>
        </button>
        <button
          className={`helpfulness-btn${vote === 'down' ? ' helpfulness-btn--active-down' : ''}`}
          onClick={() => handleVote('down')}
          aria-label="Mark article as not helpful"
          aria-pressed={vote === 'down'}
        >
          <span className="helpfulness-icon">👎</span>
          <span className="helpfulness-count">{downCount}</span>
        </button>
        {vote && (
          <span className="helpfulness-thankyou">
            {vote === 'up' ? '✨ Thanks for the feedback!' : "Thanks \u2014 we'll keep improving."}
          </span>
        )}
      </div>
    </div>
  );
};

// ─── CommentCard ─────────────────────────────────────────────────────────────

const CommentCard = ({ comment, onLike }) => {
  const initials = getInitials(comment.name);
  const userType = comment.isVerified ? null : USER_TYPES.find(t => t.value === comment.userType);

  return (
    <div className={`comment-card${comment.isVerified ? ' comment-card--agent' : ''}`}>
      {comment.isVerified && (
        <div className="agent-badge-bar">
          <span className="agent-verified-badge">
            <span className="agent-badge-dot" aria-hidden="true" />
            {comment.verifiedRole}
          </span>
          <span className="agent-badge-line" aria-hidden="true" />
        </div>
      )}

      <div className="comment-header">
        <div className={`comment-avatar${comment.isVerified ? ' comment-avatar--agent' : ''}`}>
          {initials}
        </div>
        <div className="comment-meta">
          <div className="comment-name-row">
            <span className="comment-name">{comment.name}</span>
            {comment.isVerified && (
              <span className="comment-checkmark" title="Verified Team Member" aria-label="Verified team member">✓</span>
            )}
            {!comment.isVerified && userType && (
              <span className="comment-user-tag">
                <span className="comment-user-tag-icon" aria-hidden="true">{userType.icon}</span> {userType.label}
              </span>
            )}
          </div>
          {comment.isVerified
            ? <span className="comment-agent-title">{comment.agentTitle}</span>
            : <span className="comment-date">{comment.date}</span>
          }
          {comment.isVerified && (
            <span className="comment-date comment-date--agent">{comment.date}</span>
          )}
        </div>
      </div>

      <p className="comment-text">{comment.text}</p>

      <div className="comment-footer">
        <button
          className={`comment-like-btn${comment.likedByMe ? ' comment-like-btn--liked' : ''}`}
          onClick={() => onLike(comment.id)}
          aria-label={`${comment.likedByMe ? 'Unlike' : 'Like'} this comment`}
          aria-pressed={comment.likedByMe}
        >
          <span className="comment-like-icon" aria-hidden="true">
            {comment.likedByMe ? '♥' : '♡'}
          </span>
          <span className="comment-like-count">{comment.likes}</span>
          <span className="comment-like-label">helpful</span>
        </button>
      </div>
    </div>
  );
};

// ─── FloatingLabelInput ───────────────────────────────────────────────────────

const FloatingLabelInput = ({ id, label, value, onChange, type = 'text', required }) => {
  const [focused, setFocused] = useState(false);
  const isFloated = focused || value.length > 0;

  return (
    <div className={`fl-field${focused ? ' fl-field--focused' : ''}${isFloated ? ' fl-field--floated' : ''}`}>
      <label className="fl-label" htmlFor={id}>{label}{required && ' *'}</label>
      <input
        id={id}
        type={type}
        className="fl-input"
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        autoComplete="off"
      />
    </div>
  );
};

// ─── FloatingLabelTextarea ────────────────────────────────────────────────────

const FloatingLabelTextarea = ({ id, label, value, onChange, required }) => {
  const [focused, setFocused] = useState(false);
  const isFloated = focused || value.length > 0;

  return (
    <div className={`fl-field fl-field--textarea${focused ? ' fl-field--focused' : ''}${isFloated ? ' fl-field--floated' : ''}`}>
      <label className="fl-label" htmlFor={id}>{label}{required && ' *'}</label>
      <textarea
        id={id}
        className="fl-input fl-textarea"
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        rows={4}
      />
    </div>
  );
};

// ─── CommentForm ─────────────────────────────────────────────────────────────

const EMPTY_FORM = { name: '', email: '', text: '', userType: '' };

const CommentForm = ({ onSubmit }) => {
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [error,     setError]     = useState('');

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim() || !form.userType) {
      setError('Please fill in your name, select a reader type, and write a comment.');
      return;
    }
    setError('');
    onSubmit(form);
    setForm(EMPTY_FORM);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  if (submitted) {
    return (
      <div className="comment-submitted">
        <div className="submitted-icon" aria-hidden="true">✅</div>
        <h4 className="submitted-title">Comment posted!</h4>
        <p className="submitted-sub">Your insight is now live in the discussion.</p>
      </div>
    );
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit} noValidate>
      <div className="comment-form-row">
        <FloatingLabelInput
          id="cf-name"
          label="Your Name"
          value={form.name}
          onChange={set('name')}
          required
        />
        <FloatingLabelInput
          id="cf-email"
          label="Email (not published)"
          value={form.email}
          onChange={set('email')}
          type="email"
        />
      </div>

      <div className="cf-type-section">
        <p className="cf-type-label">I am a <span aria-hidden="true">—</span></p>
        <div className="cf-type-grid" role="group" aria-label="Select your reader type">
          {USER_TYPES.map(t => (
            <button
              key={t.value}
              type="button"
              className={`cf-type-btn${form.userType === t.value ? ' cf-type-btn--active' : ''}`}
              onClick={() => setForm(f => ({ ...f, userType: t.value }))}
              aria-pressed={form.userType === t.value}
            >
              <span className="cf-type-icon" aria-hidden="true">{t.icon}</span>
              <span className="cf-type-text">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <FloatingLabelTextarea
        id="cf-comment"
        label="Share your thoughts or questions…"
        value={form.text}
        onChange={set('text')}
        required
      />

      {error && <p className="cf-error" role="alert">{error}</p>}

      <button type="submit" className="cf-submit-btn">
        <span className="cf-submit-label">Post Comment</span>
        <span className="cf-submit-arrow" aria-hidden="true">→</span>
      </button>
    </form>
  );
};

// ─── CommentsSection ──────────────────────────────────────────────────────────

const CommentsSection = () => {
  const [comments, setComments] = useState(SEED_COMMENTS);

  const handleLike = (id) => {
    setComments(cs =>
      cs.map(c =>
        c.id === id
          ? { ...c, likedByMe: !c.likedByMe, likes: c.likedByMe ? c.likes - 1 : c.likes + 1 }
          : c
      )
    );
  };

  const handleNewComment = (form) => {
    const userType = USER_TYPES.find(t => t.value === form.userType);
    const newComment = {
      id: `user-${Date.now()}`,
      name: form.name.trim(),
      userType: form.userType,
      userTypeLabel: userType?.label || '',
      userTypeIcon: userType?.icon || null,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      text: form.text.trim(),
      likes: 0,
      likedByMe: false,
      isVerified: false,
    };
    setComments(cs => [...cs, newComment]);
  };

  return (
    <section className="comments-section" aria-label="Comments and discussion">
      {/* ── Article helpfulness ── */}
      <ArticleHelpfulness />

      {/* ── Section header ── */}
      <div className="comments-header">
        <h2 className="comments-title">
          Discussion
          <span className="comments-count" aria-label={`${comments.length} comments`}>
            {comments.length}
          </span>
        </h2>
        <p className="comments-subtitle">
          Insights, questions, and local knowledge from our readers
        </p>
      </div>

      {/* ── Comment list ── */}
      <div className="comments-list" aria-label="Comment list">
        {comments.map(comment => (
          <CommentCard key={comment.id} comment={comment} onLike={handleLike} />
        ))}
      </div>

      {/* ── New comment form ── */}
      <div className="comment-form-wrap">
        <h3 className="cf-heading">Join the Discussion</h3>
        <p className="cf-subheading">
          Your local expertise and questions make this community valuable.
        </p>
        <CommentForm onSubmit={handleNewComment} />
      </div>
    </section>
  );
};

// ─── BlogDetail ───────────────────────────────────────────────────────────────

const BlogDetail = ({ post, onBack, onNavigate }) => {
  const p = post || {
    category: 'Market Insights',
    date: 'June 12, 2025',
    title: 'Goa Property Market 2025: Record Demand for Luxury Villas',
    excerpt: 'North Goa is witnessing an unprecedented surge in luxury villa demand...',
    img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80',
    readTime: '5 min read',
    author: 'Sunita Rao',
    body: [],
  };

  return (
    <div className="blogdetail-page">
      <div className="blogdetail-back-bar">
        <div className="blogdetail-container">
          <button className="back-btn" onClick={onBack}>← Back to Blog</button>
        </div>
      </div>

      <div className="blogdetail-container">
        <div className="blogdetail-main">
          <div className="blogdetail-left">
            <div className="blogdetail-cat-tag">{p.category}</div>
            <h1 className="blogdetail-title">{p.title}</h1>

            <div className="blogdetail-meta">
              <div className="blogdetail-author-info">
                <div className="blogdetail-author-avatar">
                  {getInitials(p.author)}
                </div>
                <div>
                  <p className="blogdetail-author-name">{p.author}</p>
                  <p className="blogdetail-author-role">Senior Property Consultant</p>
                </div>
              </div>
              <div className="blogdetail-meta-right">
                <span>📅 {p.date}</span>
                <span>⏱ {p.readTime}</span>
              </div>
            </div>

            <img src={p.img} alt={p.title} className="blogdetail-hero-img" />

            <div className="blogdetail-content">
              {p.body && p.body.length > 0 ? (
                p.body.map((block, index) => renderBodyBlock(block, index))
              ) : (
                <p className="blogdetail-lead">{p.excerpt}</p>
              )}
            </div>

            {/* ── Comments & Engagement ── */}
            <CommentsSection />
          </div>

          <div className="blogdetail-right">
            <div className="blog-sidebar-widget">
              <h3 className="sidebar-widget-title">Recent Articles</h3>
              {[
                { title: 'Top 5 Areas for Highest Rental Yields', date: 'May 15, 2025', cat: 'Investment' },
                { title: "Complete RERA Buyer's Guide 2025",       date: 'May 28, 2025', cat: 'Buying Guide' },
                { title: 'South Goa vs North Goa: Where to Buy?', date: 'April 18, 2025', cat: 'Market Insights' },
              ].map((a, i) => (
                <div key={i} className="sidebar-recent-post">
                  <span className="sidebar-cat-dot" />
                  <div>
                    <p className="sidebar-post-title">{a.title}</p>
                    <p className="sidebar-post-meta">{a.cat} • {a.date}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="blog-sidebar-cta">
              <div className="sidebar-cta-icon">
                <svg
                  width="52" height="52" viewBox="0 0 52 52"
                  fill="none" xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="sidebar-cta-svg"
                >
                  {/* Roof ridge line */}
                  <polyline
                    points="6,24 26,6 46,24"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  />
                  {/* Left overhang */}
                  <line x1="3" y1="24" x2="9" y2="24"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  {/* Right overhang */}
                  <line x1="43" y1="24" x2="49" y2="24"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  {/* Main walls */}
                  <path
                    d="M10 24 L10 46 L42 46 L42 24"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  />
                  {/* Left window */}
                  <rect x="13" y="28" width="8" height="7" rx="1"
                    stroke="currentColor" strokeWidth="1.5" />
                  {/* Right window */}
                  <rect x="31" y="28" width="8" height="7" rx="1"
                    stroke="currentColor" strokeWidth="1.5" />
                  {/* Window cross — left */}
                  <line x1="17" y1="28" x2="17" y2="35"
                    stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                  <line x1="13" y1="31.5" x2="21" y2="31.5"
                    stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                  {/* Window cross — right */}
                  <line x1="35" y1="28" x2="35" y2="35"
                    stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                  <line x1="31" y1="31.5" x2="39" y2="31.5"
                    stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                  {/* Door */}
                  <path d="M22 46 L22 37 Q26 34 30 37 L30 46"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Door knob */}
                  <circle cx="28.5" cy="41.5" r="1"
                    fill="currentColor" />
                  {/* Ground line */}
                  <line x1="6" y1="46" x2="46" y2="46"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h3>Looking for Your Dream Property?</h3>
              <p>Our RERA-certified agents are ready to guide you</p>
              <button
                className="sidebar-cta-btn"
                onClick={() => onNavigate && onNavigate('properties')}
              >
                View Properties
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;