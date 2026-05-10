import { ArrowRight, BadgeCheck, CalendarDays, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SchemeCard({ scheme }) {
  return (
    <article className="group glass-panel rounded-lg p-5 transition duration-300 hover:-translate-y-1 hover:border-civic-200 hover:shadow-glow dark:hover:border-civic-500/40">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-civic-50 px-2.5 py-1 text-xs font-semibold text-civic-700 dark:bg-civic-500/15 dark:text-civic-100">
            <Landmark size={13} />
            {scheme.category}
          </div>
          <h3 className="mt-4 text-lg font-bold tracking-tight text-slate-950 dark:text-white">{scheme.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{scheme.benefit}</p>
        </div>
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">
          <span className="text-sm font-bold">{scheme.score}%</span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {scheme.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600 dark:border-white/10 dark:text-slate-300">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 grid gap-3 border-t border-slate-200 pt-4 text-sm dark:border-white/10 sm:grid-cols-2">
        <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <CalendarDays size={16} />
          {scheme.deadline}
        </span>
        <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <BadgeCheck size={16} />
          {scheme.reasons[0] || 'Profile match'}
        </span>
      </div>

      <Link to={`/scheme/${scheme.id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-civic-700 transition group-hover:gap-3 dark:text-civic-100">
        View details
        <ArrowRight size={16} />
      </Link>
    </article>
  );
}
