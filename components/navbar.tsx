"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { type L, type Locale, useApp } from "@/lib/app-state";
import { site } from "@/lib/site";
import { Close, Menu } from "./ui";

const links: { href: string; label: L }[] = [
  { href: "#work", label: { en: "Work", ar: "الأعمال" } },
  { href: "#capabilities", label: { en: "Capabilities", ar: "التخصصات" } },
  { href: "#process", label: { en: "Process", ar: "طريقة العمل" } },
  { href: "#contact", label: { en: "Contact", ar: "تواصل" } },
];

const availability: L = {
  en: "Available for select projects",
  ar: "متاح لمشاريع مختارة",
};

function Mark() {
  // Two offset strokes: a path that turns once and keeps going.
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
      <rect x="0.5" y="0.5" width="25" height="25" rx="7.5" stroke="rgba(255,255,255,0.14)" />
      <path d="M7.5 16.5V9.5h7" stroke="#e9edf3" strokeWidth="1.9" strokeLinecap="square" />
      <path d="M18.5 9.5v7h-7" stroke="#38bdf8" strokeWidth="1.9" strokeLinecap="square" />
    </svg>
  );
}

export function LanguageSwitch() {
  const { locale, setLocale } = useApp();
  const options: { id: Locale; label: string; name: string }[] = [
    { id: "ar", label: "AR", name: "العربية" },
    { id: "en", label: "EN", name: "English" },
  ];
  return (
    <div
      dir="ltr"
      role="group"
      aria-label="Language"
      className="relative flex h-9 items-center rounded-full border border-white/[0.08] bg-white/[0.03] p-0.5 font-mono text-[11px]"
    >
      {options.map((o) => {
        const active = locale === o.id;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => setLocale(o.id)}
            aria-pressed={active}
            aria-label={o.name}
            className={`relative z-10 h-8 w-10 rounded-full tracking-wider transition-colors duration-300 ${
              active ? "text-bg" : "text-dim hover:text-ink"
            }`}
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 -z-10 rounded-full bg-ink"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function Navbar() {
  const { t } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <motion.nav
        initial={{ y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        aria-label="Primary"
        className="relative mx-auto flex h-14 max-w-[1240px] 2xl:max-w-[1400px] items-center justify-between rounded-full border border-white/[0.08] bg-surface/60 ps-4 pe-2 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl backdrop-saturate-150"
      >
        <a href="#top" className="flex items-center gap-2.5" data-page>
          <Mark />
          <span className="display text-[17px] font-semibold tracking-tight">{t(site.mark)}</span>
        </a>

        <ul className="absolute start-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex rtl:translate-x-1/2" data-page>
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-3.5 py-2 text-[13.5px] text-dim transition-colors duration-300 hover:bg-white/[0.05] hover:text-ink"
              >
                {t(l.label)}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <p
            className="hidden items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.02] py-2 ps-3 pe-3.5 text-[12.5px] text-dim xl:flex"
            data-page
          >
            <span className="pulse-dot size-1.5 rounded-full bg-ok text-ok" />
            {t(availability)}
          </p>
          <span className="pulse-dot size-1.5 rounded-full bg-ok text-ok xl:hidden" title={t(availability)} />
          <LanguageSwitch />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-9 place-items-center rounded-full border border-white/[0.08] text-ink lg:hidden"
          >
            {open ? <Close /> : <Menu />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-2 max-w-[1240px] 2xl:max-w-[1400px] rounded-3xl border border-white/[0.08] bg-surface/90 p-2 backdrop-blur-xl lg:hidden"
          >
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-[15px] text-ink hover:bg-white/[0.05]"
                >
                  {t(l.label)}
                </a>
              </li>
            ))}
            <li className="flex items-center gap-2.5 px-4 py-3 text-[13px] text-dim">
              <span className="size-1.5 rounded-full bg-ok" />
              {t(availability)}
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
