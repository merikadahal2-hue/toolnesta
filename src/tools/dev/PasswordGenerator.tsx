import React, { useState, useEffect } from 'react';
import { KeyRound, Copy, RefreshCw, Check, ShieldCheck } from 'lucide-react';
import { PrivacyBadge } from '../../components/PrivacyBadge';

export const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [avoidAmbiguous, setAvoidAmbiguous] = useState(false);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    let numberChars = '0123456789';
    let symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (avoidAmbiguous) {
      upperChars = upperChars.replace(/[O]/g, '');
      lowerChars = lowerChars.replace(/[l]/g, '');
      numberChars = numberChars.replace(/[01]/g, '');
      symbolChars = symbolChars.replace(/[|]/g, '');
    }

    let charPool = '';
    const guaranteed: string[] = [];

    if (useUpper) {
      charPool += upperChars;
      guaranteed.push(upperChars[Math.floor(Math.random() * upperChars.length)]);
    }
    if (useLower) {
      charPool += lowerChars;
      guaranteed.push(lowerChars[Math.floor(Math.random() * lowerChars.length)]);
    }
    if (useNumbers) {
      charPool += numberChars;
      guaranteed.push(numberChars[Math.floor(Math.random() * numberChars.length)]);
    }
    if (useSymbols) {
      charPool += symbolChars;
      guaranteed.push(symbolChars[Math.floor(Math.random() * symbolChars.length)]);
    }

    if (!charPool) {
      charPool = lowerChars;
    }

    // Cryptographically secure random values
    const randomArray = new Uint32Array(length);
    window.crypto.getRandomValues(randomArray);

    let result = '';
    for (let i = 0; i < length; i++) {
      const idx = randomArray[i] % charPool.length;
      result += charPool[idx];
    }

    setPassword(result);
  };

  useEffect(() => {
    generatePassword();
  }, [length, useUpper, useLower, useNumbers, useSymbols, avoidAmbiguous]);

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Evaluate password strength
  const getStrength = () => {
    let score = 0;
    if (length >= 12) score += 1;
    if (length >= 16) score += 1;
    if (useUpper && useLower) score += 1;
    if (useNumbers) score += 1;
    if (useSymbols) score += 1;

    if (score <= 2) return { label: 'Weak', color: 'bg-red-500', text: 'text-red-500' };
    if (score <= 4) return { label: 'Moderate', color: 'bg-amber-500', text: 'text-amber-500' };
    return { label: 'Very Strong', color: 'bg-emerald-500', text: 'text-emerald-500' };
  };

  const strength = getStrength();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-6">
        {/* Generated Output Bar */}
        <div className="relative flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
          <span className="font-mono text-lg sm:text-xl font-bold text-slate-900 dark:text-white break-all select-all">
            {password}
          </span>

          <div className="flex items-center gap-1.5 shrink-0 ml-3">
            <button
              onClick={generatePassword}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Regenerate"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={copyPassword}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-sm"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Strength Meter */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-500">Security Strength</span>
            <span className={strength.text}>{strength.label}</span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${strength.color} transition-all duration-300 ${
                strength.label === 'Weak' ? 'w-1/3' : strength.label === 'Moderate' ? 'w-2/3' : 'w-full'
              }`}
            />
          </div>
        </div>

        {/* Configuration Controls */}
        <div className="space-y-4 pt-2">
          {/* Length slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>Password Length</span>
              <span className="font-mono text-sm text-blue-600 dark:text-blue-400 font-bold">
                {length} characters
              </span>
            </div>
            <input
              type="range"
              min={6}
              max={64}
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value, 10))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Character checkboxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer text-xs font-medium text-slate-800 dark:text-slate-200">
              <input
                type="checkbox"
                checked={useUpper}
                onChange={(e) => setUseUpper(e.target.checked)}
                className="rounded accent-blue-600 w-4 h-4"
              />
              <span>Uppercase (A-Z)</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer text-xs font-medium text-slate-800 dark:text-slate-200">
              <input
                type="checkbox"
                checked={useLower}
                onChange={(e) => setUseLower(e.target.checked)}
                className="rounded accent-blue-600 w-4 h-4"
              />
              <span>Lowercase (a-z)</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer text-xs font-medium text-slate-800 dark:text-slate-200">
              <input
                type="checkbox"
                checked={useNumbers}
                onChange={(e) => setUseNumbers(e.target.checked)}
                className="rounded accent-blue-600 w-4 h-4"
              />
              <span>Numbers (0-9)</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer text-xs font-medium text-slate-800 dark:text-slate-200">
              <input
                type="checkbox"
                checked={useSymbols}
                onChange={(e) => setUseSymbols(e.target.checked)}
                className="rounded accent-blue-600 w-4 h-4"
              />
              <span>Symbols (!@#$%)</span>
            </label>
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={avoidAmbiguous}
              onChange={(e) => setAvoidAmbiguous(e.target.checked)}
              className="rounded accent-blue-600"
            />
            <span>Avoid ambiguous characters (e.g. 0, O, 1, l, I)</span>
          </label>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <PrivacyBadge text="Passwords are generated locally in your browser via Web Crypto API." />
        </div>
      </div>
    </div>
  );
};
