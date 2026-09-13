"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguageStore, Language } from "../../../store/languageStore";
import { IoIosArrowDown, IoIosCheckmark } from "react-icons/io";

interface LangOption {
  code: Language;
  label: string;
  flag: string;
  nativeName: string;
}

const LANGUAGES: LangOption[] = [
  { code: "en", label: "English", flag: "🇺🇸", nativeName: "English" },
  { code: "es", label: "Spanish", flag: "🇪🇸", nativeName: "Español" },
  { code: "fr", label: "French", flag: "🇫🇷", nativeName: "Français" },
  { code: "it", label: "Italian", flag: "🇮🇹", nativeName: "Italiano" },
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguageStore();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  /* close on outside click */
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  /* close on Escape */
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  function select(code: Language) {
    setLanguage(code);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative hidden sm:block">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 h-8 cursor-pointer px-2.5 rounded-lg transition-all duration-150 border"
        style={{
          backgroundColor: open
            ? "rgba(20,102,192,0.15)"
            : "rgba(188,199,222,0.08)",
          borderColor: open ? "rgba(20,102,192,0.5)" : "rgba(188,199,222,0.12)",
          color: "#bcc7de",
        }}
        onMouseEnter={(e) => {
          if (!open) {
            (e.currentTarget as HTMLElement).style.backgroundColor =
              "rgba(188,199,222,0.13)";
          }
        }}
        onMouseLeave={(e) => {
          if (!open) {
            (e.currentTarget as HTMLElement).style.backgroundColor =
              "rgba(188,199,222,0.08)";
          }
        }}
      >
        <span className="text-sm font-medium">
          {current.code.toUpperCase()}
        </span>

        <IoIosArrowDown
          className={`text-base transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      {/* Dropdown panel */}
      <div
        className="lang-dropdown"
        style={{
          position: "absolute",
          top: "calc(100% + 6px)",
          right: 0,
          width: 180,
          borderRadius: 10,
          border: "1px solid rgba(188,199,222,0.12)",
          backgroundColor: "#0d1e36",
          boxShadow: "0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.3)",
          overflow: "hidden",
          zIndex: 100,
          /* animate */
          transformOrigin: "top right",
          transform: open
            ? "scale(1) translateY(0)"
            : "scale(0.95) translateY(-6px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition:
            "transform 0.18s cubic-bezier(0.4,0,0.2,1), opacity 0.18s ease",
        }}
        role="listbox"
        aria-label="Select language"
      >
        {/* Options */}
        <ul>
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <li key={lang.code} role="option" aria-selected={isSelected}>
                <button
                  onClick={() => select(lang.code)}
                  className="w-full flex items-center gap-3 cursor-pointer px-3 py-3 transition-colors duration-100"
                  style={{
                    backgroundColor: isSelected
                      ? "rgba(20,102,192,0.18)"
                      : "transparent",
                    color: isSelected ? "#ffffff" : "#bcc7de",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected)
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        "rgba(188,199,222,0.07)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected)
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        "transparent";
                  }}
                >
                  {/* Labels */}
                  <div
                    className={`flex-1 text-left min-w-0 text-sm ${isSelected ? "font-semibold" : "font-normal"}`}
                  >
                    {lang.nativeName}
                  </div>

                  {/* Active tick */}
                  {isSelected && (
                    <IoIosCheckmark
                      size={20}
                      className="text-[#1466c0] shrink-0"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
