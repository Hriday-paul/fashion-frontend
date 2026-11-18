import { useSyncExternalStore } from "react";

// Tiny store so the checkout summary (which computes the GBP total) can share it
// with the pay button, which sits in a sibling component.
const totals = new Map<string, number>();
const listeners = new Set<() => void>();

export const setCheckoutTotal = (id: string, total: number) => {
  if (totals.get(id) === total) return;
  totals.set(id, total);
  listeners.forEach((l) => l());
};

export const useCheckoutTotal = (id: string): number | undefined =>
  useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => totals.get(id),
    () => undefined
  );
