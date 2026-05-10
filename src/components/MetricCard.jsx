export default function MetricCard({ label, value, detail, tone = 'blue' }) {
  const tones = {
    blue: 'bg-civic-50 text-civic-700 dark:bg-civic-500/15 dark:text-civic-100',
    green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-100'
  };

  return (
    <div className="glass-panel rounded-lg p-5">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-3xl font-bold tracking-tight">{value}</p>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>{detail}</span>
      </div>
    </div>
  );
}
