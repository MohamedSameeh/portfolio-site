"use client";

import { motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { type L, useApp } from "@/lib/app-state";
import { site } from "@/lib/site";
import { ArrowDown, ArrowOut, Magnetic } from "./ui";

const HeroScene = dynamic(() => import("./hero-scene"), { ssr: false });

const copy = {
  role: { en: "product engineer", ar: "مهندس منتجات رقمية" },
  // Each inner array is one sentence of the headline, kept on its own line.
  headline: {
    en: [
      ["Interfaces", "with", "craft."],
      ["Systems", "that", "run", "themselves."],
    ],
    ar: [
      ["واجهات", "متقنة."],
      ["وأنظمة", "تعمل", "وحدها."],
    ],
  },
  lede: {
    en: "I design and build web apps, storefronts and AI agent systems, in English and Arabic, from the first sketch to production.",
    ar: "أصمّم وأبني تطبيقات الويب والمتاجر الإلكترونية وأنظمة وكلاء الذكاء الاصطناعي، بالعربية والإنجليزية، من أول مخطط حتى التشغيل الفعلي.",
  },
  start: { en: "Start a project", ar: "ابدأ مشروعك" },
  work: { en: "View the work", ar: "استعرض الأعمال" },
  process: { en: "How I work", ar: "طريقة العمل" },
  base: { en: "Based in Egypt, UTC+2", ar: "مصر، التوقيت UTC+2" },
  scroll: { en: "Scroll", ar: "مرّر للأسفل" },
} satisfies Record<string, L | { en: string[][]; ar: string[][] }>;

/* Whether this device should get the live WebGL scene at all. */
function detectScene(): "webgl" | "static" {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return "static";
    const nav = navigator as Navigator & { deviceMemory?: number };
    if ((nav.deviceMemory ?? 8) <= 2 || (nav.hardwareConcurrency ?? 8) <= 2) return "static";
    return "webgl";
  } catch {
    return "static";
  }
}
let sceneMode: "webgl" | "static" | null = null;
const noopSubscribe = () => () => {};
function useSceneMode() {
  return useSyncExternalStore(
    noopSubscribe,
    () => (sceneMode ??= detectScene()),
    () => null,
  );
}

/* Drawn fallback for devices without WebGL: the same trefoil, as line work. */
function StaticSculpture() {
  const points: string[] = [];
  for (let i = 0; i <= 360; i++) {
    const a = (i / 360) * Math.PI * 2;
    const x = Math.sin(a) + 2 * Math.sin(2 * a);
    const y = Math.cos(a) - 2 * Math.cos(2 * a);
    points.push(`${(x * 46).toFixed(1)},${(y * 46).toFixed(1)}`);
  }
  return (
    <div className="absolute inset-0 grid place-items-center lg:place-items-end">
      <svg
        viewBox="-220 -220 440 440"
        className="h-[62vmin] w-[62vmin] -translate-y-[16vh] lg:me-[8vw] lg:translate-y-0 lg:self-center"
        aria-hidden
      >
        <defs>
          <linearGradient id="knot-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e2e8f0" />
            <stop offset="0.5" stopColor="#38bdf8" />
            <stop offset="1" stopColor="#1e293b" />
          </linearGradient>
          <filter id="knot-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>
        <circle r="205" fill="none" stroke="rgba(255,255,255,0.08)" />
        <ellipse rx="205" ry="70" fill="none" stroke="rgba(56,189,248,0.35)" transform="rotate(-18)" />
        <ellipse rx="190" ry="54" fill="none" stroke="rgba(255,255,255,0.1)" transform="rotate(34)" />
        <polyline points={points.join(" ")} fill="none" stroke="#38bdf8" strokeWidth="16" opacity="0.28" filter="url(#knot-glow)" />
        <polyline points={points.join(" ")} fill="none" stroke="url(#knot-stroke)" strokeWidth="13" strokeLinejoin="round" />
        <polyline points={points.join(" ")} fill="none" stroke="rgba(6,7,10,0.85)" strokeWidth="7" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function Hero() {
  const { t, locale, rtl, ready, showcase } = useApp();
  const reduced = useReducedMotion();
  const mode = useSceneMode();
  const lines = copy.headline[locale];
  let wordIndex = 0;

  return (
    <section id="top" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* Stage light: one soft pool where the sculpture stands. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20">
        <div className="absolute top-[-10%] h-[90vmin] w-[90vmin] rounded-full bg-[radial-gradient(closest-side,rgba(56,189,248,0.13),rgba(56,189,248,0.04)_55%,transparent)] max-lg:start-1/2 max-lg:-translate-x-1/2 lg:end-[-6%] lg:top-[6%] rtl:max-lg:translate-x-1/2" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-bg to-transparent" />
      </div>

      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        {mode === "webgl" && <HeroScene rtl={rtl} animate={!reduced} fallback={<StaticSculpture />} />}
        {mode === "static" && <StaticSculpture />}
      </div>

      {/* On phones the text sits low, over a fade, so it never fights the sculpture. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[68%] bg-gradient-to-t from-bg from-55% via-bg/90 via-75% to-transparent lg:hidden" />

      <div
        data-page
        className="mx-auto flex w-full max-w-[1240px] 2xl:max-w-[1400px] flex-1 flex-col justify-end px-5 pb-10 pt-28 sm:px-8 lg:justify-center lg:pb-16"
      >
        <div className="max-w-[760px] lg:max-w-[70%]">
          <motion.p
            key={`role-${locale}`}
            initial={{ opacity: 0, y: 10 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="mb-5 flex items-center gap-3 text-[14px] text-dim sm:mb-7 sm:text-[15px]"
          >
            <span className="h-px w-8 bg-accent/70" />
            <span>
              <span className="text-ink">{t(site.name)}</span>
              {locale === "ar" ? "، " : ", "}
              {t(copy.role)}
            </span>
          </motion.p>

          <h1
            key={`h1-${locale}`}
            aria-label={lines.map((l) => l.join(" ")).join(" ")}
            className="display text-[clamp(2.3rem,9.7vw,3.6rem)] font-bold text-ink sm:text-[clamp(3rem,5.25vw,5.2rem)] rtl:text-[clamp(2.6rem,11vw,4rem)] rtl:sm:text-[clamp(3rem,5.2vw,5.2rem)]"
          >
            {lines.map((line, li) => (
              <span key={li} className={`block ${li === 1 ? "text-[#858c99]" : ""}`} aria-hidden>
                {line.map((word) => {
                  const i = wordIndex++;
                  return (
                    <span
                      key={`${word}-${i}`}
                      className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom rtl:-mt-[0.1em] rtl:pt-[0.1em]"
                    >
                      <motion.span
                        className="inline-block will-change-transform"
                        initial={{ y: "118%", rotate: rtl ? -3 : 3 }}
                        animate={ready ? { y: 0, rotate: 0 } : undefined}
                        transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1], delay: 0.28 + i * 0.075 }}
                      >
                        {word}
                      </motion.span>
                      {" "}
                    </span>
                  );
                })}
              </span>
            ))}
          </h1>

          <motion.p
            key={`lede-${locale}`}
            initial={{ opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.85 }}
            className="mt-6 max-w-[34rem] text-[16px] leading-[1.7] text-dim sm:mt-8 sm:text-[18px]"
          >
            {t(copy.lede)}
          </motion.p>

          <motion.div
            key={`cta-${locale}`}
            initial={{ opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 1 }}
            className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4 sm:mt-10"
          >
            <Magnetic>
              <a
                href={showcase ? "#work" : "#contact"}
                className="group relative flex h-14 items-center gap-3 rounded-full bg-ink ps-7 pe-2 text-[15.5px] font-semibold text-bg shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_18px_50px_-14px_rgba(56,189,248,0.55)] transition-shadow duration-500 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.3),0_22px_60px_-10px_rgba(56,189,248,0.8)]"
              >
                {t(showcase ? copy.work : copy.start)}
                <span className="grid size-10 place-items-center rounded-full bg-bg text-ink transition-transform duration-500 ease-out group-hover:rotate-45 rtl:group-hover:-rotate-45">
                  <ArrowOut />
                </span>
              </a>
            </Magnetic>
            <a
              href={showcase ? "#process" : "#work"}
              className="group flex h-14 items-center gap-2.5 rounded-full border border-white/[0.1] px-6 text-[15px] text-ink transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.04]"
            >
              {t(showcase ? copy.process : copy.work)}
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : undefined}
          transition={{ duration: 1.2, delay: 1.3 }}
          className="mt-12 flex items-center justify-between border-t border-white/[0.08] pt-5 text-[12.5px] text-faint lg:mt-20"
        >
          <span>{t(copy.base)}</span>
          <a href="#capabilities" className="flex items-center gap-2 transition-colors hover:text-ink">
            {t(copy.scroll)}
            <ArrowDown width={13} height={13} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
