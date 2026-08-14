import React from 'react';
import { cn } from '../utils/cn';

export interface LiquidGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'pill' | 'circle' | 'card';
  intensity?: 'light' | 'medium' | 'high';
  borderRing?: boolean;
  className?: string;
}

export function LiquidGlass({
  children,
  variant = 'pill',
  intensity = 'medium',
  borderRing = true,
  className,
  ...props
}: LiquidGlassProps) {
  const intensityClasses = {
    light: 'bg-white/5 dark:bg-black/10 backdrop-blur-md',
    medium: 'bg-white/10 dark:bg-zinc-900/40 backdrop-blur-xl',
    high: 'bg-white/20 dark:bg-zinc-900/70 backdrop-blur-2xl shadow-2xl',
  };

  const shapeClasses = {
    pill: 'rounded-full px-4 py-2',
    circle: 'rounded-full aspect-square flex items-center justify-center',
    card: 'rounded-3xl p-4',
  };

  return (
    <div
      className={cn(
        'relative transition-all duration-300',
        intensityClasses[intensity],
        shapeClasses[variant],
        borderRing && 'border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] hover:border-purple-300/40 dark:hover:border-purple-500/30',
        className
      )}
      {...props}
    >
      {/* Liquid Glass Highlight Overlay */}
      <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
      {children}
    </div>
  );
}
