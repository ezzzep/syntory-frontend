import * as React from "react";
import { cn } from "@/lib/utils";

export function Button({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90",
        className
      )}
      {...props}
    />
  );
}
