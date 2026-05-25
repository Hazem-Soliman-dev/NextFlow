"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { translations, Locale, TranslationType } from "./translations"

type Theme = "light" | "dark"

interface LanguageContextType {
  lang: Locale
  dir: "ltr" | "rtl"
  strings: TranslationType
  toggleLang: () => void
  theme: Theme
  toggleTheme: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const LANG_STORAGE_KEY = "ag-lang"
const THEME_STORAGE_KEY = "ag-theme"

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Locale>("en")
  const [theme, setTheme] = useState<Theme>("dark")

  useEffect(() => {
    // 1. Initialise Language
    const savedLang = localStorage.getItem(LANG_STORAGE_KEY) as Locale
    const initialLang = savedLang === "ar" || savedLang === "en" ? savedLang : "en"
    setLang(initialLang)
    applyLangAttrs(initialLang)

    // 2. Initialise Theme
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const initialTheme = savedTheme === "light" || savedTheme === "dark" ? savedTheme : (prefersDark ? "dark" : "light")
    setTheme(initialTheme)
    applyThemeAttrs(initialTheme)
  }, [])

  const applyLangAttrs = (currentLang: Locale) => {
    const dir = currentLang === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = currentLang
    document.documentElement.dir = dir
    localStorage.setItem(LANG_STORAGE_KEY, currentLang)
    
    // Set custom font property based on language
    document.documentElement.style.setProperty(
      "--font-sans",
      currentLang === "ar" ? "'IBM Plex Arabic', sans-serif" : "'Inter', sans-serif"
    )
  }

  const applyThemeAttrs = (currentTheme: Theme) => {
    document.documentElement.dataset.theme = currentTheme
    // For Tailwind/shadcn component compatibility:
    if (currentTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem(THEME_STORAGE_KEY, currentTheme)
  }

  const toggleLang = () => {
    const nextLang: Locale = lang === "en" ? "ar" : "en"
    setLang(nextLang)
    applyLangAttrs(nextLang)
  }

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark"
    setTheme(nextTheme)
    applyThemeAttrs(nextTheme)
  }

  const dir = lang === "ar" ? "rtl" : "ltr"
  const strings = translations[lang]

  return (
    <LanguageContext.Provider value={{ lang, dir, strings, toggleLang, theme, toggleTheme }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLang must be used within a LanguageProvider")
  }
  return context
}
