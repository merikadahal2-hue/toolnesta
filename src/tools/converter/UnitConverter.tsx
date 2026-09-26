import React, { useState } from 'react';
import { ArrowRightLeft, RefreshCw } from 'lucide-react';

type UnitCategory = 'length' | 'weight' | 'temperature' | 'area' | 'volume' | 'time';

interface UnitDef {
  name: string;
  symbol: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

const CONVERSION_DATA: Record<UnitCategory, { title: string; base: string; units: Record<string, UnitDef> }> = {
  length: {
    title: 'Length',
    base: 'm',
    units: {
      m: { name: 'Meter', symbol: 'm', toBase: (v) => v, fromBase: (v) => v },
      km: { name: 'Kilometer', symbol: 'km', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      cm: { name: 'Centimeter', symbol: 'cm', toBase: (v) => v * 0.01, fromBase: (v) => v / 0.01 },
      mm: { name: 'Millimeter', symbol: 'mm', toBase: (v) => v * 0.001, fromBase: (v) => v / 0.001 },
      mi: { name: 'Mile', symbol: 'mi', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
      yd: { name: 'Yard', symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      ft: { name: 'Foot', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      in: { name: 'Inch', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    },
  },
  weight: {
    title: 'Weight',
    base: 'kg',
    units: {
      kg: { name: 'Kilogram', symbol: 'kg', toBase: (v) => v, fromBase: (v) => v },
      g: { name: 'Gram', symbol: 'g', toBase: (v) => v * 0.001, fromBase: (v) => v / 0.001 },
      mg: { name: 'Milligram', symbol: 'mg', toBase: (v) => v * 0.000001, fromBase: (v) => v / 0.000001 },
      lb: { name: 'Pound', symbol: 'lb', toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
      oz: { name: 'Ounce', symbol: 'oz', toBase: (v) => v * 0.028349523, fromBase: (v) => v / 0.028349523 },
    },
  },
  temperature: {
    title: 'Temperature',
    base: 'c',
    units: {
      c: { name: 'Celsius', symbol: '°C', toBase: (v) => v, fromBase: (v) => v },
      f: { name: 'Fahrenheit', symbol: '°F', toBase: (v) => ((v - 32) * 5) / 9, fromBase: (v) => (v * 9) / 5 + 32 },
      k: { name: 'Kelvin', symbol: 'K', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    },
  },
  area: {
    title: 'Area',
    base: 'sqm',
    units: {
      sqm: { name: 'Square Meter', symbol: 'm²', toBase: (v) => v, fromBase: (v) => v },
      sqkm: { name: 'Square Kilometer', symbol: 'km²', toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
      sqft: { name: 'Square Foot', symbol: 'ft²', toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
      sqmi: { name: 'Square Mile', symbol: 'mi²', toBase: (v) => v * 2589988.11, fromBase: (v) => v / 2589988.11 },
      acre: { name: 'Acre', symbol: 'ac', toBase: (v) => v * 4046.856, fromBase: (v) => v / 4046.856 },
      hectare: { name: 'Hectare', symbol: 'ha', toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
    },
  },
  volume: {
    title: 'Volume',
    base: 'l',
    units: {
      l: { name: 'Liter', symbol: 'L', toBase: (v) => v, fromBase: (v) => v },
      ml: { name: 'Milliliter', symbol: 'mL', toBase: (v) => v * 0.001, fromBase: (v) => v / 0.001 },
      gal: { name: 'Gallon (US)', symbol: 'gal', toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
      qt: { name: 'Quart (US)', symbol: 'qt', toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
      pt: { name: 'Pint (US)', symbol: 'pt', toBase: (v) => v * 0.473176, fromBase: (v) => v / 0.473176 },
      cup: { name: 'Cup (US)', symbol: 'cup', toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
    },
  },
  time: {
    title: 'Time',
    base: 's',
    units: {
      s: { name: 'Seconds', symbol: 's', toBase: (v) => v, fromBase: (v) => v },
      min: { name: 'Minutes', symbol: 'min', toBase: (v) => v * 60, fromBase: (v) => v / 60 },
      hr: { name: 'Hours', symbol: 'hr', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
      d: { name: 'Days', symbol: 'd', toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
      wk: { name: 'Weeks', symbol: 'wk', toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },
    },
  },
};

export const UnitConverter: React.FC = () => {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');
  const [fromValue, setFromValue] = useState<string>('1');

  const handleCategoryChange = (newCat: UnitCategory) => {
    setCategory(newCat);
    const availableKeys = Object.keys(CONVERSION_DATA[newCat].units);
    setFromUnit(availableKeys[0]);
    setToUnit(availableKeys[1] || availableKeys[0]);
  };

  const currentCatData = CONVERSION_DATA[category];
  const fromDef = currentCatData.units[fromUnit] || Object.values(currentCatData.units)[0];
  const toDef = currentCatData.units[toUnit] || Object.values(currentCatData.units)[1];

  const calculateConversion = (valStr: string): string => {
    const val = parseFloat(valStr);
    if (isNaN(val)) return '';
    const inBase = fromDef.toBase(val);
    const converted = toDef.fromBase(inBase);
    return String(Math.round(converted * 10000000) / 10000000);
  };

  const toValue = calculateConversion(fromValue);

  const swapUnits = () => {
    const prevFrom = fromUnit;
    setFromUnit(toUnit);
    setToUnit(prevFrom);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 scrollbar-none">
        {(Object.keys(CONVERSION_DATA) as UnitCategory[]).map((catKey) => (
          <button
            key={catKey}
            onClick={() => handleCategoryChange(catKey)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer transition-all ${
              category === catKey
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {CONVERSION_DATA[catKey].title}
          </button>
        ))}
      </div>

      {/* Main Converter Card */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          {/* From Input */}
          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              From
            </label>
            <input
              type="number"
              step="any"
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-lg font-mono"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
            >
              {Object.entries(currentCatData.units).map(([key, def]) => (
                <option key={key} value={key}>
                  {def.name} ({def.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center md:pt-6">
            <button
              onClick={swapUnits}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Swap Units"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </button>
          </div>

          {/* To Input (Read-only / Output) */}
          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              To
            </label>
            <input
              type="text"
              readOnly
              value={toValue}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 text-blue-600 dark:text-blue-400 text-lg font-mono font-bold"
            />
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
            >
              {Object.entries(currentCatData.units).map(([key, def]) => (
                <option key={key} value={key}>
                  {def.name} ({def.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Formula Banner */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-center text-sm font-medium text-slate-600 dark:text-slate-300">
          <span>
            {fromValue || '0'} {fromDef.symbol} = <strong className="text-blue-600 dark:text-blue-400">{toValue || '0'}</strong> {toDef.symbol}
          </span>
        </div>
      </div>
    </div>
  );
};
