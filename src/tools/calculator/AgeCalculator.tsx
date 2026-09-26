import React, { useState } from 'react';
import { Calendar, Gift, Clock, Sparkles } from 'lucide-react';

export const AgeCalculator: React.FC = () => {
  const [dob, setDob] = useState<string>('2000-01-01');

  // Exact calendar arithmetic without UTC timezone shifts
  const calculateAge = () => {
    if (!dob) return null;
    const [y, m, d] = dob.split('-').map((v) => parseInt(v, 10));
    if (!y || !m || !d) return null;

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // 1-12
    const currentDay = today.getDate();

    // Check if birth date is in the future
    const birthDateObj = new Date(y, m - 1, d);
    if (birthDateObj > today) return { isFuture: true };

    let years = currentYear - y;
    let months = currentMonth - m;
    let days = currentDay - d;

    if (days < 0) {
      months -= 1;
      // Days in previous month
      const prevMonthDays = new Date(currentYear, currentMonth - 1, 0).getDate();
      days += prevMonthDays;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Total days lived
    const diffTime = today.getTime() - birthDateObj.getTime();
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(diffTime / (1000 * 60 * 60));

    // Next birthday calculation
    let nextBdayYear = currentYear;
    if (currentMonth > m || (currentMonth === m && currentDay > d)) {
      nextBdayYear += 1;
    }
    const nextBday = new Date(nextBdayYear, m - 1, d);
    const daysUntilNext = Math.ceil((nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return {
      years,
      months,
      days,
      totalDays,
      totalHours,
      daysUntilNext,
      isFuture: false,
    };
  };

  const age = calculateAge();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
            Select Your Date of Birth
          </label>
          <div className="relative">
            <input
              type="date"
              value={dob}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-base focus:outline-hidden focus:border-blue-500 cursor-pointer"
            />
          </div>
        </div>

        {age && !age.isFuture && (
          <div className="space-y-6 pt-2">
            {/* Primary Age Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-center space-y-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                  {age.years}
                </span>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Years
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-center space-y-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  {age.months}
                </span>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Months
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 text-center space-y-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-purple-600 dark:text-purple-400">
                  {age.days}
                </span>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Days
                </p>
              </div>
            </div>

            {/* Total Duration Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400">Next Birthday</span>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {age.daysUntilNext === 0 ? 'Today! 🎉' : `In ${age.daysUntilNext} days`}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400">Total Days Lived</span>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {age.totalDays?.toLocaleString()} days
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {age?.isFuture && (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-800 dark:text-amber-200 text-sm">
            Please choose a date in the past or today.
          </div>
        )}
      </div>
    </div>
  );
};
