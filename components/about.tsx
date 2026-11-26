"use client";

import Image from "next/image";
import { type L, useApp } from "@/lib/app-state";
import { site } from "@/lib/site";

const copy = {
  heading: { en: "Hi, I'm Mohamed.", ar: "أنا محمد." },
  body: [
    {
      en: "I studied computer science at Benha University and have been building software since 2022: Flutter apps first, then web products like Lamsa and agent systems like Bounty Agents.",
      ar: "درست علوم الحاسب في جامعة بنها، وأبني البرمجيات منذ 2022: تطبيقات Flutter أولًا، ثم منتجات ويب مثل لمسة، وأنظمة وكلاء مثل Bounty Agents.",
    },
    {
      en: "Since 2024 I have also trained and evaluated AI models on more than 140 projects, reading code and agent runs closely to find where they break. I bring the same habit to my own work: I look for the failure cases before a client does.",
      ar: "ومنذ 2024 أعمل أيضًا في تدريب وتقييم نماذج الذكاء الاصطناعي، في أكثر من 140 مشروعًا، أقرأ فيها الكود ومسارات الوكلاء بدقة لأجد أين تتعطل. وأنقل العادة نفسها إلى عملي: أبحث عن حالات الفشل قبل أن يجدها العميل.",
    },
  ],
  alt: { en: "Portrait of Mohamed Sameeh", ar: "صورة محمد سميح" },
} satisfies Record<string, L | L[]>;

const facts: { label: L; value: L }[] = [
  { label: { en: "Based in", ar: "المكان" }, value: { en: "Egypt, UTC+2", ar: "مصر، التوقيت UTC+2" } },
  { label: { en: "Education", ar: "الدراسة" }, value: { en: "BSc Computer Science, Benha University, 2026", ar: "بكالوريوس علوم الحاسب، جامعة بنها، 2026" } },
  { label: { en: "Languages", ar: "اللغات" }, value: { en: "Arabic (native), English (professional)", ar: "العربية (لغة أم)، الإنجليزية (مستوى مهني)" } },
  { label: { en: "Also", ar: "أيضًا" }, value: { en: "AI training and evaluation since 2024", ar: "تدريب وتقييم نماذج الذكاء الاصطناعي منذ 2024" } },
];

export function About() {
  const { t } = useApp();
  return (
    <section id="about" className="relative border-t border-white/[0.08] py-24 sm:py-32">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-12 px-5 sm:px-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20 2xl:max-w-[1400px]">
        <figure className="relative mx-auto w-full max-w-[420px] md:mx-0">
          {/* A thin cyan edge on one side ties the print to the page's accent. */}
          <div aria-hidden className="absolute -inset-px rounded-[30px] bg-[linear-gradient(160deg,rgba(56,189,248,0.55),rgba(255,255,255,0.08)_35%,rgba(255,255,255,0.04)_70%,rgba(56,189,248,0.25))]" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[29px] bg-surface">
            <Image
              src="/me/portrait.jpg"
              alt={t(copy.alt)}
              fill
              quality={90}
              sizes="(min-width:768px) 420px, 90vw"
              className="object-cover object-top"
            />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />
          </div>
          <figcaption className="absolute bottom-5 start-5 rounded-full border border-white/[0.14] bg-bg/70 px-3.5 py-1.5 text-[13px] text-ink backdrop-blur-md">
            {t(site.name)}
          </figcaption>
        </figure>

        <div>
          <h2 className="display text-[clamp(2.2rem,5vw,4rem)] font-bold text-ink">{t(copy.heading)}</h2>
          <div className="mt-7 max-w-[40rem] space-y-5 text-[17px] leading-[1.8] text-dim">
            {copy.body.map((p) => (
              <p key={p.en}>{t(p)}</p>
            ))}
          </div>
          <dl className="mt-10 grid grid-cols-1 gap-x-10 gap-y-5 border-t border-white/[0.08] pt-8 sm:grid-cols-2">
            {facts.map((f) => (
              <div key={f.label.en}>
                <dt className="text-[13px] text-faint">{t(f.label)}</dt>
                <dd className="mt-1 text-[15px] leading-[1.6] text-ink">{t(f.value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
