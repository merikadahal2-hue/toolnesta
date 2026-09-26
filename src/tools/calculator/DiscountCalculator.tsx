import React, { useState } from 'react';
import { Tag, Sparkles } from 'lucide-react';

export const DiscountCalculator: React.FC = () => {
  const [originalPrice, setOriginalPrice] = useState<string>('120');
  const [discountPercent, setDiscountPercent] = useState<string>('25');
  const [additionalDiscount, setAdditionalDiscount] = useState<string>('0');
  const [salesTax, setSalesTax] = useState<string>('0');

  const orig = parseFloat(originalPrice) || 0;
  const disc = parseFloat(discountPercent) || 0;
  const addDisc = parseFloat(additionalDiscount) || 0;
  const tax = parseFloat(salesTax) || 0;

  // Primary discount
  const primarySavings = orig * (disc / 100);
  const afterFirst = orig - primarySavings;

  // Additional coupon
  const secondarySavings = afterFirst * (addDisc / 100);
  const subtotal = afterFirst - secondarySavings;

  // Tax
  const taxAmount = subtotal * (tax / 100);
  const finalPrice = subtotal + taxAmount;
  const totalSavings = orig - subtotal;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Original Price ($)
            </label>
            <input
              type="number"
              min={0}
              step="any"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-base"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Discount (%)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              step="any"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-base"
            />
          </div>
        </div>

        {/* Quick discount buttons */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span>Common presets:</span>
          {['10', '15', '20', '25', '30', '50', '70'].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDiscountPercent(d)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              {d}%
            </button>
          ))}
        </div>

        {/* Optional extras: Extra coupon & Tax */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Extra Coupon Discount (%) (Optional)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={additionalDiscount}
              onChange={(e) => setAdditionalDiscount(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Sales Tax (%) (Optional)
            </label>
            <input
              type="number"
              min={0}
              value={salesTax}
              onChange={(e) => setSalesTax(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono"
            />
          </div>
        </div>

        {/* Result summary */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-4">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                Final Price
              </span>
              <div className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                ${finalPrice.toFixed(2)}
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-400">
                You Save
              </span>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                ${totalSavings.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-400">
            <div>
              <span>Original Price:</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                ${orig.toFixed(2)}
              </p>
            </div>
            <div>
              <span>Discounted by:</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {disc}%
              </p>
            </div>
            {tax > 0 && (
              <div>
                <span>Estimated Tax:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  +${taxAmount.toFixed(2)} ({tax}%)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
