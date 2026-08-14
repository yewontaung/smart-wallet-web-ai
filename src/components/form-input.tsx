import React from 'react';
import { cn } from '../utils/cn';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, icon, rightElement, className, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold uppercase tracking-wider text-purple-200/80 dark:text-zinc-400">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 text-purple-300/70 dark:text-zinc-400 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-purple-950/40 dark:bg-zinc-900/80 border border-purple-500/20 dark:border-zinc-800 text-white rounded-2xl py-3 text-sm transition-all outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 placeholder:text-purple-300/40 dark:placeholder:text-zinc-500',
              icon ? 'pl-10' : 'pl-4',
              rightElement ? 'pr-12' : 'pr-4',
              error && 'border-rose-500/60 focus:ring-rose-500/50',
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3.5 flex items-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && <span className="text-xs text-rose-400 font-medium px-1">{error}</span>}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
