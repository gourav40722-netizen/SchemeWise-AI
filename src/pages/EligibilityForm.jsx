import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, Save } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const states = ['Karnataka', 'Delhi', 'Madhya Pradesh', 'Maharashtra', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal', 'Rajasthan'];
const occupations = ['Student', 'Farmer', 'Entrepreneur', 'Self-employed', 'Salaried', 'Unemployed', 'Worker'];
const genders = ['Female', 'Male', 'Other'];
const educationLevels = ['Any', 'High School', 'Undergraduate', 'Postgraduate'];

export default function EligibilityForm({ profile, onSave }) {
  const { t } = useLanguage();
  const [form, setForm] = useState(profile);
  const navigate = useNavigate();

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    await onSave({ ...form, age: Number(form.age), income: Number(form.income) });
    navigate('/dashboard');
  };

  return (
    <main className="ambient-section px-4 py-10 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-5xl">
      <div className="mb-8">
        <div className="soft-badge">
          <ClipboardCheck size={16} />
          {t('eligibility.badge')}
        </div>
        <h1 className="gradient-text mt-4 text-3xl font-black leading-tight sm:text-4xl">{t('eligibility.title')}</h1>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">{t('eligibility.subtitle')}</p>
      </div>

      <form onSubmit={submit} className="premium-card rounded-lg p-5 sm:p-7">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="label">{t('eligibility.age')}</span>
            <input className="input-field" type="number" min="0" value={form.age} onChange={(event) => update('age', event.target.value)} />
          </label>
          <label className="grid gap-2">
            <span className="label">{t('eligibility.income')}</span>
            <input className="input-field" type="number" min="0" value={form.income} onChange={(event) => update('income', event.target.value)} />
          </label>
          <label className="grid gap-2">
            <span className="label">{t('eligibility.state')}</span>
            <select className="input-field" value={form.state} onChange={(event) => update('state', event.target.value)}>
              {states.map((state) => (
                <option key={state}>{state}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="label">{t('eligibility.occupation')}</span>
            <select className="input-field" value={form.occupation} onChange={(event) => update('occupation', event.target.value)}>
              {occupations.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="label">{t('eligibility.gender')}</span>
            <select className="input-field" value={form.gender} onChange={(event) => update('gender', event.target.value)}>
              {genders.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="label">{t('eligibility.education')}</span>
            <select className="input-field" value={form.education} onChange={(event) => update('education', event.target.value)}>
              {educationLevels.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-200/80 pt-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('eligibility.note')}</p>
          <button className="primary-button" type="submit">
            <Save size={17} />
            {t('eligibility.generate')}
          </button>
        </div>
      </form>
      </div>
    </main>
  );
}
