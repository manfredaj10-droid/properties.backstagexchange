// ─── AuthContext.jsx ──────────────────────────────────────────────────────────
//
//  Provides:
//    • currentUser      — null | { name, email }
//    • authModalOpen    — boolean
//    • pendingNav       — string | null  (tab to navigate to after login)
//    • login(user)      — sets currentUser, clears modal + pendingNav
//    • logout()         — clears currentUser
//    • openAuthModal(intendedTab?) — opens modal, optionally stores pendingNav
//    • closeAuthModal() — closes modal without logging in
//
// ─────────────────────────────────────────────────────────────────────────────
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser,    setCurrentUser]    = useState(null);
  const [authModalOpen,  setAuthModalOpen]  = useState(false);
  const [pendingNav,     setPendingNav]     = useState(null);

  // Called after successful login or signup
  const login = (user) => {
    setCurrentUser(user);
    setAuthModalOpen(false);
    setPendingNav(null);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Open the auth modal; optionally remember where the user was trying to go
  const openAuthModal = (intendedTab = null) => {
    setPendingNav(intendedTab);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setPendingNav(null);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      authModalOpen,
      pendingNav,
      login,
      logout,
      openAuthModal,
      closeAuthModal,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

export default AuthContext;