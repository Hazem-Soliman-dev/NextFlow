import type { Metadata } from "next";
import { Inter, DM_Sans, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { LanguageProvider } from "@/lib/lang-context";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexflow - CRM, Inventory & Invoicing",
  description: "A free-tier portfolio demo of a full-stack business application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "dark",
        "antialiased",
        "h-full",
        inter.variable,
        dmSans.variable,
        geist.variable,
        "font-sans"
      )}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem("ag-theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
                  document.documentElement.dataset.theme = savedTheme;
                  if (savedTheme === "dark") {
                    document.documentElement.classList.add("dark");
                  } else {
                    document.documentElement.classList.remove("dark");
                  }
                  
                  const savedLang = localStorage.getItem("ag-lang") || "en";
                  document.documentElement.lang = savedLang;
                  document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";
                  document.documentElement.style.setProperty(
                    "--font-sans",
                    savedLang === "ar" ? "'IBM Plex Arabic', sans-serif" : "'Inter', sans-serif"
                  );
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

