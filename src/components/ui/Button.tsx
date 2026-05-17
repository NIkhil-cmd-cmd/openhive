import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  href?: string;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'px-4 py-2 text-min',
  md: 'px-6 py-3 text-body',
  lg: 'px-8 py-4 text-body-lg',
};

const variants = {
  primary:
    'bg-amber text-bg font-display tracking-wide hover:shadow-[0_0_30px_var(--amber-glow)]',
  secondary: 'border border-amber text-amber font-mono hover:bg-[var(--amber-glow)]',
  ghost: 'text-muted hover:text-amber font-mono',
};

export function Button({
  children,
  variant = 'primary',
  href,
  onClick,
  className = '',
  size = 'md',
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 transition-all duration-200 ${sizes[size]} ${variants[variant]} ${variant === 'primary' ? 'hex-clip-btn' : 'rounded-sm'} ${className}`;

  const content = (
    <motion.span whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={classes}>
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="inline-block"
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className="inline-block p-0 border-0 bg-transparent">
      {content}
    </button>
  );
}
