"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored || (prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(initial);
    document.documentElement.style.colorScheme = initial;
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(next);
    document.documentElement.style.colorScheme = next;
  }

  if (!mounted) {
    return (
      <button className="text-muted-foreground flex size-8 items-center justify-center">
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
          <path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.929zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z" />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      className="text-muted-foreground hover:text-foreground flex size-8 items-center justify-center rounded-md transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
          <path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.929zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
          <path d="M11.01 3.05C6.51 3.54 3 7.36 3 12a9 9 0 0 0 9 9c4.64 0 8.46-3.51 8.95-8.01.2-1.02-.85-1.79-1.74-1.28-.47.27-.99.44-1.53.52-1.43.19-2.86-.28-3.89-1.31-1.03-1.03-1.5-2.46-1.31-3.89.08-.54.25-1.06.52-1.53.51-.89-.26-1.94-1.28-1.74-.27.05-.54.12-.81.2-.55.18-1.02.57-1.26 1.08-.42.88-.52 1.87-.27 2.81.25.94.84 1.74 1.66 2.27.82.53 1.78.73 2.74.58.96-.15 1.84-.65 2.46-1.4.62-.75.96-1.71.96-2.7 0-2.21-1.79-4-4-4-.99 0-1.95.34-2.7.96-.51.42-.9.99-1.08 1.62z" />
        </svg>
      )}
    </button>
  );
}
