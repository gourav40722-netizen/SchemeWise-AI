import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  Bookmark,
  BookmarkCheck,
  BriefcaseBusiness,
  ClipboardList,
  Clock3,
  FileCheck2,
  Filter,
  Landmark,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UsersRound
} from 'lucide-react';
import Sidebar from '../components/Sidebar.jsx';
import { getRecommendedSchemes } from '../data/schemes.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { saveBookmarkedSchemes, subscribeBookmarkedSchemes } from '../services/firestore.js';

const categories = ['All', 'Education', 'Agriculture', 'Entrepreneurship', 'Housing', 'Employment', 'Women & Child'];

export default function Dashboard({ profile }) {
  const { t, categoryLabel } = useLanguage();
  const { user, isFirebaseConfigured } = useAuth();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [recentSearches, setRecentSearches] = useState(['student scholarship', 'housing subsidy', 'skill training']);
  const [savedSchemeIds, setSavedSchemeIds] = useState(() => {
    const saved = localStorage.getItem('schemewise-saved');
    return saved ? JSON.parse(saved) : ['nsp-merit', 'skill-india'];
  });

  const recommendations = useMemo(() => getRecommendedSchemes(profile), [profile]);
  const topScore = recommendations[0]?.score ?? 0;
  const savedSchemes = recommendations.filter((scheme) => savedSchemeIds.includes(scheme.id));
  const averageScore = recommendations.length
    ? Math.round(recommendations.reduce((total, scheme) => total + scheme.score, 0) / recommendations.length)
    : 0;

  const filtered = recommendations.filter((scheme) => {
    const searchableText = `${scheme.title} ${scheme.ministry} ${scheme.benefit} ${scheme.tags.join(' ')}`.toLowerCase();
    const matchesQuery = searchableText.includes(query.toLowerCase());
    const matchesCategory = category === 'All' || scheme.category === category;
    return matchesQuery && matchesCategory;
  });

  useEffect(() => {
    if (!isFirebaseConfigured || !user?.uid) return undefined;

    return subscribeBookmarkedSchemes(user.uid, (firebaseBookmarks) => {
      if (firebaseBookmarks.length > 0) {
        setSavedSchemeIds(firebaseBookmarks);
        localStorage.setItem('schemewise-saved', JSON.stringify(firebaseBookmarks));
      }
    });
  }, [isFirebaseConfigured, user?.uid]);

  const toggleSaved = (schemeId) => {
    setSavedSchemeIds((current) => {
      const next = current.includes(schemeId) ? current.filter((id) => id !== schemeId) : [...current, schemeId];
      localStorage.setItem('schemewise-saved', JSON.stringify(next));
      if (user?.uid) {
        saveBookmarkedSchemes(user.uid, next).catch((error) => {
          console.warn('Unable to save bookmarked schemes:', error);
        });
      }
      return next;
    });
  };

  const submitSearch = (event) => {
    event.preventDefault();
    const cleanQuery = query.trim();
    if (!cleanQuery) return;
    setRecentSearches((current) => [cleanQuery, ...current.filter((item) => item.toLowerCase() !== cleanQuery.toLowerCase())].slice(0, 5));
  };

  return (
    <main className="ambient-section flex min-h-[calc(100vh-72px)]">
      <Sidebar />
      <section className="relative min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <header className="relative overflow-hidden rounded-lg bg-slate-950 p-5 text-white shadow-glow ring-1 ring-white/10 sm:p-7">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(21,112,239,0.48),transparent_30%),radial-gradient(circle_at_88%_0%,rgba(16,185,129,0.30),transparent_26%),linear-gradient(135deg,rgba(15,23,42,0.2),rgba(16,42,86,0.66))]" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-civic-300/70 to-transparent" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-semibold text-civic-50 shadow-sm backdrop-blur-xl">
                  <Sparkles size={15} />
                  {t('dashboard.badge')}
                </div>
                <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">{t('dashboard.title')}</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                  {t('dashboard.subtitlePrefix')} {profile.occupation.toLowerCase()} {t('dashboard.subtitleMiddle')} {profile.state}, {t('dashboard.subtitleSuffix')}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="/eligibility" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
                  <ClipboardList size={17} />
                  {t('dashboard.updateProfile')}
                </Link>
                <Link to="/chatbot" className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-civic-600 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-glow">
                  <Bot size={17} />
                  {t('dashboard.askAssistant')}
                </Link>
              </div>
            </div>
          </header>

          <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <QuickStat icon={Landmark} label={t('dashboard.recommended')} value={recommendations.length} detail={t('dashboard.schemesMatched')} tone="blue" />
            <QuickStat icon={ShieldCheck} label={t('dashboard.eligibilityScore')} value={`${topScore}%`} detail={t('dashboard.bestFit')} tone="green" />
            <QuickStat icon={BookmarkCheck} label={t('dashboard.savedSchemes')} value={savedSchemeIds.length} detail={t('dashboard.shortlisted')} tone="amber" />
            <QuickStat icon={FileCheck2} label={t('dashboard.averageFit')} value={`${averageScore}%`} detail={t('dashboard.acrossMatches')} tone="violet" />
          </section>

          <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-5">
              <div className="premium-card rounded-lg p-4 sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <form onSubmit={submitSearch} className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      className="input-field pl-10"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder={t('dashboard.searchPlaceholder')}
                    />
                  </form>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:max-w-[540px]">
                    <Filter className="hidden shrink-0 text-slate-400 sm:block" size={18} />
                    {categories.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setCategory(item)}
                        className={`shrink-0 rounded-full px-3 py-2 text-xs font-semibold transition ${
                          category === item
                            ? 'bg-gradient-to-r from-civic-600 to-emerald-600 text-white shadow-sm'
                            : 'border border-slate-200/80 bg-white/80 text-slate-600 shadow-sm backdrop-blur-xl hover:-translate-y-0.5 hover:border-civic-200 hover:text-civic-700 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-300'
                        }`}
                      >
                        {categoryLabel(item)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
                <EligibilityPanel profile={profile} topScore={topScore} />

                <section className="premium-card rounded-lg p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-civic-700 dark:text-civic-100">{t('dashboard.recommended')}</p>
                      <h2 className="mt-1 text-2xl font-black tracking-tight">{t('dashboard.bestMatches')}</h2>
                    </div>
                    <span className="rounded-full border border-civic-100 bg-civic-50 px-3 py-1 text-xs font-bold text-civic-700 dark:border-civic-400/20 dark:bg-civic-500/15 dark:text-civic-100">
                      {filtered.length} {t('dashboard.shown')}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4">
                    {filtered.map((scheme) => (
                      <RecommendedSchemeCard
                        key={scheme.id}
                        scheme={scheme}
                        isSaved={savedSchemeIds.includes(scheme.id)}
                        onToggleSaved={() => toggleSaved(scheme.id)}
                      />
                    ))}
                  </div>

                  {filtered.length === 0 && (
                    <div className="rounded-lg border border-dashed border-slate-300/80 bg-white/50 p-8 text-center dark:border-white/10 dark:bg-white/5">
                      <TrendingUp className="mx-auto text-slate-400" size={34} />
                      <h3 className="mt-4 text-lg font-bold">{t('dashboard.noSchemes')}</h3>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t('dashboard.noSchemesText')}</p>
                    </div>
                  )}
                </section>
              </div>
            </div>

            <aside className="space-y-5">
              <Panel title={t('dashboard.savedSchemes')} count={savedSchemes.length}>
                <div className="space-y-3">
                  {savedSchemes.length > 0 ? (
                    savedSchemes.map((scheme) => (
                      <Link
                        key={scheme.id}
                        to={`/scheme/${scheme.id}`}
                        className="block rounded-lg border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-civic-200 hover:shadow-glow dark:border-white/10 dark:bg-slate-900/80"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-bold text-slate-950 dark:text-white">{scheme.title}</p>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{categoryLabel(scheme.category)}</p>
                          </div>
                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">
                            {scheme.score}%
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <EmptyState text={t('dashboard.emptySaved')} />
                  )}
                </div>
              </Panel>

              <Panel title={t('dashboard.recentSearches')} count={recentSearches.length}>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search) => (
                    <button
                      key={search}
                      type="button"
                      onClick={() => setQuery(search)}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-civic-200 hover:text-civic-700 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-300"
                    >
                      <Clock3 size={13} />
                      {search}
                    </button>
                  ))}
                </div>
              </Panel>

              <Panel title={t('dashboard.profileSignals')}>
                <div className="grid gap-3">
                  <Signal icon={UsersRound} label={t('dashboard.applicant')} value={`${profile.gender}, ${profile.age} ${t('dashboard.years')}`} />
                  <Signal icon={BriefcaseBusiness} label={t('eligibility.occupation')} value={profile.occupation} />
                  <Signal icon={Landmark} label={t('eligibility.state')} value={profile.state} />
                  <Signal icon={BadgeCheck} label={t('eligibility.education')} value={profile.education} />
                </div>
              </Panel>
            </aside>
          </section>
        </div>
      </section>
    </main>
  );
}

function QuickStat({ icon: Icon, label, value, detail, tone }) {
  const tones = {
    blue: 'bg-civic-50 text-civic-700 dark:bg-civic-500/15 dark:text-civic-100',
    green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-100',
    violet: 'bg-violet-50 text-violet-700 dark:bg-violet-400/10 dark:text-violet-100'
  };

  return (
    <div className="premium-card rounded-lg p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-black tracking-tight">{value}</p>
        </div>
        <div className={`stat-icon ${tones[tone]}`}>
          <Icon size={21} />
        </div>
      </div>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">{detail}</p>
    </div>
  );
}

function EligibilityPanel({ profile, topScore }) {
  const { t } = useLanguage();

  return (
    <section className="premium-card rounded-lg p-5">
      <p className="text-sm font-semibold uppercase tracking-wide text-civic-700 dark:text-civic-100">{t('dashboard.eligibilityScore')}</p>
      <div className="mt-4 flex items-center gap-5">
        <div className="relative grid h-28 w-28 shrink-0 place-items-center rounded-full bg-slate-100 dark:bg-slate-900">
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: `conic-gradient(#10b981 ${topScore * 3.6}deg, rgba(148, 163, 184, 0.18) 0deg)` }}
          />
          <div className="relative grid h-20 w-20 place-items-center rounded-full bg-white dark:bg-slate-950">
            <span className="text-2xl font-black">{topScore}%</span>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-black tracking-tight">{t('dashboard.strongMatch')}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {t('dashboard.scoreText')}
          </p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 text-sm">
        <Signal icon={BadgeCheck} label={t('dashboard.income')} value={`Rs. ${Number(profile.income).toLocaleString('en-IN')}`} />
        <Signal icon={UsersRound} label={t('dashboard.profile')} value={`${profile.occupation} · ${profile.education}`} />
      </div>
    </section>
  );
}

function RecommendedSchemeCard({ scheme, isSaved, onToggleSaved }) {
  const { t, categoryLabel } = useLanguage();

  return (
    <article className="rounded-lg border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-civic-200 hover:shadow-glow dark:border-white/10 dark:bg-slate-900/80">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-civic-50 px-2.5 py-1 text-xs font-bold text-civic-700 dark:bg-civic-500/15 dark:text-civic-100">
              {categoryLabel(scheme.category)}
            </span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">
              {scheme.score}% {t('dashboard.match')}
            </span>
          </div>
          <h3 className="mt-3 text-lg font-black tracking-tight text-slate-950 dark:text-white">{scheme.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{scheme.benefit}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {scheme.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleSaved}
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border shadow-sm transition-all duration-200 hover:-translate-y-0.5 ${
            isSaved
              ? 'border-civic-200 bg-civic-50 text-civic-700 dark:border-civic-400/20 dark:bg-civic-500/15 dark:text-civic-100'
              : 'border-slate-200 bg-white text-slate-500 hover:border-civic-200 hover:text-civic-700 dark:border-white/10 dark:bg-slate-950 dark:text-slate-300'
          }`}
          aria-label={isSaved ? 'Remove saved scheme' : 'Save scheme'}
        >
          {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{t('dashboard.deadline')}: {scheme.deadline}</p>
        <Link to={`/scheme/${scheme.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-civic-700 dark:text-civic-100">
          {t('dashboard.viewDetails')}
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}

function Panel({ title, count, children }) {
  return (
    <section className="premium-card rounded-lg p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-black tracking-tight">{title}</h2>
        {typeof count === 'number' && (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">{count}</span>
        )}
      </div>
      {children}
    </section>
  );
}

function Signal({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200/80 bg-white/80 p-3 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-civic-50 to-emerald-50 text-civic-700 dark:from-civic-500/15 dark:to-emerald-400/10 dark:text-civic-100">
        <Icon size={17} />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">{value}</p>
      </div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300/80 bg-white/50 p-5 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
      {text}
    </div>
  );
}
