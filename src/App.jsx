import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Landing from './pages/Landing.jsx';
import EligibilityForm from './pages/EligibilityForm.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Chatbot from './pages/Chatbot.jsx';
import SchemeDetails from './pages/SchemeDetails.jsx';
import { defaultProfile } from './data/schemes.js';
import { LanguageProvider } from './i18n/LanguageContext.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { getUserProfile, saveUserProfile } from './services/firestore.js';

const STORAGE_KEY = 'schemewise-profile';

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('schemewise-theme') === 'dark');
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('schemewise-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    let cancelled = false;

    async function loadFirebaseProfile() {
      if (!user?.uid) return;

      try {
        const firebaseProfile = await getUserProfile(user.uid);
        if (!cancelled && firebaseProfile) {
          setProfile(firebaseProfile);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(firebaseProfile));
        }
      } catch (error) {
        console.warn('Unable to load Firebase profile:', error);
      }
    }

    loadFirebaseProfile();

    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  const updateProfile = async (nextProfile) => {
    setProfile(nextProfile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProfile));
    if (user?.uid) {
      await saveUserProfile(user.uid, nextProfile);
    }
  };

  return (
    <div className="page-shell">
      <Navbar darkMode={darkMode} onToggleTheme={() => setDarkMode((value) => !value)} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/eligibility" element={<EligibilityForm profile={profile} onSave={updateProfile} />} />
        <Route path="/dashboard" element={<Dashboard profile={profile} />} />
        <Route path="/chatbot" element={<Chatbot profile={profile} />} />
        <Route path="/scheme/:schemeId" element={<SchemeDetails profile={profile} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
