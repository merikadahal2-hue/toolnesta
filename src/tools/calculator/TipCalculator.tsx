import React, { useState } from 'react';
import { Coins, Users } from 'lucide-react';

export const TipCalculator: React.FC = () => {
  const [bill, setBill] = useState<string>('85.00');
  const [tipPercent, setTipPercent] = useState<string>('18');
  const [numPeople, setNumPeople] = useState<string>('2');

  const billVal = parseFloat(bill) || 0;
  const tipPct = parseFloat(tipPercent) || 0;
  const people = Math.max(1, parseInt(numPeople, 10) || 1);

  const tipAmount = billVal * (tipPct / 100);
  const totalBill = billVal + tipAmount;
  const perPersonTip = tipAmount / people;
  const perPersonTotal = totalBill / people;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Bill Amount ($)
            </label>
            <input
              type="number"
              min={0}
              step="any"
              value={bill}
              onChange={(e) => setBill(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-base"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Tip Percentage (%)
            </label>
            <input
              type="number"
              min={0}
              step="any"
              value={tipPercent}
              onChange={(e) => setTipPercent(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-base"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Split Between People
            </label>
            <input
              type="number"
              min={1}
              value={numPeople}
              onChange={(e) => setNumPeople(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-base"
            />
          </div>
        </div>

        {/* Tip presets */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span>Quick tips:</span>
          {['10', '15', '18', '20', '25'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTipPercent(t)}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                tipPercent === t
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {t}%
            </button>
          ))}
        </div>

        {/* Summary Card */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                Tip Amount
              </span>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                ${tipAmount.toFixed(2)}
              </p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                Total Bill
              </span>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                ${totalBill.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Per Person Breakdown if split > 1 */}
          <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-600 text-white">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Each Person Pays ({people} {people === 1 ? 'person' : 'people'})
                </span>
                <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                  ${perPersonTotal.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="text-right text-xs text-slate-500">
              <span>(Tip: ${perPersonTip.toFixed(2)} ea)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
