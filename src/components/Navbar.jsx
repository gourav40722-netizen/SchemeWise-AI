import { Link, NavLink } from 'react-router-dom';
import { Bot, Building2, Languages, LogIn, LogOut, Menu, Moon, Sun, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar({ darkMode, onToggleTheme }) {
  const [open, setOpen] = useState(false);
  const { t, languages, language, setLanguage } = useLanguage();
  const { user, isGuest, isFirebaseConfigured, signInWithGoogle, signOutUser } = useAuth();
  const navItems = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.eligibility'), to: '/eligibility' },
    { label: t('nav.dashboard'), to: '/dashboard' },
    { label: t('nav.assistant'), to: '/chatbot' }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/75 shadow-sm shadow-slate-900/5 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-civic-600 via-civic-500 to-emerald-500 text-white shadow-glow ring-1 ring-white/50">
              <Building2 size={21} />
            </span>
            <span>
              <span className="block text-base font-bold tracking-tight">SchemeWise AI</span>
            <span className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">{t('nav.tagline')}</span>
            </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-civic-700 shadow-sm ring-1 ring-civic-100 dark:bg-white/10 dark:text-civic-100 dark:ring-white/10'
                    : 'text-slate-600 hover:bg-white/70 hover:text-slate-950 hover:shadow-sm dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isFirebaseConfigured && (
            <div className="hidden items-center gap-2 lg:flex">
              <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200/80 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-100">
                <UserRound size={16} />
                {isGuest ? t('auth.guest') : user?.displayName || user?.email || t('auth.signedIn')}
              </span>
              {isGuest ? (
                <button
                  type="button"
                  onClick={signInWithGoogle}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-civic-600 to-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-glow"
                >
                  <LogIn size={16} />
                  {t('auth.google')}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={signOutUser}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200/80 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-100"
                >
                  <LogOut size={16} />
                  {t('auth.signOut')}
                </button>
              )}
            </div>
          )}
          <Link to="/chatbot" className="hidden rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-glow dark:bg-white dark:text-slate-950 sm:inline-flex">
            <Bot className="mr-2" size={16} />
            {t('nav.askAi')}
          </Link>
          <label className="hidden items-center gap-2 rounded-lg border border-slate-200/80 bg-white/80 px-2.5 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-100 sm:inline-flex">
            <Languages size={16} />
            <span className="sr-only">{t('nav.language')}</span>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="bg-transparent text-sm font-semibold outline-none"
              aria-label={t('nav.language')}
            >
              {languages.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            aria-label="Toggle dark mode"
            onClick={onToggleTheme}
            className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200/80 bg-white/80 text-slate-700 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-civic-200 hover:text-civic-700 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-100"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setOpen((value) => !value)}
            className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200/80 bg-white/80 text-slate-700 shadow-sm dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-100 md:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/60 bg-white/95 px-4 py-3 shadow-xl shadow-slate-900/10 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/95 md:hidden">
          <div className="grid gap-1">
            {isFirebaseConfigured && (
              <div className="mb-2 grid gap-2 rounded-lg border border-slate-200 p-3 dark:border-white/10">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-100">
                  <UserRound size={16} />
                  {isGuest ? t('auth.guestSession') : user?.displayName || user?.email || t('auth.signedIn')}
                </span>
                {isGuest ? (
                  <button type="button" onClick={signInWithGoogle} className="primary-button">
                    <LogIn size={16} />
                    {t('auth.signInGoogle')}
                  </button>
                ) : (
                  <button type="button" onClick={signOutUser} className="secondary-button">
                    <LogOut size={16} />
                    {t('auth.signOut')}
                  </button>
                )}
              </div>
            )}
            <label className="mb-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100">
              <Languages size={16} />
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="w-full bg-transparent outline-none"
                aria-label={t('nav.language')}
              >
                {languages.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive ? 'bg-civic-50 text-civic-700 dark:bg-civic-500/15 dark:text-civic-100' : 'text-slate-600 dark:text-slate-300'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
