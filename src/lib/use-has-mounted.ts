"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

/** Guards against hydration mismatches for client-only state (e.g. persisted cart). */
export function useHasMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
