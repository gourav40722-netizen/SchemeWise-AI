import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInAnonymously, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../firebase/firebase.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(!isFirebaseConfigured);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (!auth) return undefined;

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      if (nextUser) {
        setUser(nextUser);
        setAuthReady(true);
        return;
      }

      try {
        const credential = await signInAnonymously(auth);
        setUser(credential.user);
      } catch (error) {
        setAuthError(error.message || 'Firebase sign-in failed.');
      } finally {
        setAuthReady(true);
      }
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) {
      setAuthError('Firebase is not configured. Add Firebase env variables and restart the dev server.');
      return;
    }

    setAuthError('');
    await signInWithPopup(auth, googleProvider);
  };

  const signOutUser = async () => {
    if (!auth) return;
    await signOut(auth);
  };

  const value = useMemo(
    () => ({
      user,
      authReady,
      authError,
      isFirebaseConfigured,
      isGuest: Boolean(user?.isAnonymous),
      signInWithGoogle,
      signOutUser
    }),
    [user, authReady, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
