"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const DARK = {
  "--bg-primary": "#0d0d0d",
  "--bg-secondary": "#111111",
  "--bg-card": "#161616",
  "--color-accent": "#00ff88",
  "--color-accent-dim": "rgba(0, 255, 136, 0.15)",
  "--color-accent-border": "rgba(0, 255, 136, 0.3)",
  "--text-primary": "#e5e5e5",
  "--text-secondary": "#888888",
  "--text-muted": "#767676",
  "--border-color": "#1f1f1f",
};

const LIGHT = {
  "--bg-primary": "#f0f2f5",
  "--bg-secondary": "#e8eaed",
  "--bg-card": "#ffffff",
  "--color-accent": "#006644",
  "--color-accent-dim": "rgba(0, 102, 68, 0.12)",
  "--color-accent-border": "rgba(0, 102, 68, 0.35)",
  "--text-primary": "#0f0f0f",
  "--text-secondary": "#4a4a4a",
  "--text-muted": "#6b6b6b",
  "--border-color": "#d0d0d0",
};

function applyTheme(light: boolean) {
  const vars = light ? LIGHT : DARK;
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const light = saved === "light";
    setIsDark(!light);
    applyTheme(light);
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    applyTheme(!next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      onClick={toggle}
      aria-label="테마 전환"
      className="fixed top-4 right-4 z-50 flex items-center gap-1.5 px-1 py-1 transition-all duration-200"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderRadius: "999px",
      }}
    >
      <span
        className="flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200"
        style={{
          backgroundColor: isDark ? "var(--color-accent)" : "transparent",
          color: isDark ? "var(--bg-primary)" : "var(--text-muted)",
        }}
      >
        <Moon size={12} />
      </span>
      <span
        className="flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200"
        style={{
          backgroundColor: !isDark ? "var(--color-accent)" : "transparent",
          color: !isDark ? "var(--bg-primary)" : "var(--text-muted)",
        }}
      >
        <Sun size={12} />
      </span>
    </button>
  );
}
