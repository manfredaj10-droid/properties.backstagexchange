import React from 'react';
import './Legal.css';

const Privacy = () => (
  <div className="legal-page">
    <div className="page-hero legal-hero">
      <div className="page-hero-overlay"></div>
      <div className="page-hero-content" style={{ paddingLeft: '5vw', paddingBottom: '3rem' }}>
        <p className="page-eyebrow">• Legal</p>
        <h1 className="page-hero-title">Privacy <em>Policy</em></h1>
      </div>
    </div>

    <section className="legal-section">
      <div className="legal-container">
        <p className="legal-updated">Last Updated: June 1, 2025</p>

        <div className="legal-intro">
          <p>At BackstageXchange Property, we are committed to protecting your personal information and your right to privacy. This Privacy Policy explains what information we collect, how we use it, and what rights you have in relation to it.</p>
        </div>

        {[
          {
            title: '1. Information We Collect',
            content: `We collect information you provide directly to us, including:
• Personal identification details (name, email address, phone number)
• Property preferences and search history on our platform
• Communications you send to us or our agents
• Information submitted through contact forms, property enquiry forms, or listing submission forms
• Technical data including IP address, browser type, device information, and cookies`
          },
          {
            title: '2. How We Use Your Information',
            content: `We use the information we collect to:
• Connect you with relevant property listings and RERA-certified agents
• Respond to your enquiries and provide customer support
• Send you property alerts, newsletters, and market updates (with your consent)
• Improve our website experience and service offerings
• Comply with legal obligations under Indian law and RERA regulations
• Prevent fraud and ensure the security of our platform`
          },
          {
            title: '3. Information Sharing',
            content: `We do not sell, trade, or rent your personal information to third parties. We may share your information with:
• Our verified RERA-certified agents to facilitate property transactions
• Service providers who assist in operating our platform (under strict confidentiality agreements)
• Law enforcement or regulatory authorities when required by law
• Professional advisors including lawyers and accountants, under confidentiality obligations`
          },
          {
            title: '4. Cookies & Tracking Technologies',
            content: `We use cookies and similar tracking technologies to enhance your browsing experience. Types of cookies we use:
• Essential Cookies: Required for core platform functionality
• Analytics Cookies: Help us understand how visitors interact with our website
• Preference Cookies: Remember your settings and preferences
• Marketing Cookies: Used to deliver relevant property advertisements

You can control cookie settings through your browser preferences.`
          },
          {
            title: '5. Data Security',
            content: `We implement industry-standard security measures to protect your personal data, including SSL encryption, secure servers, and access controls. However, no internet transmission is 100% secure, and we cannot guarantee absolute security.`
          },
          {
            title: '6. Your Rights',
            content: `Under applicable Indian data protection laws, you have the right to:
• Access the personal data we hold about you
• Request correction of inaccurate information
• Request deletion of your personal data
• Withdraw consent for marketing communications at any time
• Lodge a complaint with the relevant data protection authority

To exercise these rights, contact us at privacy@backstagexchange.com`
          },
          {
            title: '7. Contact Us',
            content: `If you have questions or concerns about this Privacy Policy, please contact:

BackstageXchange Property
Calangute-Candolim Road, North Goa – 403516
Email: privacy@backstagexchange.com
Phone: +91 98765 43210`
          },
        ].map((section, i) => (
          <div key={i} className="legal-section-block">
            <h2 className="legal-section-title">{section.title}</h2>
            <div className="legal-text">{section.content.split('\n').map((line, j) => (
              <p key={j}>{line}</p>
            ))}</div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default Privacy;
