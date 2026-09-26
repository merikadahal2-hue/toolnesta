import React, { useState, useEffect } from 'react';
import {
  Calculator as CalcIcon,
  Delete,
  RotateCcw,
  History,
  Trash2,
  Equal,
} from 'lucide-react';
import { safeCalculate } from '../../utils/mathParser';

interface HistoryItem {
  expression: string;
  result: string;
}

export const BasicCalculator: React.FC = () => {
  const [expression, setExpression] = useState<string>('');
  const [displayResult, setDisplayResult] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('toolnest_calc_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const appendChar = (char: string) => {
    setError(null);
    setExpression((prev) => prev + char);
  };

  const handleClear = () => {
    setExpression('');
    setDisplayResult('');
    setError(null);
  };

  const handleDelete = () => {
    setError(null);
    setExpression((prev) => prev.slice(0, -1));
  };

  const handleCalculate = () => {
    if (!expression.trim()) return;
    try {
      const res = safeCalculate(expression);
      const resStr = String(res);
      setDisplayResult(resStr);

      const newItem: HistoryItem = { expression, result: resStr };
      setHistory((prev) => {
        const updated = [newItem, ...prev].slice(0, 15);
        localStorage.setItem('toolnest_calc_history', JSON.stringify(updated));
        return updated;
      });
      setExpression(resStr);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Invalid calculation');
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in another input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const key = e.key;
      if (/[0-9]/.test(key)) {
        appendChar(key);
      } else if (['+', '-', '*', '/', '(', ')', '.', '%'].includes(key)) {
        appendChar(key);
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleCalculate();
      } else if (key === 'Backspace') {
        handleDelete();
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expression]);

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('toolnest_calc_history');
  };

  const buttons = [
    { label: 'C', type: 'clear', action: handleClear, class: 'text-red-500 bg-red-50 dark:bg-red-950/40 hover:bg-red-100' },
    { label: '(', type: 'paren', action: () => appendChar('('), class: 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800' },
    { label: ')', type: 'paren', action: () => appendChar(')'), class: 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800' },
    { label: '÷', type: 'op', action: () => appendChar('/'), class: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40' },

    { label: '7', type: 'num', action: () => appendChar('7') },
    { label: '8', type: 'num', action: () => appendChar('8') },
    { label: '9', type: 'num', action: () => appendChar('9') },
    { label: '×', type: 'op', action: () => appendChar('*'), class: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40' },

    { label: '4', type: 'num', action: () => appendChar('4') },
    { label: '5', type: 'num', action: () => appendChar('5') },
    { label: '6', type: 'num', action: () => appendChar('6') },
    { label: '-', type: 'op', action: () => appendChar('-'), class: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40' },

    { label: '1', type: 'num', action: () => appendChar('1') },
    { label: '2', type: 'num', action: () => appendChar('2') },
    { label: '3', type: 'num', action: () => appendChar('3') },
    { label: '+', type: 'op', action: () => appendChar('+'), class: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40' },

    { label: '0', type: 'num', action: () => appendChar('0') },
    { label: '.', type: 'dot', action: () => appendChar('.') },
    { label: '⌫', type: 'del', action: handleDelete, class: 'text-slate-500 hover:text-slate-800' },
    { label: '=', type: 'eq', action: handleCalculate, class: 'bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20' },
  ];

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Main Calculator Body */}
      <div className="md:col-span-2 max-w-md mx-auto w-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
        {/* LCD Screen Display */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 text-right space-y-1 min-h-[105px] flex flex-col justify-end">
          <div className="text-xs sm:text-sm font-mono text-slate-400 overflow-x-auto whitespace-nowrap">
            {expression || '0'}
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-slate-900 dark:text-white truncate">
            {error ? (
              <span className="text-red-500 text-lg font-sans font-medium">{error}</span>
            ) : (
              displayResult || expression || '0'
            )}
          </div>
        </div>

        {/* Keypad Grid */}
        <div className="grid grid-cols-4 gap-2.5">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              type="button"
              onClick={btn.action}
              className={`h-14 sm:h-16 rounded-2xl text-lg sm:text-xl font-medium transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
                btn.class ||
                'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div className="text-center pt-2 text-[11px] text-slate-400">
          Keyboard supported: 0-9, +, -, *, /, =, Backspace, Esc
        </div>
      </div>

      {/* History Side Panel */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4 flex flex-col h-full max-h-[520px]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">History</h3>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-xs text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {history.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No recent calculations
            </div>
          ) : (
            history.map((item, i) => (
              <div
                key={i}
                onClick={() => setExpression(item.result)}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-slate-100 dark:border-slate-800/60 text-right cursor-pointer transition-colors"
                title="Click to use result"
              >
                <div className="text-xs text-slate-400 font-mono">{item.expression} =</div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
                  {item.result}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
