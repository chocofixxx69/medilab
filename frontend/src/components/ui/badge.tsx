import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90",
        secondary:
          "border-border/50 bg-secondary/80 text-secondary-foreground hover:bg-secondary",
        destructive:
          "border-destructive/20 bg-destructive/10 text-destructive dark:text-rose-400 hover:bg-destructive/20",
        outline:
          "border-border/80 text-foreground bg-background/50 backdrop-blur-sm",
        success:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium",
        warning:
          "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium",
        info:
          "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300 font-medium",
        medical:
          "border-teal-500/20 bg-teal-500/10 text-teal-700 dark:text-teal-300 font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
