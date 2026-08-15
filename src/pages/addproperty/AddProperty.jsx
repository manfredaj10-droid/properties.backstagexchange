import React, { useState, useRef, useEffect, useCallback } from 'react';
import './AddProperty.css';

const steps = ['Basic Info', 'Location & Price', 'Photos & Amenities', 'Review & Submit'];

const validateStep = (step, form, agreed) => {
  const errors = {};

  if (step === 0) {
    if (!form.title.trim())       errors.title       = 'Property title is required.';
    if (!form.type)               errors.type        = 'Please select a property type.';
    if (!form.description.trim()) errors.description = 'A description is required.';
  }

  if (step === 1) {
    if (!form.location.trim())    errors.location    = 'Address / location is required.';
    if (!form.price.trim())       errors.price       = 'Asking price is required.';
    if (!form.agentName.trim())   errors.agentName   = 'Your name is required.';
    if (!form.agentPhone.trim())  errors.agentPhone  = 'Phone number is required.';
  }

  if (step === 3) {
    if (!agreed) errors.agreed = 'You must agree to the listing terms before submitting.';
  }

  return errors;
};

const INITIAL_FORM = {
  title: '', type: '', listing: 'For Sale', beds: '', baths: '', sqft: '',
  description: '', location: '', price: '', area: '',
  amenities: [], agentName: '', agentPhone: '', agentEmail: '',
};

const AddProperty = ({ onNavigate, listingsCount = 0, onAddListing }) => {
  const [currentStep, setCurrentStep]     = useState(0);
  const [form, setForm]                   = useState(INITIAL_FORM);
  const [agreed, setAgreed]               = useState(false);
  const [errors, setErrors]               = useState({});
  const [photos, setPhotos]               = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [submitted, setSubmitted]         = useState(false);
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [apiError, setApiError]           = useState('');
  const [isDragging, setIsDragging]       = useState(false);

  // Local state to track additions accurately even if parent prop isn't updating
  const [addedCount, setAddedCount]       = useState(listingsCount);

  const fileInputRef = useRef(null);

  const amenityOptions = [
    'Swimming Pool', 'Parking', '24/7 Security', 'Garden', 'Gym',
    'Sea View', 'WiFi', 'BBQ Area', 'Elevator', 'Balcony',
  ];

  // Keep addedCount in sync if parent prop actually updates
  useEffect(() => {
    if (listingsCount > addedCount) {
      setAddedCount(listingsCount);
    }
  }, [listingsCount, addedCount]);

  // ── Sync File Previews & Cleanup Memory Leak ───────────────────────────────
  useEffect(() => {
    const urls = photos.map(file => URL.createObjectURL(file));
    setPhotoPreviews(urls);

    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [photos]);

  // ── Form Helpers ────────────────────────────────────────────────────────────
  const updateForm = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors(prev => { const e = { ...prev }; delete e[key]; return e; });
  };

  const toggleAmenity = (a) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter(x => x !== a)
        : [...prev.amenities, a],
    }));
  };

  // ── Photo Upload Helpers ───────────────────────────────────────────────────
  const processFiles = (newFiles) => {
    setPhotos(prev => {
      const combined = [...prev, ...newFiles];
      return combined.slice(0, 10);
    });
  };

  const handlePhotoChange = (e) => {
    if (!e.target.files.length) return;
    processFiles(Array.from(e.target.files));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handlePhotoRemove = useCallback((index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  }, []);

  // ── Navigation ───────────────────────────────────────────────────────────────
  const handleNext = () => {
    const stepErrors = validateStep(currentStep, form, agreed);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setCurrentStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const stepErrors = validateStep(3, form, agreed);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const userId = localStorage.getItem('user_id') || '1';
      
      const formData = new FormData();
      formData.append('user_id', userId);

      Object.keys(form).forEach(key => {
        if (key === 'amenities') {
          formData.append('amenities', JSON.stringify(form.amenities));
        } else {
          formData.append(key, form[key]);
        }
      });

      // Append image files using standard array key format
      photos.forEach((file) => {
        formData.append('photos[]', file);
      });

      const response = await fetch('http://localhost/backstage-api/add_property.php', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setAddedCount(prev => prev + 1); // Increment local count
        if (onAddListing) {
          onAddListing(data);
        }
        setSubmitted(true);
      } else {
        throw new Error(data.message || 'Failed to submit property.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setApiError(err.message || 'Server error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Reset Form ──────────────────────────────────────────────────────────────
  const handleAddAnother = () => {
    setForm(INITIAL_FORM);
    setAgreed(false);
    setErrors({});
    setPhotos([]);
    setCurrentStep(0);
    setSubmitted(false);
    setApiError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Success Screen ───────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="addprop-page">
        <div className="addprop-success">
          <div className="success-icon">🎉</div>
          <h2 className="success-title">
            {addedCount <= 1 
              ? 'Property Listing Created!' 
              : `You have added ${addedCount} properties!`}
          </h2>

          <p className="success-sub">
            {addedCount <= 1
              ? 'Your first property is live. Add another property to showcase more of your portfolio.'
              : 'Your listings are configured and ready to be viewed by potential clients.'}
          </p>

          <div className="success-actions">
            <button className="btn-addprop-gold" onClick={handleAddAnother}>
              + Add Another Listing
            </button>
            
            {addedCount >= 2 && onNavigate && (
              <button 
                className="btn-addprop-outline" 
                onClick={() => onNavigate('properties')}
              >
                View All Displayed Listings ({addedCount})
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const stepClass = (i) => {
    if (i < currentStep)   return 'stepper-step done';
    if (i === currentStep) return 'stepper-step active';
    return 'stepper-step';
  };

  return (
    <div className="addprop-page">
      <div className="page-hero addprop-hero">
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content" style={{ paddingLeft: '5vw', paddingBottom: '3rem' }}>
          <p className="page-eyebrow">• Agent Portal</p>
          <h1 className="page-hero-title">List Your <em>Property</em></h1>
        </div>
      </div>

      <section className="addprop-section">
        <div className="addprop-container">

          {/* Stepper */}
          <div className="addprop-stepper" role="list" aria-label="Form steps">
            {steps.map((step, i) => (
              <div key={i} className={stepClass(i)} role="listitem" aria-current={i === currentStep ? 'step' : undefined}>
                <div className="stepper-circle" aria-hidden="true">
                  {i < currentStep ? '✓' : i + 1}
                </div>
                <span className="stepper-label">{step}</span>
                {i < steps.length - 1 && <div className="stepper-line" aria-hidden="true"></div>}
              </div>
            ))}
          </div>

          {apiError && (
            <div className="api-error-banner" style={{ color: '#d9534f', marginBottom: '1rem', textAlign: 'center' }} role="alert">
              {apiError}
            </div>
          )}

          <form className="addprop-form" onSubmit={handleSubmit} noValidate>

            {/* Step 1: Basic Info */}
            {currentStep === 0 && (
              <div className="addprop-step-panel">
                <h2 className="step-title">Basic Property Information</h2>
                <div className="form-grid-2">

                  <div className="form-group full">
                    <label className="form-label" htmlFor="prop-title">Property Title *</label>
                    <input
                      id="prop-title"
                      className={`form-input${errors.title ? ' input-error' : ''}`}
                      type="text"
                      placeholder="e.g. Seabreeze Infinity Villa"
                      value={form.title}
                      onChange={e => updateForm('title', e.target.value)}
                      aria-invalid={!!errors.title}
                      aria-describedby={errors.title ? 'err-title' : undefined}
                    />
                    {errors.title && <span id="err-title" className="field-error">{errors.title}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="prop-type">Property Type *</label>
                    <select
                      id="prop-type"
                      className={`form-select${errors.type ? ' input-error' : ''}`}
                      value={form.type}
                      onChange={e => updateForm('type', e.target.value)}
                      aria-invalid={!!errors.type}
                      aria-describedby={errors.type ? 'err-type' : undefined}
                    >
                      <option value="">Select Type</option>
                      {['Villa', 'Apartment', 'Cottage', 'Bungalow', 'Plot', 'Commercial'].map(v => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                    {errors.type && <span id="err-type" className="field-error">{errors.type}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Listing Type *</label>
                    <div className="radio-group" role="radiogroup" aria-label="Listing type">
                      {['For Sale', 'For Rent', 'New Project'].map(opt => (
                        <label key={opt} className={`radio-label${form.listing === opt ? ' active' : ''}`}>
                          <input
                            type="radio"
                            name="listing"
                            value={opt}
                            checked={form.listing === opt}
                            onChange={e => updateForm('listing', e.target.value)}
                            hidden
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="prop-beds">Bedrooms</label>
                    <select id="prop-beds" className="form-select" value={form.beds} onChange={e => updateForm('beds', e.target.value)}>
                      <option value="">Select</option>
                      {['1', '2', '3', '4', '5', '6+'].map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="prop-baths">Bathrooms</label>
                    <select id="prop-baths" className="form-select" value={form.baths} onChange={e => updateForm('baths', e.target.value)}>
                      <option value="">Select</option>
                      {['1', '2', '3', '4', '5+'].map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="prop-sqft">Area (sq. ft.)</label>
                    <input
                      id="prop-sqft"
                      className="form-input"
                      type="number"
                      min="0"
                      placeholder="e.g. 2500"
                      value={form.sqft}
                      onChange={e => updateForm('sqft', e.target.value)}
                    />
                  </div>

                  <div className="form-group full">
                    <label className="form-label" htmlFor="prop-desc">Property Description *</label>
                    <textarea
                      id="prop-desc"
                      className={`form-textarea${errors.description ? ' input-error' : ''}`}
                      rows="4"
                      placeholder="Describe the key features, views, and highlights of this property..."
                      value={form.description}
                      onChange={e => updateForm('description', e.target.value)}
                      aria-invalid={!!errors.description}
                      aria-describedby={errors.description ? 'err-desc' : undefined}
                    />
                    {errors.description && <span id="err-desc" className="field-error">{errors.description}</span>}
                  </div>

                </div>
              </div>
            )}

            {/* Step 2: Location & Price */}
            {currentStep === 1 && (
              <div className="addprop-step-panel">
                <h2 className="step-title">Location & Pricing</h2>
                <div className="form-grid-2">

                  <div className="form-group full">
                    <label className="form-label" htmlFor="prop-loc">Full Address / Location *</label>
                    <input
                      id="prop-loc"
                      className={`form-input${errors.location ? ' input-error' : ''}`}
                      type="text"
                      placeholder="e.g. Calangute Beach Road, North Goa"
                      value={form.location}
                      onChange={e => updateForm('location', e.target.value)}
                      aria-invalid={!!errors.location}
                      aria-describedby={errors.location ? 'err-loc' : undefined}
                    />
                    {errors.location && <span id="err-loc" className="field-error">{errors.location}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="prop-area">Area / Locality</label>
                    <select id="prop-area" className="form-select" value={form.area} onChange={e => updateForm('area', e.target.value)}>
                      <option value="">Select Area</option>
                      {['Calangute', 'Candolim', 'Assagao', 'Anjuna', 'Panaji', 'Porvorim', 'Margao', 'Morjim', 'Siolim', 'Aguada'].map(a => (
                        <option key={a}>{a}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="prop-price">Asking Price (₹) *</label>
                    <input
                      id="prop-price"
                      className={`form-input${errors.price ? ' input-error' : ''}`}
                      type="text"
                      placeholder="e.g. 4.20 Cr or 85,000/mo"
                      value={form.price}
                      onChange={e => updateForm('price', e.target.value)}
                      aria-invalid={!!errors.price}
                      aria-describedby={errors.price ? 'err-price' : undefined}
                    />
                    {errors.price && <span id="err-price" className="field-error">{errors.price}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="prop-agent">Your Name (Agent/Owner) *</label>
                    <input
                      id="prop-agent"
                      className={`form-input${errors.agentName ? ' input-error' : ''}`}
                      type="text"
                      placeholder="Full Name"
                      value={form.agentName}
                      onChange={e => updateForm('agentName', e.target.value)}
                      aria-invalid={!!errors.agentName}
                      aria-describedby={errors.agentName ? 'err-agent' : undefined}
                    />
                    {errors.agentName && <span id="err-agent" className="field-error">{errors.agentName}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="prop-phone">Phone Number *</label>
                    <input
                      id="prop-phone"
                      className={`form-input${errors.agentPhone ? ' input-error' : ''}`}
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={form.agentPhone}
                      onChange={e => updateForm('agentPhone', e.target.value)}
                      aria-invalid={!!errors.agentPhone}
                      aria-describedby={errors.agentPhone ? 'err-phone' : undefined}
                    />
                    {errors.agentPhone && <span id="err-phone" className="field-error">{errors.agentPhone}</span>}
                  </div>

                  <div className="form-group full">
                    <label className="form-label" htmlFor="prop-email">Email Address</label>
                    <input
                      id="prop-email"
                      className="form-input"
                      type="email"
                      placeholder="your@email.com"
                      value={form.agentEmail}
                      onChange={e => updateForm('agentEmail', e.target.value)}
                    />
                  </div>

                </div>
              </div>
            )}

            {/* Step 3: Photos & Amenities */}
            {currentStep === 2 && (
              <div className="addprop-step-panel">
                <h2 className="step-title">Photos & Amenities</h2>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  multiple
                  hidden
                  onChange={handlePhotoChange}
                />

                <div
                  className={`photo-upload-area${isDragging ? ' dragging' : ''}`}
                  onClick={() => fileInputRef.current.click()}
                  onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && fileInputRef.current.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  role="button"
                  tabIndex={0}
                  aria-label="Upload property photos"
                >
                  <div className="photo-upload-icon">📷</div>
                  <p className="photo-upload-text">Drag & drop photos here, or click to browse</p>
                  <p className="photo-upload-sub">Supported: JPG, PNG — Max 10 photos total</p>
                  <span className="btn-addprop-outline" style={{ pointerEvents: 'none' }}>
                    Choose Photos
                  </span>
                </div>

                {photos.length > 0 && (
                  <div className="photo-preview-grid">
                    {photoPreviews.map((src, idx) => (
                      <div key={idx} className="photo-thumb-wrap">
                        <img
                          src={src}
                          alt={`Preview ${idx + 1}`}
                          className="photo-thumb"
                        />
                        <button
                          type="button"
                          className="photo-thumb-remove"
                          onClick={() => handlePhotoRemove(idx)}
                          aria-label={`Remove photo ${idx + 1}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <p className="photo-count-label">{photos.length} / 10 photos selected</p>
                  </div>
                )}

                <h3 className="amenities-form-heading">Select Available Amenities</h3>
                <div className="amenities-checkbox-grid">
                  {amenityOptions.map(a => (
                    <label
                      key={a}
                      className={`amenity-checkbox${form.amenities.includes(a) ? ' checked' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={form.amenities.includes(a)}
                        onChange={() => toggleAmenity(a)}
                        hidden
                      />
                      <span className="amenity-check-indicator" aria-hidden="true">✓</span>
                      {a}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 3 && (
              <div className="addprop-step-panel">
                <h2 className="step-title">Review Your Listing</h2>

                <div className="review-grid">
                  <div className="review-block">
                    <h3 className="review-block-title">Property Details</h3>
                    {[
                      ['Title',   form.title],
                      ['Type',    form.type],
                      ['Listing', form.listing],
                      ['Beds',    form.beds],
                      ['Baths',   form.baths],
                      ['Area',    form.sqft ? `${form.sqft} sqft` : null],
                    ].map(([label, value]) => (
                      <div className="review-row" key={label}>
                        <span>{label}</span>
                        <strong>{value || '—'}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="review-block">
                    <h3 className="review-block-title">Location & Contact</h3>
                    {[
                      ['Location', form.location],
                      ['Area',     form.area],
                      ['Price',    form.price],
                      ['Agent',    form.agentName],
                      ['Phone',    form.agentPhone],
                      ['Email',    form.agentEmail],
                    ].map(([label, value]) => (
                      <div className="review-row" key={label}>
                        <span>{label}</span>
                        <strong>{value || '—'}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="review-block full">
                    <h3 className="review-block-title">Amenities Selected</h3>
                    <div className="review-amenities">
                      {form.amenities.length > 0
                        ? form.amenities.map(a => <span key={a} className="review-amenity-tag">{a}</span>)
                        : <span style={{ color: '#9aa4b5' }}>None selected</span>
                      }
                    </div>
                  </div>

                  {photoPreviews.length > 0 && (
                    <div className="review-block full">
                      <h3 className="review-block-title">Photos ({photoPreviews.length})</h3>
                      <div className="review-photo-strip">
                        {photoPreviews.map((src, idx) => (
                          <img
                            key={idx}
                            src={src}
                            alt={`Upload ${idx + 1}`}
                            className="review-photo-thumb"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className={`review-agree${errors.agreed ? ' agree-error' : ''}`}>
                  <input
                    type="checkbox"
                    id="agree"
                    checked={agreed}
                    onChange={e => {
                      setAgreed(e.target.checked);
                      if (errors.agreed) setErrors(prev => { const e = { ...prev }; delete e.agreed; return e; });
                    }}
                    aria-invalid={!!errors.agreed}
                    aria-describedby={errors.agreed ? 'err-agreed' : undefined}
                  />
                  <label htmlFor="agree">
                    I confirm that all information provided is accurate and I agree to the
                    listing terms.
                  </label>
                </div>
                {errors.agreed && <span id="err-agreed" className="field-error agree-field-error">{errors.agreed}</span>}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="addprop-nav">
              {currentStep > 0 && (
                <button type="button" className="btn-addprop-outline" onClick={handleBack} disabled={isSubmitting}>
                  ← Previous
                </button>
              )}
              {currentStep < steps.length - 1 ? (
                <button type="button" className="btn-addprop-gold" onClick={handleNext}>
                  Continue →
                </button>
              ) : (
                <button type="submit" className="btn-addprop-gold" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : '🚀 Submit Listing'}
                </button>
              )}
            </div>

          </form>
        </div>
      </section>
    </div>
  );
};

export default AddProperty;