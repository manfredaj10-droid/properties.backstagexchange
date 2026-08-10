import { useState } from 'react';
import './Contact.css';

const WEB3FORMS_ACCESS_KEY = 'dce07800-311d-46fc-8ada-f2be73697a24';

/* ─── Premium SVG Icon Components ────────────────────────────────────────── */

const IconPin = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 2C7.24 2 5 4.24 5 7C5 10.75 10 18 10 18C10 18 15 10.75 15 7C15 4.24 12.76 2 10 2Z" stroke="#C9A84C" strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="10" cy="7" r="2" stroke="#C9A84C" strokeWidth="1.5"/>
  </svg>
);

const IconPhone = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 3H7.5L9 6.5L7 8C7.96 9.97 10.03 12.04 12 13L13.5 11L17 12.5V16C17 16.55 16.55 17 16 17C8.82 17 3 11.18 3 4C3 3.45 3.45 3 4 3Z" stroke="#C9A84C" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

const IconMail = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="16" height="12" rx="1.5" stroke="#C9A84C" strokeWidth="1.5"/>
    <path d="M2 6L10 11L18 6" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="7" stroke="#C9A84C" strokeWidth="1.5"/>
    <path d="M10 6V10L13 12.5" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconSend = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display:'inline', verticalAlign:'middle', marginRight:'6px' }}>
    <path d="M2 8L14 2L8 14L7 9L2 8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    <line x1="7" y1="9" x2="14" y2="2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const IconSuccess = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="20" stroke="#C9A84C" strokeWidth="2"/>
    <path d="M15 24L21 30L33 18" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconWhatsApp = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display:'inline', verticalAlign:'middle', marginRight:'8px' }}>
    <path d="M11 2C6.03 2 2 6.03 2 11C2 12.7 2.46 14.29 3.27 15.66L2 20L6.44 18.74C7.78 19.5 9.34 19.94 11 19.94C15.97 19.94 20 15.91 20 10.94C20 6 15.97 2 11 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    <path d="M8 8.5C8 8.5 8.2 10.2 9.5 11.5C10.8 12.8 12.5 13 12.5 13L13.5 12C13.5 12 12.8 11.7 12.2 11.1C11.6 10.5 11.3 9.8 11.3 9.8L8 8.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
  </svg>
);

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        to: 'cybercreativegoa@gmail.com',
        name: form.name,
        email: form.email,
        phone: form.phone || 'Not provided',
        subject: form.subject
          ? `[BackstageXchange] ${form.subject} from ${form.name}`
          : `[BackstageXchange] New Enquiry from ${form.name}`,
        message: form.message,
        from_name: 'BackstageXchange Property Website',
      };

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setSent(true);
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setError(result.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="page-hero contact-hero">
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content" style={{ paddingLeft: '5vw', paddingBottom: '3rem' }}>
          <p className="page-eyebrow">• Get in Touch</p>
          <h1 className="page-hero-title">Let's Find Your Dream<br />Property in <em>Goa</em></h1>
        </div>
      </div>

      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-grid">
            {/* Left: Form */}
            <div className="contact-form-panel">
              <p className="contact-eyebrow">• GET IN TOUCH</p>
              <h2 className="contact-title">Send a Message</h2>
              {sent ? (
                <div className="contact-success">
                  <div className="contact-success-icon"><IconSuccess /></div>
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. Our team will respond within 24 hours.</p>
                  <button className="btn-contact-gold" onClick={() => setSent(false)}>Send Another</button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  {/* Hidden honeypot to prevent spam */}
                  <input type="checkbox" name="botcheck" style={{ display: 'none' }} />

                  <div className="contact-form-row">
                    <div className="contact-field">
                      <label className="contact-label">Full Name *</label>
                      <input
                        type="text"
                        className="contact-input"
                        placeholder="Your Full Name"
                        value={form.name}
                        onChange={e => update('name', e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="contact-field">
                      <label className="contact-label">Phone Number</label>
                      <input
                        type="tel"
                        className="contact-input"
                        placeholder="+91 XXXXX XXXXX"
                        value={form.phone}
                        onChange={e => update('phone', e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="contact-field">
                    <label className="contact-label">Email Address *</label>
                    <input
                      type="email"
                      className="contact-input"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={e => update('email', e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="contact-field">
                    <label className="contact-label">Subject</label>
                    <select
                      className="contact-select"
                      value={form.subject}
                      onChange={e => update('subject', e.target.value)}
                      disabled={loading}
                    >
                      <option value="">Select a topic</option>
                      <option>Property Enquiry</option>
                      <option>Book Site Visit</option>
                      <option>Investment Advice</option>
                      <option>List My Property</option>
                      <option>General Query</option>
                    </select>
                  </div>
                  <div className="contact-field">
                    <label className="contact-label">Message *</label>
                    <textarea
                      className="contact-textarea"
                      rows="5"
                      placeholder="Tell us about the property you're looking for, your budget, preferred location..."
                      value={form.message}
                      onChange={e => update('message', e.target.value)}
                      required
                      disabled={loading}
                    ></textarea>
                  </div>

                  {error && (
                    <div className="contact-error">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ display:'inline', verticalAlign:'middle', marginRight:'6px' }}>
                        <circle cx="8" cy="8" r="6.5" stroke="#c0392b" strokeWidth="1.3"/>
                        <line x1="8" y1="5" x2="8" y2="9" stroke="#c0392b" strokeWidth="1.3" strokeLinecap="round"/>
                        <circle cx="8" cy="11.5" r="0.7" fill="#c0392b"/>
                      </svg>
                      {error}
                    </div>
                  )}

                  <button type="submit" className="btn-contact-gold" disabled={loading}>
                    {loading ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ display:'inline', verticalAlign:'middle', marginRight:'6px', animation:'spin 1s linear infinite' }}>
                          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="20 18" strokeLinecap="round"/>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <><IconSend />Send Message</>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right: Info */}
            <div className="contact-info-panel">
              <div className="contact-info-card">
                <h3 className="contact-info-title">Office Information</h3>
                <div className="contact-info-item">
                  <div className="contact-info-icon"><IconPin /></div>
                  <div>
                    <p className="contact-info-label">Office Address</p>
                    <p className="contact-info-value">BackstageXchange Property<br />14, Panaji Business Hub, Dr. Atmaram Borkar Road,<br />Panjim, Goa 403001</p>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-icon"><IconPhone /></div>
                  <div>
                    <p className="contact-info-label">Phone</p>
                    <p className="contact-info-value">+91 98765 43210<br />+91 87654 32109</p>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-icon"><IconMail /></div>
                  <div>
                    <p className="contact-info-label">Email</p>
                    <p className="contact-info-value">info@backstagexchange.com<br />sales@backstagexchange.com</p>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-icon"><IconClock /></div>
                  <div>
                    <p className="contact-info-label">Working Hours</p>
                    <p className="contact-info-value">Mon – Sat: 9:00 AM – 7:00 PM<br />Sunday: 10:00 AM – 4:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="contact-social-card">
                <h3 className="contact-social-title">Follow Us</h3>
                <div className="contact-social-buttons">
                  <a href="#" className="social-btn instagram">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ display:'inline', verticalAlign:'middle', marginRight:'6px' }}>
                      <rect x="2" y="2" width="12" height="12" rx="3.5" stroke="currentColor" strokeWidth="1.3"/>
                      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.3"/>
                      <circle cx="11.5" cy="4.5" r="0.7" fill="currentColor"/>
                    </svg>
                    Instagram
                  </a>
                  <a href="#" className="social-btn facebook">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ display:'inline', verticalAlign:'middle', marginRight:'6px' }}>
                      <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3"/>
                      <path d="M9 6H7.5V8H9V13H7V8H6V6H7V5C7 3.9 7.9 3 9 3H10V5H9V6Z" fill="currentColor"/>
                    </svg>
                    Facebook
                  </a>
                  <a href="#" className="social-btn youtube">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ display:'inline', verticalAlign:'middle', marginRight:'6px' }}>
                      <rect x="1" y="3" width="14" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.3"/>
                      <path d="M6.5 6L10.5 8L6.5 10V6Z" fill="currentColor"/>
                    </svg>
                    YouTube
                  </a>
                  <a href="#" className="social-btn linkedin">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ display:'inline', verticalAlign:'middle', marginRight:'6px' }}>
                      <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3"/>
                      <line x1="5" y1="7" x2="5" y2="11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      <circle cx="5" cy="5.5" r="0.7" fill="currentColor"/>
                      <path d="M8 7V11M8 9C8 7.9 8.9 7 10 7C11.1 7 12 7.9 12 9V11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                    LinkedIn
                  </a>
                </div>
              </div>

              <div className="contact-whatsapp-card">
                <div className="wa-icon">
                  {/* Official WhatsApp logo — filled white vector */}
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M16 2C8.268 2 2 8.268 2 16c0 2.444.638 4.74 1.756 6.733L2 30l7.515-1.724A13.931 13.931 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm-3.274 8.152c-.275-.618-.564-.63-.825-.641-.213-.01-.457-.01-.701-.01-.244 0-.64.092-.975.457-.336.366-1.28 1.251-1.28 3.05 0 1.8 1.311 3.541 1.494 3.785.183.244 2.54 4.04 6.25 5.504 3.087 1.218 3.71 .976 4.381.915.67-.061 2.164-.884 2.469-1.738.305-.854.305-1.586.214-1.738-.092-.153-.336-.244-.701-.427-.366-.183-2.164-1.068-2.5-1.19-.335-.122-.58-.183-.824.183-.244.366-.945 1.19-1.159 1.434-.213.244-.427.275-.793.092-.366-.183-1.543-.569-2.94-1.814-1.087-.969-1.821-2.165-2.034-2.531-.214-.366-.023-.564.16-.747.163-.163.366-.427.549-.64.183-.214.244-.366.366-.61.122-.244.061-.457-.03-.64-.092-.182-.8-1.99-1.12-2.728z" fill="white"/>
                  </svg>
                </div>
                <div>
                  <p className="wa-text">Quick Query? WhatsApp Us!</p>
                  <p className="wa-sub">Average response time: 15 minutes</p>
                </div>
                <a href="https://wa.me/919876543210" className="wa-btn">Chat Now</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;