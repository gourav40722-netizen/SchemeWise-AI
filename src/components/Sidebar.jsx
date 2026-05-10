import { Bot, ClipboardList, Home, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function Sidebar() {
  const { t } = useLanguage();
  const items = [
    { label: t('sidebar.overview'), to: '/dashboard', icon: LayoutDashboard },
    { label: t('nav.eligibility'), to: '/eligibility', icon: ClipboardList },
    { label: t('nav.assistant'), to: '/chatbot', icon: Bot },
    { label: t('sidebar.verified'), to: '/', icon: ShieldCheck }
  ];

  return (
    <aside className="hidden w-64 shrink-0 border-r border-white/60 bg-white/40 p-4 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/40 lg:block">
      <div className="mb-5 rounded-lg bg-gradient-to-br from-civic-600 to-emerald-600 p-4 text-white shadow-glow">
        <Home size={20} />
        <p className="mt-3 text-sm font-semibold">{t('sidebar.title')}</p>
        <p className="mt-1 text-xs text-civic-50">{t('sidebar.subtitle')}</p>
      </div>
      <nav className="grid gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-civic-700 shadow-sm ring-1 ring-civic-100 dark:bg-white/10 dark:text-civic-100 dark:ring-white/10'
                    : 'text-slate-600 hover:-translate-y-0.5 hover:bg-white/70 hover:shadow-sm dark:text-slate-300 dark:hover:bg-white/10'
                }`
              }
            >
              <Icon size={17} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
