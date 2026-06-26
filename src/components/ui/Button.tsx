'use client';

import { motion } from 'framer-motion';
import { useVibration } from '@/hooks/useVibration';
import { springs } from '@/lib/animations';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  id?: string;
}

const variantStyles: Record<string, string> = {
  primary:   'bg-gradient-to-r from-[#FF7EB6] to-[#FF5EA3] text-white shadow-[0_8px_32px_rgba(255,126,182,0.45)]',
  secondary: 'bg-white/30 backdrop-blur-md border border-white/40 text-[#3D3142]',
  ghost:     'bg-transparent text-[#FF7EB6] border border-[#FF7EB6]/40',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-5 py-2.5 text-sm rounded-2xl',
  md: 'px-8 py-4   text-base rounded-3xl',
  lg: 'px-10 py-5  text-lg rounded-[28px]',
};

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  id,
}: ButtonProps) {
  const { vibrate } = useVibration();

  const handleClick = () => {
    if (disabled) return;
    vibrate('tap');
    onClick?.();
  };

  return (
    <motion.button
      id={id}
      onClick={handleClick}
      disabled={disabled}
      whileTap={{ scale: 0.94 }}
      whileHover={{ scale: 1.03 }}
      transition={springs.snappy}
      className={`
        font-nunito font-bold tracking-wide select-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      aria-label={typeof children === 'string' ? children : undefined}
    >
      {children}
    </motion.button>
  );
}
