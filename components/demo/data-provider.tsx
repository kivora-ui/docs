"use client";

import * as React from "react";
import { subscriberSeed, titleSeed } from "@/lib/demo/seed";
import type { Subscriber, Title } from "@/lib/demo/types";

const STORAGE_KEY = "kivora-demo-ott-v1";

interface DemoStore {
  titles: Title[];
  subscribers: Subscriber[];
}

function isDemoStore(value: unknown): value is DemoStore {
  if (!value || typeof value !== "object") return false;
  const store = value as DemoStore;
  return Array.isArray(store.titles) && Array.isArray(store.subscribers);
}

interface DemoDataContextValue extends DemoStore {
  addTitle: (title: Title) => void;
  addSubscriber: (subscriber: Subscriber) => void;
}

const DemoDataContext = React.createContext<DemoDataContextValue | null>(null);

export function useDemoData(): DemoDataContextValue {
  const context = React.useContext(DemoDataContext);
  if (!context) {
    throw new Error("useDemoData must be used within DemoDataProvider");
  }
  return context;
}

export function DemoDataProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = React.useState<DemoStore>({
    titles: titleSeed,
    subscribers: subscriberSeed,
  });
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (isDemoStore(parsed)) setStore(parsed);
      }
    } catch {
      // Corrupt or unavailable storage: keep the seed.
    } finally {
      setReady(true);
    }
  }, []);

  React.useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch {
      // Storage unavailable (e.g. private browsing quota): keep in-memory only.
    }
  }, [store, ready]);

  const addTitle = React.useCallback((title: Title) => {
    setStore((prev) => ({ ...prev, titles: [title, ...prev.titles] }));
  }, []);

  const addSubscriber = React.useCallback((subscriber: Subscriber) => {
    setStore((prev) => ({ ...prev, subscribers: [subscriber, ...prev.subscribers] }));
  }, []);

  const value = React.useMemo<DemoDataContextValue>(
    () => ({ ...store, addTitle, addSubscriber }),
    [store, addTitle, addSubscriber]
  );

  return <DemoDataContext.Provider value={value}>{children}</DemoDataContext.Provider>;
}
