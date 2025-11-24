const listeners = new Set<() => void>();

export const notifyAuthChanged = () => {
  listeners.forEach((listener) => listener());
};

export const subscribeToAuthChange = (callback: () => void): (() => void) => {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
};
