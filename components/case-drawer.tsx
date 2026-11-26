"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { type L, isLatin, useApp } from "@/lib/app-state";
import type { Project } from "@/lib/projects";
import { BountyArchitecture, BountyConsole } from "./bounty-console";
import { Browser, Phone } from "./project-media";
import { ArrowOut, Close } from "./ui";

const labels = {
  challenge: { en: "The challenge", ar: "التحدي" },
  solution: { en: "The technical solution", ar: "الحل التقني" },
  role: { en: "My role", ar: "دوري" },
  stack: { en: "Stack", ar: "التقنيات" },
  desktop: { en: "Desktop, 1440px", ar: "الكمبيوتر، 1440 بكسل" },
  mobile: { en: "Mobile, 390px", ar: "الموبايل، 390 بكسل" },
  screens: { en: "Screens from the running app", ar: "شاشات من التطبيق أثناء التشغيل" },
  architecture: { en: "How the service is put together", ar: "كيف رُكّبت الخدمة" },
  close: { en: "Close case study", ar: "إغلاق دراسة الحالة" },
  visit: { en: "Open the live product", ar: "افتح المنتج الفعلي" },
} satisfies Record<string, L>;

const noop = () => () => {};

function Meta({ project, flush = false }: { project: Project; flush?: boolean }) {
  const { t } = useApp();
  return (
    <dl className={`grid gap-6 ${flush ? "" : "mt-7 border-t border-white/[0.07] pt-6"}`}>
      <div>
        <dt className="text-[13px] text-faint">{t(labels.role)}</dt>
        <dd className="mt-1.5 text-[15px] leading-[1.7] text-ink">{t(project.role)}</dd>
      </div>
      <div>
        <dt className="text-[13px] text-faint">{t(labels.stack)}</dt>
        <dd>
          <ul dir="ltr" className="mt-2.5 flex flex-wrap gap-2 rtl:justify-end">
            {project.stack.map((s) => (
              <li key={s} className="rounded-full border border-white/[0.09] bg-white/[0.03] px-3 py-1.5 font-mono text-[12px] text-ink/90">
                {s}
              </li>
            ))}
          </ul>
        </dd>
      </div>
    </dl>
  );
}

function DrawerBody({ project, onClose }: { project: Project; onClose: () => void }) {
  const { t, rtl, showcase } = useApp();
  const closeRef = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      opener?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  // The page behind stays put while the case study scrolls.
  useEffect(() => {
    lenis?.stop();
    const root = document.documentElement;
    const previous = root.style.overflow;
    if (!lenis) root.style.overflow = "hidden";
    return () => {
      lenis?.start();
      root.style.overflow = previous;
    };
  }, [lenis]);

  const media = project.media;
  const stage = { background: `radial-gradient(110% 80% at 50% 0%, ${project.tint}, rgba(6,7,10,0.6) 78%)` };
  const showLink = Boolean(project.link) && !showcase;

  return (
    <div className="fixed inset-0 z-[60]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-[6px]"
      />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-label={t(project.title)}
        initial={{ x: rtl ? "-100%" : "100%" }}
        animate={{ x: 0 }}
        exit={{ x: rtl ? "-100%" : "100%" }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        data-lenis-prevent
        className="drawer-scroll absolute inset-y-0 end-0 w-full max-w-[1160px] overflow-y-auto overscroll-contain border-s border-white/[0.09] bg-surface shadow-[0_0_120px_rgba(0,0,0,0.9)]"
      >
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/[0.07] bg-surface/85 px-5 py-3.5 backdrop-blur-xl sm:px-9">
          <span className="flex items-center gap-2.5 text-[13px] text-dim">
            <span className="size-1.5 rounded-full bg-accent" />
            {t(project.status)}
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t(labels.close)}
            className="grid size-10 place-items-center rounded-full border border-white/[0.1] text-ink transition-colors hover:bg-white/[0.06]"
          >
            <Close />
          </button>
        </div>

        <div className="px-5 pb-16 pt-8 sm:px-9 sm:pt-10">
          <p className="text-[15px] text-accent">{t(project.kind)}</p>
          <h2 className={`display mt-2 text-[clamp(2.2rem,4.6vw,3.4rem)] font-bold text-ink ${isLatin(t(project.title)) ? "latin" : ""}`}>{t(project.title)}</h2>
          <p className="mt-3.5 max-w-[46rem] text-[16.5px] leading-[1.75] text-dim">{t(project.summary)}</p>

          {media.type === "console" && (
            <div className="mt-8 overflow-hidden rounded-3xl border border-white/[0.07] p-4 sm:p-7" style={stage}>
              <BountyConsole lines={6} />
            </div>
          )}

          {/* First view: the picture beside the problem, the role and the stack. */}
          <div className="mt-8 grid grid-cols-1 gap-9 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-11">
            {media.type === "web" && (
              <div className="relative self-start overflow-hidden rounded-3xl border border-white/[0.07] p-4 sm:p-6" style={stage}>
                <div dir="ltr" className="relative pb-[9%] pl-[15%]">
                  <Browser src={media.hero} alt={`${t(project.title)}, ${t(labels.desktop)}`} sizes="(min-width:1024px) 560px, 88vw" />
                  <Phone
                    src={media.mobile}
                    alt={`${t(project.title)}, ${t(labels.mobile)}`}
                    sizes="220px"
                    ratio="390/844"
                    className="absolute bottom-0 left-0 w-[27%]"
                  />
                </div>
                {/* The Arabic sites lead from the right, so the phone stands on the left in both languages. */}
                <div dir="ltr" className="mt-4 flex justify-between text-[12.5px] text-faint">
                  <span>{t(labels.mobile)}</span>
                  <span>{t(labels.desktop)}</span>
                </div>
              </div>
            )}

            {media.type === "app" && (
              <div className="relative self-start overflow-hidden rounded-3xl border border-white/[0.07] p-4 sm:p-6" style={stage}>
                <div dir="ltr" className="mx-auto grid max-w-[560px] grid-cols-3 gap-3 py-3 sm:gap-4">
                  {media.screens.map((s, i) => (
                    <Phone
                      key={s}
                      src={s}
                      alt={`${t(project.title)} ${i + 1}`}
                      sizes="(min-width:1024px) 190px, 30vw"
                      className={i === 1 ? "sm:-translate-y-3" : "sm:translate-y-3"}
                    />
                  ))}
                </div>
                <p className="mt-5 text-center text-[12.5px] text-faint">{t(labels.screens)}</p>
              </div>
            )}

            <div>
              <h3 className="display text-[20px] font-semibold text-ink">{t(labels.challenge)}</h3>
              <p className="mt-2.5 text-[15.5px] leading-[1.8] text-dim">{t(project.challenge)}</p>
              {media.type !== "console" && <Meta project={project} />}
            </div>

            {media.type === "console" && (
              <div className="lg:border-s lg:border-white/[0.07] lg:ps-10">
                <Meta project={project} flush />
              </div>
            )}
          </div>

          <div className="mt-11 border-t border-white/[0.07] pt-9">
            <h3 className="display text-[20px] font-semibold text-ink">{t(labels.solution)}</h3>
            <ul className="mt-5 grid grid-cols-1 gap-x-11 gap-y-4 lg:grid-cols-2">
              {project.solution.map((s) => (
                <li key={s.en} className="flex gap-3.5 text-[15.5px] leading-[1.75] text-dim">
                  <span className="mt-[0.75em] h-px w-4 shrink-0 bg-accent" />
                  <span>{t(s)}</span>
                </li>
              ))}
            </ul>
          </div>

          {media.type === "web" && (
            <Browser src={media.showcase} alt={t(project.title)} sizes="(min-width:1024px) 1080px, 92vw" className="mt-10" />
          )}

          {media.type === "console" && (
            <div className="mt-10">
              <p className="mb-3 text-[13px] text-faint">{t(labels.architecture)}</p>
              <BountyArchitecture />
            </div>
          )}

          {(project.note || showLink) && (
            <div className="mt-9 flex flex-col gap-5 border-t border-white/[0.07] pt-6 sm:flex-row sm:items-center sm:justify-between">
              {project.note && <p className="max-w-[44rem] text-[13.5px] leading-[1.75] text-faint">{t(project.note)}</p>}
              {showLink && project.link && (
                <a
                  href={project.link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-white/[0.12] px-4 py-2.5 text-[14px] text-ink transition-colors hover:bg-white/[0.06]"
                >
                  {t(labels.visit)}
                  <ArrowOut width={14} height={14} />
                </a>
              )}
            </div>
          )}
        </div>
      </motion.aside>
    </div>
  );
}

export function CaseDrawer({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>{project && <DrawerBody key={project.slug} project={project} onClose={onClose} />}</AnimatePresence>,
    document.body,
  );
}
