import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag, Timer as TimerIcon } from 'lucide-react';

interface LapItem {
  id: number;
  lapTime: number;
  overallTime: number;
}

export const Stopwatch: React.FC = () => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [laps, setLaps] = useState<LapItem[]>([]);

  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - elapsedTime;
      intervalRef.current = window.setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 10);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    const prevOverall = laps.length > 0 ? laps[0].overallTime : 0;
    const lapTime = elapsedTime - prevOverall;
    const newLap: LapItem = {
      id: laps.length + 1,
      lapTime,
      overallTime: elapsedTime,
    };
    setLaps([newLap, ...laps]);
  };

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);

    const mStr = minutes.toString().padStart(2, '0');
    const sStr = seconds.toString().padStart(2, '0');
    const cStr = centiseconds.toString().padStart(2, '0');

    return `${mStr}:${sStr}.${cStr}`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 space-y-8 text-center shadow-xs">
        {/* Big Digital Display */}
        <div className="py-6 px-4 rounded-3xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
          <span className="font-mono text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white select-none">
            {formatTime(elapsedTime)}
          </span>
        </div>

        {/* Buttons */}
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
            disabled={!isRunning}
            onClick={handleLap}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <Flag className="w-4 h-4" />
            <span>Lap</span>
          </button>

          <button
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm cursor-pointer transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>

        {/* Laps List */}
        {laps.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-left">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Laps ({laps.length})
            </h4>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto pr-1">
              {laps.map((lap) => (
                <div
                  key={lap.id}
                  className="py-2.5 flex items-center justify-between font-mono text-sm"
                >
                  <span className="text-slate-400 text-xs">Lap {lap.id}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    +{formatTime(lap.lapTime)}
                  </span>
                  <span className="text-slate-500 text-xs">
                    {formatTime(lap.overallTime)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
