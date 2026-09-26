import React from 'react';
import * as Icons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = 'w-5 h-5', size }) => {
  // @ts-expect-error dynamic key indexing Lucide icons
  const Component = Icons[name] || Icons.Wrench;
  return <Component className={className} size={size} />;
};
