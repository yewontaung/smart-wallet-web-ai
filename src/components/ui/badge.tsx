import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-purple-600 text-white shadow hover:bg-purple-500',
        secondary:
          'border-transparent bg-zinc-800 text-zinc-300 hover:bg-zinc-700',
        destructive:
          'border-rose-500/30 bg-rose-500/10 text-rose-400 border',
        success:
          'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 border',
        warning:
          'border-amber-500/30 bg-amber-500/10 text-amber-400 border',
        outline: 'border-zinc-800 text-zinc-300',
        purple: 'border-purple-500/30 bg-purple-500/10 text-purple-300 border',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  className?: string;
  children?: React.ReactNode;
}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
