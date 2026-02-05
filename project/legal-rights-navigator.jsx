import React, { useMemo, useState } from 'react';
import { AlertCircle, BarChart3, Heart, Loader2, Scale, TrendingUp } from 'lucide-react';

/**
 * Cleaned, syntax-safe version of the component snippet shared by the user.
 * Note: This file assumes a React + Tailwind + lucide-react toolchain.
 */
const LegalRightsNavigator = () => {
  const [activeTab, setActiveTab] = useState('story');
  const [yourStory, setYourStory] = useState('');
  const [legalTranslation, setLegalTranslation] = useState('');
  const [plainExplanation, setPlainExplanation] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [storyJurisdiction, setStoryJurisdiction] = useState('Federal Law');
  const [jurisdiction, setJurisdiction] = useState('Federal Law');
  const [legalArea, setLegalArea] = useState('Domestic Violence (DV)');
  const [isProcessingStory, setIsProcessingStory] = useState(false);
  const [error, setError] = useState('');
  const [showStats, setShowStats] = useState(true);

  const jurisdictions = ['Federal Law', 'New York State', 'Connecticut State', 'NYC Local Laws', 'Multi-Jurisdiction'];
  const languages = ['English', 'Spanish (Español)', 'Chinese (中文)', 'Russian (Русский)', 'Arabic (العربية)', 'French (Français)'];
  const legalAreas = [
    'Domestic Violence (DV)',
    'VAWA (Violence Against Women Act)',
    'Wage Theft & Labor Rights',
    'Housing & Tenant Rights',
    'COVID-19 Protections & Relief',
  ];

  const statsDatabase = {
    'Domestic Violence (DV)': {
      federalSuccessRate: 68,
      nySuccessRate: 72,
      ctSuccessRate: 65,
      avgCaseDuration: '4-6 months',
      recentCases: 24567,
      jurisdictionStrength: {
        'Federal Law': 7.5,
        'New York State': 8.2,
        'Connecticut State': 7.8,
        'NYC Local Laws': 8.5,
      },
    },
    'VAWA (Violence Against Women Act)': {
      federalSuccessRate: 71,
      nySuccessRate: 75,
      ctSuccessRate: 69,
      avgCaseDuration: '8-14 months',
      recentCases: 12400,
      jurisdictionStrength: {
        'Federal Law': 9.1,
        'New York State': 8.7,
        'Connecticut State': 8.3,
        'NYC Local Laws': 7.9,
      },
    },
  };

  const currentStats = useMemo(
    () => statsDatabase[legalArea] || statsDatabase['Domestic Violence (DV)'],
    [legalArea],
  );

  const jurisdictionLeverage = useMemo(() => {
    const strength = currentStats.jurisdictionStrength[jurisdiction] || 7.0;
    const successRate =
      jurisdiction === 'Federal Law'
        ? currentStats.federalSuccessRate
        : jurisdiction === 'New York State'
          ? currentStats.nySuccessRate
          : jurisdiction === 'Connecticut State'
            ? currentStats.ctSuccessRate
            : Math.round((currentStats.nySuccessRate + currentStats.ctSuccessRate) / 2);

    return {
      strength,
      successRate,
      recommendation: strength >= 9 ? 'Strong' : strength >= 7.5 ? 'Good' : 'Moderate',
      color: strength >= 9 ? '#22c55e' : strength >= 7.5 ? '#3b82f6' : '#f59e0b',
    };
  }, [currentStats, jurisdiction]);

  const processYourStory = async () => {
    if (!yourStory.trim()) {
      setError('Please share your story so we can help identify your legal rights.');
      return;
    }

    setError('');
    setIsProcessingStory(true);

    // Placeholder for API integration. Keeps this component safe to render without secrets.
    await new Promise((resolve) => setTimeout(resolve, 700));

    setLegalTranslation(
      `Based on ${storyJurisdiction} and ${legalArea}, your case profile aligns with a ${jurisdictionLeverage.successRate}% success trend in this jurisdiction.`,
    );
    setPlainExplanation(
      `In ${selectedLanguage}, this means you likely have enforceable rights and can begin with documentation, safety planning, and local legal aid intake this week.`,
    );

    setShowStats(true);
    setIsProcessingStory(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 text-white p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-xl border border-slate-700 bg-slate-900/80 p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="h-7 w-7 text-rose-400" />
              <div>
                <h1 className="text-2xl font-bold">Legal Rights Navigator</h1>
                <p className="text-sm text-slate-300">Cleaned component baseline (smart quotes fixed).</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowStats((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm hover:bg-blue-700"
            >
              <BarChart3 className="h-4 w-4" /> {showStats ? 'Hide' : 'Show'} Stats
            </button>
          </div>
        </header>

        <section className="rounded-xl border border-rose-800 bg-rose-900/30 p-4 text-sm">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-5 w-5 text-rose-300" />
            <p>24/7 crisis support: National DV Hotline 1-800-799-7233.</p>
          </div>
        </section>

        {showStats && (
          <section className="rounded-xl border border-slate-700 bg-slate-800/70 p-5">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <TrendingUp className="h-5 w-5 text-blue-400" /> Jurisdiction Snapshot
            </h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <Metric label="Success rate" value={`${jurisdictionLeverage.successRate}%`} />
              <Metric label="Recent cases" value={currentStats.recentCases.toLocaleString()} />
              <Metric label="Strength" value={`${jurisdictionLeverage.strength}/10`} />
              <Metric label="Avg. duration" value={currentStats.avgCaseDuration} />
            </div>
          </section>
        )}

        <section className="rounded-xl border border-slate-700 bg-slate-800/70 p-5">
          <div className="mb-4 flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('story')}
              className={`rounded-lg px-4 py-2 ${activeTab === 'story' ? 'bg-slate-700 text-white' : 'bg-slate-700/40 text-slate-300'}`}
            >
              Your Story
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('legal')}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 ${activeTab === 'legal' ? 'bg-slate-700 text-white' : 'bg-slate-700/40 text-slate-300'}`}
            >
              <Scale className="h-4 w-4" /> Legal Text
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <SelectField label="Language" value={selectedLanguage} onChange={setSelectedLanguage} options={languages} />
            <SelectField label="Jurisdiction" value={storyJurisdiction} onChange={setStoryJurisdiction} options={jurisdictions} />
            <SelectField label="Legal area" value={legalArea} onChange={setLegalArea} options={legalAreas} />
          </div>

          <textarea
            value={yourStory}
            onChange={(event) => setYourStory(event.target.value)}
            className="mt-4 h-40 w-full rounded-lg border border-slate-600 bg-slate-900/60 p-3"
            placeholder="Write your situation in your own words..."
          />

          <button
            type="button"
            onClick={processYourStory}
            disabled={isProcessingStory}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-rose-600 px-5 py-3 font-medium hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-600"
          >
            {isProcessingStory ? <Loader2 className="h-5 w-5 animate-spin" /> : <Heart className="h-5 w-5" />}
            Analyze My Rights
          </button>

          {error && <p className="mt-3 rounded bg-red-900/40 p-3 text-sm text-red-200">{error}</p>}

          {(legalTranslation || plainExplanation) && (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <article className="rounded-lg border border-slate-600 bg-slate-900/60 p-4 text-sm">{legalTranslation}</article>
              <article className="rounded-lg border border-slate-600 bg-slate-900/60 p-4 text-sm">{plainExplanation}</article>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const Metric = ({ label, value }) => (
  <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-3">
    <p className="text-xs text-slate-400">{label}</p>
    <p className="text-xl font-semibold">{value}</p>
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <label className="block text-sm">
    <span className="mb-1 block text-slate-300">{label}</span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-lg border border-slate-600 bg-slate-900/60 p-2"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </label>
);

export default LegalRightsNavigator;
