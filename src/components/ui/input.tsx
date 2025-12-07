import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "light" | "dark";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = "light", ...props }, ref) => {
    const baseStyles =
      "rounded-lg text-base h-12 px-4 shadow-sm border-none focus:ring-2";

    const lightStyles =
      "bg-white text-black placeholder:text-black/40 focus:ring-black/40";
    const darkStyles =
      "bg-slate-700/30 border-slate-600/30 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 backdrop-blur-md";

    const variantStyles = variant === "dark" ? darkStyles : lightStyles;

    return (
      <input
        ref={ref}
        className={cn(baseStyles, variantStyles, className)}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
