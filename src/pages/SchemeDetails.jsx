import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, ExternalLink, FileText, Landmark, MapPin } from 'lucide-react';
import { scoreScheme, schemes } from '../data/schemes.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function SchemeDetails({ profile }) {
  const { t } = useLanguage();
  const { schemeId } = useParams();
  const scheme = schemes.find((item) => item.id === schemeId);

  if (!scheme) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold">{t('details.notFound')}</h1>
        <Link className="mt-4 inline-flex text-civic-700 dark:text-civic-100" to="/dashboard">
          {t('details.back')}
        </Link>
      </main>
    );
  }

  const scored = scoreScheme(scheme, profile);

  return (
    <main className="ambient-section px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-6xl">
      <Link to="/dashboard" className="mb-5 inline-flex items-center gap-2 rounded-lg border border-civic-100 bg-white/70 px-3 py-2 text-sm font-semibold text-civic-700 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-civic-100">
        <ArrowLeft size={16} />
        {t('details.back')}
      </Link>

      <section className="premium-card overflow-hidden rounded-lg">
        <div className="relative overflow-hidden bg-slate-950 p-6 text-white sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_6%,rgba(21,112,239,0.42),transparent_32%),radial-gradient(circle_at_90%_12%,rgba(16,185,129,0.24),transparent_28%)]" />
          <div className="relative">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-semibold text-civic-50 backdrop-blur-xl">
                <Landmark size={15} />
                {scheme.ministry}
              </div>
              <h1 className="mt-5 text-3xl font-black leading-tight sm:text-5xl">{scheme.title}</h1>
              <p className="mt-4 max-w-3xl text-slate-300">{scheme.description}</p>
            </div>
            <div className="rounded-lg bg-white/95 p-5 text-slate-950 shadow-xl shadow-civic-950/20">
              <p className="text-sm font-semibold text-slate-500">{t('dashboard.eligibilityScore')}</p>
              <p className="mt-2 text-4xl font-black">{scored.score}%</p>
              <p className="mt-1 text-sm text-slate-600">{t('details.basedProfile')}</p>
            </div>
          </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <h2 className="text-xl font-bold">{t('details.benefitSummary')}</h2>
            <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{scheme.benefit}</p>

            <h2 className="mt-8 text-xl font-bold">{t('details.whyMatches')}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {scored.reasons.map((reason) => (
                <div key={reason} className="flex items-center gap-3 rounded-lg border border-slate-200/80 bg-white/70 p-3 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
                  <BadgeCheck className="shrink-0 text-emerald-600" size={18} />
                  <span className="text-sm text-slate-700 dark:text-slate-200">{reason}</span>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-lg border border-slate-200/80 bg-white/60 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <h2 className="text-xl font-bold">{t('details.checklist')}</h2>
            <div className="mt-4 space-y-3">
              {scheme.documents.map((document) => (
                <div key={document} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                  <FileText size={17} className="text-civic-600 dark:text-civic-100" />
                  {document}
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-3 border-t border-slate-200 pt-5 text-sm dark:border-white/10">
              <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <MapPin size={17} />
                {scheme.states.includes('All India') ? 'All India' : scheme.states.join(', ')}
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-100">{t('dashboard.deadline')}: {scheme.deadline}</span>
            </div>
            <a href={scheme.applyUrl} target="_blank" rel="noreferrer" className="primary-button mt-6 w-full">
              {t('details.official')}
              <ExternalLink size={17} />
            </a>
          </aside>
        </div>
      </section>
      </div>
    </main>
  );
}
