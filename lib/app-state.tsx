"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

export type Locale = "en" | "ar";
export type L = { en: string; ar: string };

type AppState = {
  locale: Locale;
  /** ?showcase=true: every personal contact route is removed from the page. */
  showcase: boolean;
  /** False during the server render and the hydration pass. */
  ready: boolean;
};

const SERVER_STATE: AppState = { locale: "en", showcase: false, ready: false };

let state: AppState = SERVER_STATE;
const listeners = new Set<() => void>();

/** True when a string has no Arabic in it (a product name, a figure). */
export const isLatin = (text: string) => !/[؀-ۿ]/.test(text);

function isLocale(v: string | null): v is Locale {
  return v === "en" || v === "ar";
}

function readClientState(): AppState {
  if (state.ready) return state;
  let locale: Locale = "en";
  let showcase = false;
  try {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("lang");
    const stored = window.localStorage.getItem("locale");
    locale = isLocale(fromUrl) ? fromUrl : isLocale(stored) ? stored : "en";
    showcase = params.get("showcase") === "true";
  } catch {
    /* private mode or blocked storage: keep the defaults */
  }
  state = { locale, showcase, ready: true };
  return state;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function commitLocale(locale: Locale) {
  state = { ...state, locale };
  try {
    window.localStorage.setItem("locale", locale);
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function useApp() {
  const snapshot = useSyncExternalStore(
    subscribe,
    readClientState,
    () => SERVER_STATE,
  );

  const setLocale = useCallback((next: Locale) => {
    if (next === state.locale) return;
    const root = document.documentElement;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      commitLocale(next);
      return;
    }
    // Dip the page out, swap language and direction, bring it back.
    root.classList.add("lang-fade");
    window.setTimeout(() => {
      commitLocale(next);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => root.classList.remove("lang-fade"));
      });
    }, 170);
  }, []);

  const t = useCallback(
    (text: L) => text[snapshot.locale],
    [snapshot.locale],
  );

  return {
    ...snapshot,
    rtl: snapshot.locale === "ar",
    setLocale,
    t,
  };
}

/** Keeps <html lang dir> in step with the chosen language. Mount once. */
export function DocumentDirection() {
  const { locale, ready } = useApp();
  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    root.lang = locale;
    root.dir = locale === "ar" ? "rtl" : "ltr";
    root.dataset.hydrated = "true";
  }, [locale, ready]);
  return null;
}
