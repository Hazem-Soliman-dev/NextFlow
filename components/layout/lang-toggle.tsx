"use client"

import { useLang } from "@/lib/lang-context"

export function LangToggle() {
  const { lang, toggleLang } = useLang()

  return (
    <button
      onClick={toggleLang}
      className="ag-icon-btn px-3 w-auto font-semibold text-xs border border-border/30 rounded-md transition-all hover:bg-muted hover:text-foreground hover:scale-105 active:scale-95"
      aria-label={lang === "en" ? "تغيير اللغة إلى العربية" : "Change language to English"}
    >
      <span className="font-sans">
        {lang === "en" ? "العربية" : "English"}
      </span>
    </button>
  )
}
