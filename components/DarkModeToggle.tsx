"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const getPreferredTheme = () => {
  if (typeof window === "undefined") {
    return "light";
  }

  try {
    const storedTheme = window.localStorage.getItem("theme");
    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch (error) {
    console.error("Theme detection failed:", error);
    return "light";
  }
};

export default function DarkModeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const preferredTheme = getPreferredTheme();
    setTheme(preferredTheme);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    try {
      const root = window.document.documentElement;
      root.classList.toggle("dark", theme === "dark");
      window.localStorage.setItem("theme", theme);
    } catch (error) {
      console.error("Theme application failed:", error);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="flex items-center gap-2 text-slate-800 dark:text-white"
    >
      {theme === "dark" ? (
        <>
          <Moon className="h-4 w-4 text-slate-800 dark:text-white" />
          <span>다크</span>
        </>
      ) : (
        <>
          <Sun className="h-4 w-4 text-slate-800 dark:text-white" />
          <span>라이트</span>
        </>
      )}
    </Button>
  );
}
