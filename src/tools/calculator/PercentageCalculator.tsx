import React, { useState } from 'react';
import { Percent, ArrowRight } from 'lucide-react';

export const PercentageCalculator: React.FC = () => {
  // Case 1: What is X% of Y?
  const [c1Pct, setC1Pct] = useState<string>('20');
  const [c1Val, setC1Val] = useState<string>('500');

  // Case 2: X is what % of Y?
  const [c2Part, setC2Part] = useState<string>('500');
  const [c2Total, setC2Total] = useState<string>('800');

  // Case 3: Increase X by Y%
  const [c3Val, setC3Val] = useState<string>('500');
  const [c3Pct, setC3Pct] = useState<string>('20');

  // Case 4: Decrease X by Y%
  const [c4Val, setC4Val] = useState<string>('500');
  const [c4Pct, setC4Pct] = useState<string>('20');

  // Results
  const res1 = ((parseFloat(c1Pct) || 0) / 100) * (parseFloat(c1Val) || 0);
  const res2 = (parseFloat(c2Total) || 0) !== 0 ? ((parseFloat(c2Part) || 0) / (parseFloat(c2Total) || 1)) * 100 : 0;
  const res3Delta = (parseFloat(c3Val) || 0) * ((parseFloat(c3Pct) || 0) / 100);
  const res3Total = (parseFloat(c3Val) || 0) + res3Delta;
  const res4Delta = (parseFloat(c4Val) || 0) * ((parseFloat(c4Pct) || 0) / 100);
  const res4Total = (parseFloat(c4Val) || 0) - res4Delta;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Mode 1 */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Percent className="w-4 h-4 text-blue-600" />
          <span>What is X% of Y?</span>
        </h3>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span>What is</span>
          <input
            type="number"
            value={c1Pct}
            onChange={(e) => setC1Pct(e.target.value)}
            className="w-24 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
          />
          <span>% of</span>
          <input
            type="number"
            value={c1Val}
            onChange={(e) => setC1Val(e.target.value)}
            className="w-32 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
          />
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <div className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold font-mono text-base">
            {Math.round(res1 * 10000) / 10000}
          </div>
        </div>
        <p className="text-xs text-slate-400">
          Formula: ({c1Pct} ÷ 100) × {c1Val} = {Math.round(res1 * 10000) / 10000}
        </p>
      </div>

      {/* Mode 2 */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Percent className="w-4 h-4 text-indigo-600" />
          <span>X is what percentage of Y?</span>
        </h3>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <input
            type="number"
            value={c2Part}
            onChange={(e) => setC2Part(e.target.value)}
            className="w-28 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
          />
          <span>is what % of</span>
          <input
            type="number"
            value={c2Total}
            onChange={(e) => setC2Total(e.target.value)}
            className="w-28 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
          />
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <div className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold font-mono text-base">
            {Math.round(res2 * 100) / 100}%
          </div>
        </div>
        <p className="text-xs text-slate-400">
          Formula: ({c2Part} ÷ {c2Total}) × 100 = {Math.round(res2 * 100) / 100}%
        </p>
      </div>

      {/* Mode 3 */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Percent className="w-4 h-4 text-emerald-600" />
          <span>Percentage Increase</span>
        </h3>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span>Increase</span>
          <input
            type="number"
            value={c3Val}
            onChange={(e) => setC3Val(e.target.value)}
            className="w-28 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
          />
          <span>by</span>
          <input
            type="number"
            value={c3Pct}
            onChange={(e) => setC3Pct(e.target.value)}
            className="w-24 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
          />
          <span>%</span>
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <div className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold font-mono text-base">
            {Math.round(res3Total * 100) / 100}
          </div>
        </div>
        <p className="text-xs text-slate-400">
          Added amount: +{Math.round(res3Delta * 100) / 100} • Result: {Math.round(res3Total * 100) / 100}
        </p>
      </div>

      {/* Mode 4 */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Percent className="w-4 h-4 text-rose-600" />
          <span>Percentage Decrease</span>
        </h3>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span>Decrease</span>
          <input
            type="number"
            value={c4Val}
            onChange={(e) => setC4Val(e.target.value)}
            className="w-28 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
          />
          <span>by</span>
          <input
            type="number"
            value={c4Pct}
            onChange={(e) => setC4Pct(e.target.value)}
            className="w-24 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
          />
          <span>%</span>
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <div className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-bold font-mono text-base">
            {Math.round(res4Total * 100) / 100}
          </div>
        </div>
        <p className="text-xs text-slate-400">
          Subtracted amount: -{Math.round(res4Delta * 100) / 100} • Result: {Math.round(res4Total * 100) / 100}
        </p>
      </div>
    </div>
  );
};
