import React from 'react';
import './Legal.css';

const Terms = () => (
  <div className="legal-page">
    <div className="page-hero legal-hero">
      <div className="page-hero-overlay"></div>
      <div className="page-hero-content" style={{ paddingLeft: '5vw', paddingBottom: '3rem' }}>
        <p className="page-eyebrow">• Legal</p>
        <h1 className="page-hero-title">Terms &amp; <em>Conditions</em></h1>
      </div>
    </div>

    <section className="legal-section">
      <div className="legal-container">
        <p className="legal-updated">Last Updated: June 1, 2025</p>

        <div className="legal-intro">
          <p>These Terms and Conditions govern your use of the BackstageXchange Property website and services. By accessing our platform, you agree to be bound by these terms. Please read them carefully.</p>
        </div>

        {[
          {
            title: '1. Acceptance of Terms',
            content: `By using the BackstageXchange Property website, mobile application, or services, you confirm that you are at least 18 years of age and agree to comply with and be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.`
          },
          {
            title: '2. Platform Usage',
            content: `Our platform is designed to facilitate property discovery, buyer-seller connections, and real estate service enquiries in Goa. You agree to:
• Use the platform only for lawful purposes
• Provide accurate and truthful information when submitting enquiries or listings
• Not misrepresent your identity or authority
• Not use the platform to distribute spam, malware, or harmful content
• Not attempt to scrape, copy, or reproduce our property database without authorisation`
          },
          {
            title: '3. Property Listings',
            content: `BackstageXchange Property acts as an intermediary platform. All property listings are provided by verified agents and owners. We make every effort to ensure listing accuracy, however:
• We cannot guarantee the accuracy of all listing information
• Property prices are subject to change without notice
• Site visits and independent verification are strongly recommended before any transaction
• We are not party to any transaction between buyers and sellers`
          },
          {
            title: '4. RERA Compliance',
            content: `All agents listed on our platform are required to provide valid RERA registration numbers. However, buyers are advised to independently verify RERA registration at rera.goa.gov.in before entering into any property agreement. BackstageXchange Property does not guarantee RERA compliance of all listed projects.`
          },
          {
            title: '5. Intellectual Property',
            content: `All content on the BackstageXchange Property platform, including text, images, logos, property descriptions, and data compilations, is the intellectual property of BackstageXchange Property or its licensors. Unauthorised reproduction, distribution, or commercial use of our content is strictly prohibited.`
          },
          {
            title: '6. Limitation of Liability',
            content: `BackstageXchange Property shall not be liable for:
• Any direct, indirect, incidental, or consequential damages arising from property transactions
• Inaccuracies in property listings provided by third-party agents
• Technical interruptions or service unavailability
• Losses arising from reliance on information displayed on our platform

Our maximum liability in any event shall be limited to the service fees paid to us in the preceding 12 months.`
          },
          {
            title: '7. Privacy & Data',
            content: `Your use of our platform is also governed by our Privacy Policy. By using our services, you consent to the collection and use of your data as described in our Privacy Policy.`
          },
          {
            title: '8. Governing Law',
            content: `These Terms and Conditions are governed by the laws of India. Any disputes arising from the use of our platform shall be subject to the exclusive jurisdiction of the courts in Panaji, Goa.`
          },
          {
            title: '9. Amendments',
            content: `BackstageXchange Property reserves the right to modify these Terms and Conditions at any time. Material changes will be communicated via email or a prominent notice on our website. Continued use of the platform after changes constitutes acceptance of the revised terms.`
          },
          {
            title: '10. Contact',
            content: `For questions regarding these Terms and Conditions:

BackstageXchange Property
Calangute-Candolim Road, North Goa – 403516
Email: legal@backstagexchange.com
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

export default Terms;
