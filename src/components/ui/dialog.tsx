"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import clsx from "clsx";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

interface DialogContentProps {
  title?: string; // optional
  children: React.ReactNode;
  className?: string;
}

export function DialogContent({
  title,
  children,
  className,
}: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

      <DialogPrimitive.Content
        className={clsx(
          "fixed left-1/2 top-1/2 w-[90%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-gray-800 p-6 shadow-lg",
          className
        )}
      >
        {title ? (
          <DialogPrimitive.Title className="text-lg font-semibold mb-4">
            {title}
          </DialogPrimitive.Title>
        ) : (
          <DialogPrimitive.Title asChild>
            <VisuallyHidden></VisuallyHidden>
          </DialogPrimitive.Title>
        )}

        {children}

        <DialogPrimitive.Close className="absolute right-4 top-4 p-1 hover:bg-gray-600 text-white rounded-full cursor-pointer">
          <X size={20} />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2 className={clsx("text-lg font-semibold", className)}>{children}</h2>
  );
}
