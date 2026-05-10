import { ArrowRight, BrainCircuit, CheckCircle2, FileSearch, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function Landing() {
  const { t } = useLanguage();
  const features = [
    { icon: BrainCircuit, title: t('landing.featureAi'), text: t('landing.featureAiText') },
    { icon: FileSearch, title: t('landing.featureSearch'), text: t('landing.featureSearchText') },
    { icon: ShieldCheck, title: t('landing.featureCitizen'), text: t('landing.featureCitizenText') }
  ];
  const heroPoints = [t('landing.pointScore'), t('landing.pointState'), t('landing.pointAssistant')];

  return (
    <main>
      <section className="ambient-section">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(21,112,239,0.20),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(16,185,129,0.14),transparent_28%),linear-gradient(135deg,#f8fafc_0%,#eef8ff_45%,#f8fffb_100%)] dark:bg-[radial-gradient(circle_at_15%_20%,rgba(21,112,239,0.30),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(16,185,129,0.16),transparent_28%),linear-gradient(135deg,#020617_0%,#0f172a_55%,#102a56_100%)]" />
        <div className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
          <div className="stagger-in max-w-3xl">
            <div className="soft-badge">
              <Sparkles size={15} />
              {t('landing.badge')}
            </div>
            <h1 className="gradient-text mt-6 text-4xl font-black leading-[1.02] sm:text-5xl lg:text-6xl">
              {t('landing.title')}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              {t('landing.subtitle')}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/eligibility" className="primary-button">
                {t('landing.check')}
                <ArrowRight size={18} />
              </Link>
              <Link to="/dashboard" className="secondary-button">
                {t('landing.viewDashboard')}
              </Link>
            </div>
            <div className="mt-8 grid gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-3">
              {heroPoints.map((item) => (
                <span key={item} className="flex items-center gap-2 rounded-lg border border-white/70 bg-white/60 px-3 py-2 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
                  <CheckCircle2 className="text-emerald-600" size={17} />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="premium-card stagger-in rounded-lg p-3 shadow-glow [animation-delay:120ms]">
            <div className="relative overflow-hidden rounded-lg bg-slate-950 p-5 text-white">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(21,112,239,0.34),transparent_32%),radial-gradient(circle_at_86%_10%,rgba(16,185,129,0.26),transparent_28%)]" />
              <div className="relative">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm text-civic-100">{t('landing.profile')}</p>
                  <p className="text-xl font-bold">{t('landing.snapshot')}</p>
                </div>
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm font-semibold text-emerald-200">{t('landing.live')}</span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  ['Age', '24 years'],
                  ['Income', 'Rs. 1.8L'],
                  ['State', 'Karnataka'],
                  ['Occupation', 'Student']
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-white/10 bg-white/10 p-4 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/15">
                    <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
                    <p className="mt-2 text-lg font-bold">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-lg bg-white/95 p-4 text-slate-950 shadow-xl shadow-civic-950/20">
                <div className="flex items-center justify-between">
                  <p className="font-bold">{t('landing.top')}</p>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">92%</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">National Scholarship Portal Merit Aid</p>
                <div className="mt-4 h-2 rounded-full bg-slate-100">
                  <div className="h-2 w-[92%] rounded-full bg-gradient-to-r from-civic-600 to-emerald-500" />
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="premium-card rounded-lg p-6">
                <div className="stat-icon bg-gradient-to-br from-civic-50 to-emerald-50 text-civic-700 dark:from-civic-500/15 dark:to-emerald-400/10 dark:text-civic-100">
                  <Icon size={21} />
                </div>
                <h2 className="mt-5 text-lg font-bold">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{feature.text}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
