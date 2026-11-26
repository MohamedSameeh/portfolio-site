"use client";

import type { PointerEvent, ReactNode } from "react";
import { type L, useApp } from "@/lib/app-state";

const heading: L = {
  en: "Four things I am hired for",
  ar: "أربعة أشياء أُوظَّف من أجلها",
};
const sub: L = {
  en: "Each one is a part of a product I have built, not a keyword.",
  ar: "كل واحد منها جزء من منتج بنيته فعلًا، لا كلمة مفتاحية.",
};

const tech = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Three.js",
  "Framer Motion",
  "Flutter",
  "Dart",
  "Firebase",
  "Python",
  "FastAPI",
  "Postgres",
  "SQLite",
  "Gemini API",
  "Playwright",
  "Docker",
];

function Card({
  title,
  body,
  className = "",
  children,
}: {
  title: string;
  body: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <article
      data-spot
      className={`spot flex flex-col justify-between overflow-hidden rounded-[28px] border border-white/[0.08] bg-surface p-6 sm:p-8 ${className}`}
    >
      <div className="mb-10">{children}</div>
      <div>
        <h3 className="display text-[22px] font-semibold text-ink sm:text-[26px]">{title}</h3>
        <p className="mt-3 max-w-[30rem] text-[15px] leading-[1.7] text-dim">{body}</p>
      </div>
    </article>
  );
}

/* Small figures. Each one shows the capability instead of naming it again. */

function StackFigure() {
  const rows = [
    ["interface", "Next.js, React, TypeScript"],
    ["services", "Route handlers, Python, webhooks"],
    ["data", "Postgres, SQLite, object storage"],
  ];
  return (
    <div dir="ltr" className="space-y-2 font-mono text-[12.5px]">
      {rows.map(([k, v], i) => (
        <div
          key={k}
          className="flex items-center gap-4 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3"
          style={{ marginInlineStart: `${i * 22}px` }}
        >
          <span className="w-20 shrink-0 text-accent">{k}</span>
          <span className="truncate text-dim">{v}</span>
        </div>
      ))}
    </div>
  );
}

function MotionFigure() {
  return (
    <div dir="ltr" className="relative h-[132px]">
      <svg viewBox="0 0 320 132" className="h-full w-full" fill="none" aria-hidden>
        <path d="M0 131.5h320M0.5 0v132" stroke="rgba(255,255,255,0.08)" />
        <path d="M0 131 C 52 131, 96 6, 320 4" stroke="rgba(56,189,248,0.9)" strokeWidth="1.6" />
        <path d="M0 131 L 320 4" stroke="rgba(255,255,255,0.12)" strokeDasharray="3 5" />
        <circle r="5" fill="#e9edf3">
          <animateMotion dur="2.6s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.16 1 0.3 1" path="M0 131 C 52 131, 96 6, 320 4" />
        </circle>
      </svg>
      <span className="absolute end-0 bottom-2 font-mono text-[11.5px] text-faint">ease-out, 60fps</span>
    </div>
  );
}

function DirectionFigure() {
  return (
    <div className="space-y-2.5 text-[14px]">
      <div dir="ltr" className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">
        <span className="text-ink">Checkout</span>
        <span className="font-mono text-[12.5px] text-dim">20% off</span>
        <span className="text-accent" aria-hidden>
          &#8594;
        </span>
      </div>
      <div dir="rtl" className="flex items-center justify-between rounded-xl border border-accent/25 bg-accent/[0.04] px-4 py-3" style={{ fontFamily: "var(--font-plex-ar), sans-serif" }}>
        <span className="text-ink">إتمام الشراء</span>
        <span className="text-[13px] text-dim">
          خصم <span className="ltr-isolate font-mono text-[12.5px]">20%</span>
        </span>
        <span className="text-accent" aria-hidden>
          &#8592;
        </span>
      </div>
    </div>
  );
}

function CommerceFigure() {
  const bars = [34, 52, 41, 66, 58, 82, 73, 96];
  return (
    <div dir="ltr" className="flex h-[132px] items-end gap-5">
      <div className="flex h-full flex-1 items-end gap-1.5">
        {bars.map((h, i) => (
          <span
            key={i}
            className={`flex-1 rounded-t-[5px] ${i === bars.length - 1 ? "bg-accent" : "bg-white/[0.09]"}`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="w-[46%] space-y-2 font-mono text-[11.5px]">
        {[
          ["#104245", "shipped"],
          ["#104246", "processing"],
          ["#104247", "placed"],
        ].map(([id, s], i) => (
          <div key={id} className="flex items-center justify-between rounded-lg border border-white/[0.07] px-3 py-2">
            <span className="text-dim">{id}</span>
            <span className={i === 0 ? "text-ok" : "text-faint"}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Capabilities() {
  const { t } = useApp();

  // One listener for the whole grid: every card gets the pointer position
  // in its own coordinates, so borders near the cursor light up together.
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    e.currentTarget.querySelectorAll<HTMLElement>("[data-spot]").forEach((card) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  };

  return (
    <section id="capabilities" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-[1240px] 2xl:max-w-[1400px] px-5 sm:px-8">
        <div className="mb-12 flex flex-col justify-between gap-4 sm:mb-16 lg:flex-row lg:items-end">
          <h2 className="display max-w-[18ch] text-[clamp(2rem,4.6vw,3.6rem)] font-bold text-ink">{t(heading)}</h2>
          <p className="max-w-[26rem] text-[16px] leading-[1.7] text-dim">{t(sub)}</p>
        </div>

        <div onPointerMove={onMove} className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Card
            className="lg:col-span-7"
            title={t({ en: "Full-stack web apps", ar: "تطبيقات ويب متكاملة" })}
            body={t({
              en: "React and TypeScript in front, Postgres or Python services behind. Payments, admin consoles, background jobs: the parts that make a product real.",
              ar: "React و TypeScript في الواجهة، و Postgres أو خدمات Python في الخلف. المدفوعات ولوحات الإدارة والمهام الخلفية: الأجزاء التي تجعل المنتج حقيقيًا.",
            })}
          >
            <StackFigure />
          </Card>
          <Card
            className="lg:col-span-5"
            title={t({ en: "High-craft UI and 3D", ar: "واجهات متقنة وثلاثية الأبعاد" })}
            body={t({
              en: "Design systems, motion that has a reason, and WebGL scenes that hold their frame rate.",
              ar: "أنظمة تصميم، وحركة لها سبب، ومشاهد WebGL تحافظ على سلاسة الإطارات.",
            })}
          >
            <MotionFigure />
          </Card>
          <Card
            className="lg:col-span-5"
            title={t({ en: "Arabic RTL engineering", ar: "هندسة الواجهات العربية" })}
            body={t({
              en: "Arabic-first layouts, not mirrored English: direction-safe numbers, mirrored icons, type set for Arabic.",
              ar: "تخطيط عربي من الأساس لا إنجليزي معكوس: أرقام لا تنقلب، أيقونات تتبع الاتجاه، وخط مضبوط للعربية.",
            })}
          >
            <DirectionFigure />
          </Card>
          <Card
            className="lg:col-span-7"
            title={t({ en: "E-commerce systems", ar: "أنظمة التجارة الإلكترونية" })}
            body={t({
              en: "Catalogues, search, carts, checkout and order tracking, plus the dashboard that shows the owner what sells.",
              ar: "كتالوج وبحث وسلة وإتمام طلب وتتبّع، مع لوحة تُري صاحب المتجر ما الذي يُباع.",
            })}
          >
            <CommerceFigure />
          </Card>
        </div>
      </div>

      <div
        dir="ltr"
        aria-label="Technologies"
        className="marquee mt-14 overflow-hidden border-y border-white/[0.08] py-5 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)] sm:mt-20"
      >
        <div className="marquee-track flex w-max">
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
              {tech.map((name) => (
                <li key={name} className="flex items-center gap-10 pe-10 font-mono text-[14px] text-dim sm:text-[15px]">
                  {name}
                  <span className="size-1 rotate-45 bg-accent/60" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
