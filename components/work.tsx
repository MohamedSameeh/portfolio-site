"use client";

import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { type PointerEvent, type ReactNode, useCallback, useState } from "react";
import { type L, isLatin, useApp } from "@/lib/app-state";
import { type Category, type Project, featured, filters, projects } from "@/lib/projects";
import { BountyConsole } from "./bounty-console";
import { CaseDrawer } from "./case-drawer";
import { CardMedia } from "./project-media";
import { ArrowOut, Magnetic } from "./ui";

const copy = {
  heading: { en: "Selected work", ar: "أعمال مختارة" },
  sub: {
    en: "One system that works while I sleep, one live product, and the interfaces around them. Open any of them for the full case study.",
    ar: "نظام يعمل وأنا نائم، ومنتج يعمل فعليًا، والواجهات التي حولهما. افتح أي مشروع لقراءة دراسة الحالة كاملة.",
  },
  read: { en: "Read the case study", ar: "اقرأ دراسة الحالة" },
  open: { en: "Open case study", ar: "افتح دراسة الحالة" },
  filter: { en: "Filter projects", ar: "تصفية المشاريع" },
  consoleNote: {
    en: "A visualisation of the service at work, built on its real log format.",
    ar: "تصوّر مرئي للخدمة أثناء العمل، مبني على صيغة سجلاتها الحقيقية.",
  },
} satisfies Record<string, L>;

const facts: { value: string; label: L }[] = [
  { value: "5", label: { en: "specialist agents", ar: "وكلاء متخصصون" } },
  { value: "75", label: { en: "automated tests", ar: "اختبارًا آليًا" } },
  { value: "24/7", label: { en: "on a single server", ar: "على خادم واحد" } },
];

/* The full set is a hand-placed bento: order and spans are chosen so the
   four web builds read first and the live product stands tall beside them. */
const BENTO: Record<string, string> = {
  "memar-aldiyar": "lg:col-span-5",
  sudeem: "lg:col-span-4",
  lamsa: "row-span-2 lg:col-span-3",
  madar: "lg:col-span-4",
  "dar-alsidra": "lg:col-span-5",
  fashionshop: "lg:col-span-6",
  estashirna: "lg:col-span-6",
};
const BENTO_ORDER = Object.keys(BENTO);
const ordered = [...projects].sort((x, y) => BENTO_ORDER.indexOf(x.slug) - BENTO_ORDER.indexOf(y.slug));

/* A filtered set closes into full rows, whatever its size. */
function spansFor(count: number): number[] {
  if (count === 1) return [12];
  const out: number[] = [];
  let left = count;
  let flip = false;
  while (left > 0) {
    if (left === 3) {
      out.push(4, 4, 4);
      left = 0;
    } else {
      out.push(...(flip ? [5, 7] : [7, 5]));
      flip = !flip;
      left -= 2;
    }
  }
  return out;
}
const SPAN_CLASS: Record<number, string> = {
  12: "lg:col-span-12",
  7: "lg:col-span-7",
  5: "lg:col-span-5",
  4: "lg:col-span-4",
};

/** Tilts toward the pointer and carries a moving highlight, like lacquer under a lamp. */
function Tilt({ children, onOpen, label }: { children: ReactNode; onOpen: () => void; label: string }) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glow = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 170, damping: 18, mass: 0.6 });
  const sry = useSpring(ry, { stiffness: 170, damping: 18, mass: 0.6 });
  const sglow = useSpring(glow, { stiffness: 120, damping: 20 });
  const glare = useMotionTemplate`radial-gradient(460px circle at ${gx}% ${gy}%, rgba(255,255,255,0.2), rgba(255,255,255,0.05) 34%, transparent 60%)`;
  const sheen = useMotionTemplate`linear-gradient(115deg, transparent 30%, rgba(190,230,255,0.11) ${gx}%, transparent 72%)`;

  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 9);
    rx.set((0.5 - py) * 7);
    gx.set(px * 100);
    gy.set(py * 100);
    glow.set(1);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    glow.set(0);
  };

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-label={label}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1100 }}
      className="group relative block h-full w-full overflow-hidden rounded-[26px] border border-white/[0.08] bg-surface text-start shadow-[0_30px_70px_-40px_rgba(0,0,0,0.9)] transition-[border-color] duration-500 hover:border-white/[0.2]"
    >
      {children}
      <motion.span aria-hidden style={{ background: glare, opacity: sglow }} className="pointer-events-none absolute inset-0 mix-blend-soft-light" />
      <motion.span aria-hidden style={{ background: sheen, opacity: sglow }} className="pointer-events-none absolute inset-0" />
    </motion.button>
  );
}

function ProjectCard({ project, tall, onOpen }: { project: Project; tall: boolean; onOpen: () => void }) {
  const { t } = useApp();
  return (
    <Tilt onOpen={onOpen} label={`${t(copy.open)}: ${t(project.title)}`}>
      <CardMedia media={project.media} title={t(project.title)} tint={project.tint} tall={tall} />
      <span className="absolute start-4 top-4 rounded-full border border-white/[0.14] bg-bg/70 px-3 py-1.5 text-[12px] text-ink backdrop-blur-md">
        {t(project.status)}
      </span>
      <span
        aria-hidden
        className="absolute end-4 top-4 grid size-10 translate-y-1 place-items-center rounded-full bg-ink text-bg opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <ArrowOut />
      </span>
      <span className="absolute inset-x-0 bottom-0 block bg-gradient-to-t from-[#06070a]/95 via-[#06070a]/60 via-55% to-transparent px-5 pb-4.5 pt-14 sm:px-6">
        <span className={`display block text-[22px] font-semibold text-ink sm:text-[24px] ${isLatin(t(project.title)) ? "latin" : ""}`}>{t(project.title)}</span>
        <span className="mt-0.5 block text-[14px] text-dim">{t(project.kind)}</span>
      </span>
    </Tilt>
  );
}

function Featured({ onOpen }: { onOpen: () => void }) {
  const { t } = useApp();
  return (
    <article className="relative overflow-hidden rounded-[32px] border border-white/[0.09] bg-surface">
      <div aria-hidden className="pointer-events-none absolute -end-40 -top-40 size-[560px] rounded-full bg-[radial-gradient(closest-side,rgba(56,189,248,0.14),transparent)]" />
      <div className="relative grid grid-cols-1 gap-9 p-5 sm:p-9 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-12 lg:p-10">
        <div>
          <p className="flex items-center gap-2.5 text-[13.5px] text-dim">
            <span className="pulse-dot size-1.5 rounded-full bg-ok text-ok" />
            {t(featured.status)}
          </p>
          <h3 dir="ltr" className="display latin mt-5 text-[clamp(2.1rem,5vw,4.1rem)] font-bold text-ink rtl:text-right">
            Bounty Agents
          </h3>
          <p className="mt-1.5 text-[16px] text-accent">{t(featured.kind)}</p>
          <p className="mt-5 max-w-[30rem] text-[16.5px] leading-[1.75] text-dim">{t(featured.summary)}</p>

          <dl className="mt-8 grid grid-cols-3 gap-3 border-t border-white/[0.08] pt-6 sm:gap-4">
            {facts.map((f) => (
              <div key={f.value}>
                <dt className="sr-only">{t(f.label)}</dt>
                <dd>
                  <span dir="ltr" className="display latin block text-[26px] font-semibold text-ink sm:text-[36px] rtl:text-right">
                    {f.value}
                  </span>
                  <span className="mt-1 block text-[13px] leading-snug text-dim">{t(f.label)}</span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-9">
            <Magnetic strength={0.22}>
              <button
                type="button"
                onClick={onOpen}
                className="group flex h-13 items-center gap-3 rounded-full bg-ink py-1.5 ps-6 pe-1.5 text-[15px] font-semibold text-bg"
              >
                {t(copy.read)}
                <span className="grid size-10 place-items-center rounded-full bg-bg text-ink transition-transform duration-500 group-hover:rotate-45 rtl:group-hover:-rotate-45">
                  <ArrowOut />
                </span>
              </button>
            </Magnetic>
          </div>
        </div>

        <div>
          <BountyConsole />
          <p className="mt-3.5 text-[12.5px] text-faint">{t(copy.consoleNote)}</p>
        </div>
      </div>
    </article>
  );
}

export function Work() {
  const { t } = useApp();
  const [filter, setFilter] = useState<"all" | Category>("all");
  const [open, setOpen] = useState<Project | null>(null);
  const close = useCallback(() => setOpen(null), []);

  const visible = ordered.filter((p) => filter === "all" || p.categories.includes(filter));
  const spans = spansFor(visible.length);
  const tileClass = (slug: string, i: number) => (filter === "all" ? BENTO[slug] : SPAN_CLASS[spans[i]]);
  const showFeatured = filter === "all" || featured.categories.includes(filter);

  return (
    <section id="work" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-[1240px] 2xl:max-w-[1400px] px-5 sm:px-8">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-14 lg:flex-row lg:items-end">
          <h2 className="display text-[clamp(2.4rem,6.2vw,5rem)] font-bold text-ink">{t(copy.heading)}</h2>
          <p className="max-w-[30rem] text-[16px] leading-[1.7] text-dim">{t(copy.sub)}</p>
        </div>

        <div role="group" aria-label={t(copy.filter)} className="mb-7 flex flex-wrap gap-2">
          {filters.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f.id)}
                className={`relative h-10 rounded-full px-4.5 text-[14px] transition-colors duration-300 ${
                  active ? "text-bg" : "border border-white/[0.08] text-dim hover:text-ink"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{t(f.label)}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence initial={false}>
          {showFeatured && (
            <motion.div
              key="featured"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="pb-4">
                <Featured onOpen={() => setOpen(featured)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid auto-rows-[300px] grid-cols-1 gap-4 md:grid-cols-2 lg:auto-rows-[268px] lg:grid-cols-12">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((p, i) => (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className={tileClass(p.slug, i)}
              >
                <ProjectCard project={p} tall={filter === "all" && p.slug === "lamsa"} onOpen={() => setOpen(p)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <CaseDrawer project={open} onClose={close} />
    </section>
  );
}
