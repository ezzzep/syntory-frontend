import * as React from "react";
import { cn } from "@/lib/utils";

export function Button({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const defaultClasses = `
    bg-black text-white rounded-lg 
    h-12 text-base font-semibold
    transition-all duration-300
    hover:scale-[1.02] hover:bg-black/90
    active:scale-95
    disabled:opacity-50 cursor-pointer
  `;

  return <button className={cn(defaultClasses, className)} {...props} />;
}
