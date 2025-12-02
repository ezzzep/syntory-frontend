"use client";

import { ReactNode, useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Button } from "@/components/button-1";

type ToastType = "message" | "success" | "warning" | "error";

interface Toast {
  id: number;
  text: string | ReactNode;
  type: ToastType;
  action?: string;
  onAction?: () => void;
  onUndoAction?: () => void;
}

let root: ReturnType<typeof createRoot> | null = null;
let toastId = 0;

const toastStore = {
  toasts: [] as Toast[],
  listeners: new Set<() => void>(),
  add(toast: Omit<Toast, "id">) {
    const id = toastId++;
    this.toasts.push({ ...toast, id });
    this.notify();
    if (!toast.action && !toast.onUndoAction) {
      setTimeout(() => this.remove(id), 3000);
    }
  },
  remove(id: number) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  },
  subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  },
  notify() {
    this.listeners.forEach((fn) => fn());
  },
};

const TypeIcon = ({ type }: { type: ToastType }) => {
  const icons: Record<ToastType, ReactNode> = {
    message: null,
    success: <span className="text-xl">✅</span>,
    warning: <span className="text-xl">⚠️</span>,
    error: <span className="text-xl">❌</span>,
  };
  return <>{icons[type]}</>;
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const updateToasts = () => setToasts([...toastStore.toasts]);
    updateToasts();
    const unsubscribe = toastStore.subscribe(updateToasts);
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="fixed bottom-16 right-4 z-[9999] w-[420px] pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="mb-2 p-4 flex items-center justify-between bg-white shadow-menu rounded-xl pointer-events-auto transition-all"
        >
          <div className="flex items-center gap-2">
            <TypeIcon type={toast.type} />
            <span>{toast.text}</span>
          </div>
          <div className="flex gap-1">
            {toast.onUndoAction && (
              <Button
                type="tertiary"
                svgOnly
                size="small"
                onClick={() => {
                  toast.onUndoAction?.();
                  toastStore.remove(toast.id);
                }}
              >
                ↩️
              </Button>
            )}
            <Button
              type="tertiary"
              svgOnly
              className="font-bold cursor-pointer"
              onClick={() => toastStore.remove(toast.id)}
            >
              X
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

const mountContainer = () => {
  if (root) return;
  const el = document.createElement("div");
  document.body.appendChild(el);
  root = createRoot(el);
  root.render(<ToastContainer />);
};

interface Message {
  text: string | ReactNode;
  action?: string;
  onAction?: () => void;
  onUndoAction?: () => void;
  type?: ToastType;
}

export const useToasts = () => ({
  toast: useCallback((msg: Message) => {
    mountContainer();
    toastStore.add({ type: msg.type || "message", ...msg });
  }, []),
  success: useCallback((text: string) => {
    mountContainer();
    toastStore.add({ type: "success", text });
  }, []),
  warning: useCallback((text: string) => {
    mountContainer();
    toastStore.add({ type: "warning", text });
  }, []),
  error: useCallback((text: string) => {
    mountContainer();
    toastStore.add({ type: "error", text });
  }, []),
});
