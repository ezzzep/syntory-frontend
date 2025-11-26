import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      `
      bg-white text-black rounded-lg text-base
      h-12 px-4 shadow-sm
      placeholder:text-black/40
      focus:ring-2 focus:ring-black/40
      border-none
      `,
      className
    )}
    {...props}
  />
));

Input.displayName = "Input";
