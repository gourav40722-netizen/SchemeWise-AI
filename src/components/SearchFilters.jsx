import { Filter, Search } from 'lucide-react';

const categories = ['All', 'Education', 'Agriculture', 'Entrepreneurship', 'Housing', 'Employment', 'Women & Child'];

export default function SearchFilters({ query, category, onQueryChange, onCategoryChange }) {
  return (
    <div className="glass-panel rounded-lg p-4">
      <div className="grid gap-3 lg:grid-cols-[1fr_240px]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            className="input-field pl-10"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search schemes, benefits, ministries"
          />
        </label>
        <label className="relative">
          <Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select className="input-field pl-10" value={category} onChange={(event) => onCategoryChange(event.target.value)}>
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
