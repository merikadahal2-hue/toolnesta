import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Bell, Hourglass } from 'lucide-react';

export const CountdownTimer: React.FC = () => {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(5);
  const [seconds, setSeconds] = useState<number>(0);

  const [totalRemainingSeconds, setTotalRemainingSeconds] = useState<number>(300);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [hasFinished, setHasFinished] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);

  // Play pleasant chime via Web Audio API
  const playAlertSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const playBeep = (freq: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

        gain.gain.setValueAtTime(0.15, ctx.currentTime + startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + startTime);
        osc.stop(ctx.currentTime + startTime + duration);
      };

      playBeep(587.33, 0, 0.25); // D5
      playBeep(880.0, 0.25, 0.4); // A5
      playBeep(1174.66, 0.65, 0.6); // D6
    } catch {
      // Audio might be blocked by browser policy without user gesture
    }
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTotalRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setHasFinished(true);
            playAlertSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleStartPause = () => {
    if (totalRemainingSeconds === 0) {
      resetToInputs();
    }
    setHasFinished(false);
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setHasFinished(false);
    resetToInputs();
  };

  const resetToInputs = () => {
    const total = hours * 3600 + minutes * 60 + seconds;
    setTotalRemainingSeconds(total > 0 ? total : 300);
  };

  const handleApplyInputs = (h: number, m: number, s: number) => {
    setIsRunning(false);
    setHasFinished(false);
    setHours(h);
    setMinutes(m);
    setSeconds(s);
    setTotalRemainingSeconds(h * 3600 + m * 60 + s);
  };

  const addMinutes = (m: number) => {
    setTotalRemainingSeconds((prev) => prev + m * 60);
    setHasFinished(false);
  };

  const dispHours = Math.floor(totalRemainingSeconds / 3600);
  const dispMinutes = Math.floor((totalRemainingSeconds % 3600) / 60);
  const dispSeconds = totalRemainingSeconds % 60;

  const formattedDisplay = `${dispHours.toString().padStart(2, '0')}:${dispMinutes
    .toString()
    .padStart(2, '0')}:${dispSeconds.toString().padStart(2, '0')}`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 space-y-8 text-center shadow-xs">
        {/* Big Countdown Display */}
        <div
          className={`py-8 px-4 rounded-3xl border transition-all ${
            hasFinished
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 animate-pulse'
              : 'bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800'
          }`}
        >
          <span className="font-mono text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white select-none">
            {formattedDisplay}
          </span>
          {hasFinished && (
            <p className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-2 flex items-center justify-center gap-1.5">
              <Bell className="w-4 h-4 animate-bounce" />
              <span>Time's up!</span>
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleStartPause}
            className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-base shadow-md cursor-pointer transition-all active:scale-95 ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
            }`}
          >
            {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            <span>{isRunning ? 'Pause' : 'Start'}</span>
          </button>

          <button
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm cursor-pointer transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>

        {/* Quick Add Presets */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span>Quick add:</span>
          {[1, 5, 15, 30].map((mins) => (
            <button
              key={mins}
              onClick={() => addMinutes(mins)}
              className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              +{mins}m
            </button>
          ))}
        </div>

        {/* Custom Input Setup */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 max-w-sm mx-auto space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Set Custom Time
          </span>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <span className="text-[11px] text-slate-400">Hours</span>
              <input
                type="number"
                min={0}
                max={99}
                value={hours}
                onChange={(e) => setHours(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full text-center px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm"
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-400">Minutes</span>
              <input
                type="number"
                min={0}
                max={59}
                value={minutes}
                onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full text-center px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm"
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-400">Seconds</span>
              <input
                type="number"
                min={0}
                max={59}
                value={seconds}
                onChange={(e) => setSeconds(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full text-center px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm"
              />
            </div>
          </div>
          <button
            onClick={() => handleApplyInputs(hours, minutes, seconds)}
            className="w-full py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            Apply Custom Time
          </button>
        </div>
      </div>
    </div>
  );
};
