"use client";

import { animate, motion, useInView, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import { type L, useApp } from "@/lib/app-state";

const copy = {
  heading: { en: "How a project runs", ar: "كيف يسير المشروع" },
  sub: {
    en: "Four stages, in this order. You see something you can open at the end of each one.",
    ar: "أربع مراحل بهذا الترتيب، وفي نهاية كل مرحلة شيء تستطيع فتحه ورؤيته.",
  },
  get: { en: "You get", ar: "تستلم" },
  numbers: { en: "In numbers", ar: "بالأرقام" },
} satisfies Record<string, L>;

const steps: { title: L; body: L; get: L }[] = [
  {
    title: { en: "Architecture", ar: "المعمارية" },
    body: {
      en: "Before a screen is drawn: the data model, every state a screen can be in, and what happens when something fails.",
      ar: "قبل رسم أي شاشة: نموذج البيانات، وكل حالة يمكن أن تكون عليها الشاشة، وما الذي يحدث عند الفشل.",
    },
    get: { en: "A written plan and a fixed scope", ar: "خطة مكتوبة ونطاق محدد" },
  },
  {
    title: { en: "Design system", ar: "نظام التصميم" },
    body: {
      en: "Colour, type, spacing and components defined once as tokens, in both directions, so the tenth screen matches the first.",
      ar: "الألوان والخطوط والمسافات والمكوّنات تُعرَّف مرة واحدة كرموز، في الاتجاهين، لتطابق الشاشة العاشرة الأولى.",
    },
    get: { en: "Tokens and core components, LTR and RTL", ar: "رموز التصميم والمكوّنات الأساسية بالاتجاهين" },
  },
  {
    title: { en: "Build", ar: "البناء" },
    body: {
      en: "Feature by feature, with a build you can open every few days. Loading, empty and error states are part of the feature.",
      ar: "ميزة بعد ميزة، مع نسخة تفتحها كل بضعة أيام. حالات التحميل والفراغ والخطأ جزء من الميزة نفسها.",
    },
    get: { en: "Preview links and short progress notes", ar: "روابط معاينة وملاحظات تقدّم قصيرة" },
  },
  {
    title: { en: "Launch", ar: "الإطلاق" },
    body: {
      en: "A production build, a performance pass, and a handover you can run without me: setup notes, tests, documentation.",
      ar: "نسخة إنتاج، ومراجعة للأداء، وتسليم تستطيع تشغيله بدوني: ملاحظات الإعداد والاختبارات والتوثيق.",
    },
    get: { en: "The deployed product and its documentation", ar: "المنتج منشورًا مع توثيقه" },
  },
];

const metrics: { value: number; suffix?: string; label: L }[] = [
  { value: 5, label: { en: "AI agents running around the clock in Bounty Agents", ar: "وكلاء ذكاء اصطناعي يعملون على مدار الساعة في Bounty Agents" } },
  { value: 75, label: { en: "automated tests guarding that system", ar: "اختبارًا آليًا يحرس ذلك النظام" } },
  { value: 131, label: { en: "invitation designs shipped in Lamsa", ar: "تصميم دعوة متاح في لمسة" } },
  { value: 140, suffix: "+", label: { en: "AI training and evaluation projects since 2024", ar: "مشروع تدريب وتقييم لنماذج الذكاء الاصطناعي منذ 2024" } },
];

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduced) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduced, value, suffix]);

  // The server render carries the final number, so it is right without JS.
  return (
    <span ref={ref} dir="ltr" className="latin tabular-nums">
      {value}
      {suffix}
    </span>
  );
}

export function Process() {
  const { t } = useApp();
  const rail = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: rail, offset: ["start 82%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <section id="process" className="relative border-t border-white/[0.08] py-24 sm:py-32">
      <div className="mx-auto max-w-[1240px] 2xl:max-w-[1400px] px-5 sm:px-8">
        <div className="mb-14 flex flex-col justify-between gap-4 sm:mb-20 lg:flex-row lg:items-end">
          <h2 className="display text-[clamp(2rem,4.6vw,3.6rem)] font-bold text-ink">{t(copy.heading)}</h2>
          <p className="max-w-[26rem] text-[16px] leading-[1.7] text-dim">{t(copy.sub)}</p>
        </div>

        <ol ref={rail} className="relative grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
          <span aria-hidden className="absolute inset-x-0 top-0 hidden h-px bg-white/[0.08] lg:block" />
          <motion.span
            aria-hidden
            style={{ scaleX: progress }}
            className="absolute inset-x-0 top-0 hidden h-px origin-left bg-accent lg:block rtl:origin-right"
          />
          {steps.map((s, i) => (
            <li key={s.title.en} className="relative lg:pt-9">
              <span aria-hidden className="absolute start-0 top-0 hidden size-[9px] -translate-y-1/2 rounded-full border border-accent bg-bg lg:block" />
              <span dir="ltr" className="font-mono text-[13px] text-accent">
                0{i + 1}
              </span>
              <h3 className="display mt-3 text-[26px] font-semibold text-ink">{t(s.title)}</h3>
              <p className="mt-3 text-[15px] leading-[1.75] text-dim">{t(s.body)}</p>
              <p className="mt-5 border-t border-white/[0.07] pt-4 text-[13.5px] leading-[1.6] text-ink/85">
                <span className="text-faint">{t(copy.get)}: </span>
                {t(s.get)}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-20 sm:mt-28">
          <h3 className="mb-7 text-[14px] text-faint">{t(copy.numbers)}</h3>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.08] lg:grid-cols-4">
            {metrics.map((m) => (
              <div key={m.label.en} className="flex flex-col-reverse justify-end gap-3 bg-surface p-6 sm:p-8">
                <dt className="max-w-[16rem] text-[14px] leading-[1.6] text-dim">{t(m.label)}</dt>
                <dd className="display text-[clamp(2.6rem,6vw,4.6rem)] font-bold leading-none text-ink">
                  <Counter value={m.value} suffix={m.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
