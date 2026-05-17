import type { ReactNode } from 'react';

interface HexBadgeProps {
  children: ReactNode;
  variant?: 'outline' | 'fill' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'px-3 py-1 text-[10px]',
  md: 'px-4 py-1.5 text-xs',
  lg: 'px-6 py-2 text-sm',
};

const variants = {
  outline: 'border border-amber text-amber bg-transparent',
  fill: 'bg-amber text-bg border border-amber',
  glow: 'bg-[var(--amber-glow)] border border-amber text-amber',
};

export function HexBadge({
  children,
  variant = 'outline',
  size = 'md',
  className = '',
}: HexBadgeProps) {
  return (
    <span
      className={`hex-clip inline-flex items-center justify-center font-mono font-medium ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
