import React, { useState } from 'react';
import { Receipt } from 'lucide-react';

export const TaxCalculator: React.FC = () => {
  const [mode, setMode] = useState<'add' | 'extract'>('add');
  const [amount, setAmount] = useState<string>('100');
  const [taxRate, setTaxRate] = useState<string>('10');

  const amt = parseFloat(amount) || 0;
  const rate = parseFloat(taxRate) || 0;

  let netAmount = 0;
  let taxAmount = 0;
  let totalAmount = 0;

  if (mode === 'add') {
    // Exclusive: amount is net, tax is added
    netAmount = amt;
    taxAmount = amt * (rate / 100);
    totalAmount = amt + taxAmount;
  } else {
    // Inclusive: amount is gross/total, tax is extracted
    totalAmount = amt;
    netAmount = amt / (1 + rate / 100);
    taxAmount = totalAmount - netAmount;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
        {/* Mode Selector */}
        <div className="flex justify-center">
          <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center gap-1">
            <button
              onClick={() => setMode('add')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                mode === 'add'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Add Tax (Exclusive)
            </button>
            <button
              onClick={() => setMode('extract')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                mode === 'extract'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Extract Tax (Inclusive)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {mode === 'add' ? 'Base Amount ($)' : 'Total Amount with Tax ($)'}
            </label>
            <input
              type="number"
              min={0}
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-base"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Tax / GST Rate (%)
            </label>
            <input
              type="number"
              min={0}
              step="any"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-base"
            />
          </div>
        </div>

        {/* Quick rate presets */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span>Common tax rates:</span>
          {['5', '8.25', '10', '12', '15', '18', '20'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setTaxRate(r)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              {r}%
            </button>
          ))}
        </div>

        {/* Calculation Result */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Net (Pre-Tax)
              </span>
              <p className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200 mt-1">
                ${netAmount.toFixed(2)}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Tax Amount ({rate}%)
              </span>
              <p className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                +${taxAmount.toFixed(2)}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Total (Gross)
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                ${totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
