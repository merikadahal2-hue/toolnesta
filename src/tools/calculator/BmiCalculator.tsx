import React, { useState } from 'react';
import { Activity, Info, CheckCircle2 } from 'lucide-react';

export const BmiCalculator: React.FC = () => {
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');

  // Metric
  const [cm, setCm] = useState<string>('175');
  const [kg, setKg] = useState<string>('70');

  // Imperial
  const [feet, setFeet] = useState<string>('5');
  const [inches, setInches] = useState<string>('9');
  const [lbs, setLbs] = useState<string>('155');

  const calculateBmi = () => {
    let bmiValue = 0;

    if (unitSystem === 'metric') {
      const heightM = (parseFloat(cm) || 0) / 100;
      const weightKg = parseFloat(kg) || 0;
      if (heightM > 0 && weightKg > 0) {
        bmiValue = weightKg / (heightM * heightM);
      }
    } else {
      const totalInches = (parseFloat(feet) || 0) * 12 + (parseFloat(inches) || 0);
      const weightLbs = parseFloat(lbs) || 0;
      if (totalInches > 0 && weightLbs > 0) {
        bmiValue = (weightLbs / (totalInches * totalInches)) * 703;
      }
    }

    const rounded = Math.round(bmiValue * 10) / 10;

    let category = 'Normal';
    let color = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200';
    let rangeDesc = '18.5 – 24.9';

    if (rounded < 18.5) {
      category = 'Underweight';
      color = 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200';
      rangeDesc = 'Below 18.5';
    } else if (rounded >= 25 && rounded < 30) {
      category = 'Overweight';
      color = 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border-orange-200';
      rangeDesc = '25.0 – 29.9';
    } else if (rounded >= 30) {
      category = 'Obese';
      color = 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border-red-200';
      rangeDesc = '30.0 and above';
    }

    return { value: rounded, category, color, rangeDesc };
  };

  const bmi = calculateBmi();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
        {/* Unit Toggle */}
        <div className="flex justify-center">
          <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center gap-1">
            <button
              onClick={() => setUnitSystem('metric')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                unitSystem === 'metric'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Metric (cm, kg)
            </button>
            <button
              onClick={() => setUnitSystem('imperial')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                unitSystem === 'imperial'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Imperial (ft, in, lbs)
            </button>
          </div>
        </div>

        {/* Inputs */}
        {unitSystem === 'metric' ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Height (cm)
              </label>
              <input
                type="number"
                value={cm}
                onChange={(e) => setCm(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-base"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Weight (kg)
              </label>
              <input
                type="number"
                value={kg}
                onChange={(e) => setKg(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-base"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Height (Feet)
              </label>
              <input
                type="number"
                value={feet}
                onChange={(e) => setFeet(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-base"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Height (Inches)
              </label>
              <input
                type="number"
                value={inches}
                onChange={(e) => setInches(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-base"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Weight (lbs)
              </label>
              <input
                type="number"
                value={lbs}
                onChange={(e) => setLbs(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-base"
              />
            </div>
          </div>
        )}

        {/* BMI Score Display */}
        {bmi.value > 0 && (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
              Your Body Mass Index (BMI)
            </span>
            <div className="text-5xl font-black text-slate-900 dark:text-white">
              {bmi.value}
            </div>
            <div className="inline-block">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${bmi.color}`}>
                Category: {bmi.category} ({bmi.rangeDesc})
              </span>
            </div>

            {/* Ranges Reference Strip */}
            <div className="pt-4 grid grid-cols-4 gap-1 text-center text-[10px] font-medium text-slate-500">
              <div className="p-2 rounded-lg bg-amber-100/60 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300">
                &lt; 18.5<br />Underweight
              </div>
              <div className="p-2 rounded-lg bg-emerald-100/60 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300">
                18.5 - 24.9<br />Normal
              </div>
              <div className="p-2 rounded-lg bg-orange-100/60 dark:bg-orange-950/30 text-orange-800 dark:text-orange-300">
                25 - 29.9<br />Overweight
              </div>
              <div className="p-2 rounded-lg bg-red-100/60 dark:bg-red-950/30 text-red-800 dark:text-red-300">
                30+<br />Obese
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <span>
            <strong>Health Note:</strong> BMI is a general screening indicator of body weight categories and is not a medical diagnosis. Consult a qualified healthcare professional for personalized medical advice.
          </span>
        </div>
      </div>
    </div>
  );
};
