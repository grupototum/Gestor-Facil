import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type FontScale = "normal" | "large" | "xlarge";

interface Ctx {
  scale: FontScale;
  setScale: (s: FontScale) => void;
  cycle: () => void;
}

const FontScaleContext = createContext<Ctx | null>(null);
const KEY = "campoos.fontScale";

export function FontScaleProvider({ children }: { children: ReactNode }) {
  const [scale, setScaleState] = useState<FontScale>("normal");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && (localStorage.getItem(KEY) as FontScale)) || "normal";
    setScaleState(saved);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dataset.fontScale = scale;
    }
  }, [scale]);

  const setScale = (s: FontScale) => {
    setScaleState(s);
    if (typeof window !== "undefined") localStorage.setItem(KEY, s);
  };

  const cycle = () => {
    const order: FontScale[] = ["normal", "large", "xlarge"];
    const i = order.indexOf(scale);
    setScale(order[(i + 1) % order.length]);
  };

  return <FontScaleContext.Provider value={{ scale, setScale, cycle }}>{children}</FontScaleContext.Provider>;
}

export function useFontScale() {
  const ctx = useContext(FontScaleContext);
  if (!ctx) throw new Error("FontScaleProvider missing");
  return ctx;
}
