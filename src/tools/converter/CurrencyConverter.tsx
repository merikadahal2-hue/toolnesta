import React, { useState, useEffect } from 'react';
import { DollarSign, ArrowRightLeft, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
}

const CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'NPR', name: 'Nepalese Rupee', symbol: 'Rs' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
];

export const CurrencyConverter: React.FC = () => {
  const [fromCode, setFromCode] = useState<string>('USD');
  const [toCode, setToCode] = useState<string>('EUR');
  const [amount, setAmount] = useState<string>('100');
  const [manualMode, setManualMode] = useState<boolean>(false);
  const [manualRate, setManualRate] = useState<string>('0.92');
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!res.ok) throw new Error('Network error fetching exchange rates');
      const data = await res.json();
      if (data && data.rates) {
        setRates(data.rates);
        setLastUpdated(data.time_last_update_utc || new Date().toUTCString());
      }
    } catch (err: any) {
      console.warn('Live rates fetch failed, defaulting to manual mode:', err);
      setError('Live exchange API was unreachable. You can set the rate manually below.');
      setManualMode(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const calculateResult = (): { result: number; rate: number } => {
    const amt = parseFloat(amount) || 0;
    if (manualMode) {
      const r = parseFloat(manualRate) || 1;
      return { result: amt * r, rate: r };
    }

    if (!rates) return { result: 0, rate: 1 };

    const fromRateUSD = rates[fromCode] || 1;
    const toRateUSD = rates[toCode] || 1;

    // Rate from fromCode -> toCode
    const effectiveRate = toRateUSD / fromRateUSD;
    return {
      result: amt * effectiveRate,
      rate: effectiveRate,
    };
  };

  const { result, rate } = calculateResult();

  const handleSwap = () => {
    const temp = fromCode;
    setFromCode(toCode);
    setToCode(temp);
    if (manualMode) {
      const currentRate = parseFloat(manualRate) || 1;
      setManualRate(currentRate !== 0 ? (1 / currentRate).toFixed(4) : '1');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-6">
        {/* Header bar with Mode switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Currency Exchange</h3>
            <p className="text-xs text-slate-500">
              {manualMode
                ? 'Manual Rate Mode active (custom rate)'
                : lastUpdated
                ? `Rates last updated: ${lastUpdated}`
                : 'Fetching live rates...'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!manualMode && (
              <button
                onClick={fetchRates}
                disabled={isLoading}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                title="Refresh rates"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            )}
            <button
              onClick={() => setManualMode(!manualMode)}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
            >
              {manualMode ? 'Switch to Live Rates' : 'Set Custom Rate'}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Amount to Convert
            </label>
            <input
              type="number"
              min={0}
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-lg font-mono"
            />
            <select
              value={fromCode}
              onChange={(e) => setFromCode(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} – {c.name} ({c.symbol})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center md:pt-6">
            <button
              onClick={handleSwap}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 text-slate-600 dark:text-slate-300 cursor-pointer transition-colors"
              title="Swap Currencies"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Converted Amount
            </label>
            <input
              type="text"
              readOnly
              value={result.toFixed(2)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 text-blue-600 dark:text-blue-400 text-lg font-mono font-bold"
            />
            <select
              value={toCode}
              onChange={(e) => setToCode(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} – {c.name} ({c.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Manual Rate Input if in Manual Mode */}
        {manualMode && (
          <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 space-y-2">
            <label className="block text-xs font-semibold text-amber-900 dark:text-amber-200">
              Custom Exchange Rate: 1 {fromCode} = ? {toCode}
            </label>
            <input
              type="number"
              step="any"
              value={manualRate}
              onChange={(e) => setManualRate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-amber-300 dark:border-amber-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm"
            />
          </div>
        )}

        {/* Summary Pill */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-center space-y-1">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {amount || '0'} {fromCode} = {result.toFixed(2)} {toCode}
          </p>
          <p className="text-xs text-slate-500">
            1 {fromCode} = {rate.toFixed(4)} {toCode}
          </p>
        </div>
      </div>
    </div>
  );
};
