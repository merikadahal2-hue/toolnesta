import React, { useState } from 'react';
import { CalendarDays, ArrowRight, Clock } from 'lucide-react';

export const DateDifference: React.FC = () => {
  const todayStr = new Date().toISOString().split('T')[0];
  const nextMonth = new Date();
  nextMonth.setDate(nextMonth.getDate() + 30);
  const nextMonthStr = nextMonth.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState<string>(todayStr);
  const [endDate, setEndDate] = useState<string>(nextMonthStr);

  const calculateDifference = () => {
    if (!startDate || !endDate) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const isNegative = end.getTime() < start.getTime();
    const d1 = isNegative ? end : start;
    const d2 = isNegative ? start : end;

    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const totalDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;

    // Approximate months and years
    let years = d2.getFullYear() - d1.getFullYear();
    let months = d2.getMonth() - d1.getMonth();
    let days = d2.getDate() - d1.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonthDays = new Date(d2.getFullYear(), d2.getMonth(), 0).getDate();
      days += prevMonthDays;
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Business days (Mon-Fri)
    let businessDays = 0;
    const cur = new Date(d1);
    while (cur < d2) {
      cur.setDate(cur.getDate() + 1);
      const dayOfWeek = cur.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        businessDays++;
      }
    }

    return {
      totalDays,
      totalWeeks,
      remainingDays,
      years,
      months,
      days,
      businessDays,
      isNegative,
    };
  };

  const diff = calculateDifference();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
            />
          </div>
        </div>

        {diff && (
          <div className="space-y-4 pt-2">
            {/* Primary Total Days Card */}
            <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-center space-y-1">
              <span className="text-4xl sm:text-5xl font-black text-blue-600 dark:text-blue-400 font-mono">
                {diff.totalDays}
              </span>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Total Days {diff.isNegative ? '(In the past)' : ''}
              </p>
            </div>

            {/* Breakdown cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-center">
                <span className="text-xl font-bold text-slate-900 dark:text-white font-mono">
                  {diff.totalWeeks} w {diff.remainingDays} d
                </span>
                <p className="text-xs text-slate-500 mt-0.5">Weeks & Days</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-center">
                <span className="text-xl font-bold text-slate-900 dark:text-white font-mono">
                  {diff.years > 0 ? `${diff.years}y ` : ''}{diff.months}m {diff.days}d
                </span>
                <p className="text-xs text-slate-500 mt-0.5">Calendar Breakdown</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-center">
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  {diff.businessDays} days
                </span>
                <p className="text-xs text-slate-500 mt-0.5">Work / Business Days</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
