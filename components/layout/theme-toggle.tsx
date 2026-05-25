"use client"

import { useLang } from "@/lib/lang-context"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const { theme, toggleTheme, strings } = useLang()

  return (
    <button
      onClick={toggleTheme}
      className="ag-icon-btn transition-transform hover:scale-105 active:scale-95"
      aria-label={theme === "dark" ? strings.lightMode : strings.darkMode}
      title={theme === "dark" ? strings.lightMode : strings.darkMode}
    >
      {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
    </button>
  )
}
