"use client";

import { ReactNode, useCallback, useEffect, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { Button } from "@/components/ui/button-1";

type ToastType = "message" | "success" | "warning" | "error";
type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

interface Toast {
  id: string;
  text: string | ReactNode;
  type: ToastType;
  action?: string;
  onAction?: () => void;
  duration?: number;
  persistent?: boolean;
  position?: ToastPosition;
  createdAt: number;
}

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const toastStore = {
  toasts: [] as Toast[],
  listeners: new Set<() => void>(),
  add(toast: Omit<Toast, "id" | "createdAt">) {
    const isDuplicate = this.toasts.some(
      (t) => t.text === toast.text && t.type === toast.type
    );

    if (isDuplicate) return null;

    const id = generateId();
    const newToast = { ...toast, id, createdAt: Date.now() };
    this.toasts.push(newToast);
    this.notify();

    if (!toast.persistent) {
      const duration = toast.duration ?? 3000;
      setTimeout(() => this.remove(id), duration);
    }

    return id;
  },
  remove(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  },
  clearAll() {
    this.toasts = [];
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
    message: <span className="text-xl">💬</span>,
    success: <span className="text-xl">✅</span>,
    warning: <span className="text-xl">⚠️</span>,
    error: <span className="text-xl">❌</span>,
  };
  return <>{icons[type]}</>;
};

const getPositionClasses = (position: ToastPosition) => {
  const positions: Record<ToastPosition, string> = {
    "top-right": "fixed top-4 right-4",
    "top-left": "fixed top-4 left-4",
    "bottom-right": "fixed bottom-16 right-4",
    "bottom-left": "fixed bottom-16 left-4",
    "top-center": "fixed top-4 left-1/2 transform -translate-x-1/2",
    "bottom-center": "fixed bottom-16 left-1/2 transform -translate-x-1/2",
  };
  return positions[position];
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateToasts = () => setToasts([...toastStore.toasts]);
    updateToasts();
    const unsubscribe = toastStore.subscribe(updateToasts);
    return () => {
      unsubscribe();
    };
  }, []);

  const toastsByPosition = toasts.reduce((acc, toast) => {
    const position = toast.position || "bottom-right";
    if (!acc[position]) acc[position] = [];
    acc[position].push(toast);
    return acc;
  }, {} as Record<ToastPosition, Toast[]>);

  return (
    <>
      {Object.entries(toastsByPosition).map(([position, positionToasts]) => (
        <div
          key={position}
          ref={containerRef}
          className={`${getPositionClasses(
            position as ToastPosition
          )} z-[9999] w-[420px] pointer-events-none`}
        >
          {positionToasts.map((toast, index) => (
            <div
              key={toast.id}
              className={`mb-2 p-4 flex items-center justify-between bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-md rounded-xl pointer-events-auto transition-all transform border border-slate-700/50 shadow-xl hover:shadow-2xl ${
                index === 0 ? "animate-slide-in" : ""
              }`}
              style={{
                animation: `slideIn 0.3s ease-out forwards`,
                opacity: 1,
                transform: `translateY(0)`,
                maxHeight: "200px",
              }}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {/* Removed the circular background and just kept the emoji */}
                <TypeIcon type={toast.type} />
                <span className="text-white truncate">{toast.text}</span>
              </div>
              <div className="flex gap-1 ml-2">
                {toast.action && toast.onAction && (
                  <Button
                    type="primary"
                    size="small"
                    className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-white border-0"
                    onClick={() => {
                      toast.onAction?.();
                      toastStore.remove(toast.id);
                    }}
                  >
                    {toast.action}
                  </Button>
                )}
                <Button
                  type="tertiary"
                  svgOnly
                  className="font-bold cursor-pointer text-white hover:text-gray-300"
                  onClick={() => toastStore.remove(toast.id)}
                  aria-label="Close"
                >
                  X
                </Button>
              </div>
            </div>
          ))}
        </div>
      ))}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

let root: ReturnType<typeof createRoot> | null = null;

const mountContainer = () => {
  if (root) return;
  const el = document.createElement("div");
  el.id = "toast-container";
  document.body.appendChild(el);
  root = createRoot(el);
  root.render(<ToastContainer />);
};

interface Message {
  text: string | ReactNode;
  action?: string;
  onAction?: () => void;
  type?: ToastType;
  duration?: number;
  persistent?: boolean;
  position?: ToastPosition;
}

export const useToasts = () => ({
  toast: useCallback((msg: Message) => {
    mountContainer();
    return toastStore.add({ type: msg.type || "message", ...msg });
  }, []),
  success: useCallback(
    (text: string, options?: Omit<Message, "text" | "type">) => {
      mountContainer();
      return toastStore.add({ type: "success", text, ...options });
    },
    []
  ),
  warning: useCallback(
    (text: string, options?: Omit<Message, "text" | "type">) => {
      mountContainer();
      return toastStore.add({ type: "warning", text, ...options });
    },
    []
  ),
  error: useCallback(
    (text: string, options?: Omit<Message, "text" | "type">) => {
      mountContainer();
      return toastStore.add({ type: "error", text, ...options });
    },
    []
  ),

  itemDeleted: useCallback(
    (itemName: string, options?: Omit<Message, "text" | "type">) => {
      mountContainer();
      return toastStore.add({
        type: "message",
        text: `${itemName} deleted`,
        ...options,
      });
    },
    []
  ),
  clearAll: useCallback(() => {
    toastStore.clearAll();
  }, []),
});
