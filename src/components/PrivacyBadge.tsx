import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface PrivacyBadgeProps {
  text?: string;
  className?: string;
}

export const PrivacyBadge: React.FC<PrivacyBadgeProps> = ({
  text = 'Files are processed locally in your browser. Nothing is uploaded to a server.',
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300 text-xs font-medium ${className}`}
    >
      <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
      <span>{text}</span>
    </div>
  );
};
