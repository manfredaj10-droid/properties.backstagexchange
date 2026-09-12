// ─── AuthModal.jsx ────────────────────────────────────────────────────────────
//
//  Self-contained Sign-Up / Login modal.
//  Reads auth state from AuthContext; the parent (App.jsx) mounts this
//  conditionally when authModalOpen === true.
//
//  Wiring points:
//    • handleLoginSubmit  — swap the setTimeout mock with your real API call
//    • handleSignupSubmit — same
//    • Google button      — plug in firebase.auth().signInWithPopup(googleProvider)
//
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from "../../AuthContext";
import './AuthModal.css';

// ─── tiny helpers ─────────────────────────────────────────────────────────────
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isStrongPass  = (v) => v.length >= 8;

// ─── Admin Notification Email ────────────────────────────────────────────────
const ADMIN_EMAIL = 'manfredviegas@gmail.com';
// Google Apps Script Web App URL for instant inbox notifications:
const GOOGLE_SCRIPT_WEBHOOK_URL = '';

// ─────────────────────────────────────────────────────────────────────────────
const AuthModal = () => {
  const { closeAuthModal, login } = useAuth();

  // 'login' | 'signup'
  const [mode,     setMode]     = useState('login');
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);

  // ── Login form state ─────────────────────────────────────────────────────
  const [loginEmail,    setLoginEmail]    = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrors,   setLoginErrors]   = useState({});

  // ── Signup form state ────────────────────────────────────────────────────
  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupLastName,  setSignupLastName]  = useState('');
  const [signupEmail,     setSignupEmail]     = useState('');
  const [signupPassword,  setSignupPassword]  = useState('');
  const [signupConfirm,   setSignupConfirm]   = useState('');
  const [signupErrors,    setSignupErrors]    = useState({});

  // Close on Escape key
  const panelRef = useRef(null);
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeAuthModal(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeAuthModal]);

  // Trap focus inside panel; focus first input on mount
  useEffect(() => {
    const firstInput = panelRef.current?.querySelector('input, button');
    firstInput?.focus();
  }, [mode]);

  // ── Validation ───────────────────────────────────────────────────────────
  const validateLogin = () => {
    const e = {};
    if (!loginEmail.trim())           e.email    = 'Email is required.';
    else if (!isValidEmail(loginEmail)) e.email   = 'Enter a valid email address.';
    if (!loginPassword)               e.password = 'Password is required.';
    return e;
  };

  const validateSignup = () => {
    const e = {};
    if (!signupFirstName.trim()) e.firstName = 'First name is required.';
    if (!signupLastName.trim())  e.lastName  = 'Last name is required.';
    if (!signupEmail.trim())            e.email    = 'Email is required.';
    else if (!isValidEmail(signupEmail)) e.email   = 'Enter a valid email address.';
    if (!signupPassword)                e.password = 'Password is required.';
    else if (!isStrongPass(signupPassword)) e.password = 'Password must be at least 8 characters.';
    if (signupConfirm !== signupPassword)   e.confirm  = 'Passwords do not match.';
    return e;
  };

  // ── Submit handlers ──────────────────────────────────────────────────────
const handleLoginSubmit = async (e) => {
  e.preventDefault();
  const errs = validateLogin();
  if (Object.keys(errs).length) { setLoginErrors(errs); return; }

  setLoading(true);
  try {
    const response = await fetch('http://localhost/backstage-api/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    });

    const data = await response.json();

    if (data.success) {
      login(data.user); // Saves user to AuthContext and closes modal
    } else {
      // Displays PHP error message (e.g., "Your account is awaiting admin approval.")
      setLoginErrors({ password: data.message });
    }
  } catch (error) {
    setLoginErrors({ password: 'Unable to connect to server. Check XAMPP.' });
  } finally {
    setLoading(false);
  }
};

const handleSignupSubmit = async (e) => {
  e.preventDefault();
  const errs = validateSignup();
  if (Object.keys(errs).length) { setSignupErrors(errs); return; }

  setLoading(true);
  try {
    const fullName = `${signupFirstName.trim()} ${signupLastName.trim()}`;
    const registrationTiming = new Date().toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    let response;
    const reqBody = JSON.stringify({
      name: fullName,
      email: signupEmail,
      password: signupPassword,
      admin_email: ADMIN_EMAIL,
      registration_timing: registrationTiming,
    });

    try {
      response = await fetch('http://localhost/backstage-api/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: reqBody,
      });
      if (!response.ok && response.status === 404) {
        throw new Error('Fallback to port 8000');
      }
    } catch {
      response = await fetch('http://localhost:8000/backstage-api/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: reqBody,
      });
    }

    const data = await response.json();

    if (data.success) {
      // ─── Dispatch Admin Email Notification with Timing ─────────────────
      try {
        if (GOOGLE_SCRIPT_WEBHOOK_URL && GOOGLE_SCRIPT_WEBHOOK_URL.trim() !== '') {
          await fetch(GOOGLE_SCRIPT_WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: fullName,
              email: signupEmail,
              timing: registrationTiming,
            }),
          });
        }
      } catch (notifyErr) {
        console.warn('Admin notification error:', notifyErr);
      }

      setSuccess(true); // Shows the 🎉 Account Created! banner
    } else {
      setSignupErrors({ email: data.message });
    }
  } catch (error) {
    setSignupErrors({ email: 'Unable to connect to server. Check XAMPP.' });
  } finally {
    setLoading(false);
  }
};


  // ── Close on backdrop click ──────────────────────────────────────────────
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) closeAuthModal();
  };

  

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className="auth-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'login' ? 'Sign in to your account' : 'Create your account'}
    >
      <div className="auth-panel" ref={panelRef}>
        <button className="auth-close" onClick={closeAuthModal} aria-label="Close">✕</button>

        {/* ── Header ── */}
        <div className="auth-header">
          <div className="auth-header-icon">🏡</div>
          <h2 className="auth-header-title">
            {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <p className="auth-header-sub">
            {mode === 'login'
              ? 'Sign in to list and manage your properties.'
              : 'Join BackstageXchange to list your property.'}
          </p>
        </div>

        {/* ── Tab switcher ── */}
        <div className="auth-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={mode === 'login'}
            className={`auth-tab${mode === 'login' ? ' active' : ''}`}
            onClick={() => { setMode('login'); setLoginErrors({}); setSignupErrors({}); }}
          >
            Sign In
          </button>
          <button
            role="tab"
            aria-selected={mode === 'signup'}
            className={`auth-tab${mode === 'signup' ? ' active' : ''}`}
            onClick={() => { setMode('signup'); setLoginErrors({}); setSignupErrors({}); }}
          >
            Sign Up
          </button>
        </div>

        {/* ── Success state ── */}
        {success ? (
          <div className="auth-success">
            <div className="auth-success-icon">🎉</div>
            <h3 className="auth-success-title">Account Created!</h3>
            <p className="auth-success-sub">Welcome to BackstageXchange. Redirecting you now…</p>
          </div>
        ) : mode === 'login' ? (

          /* ════════════════════ LOGIN FORM ════════════════════ */
          <div className="auth-body">
            <form onSubmit={handleLoginSubmit} noValidate>

              <div className="auth-field">
                <label className="auth-label" htmlFor="auth-login-email">Email Address</label>
                <input
                  id="auth-login-email"
                  type="email"
                  className={`auth-input${loginErrors.email ? ' input-error' : ''}`}
                  placeholder="you@example.com"
                  value={loginEmail}
                  onChange={e => { setLoginEmail(e.target.value); setLoginErrors(p => { const x={...p}; delete x.email; return x; }); }}
                  autoComplete="email"
                />
                {loginErrors.email && <span className="auth-field-error">{loginErrors.email}</span>}
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="auth-login-pass">Password</label>
                <input
                  id="auth-login-pass"
                  type="password"
                  className={`auth-input${loginErrors.password ? ' input-error' : ''}`}
                  placeholder="Your password"
                  value={loginPassword}
                  onChange={e => { setLoginPassword(e.target.value); setLoginErrors(p => { const x={...p}; delete x.password; return x; }); }}
                  autoComplete="current-password"
                />
                {loginErrors.password && <span className="auth-field-error">{loginErrors.password}</span>}
                <button type="button" className="auth-forgot">Forgot password?</button>
              </div>

              <button type="submit" className="auth-btn-primary" disabled={loading}>
                {loading && <span className="auth-spinner" />}
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            {/* <div className="auth-divider">or</div>

            <button className="auth-btn-social" onClick={handleGoogleAuth} disabled={loading}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button> */}

            <p className="auth-switch">
              Don't have an account?{' '}
              <button onClick={() => { setMode('signup'); setLoginErrors({}); }}>Sign up free</button>
            </p>
          </div>

        ) : (

          /* ════════════════════ SIGNUP FORM ════════════════════ */
          <div className="auth-body">
            <form onSubmit={handleSignupSubmit} noValidate>

              <div className="auth-name-row">
                <div className="auth-field">
                  <label className="auth-label" htmlFor="auth-signup-fn">First Name</label>
                  <input
                    id="auth-signup-fn"
                    type="text"
                    className={`auth-input${signupErrors.firstName ? ' input-error' : ''}`}
                    placeholder="Jane"
                    value={signupFirstName}
                    onChange={e => { setSignupFirstName(e.target.value); setSignupErrors(p => { const x={...p}; delete x.firstName; return x; }); }}
                    autoComplete="given-name"
                  />
                  {signupErrors.firstName && <span className="auth-field-error">{signupErrors.firstName}</span>}
                </div>
                <div className="auth-field">
                  <label className="auth-label" htmlFor="auth-signup-ln">Last Name</label>
                  <input
                    id="auth-signup-ln"
                    type="text"
                    className={`auth-input${signupErrors.lastName ? ' input-error' : ''}`}
                    placeholder="Smith"
                    value={signupLastName}
                    onChange={e => { setSignupLastName(e.target.value); setSignupErrors(p => { const x={...p}; delete x.lastName; return x; }); }}
                    autoComplete="family-name"
                  />
                  {signupErrors.lastName && <span className="auth-field-error">{signupErrors.lastName}</span>}
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="auth-signup-email">Email Address</label>
                <input
                  id="auth-signup-email"
                  type="email"
                  className={`auth-input${signupErrors.email ? ' input-error' : ''}`}
                  placeholder="you@example.com"
                  value={signupEmail}
                  onChange={e => { setSignupEmail(e.target.value); setSignupErrors(p => { const x={...p}; delete x.email; return x; }); }}
                  autoComplete="email"
                />
                {signupErrors.email && <span className="auth-field-error">{signupErrors.email}</span>}
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="auth-signup-pass">Password</label>
                <input
                  id="auth-signup-pass"
                  type="password"
                  className={`auth-input${signupErrors.password ? ' input-error' : ''}`}
                  placeholder="Min. 8 characters"
                  value={signupPassword}
                  onChange={e => { setSignupPassword(e.target.value); setSignupErrors(p => { const x={...p}; delete x.password; return x; }); }}
                  autoComplete="new-password"
                />
                {signupErrors.password && <span className="auth-field-error">{signupErrors.password}</span>}
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="auth-signup-confirm">Confirm Password</label>
                <input
                  id="auth-signup-confirm"
                  type="password"
                  className={`auth-input${signupErrors.confirm ? ' input-error' : ''}`}
                  placeholder="Repeat password"
                  value={signupConfirm}
                  onChange={e => { setSignupConfirm(e.target.value); setSignupErrors(p => { const x={...p}; delete x.confirm; return x; }); }}
                  autoComplete="new-password"
                />
                {signupErrors.confirm && <span className="auth-field-error">{signupErrors.confirm}</span>}
              </div>

              <button type="submit" className="auth-btn-primary" disabled={loading}>
                {loading && <span className="auth-spinner" />}
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>

            {/* <div className="auth-divider">or</div>

            <button className="auth-btn-social" onClick={handleGoogleAuth} disabled={loading}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button> */}

            <p className="auth-switch">
              Already have an account?{' '}
              <button onClick={() => { setMode('login'); setSignupErrors({}); }}>Sign in</button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;