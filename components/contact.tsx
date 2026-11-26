"use client";

import { type L, useApp } from "@/lib/app-state";
import { site } from "@/lib/site";
import { ArrowOut, GitHubMark, LinkedInMark, Magnetic, Mail } from "./ui";

const copy = {
  heading: {
    en: "Have a product to build? Start with what it should do.",
    ar: "عندك منتج تريد بناءه؟ ابدأ بما يجب أن يفعله.",
  },
  sub: {
    en: "Send the idea as it is, rough edges included. You get back how I would build it and what it would take, within a working day.",
    ar: "أرسل الفكرة كما هي، حتى لو لم تكتمل. يصلك خلال يوم عمل كيف سأبنيها وما الذي تحتاجه.",
  },
  subShowcase: {
    en: "A project starts with a short brief: what the product should do, for whom, and by when. The plan follows within a working day.",
    ar: "المشروع يبدأ بوصف قصير: ما الذي يجب أن يفعله المنتج، ولمن، ومتى. والخطة تصلك خلال يوم عمل.",
  },
  email: { en: "Write to me", ar: "راسلني" },
  work: { en: "View the work", ar: "استعرض الأعمال" },
  top: { en: "Back to top", ar: "العودة للأعلى" },
  built: {
    en: "Designed and built with Next.js, Three.js and Framer Motion.",
    ar: "صُمّم وبُني بـ Next.js و Three.js و Framer Motion.",
  },
} satisfies Record<string, L>;

export function Contact() {
  const { t, showcase, ready } = useApp();
  // Personal routes render only on the client, and never in showcase mode,
  // so they are absent from the HTML that marketplace screenshots are taken from.
  const personal = ready && !showcase;

  return (
    <>
      <section id="contact" className="relative overflow-hidden border-t border-white/[0.08] py-28 sm:py-40">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-[-55%] mx-auto size-[110vmin] rounded-full bg-[radial-gradient(closest-side,rgba(56,189,248,0.13),transparent)]" />
        <div className="relative mx-auto max-w-[1240px] 2xl:max-w-[1400px] px-5 sm:px-8">
          <h2 className="display max-w-[17ch] text-[clamp(2.4rem,6.6vw,5.6rem)] font-bold text-ink">{t(copy.heading)}</h2>
          <p className="mt-7 max-w-[34rem] text-[17px] leading-[1.75] text-dim">{t(personal ? copy.sub : copy.subShowcase)}</p>

          <div className="mt-11 flex flex-wrap items-center gap-4">
            {personal && site.email ? (
              <Magnetic>
                <a
                  href={`mailto:${site.email}`}
                  className="group flex h-14 items-center gap-3 rounded-full bg-ink ps-7 pe-2 text-[15.5px] font-semibold text-bg shadow-[0_18px_50px_-14px_rgba(56,189,248,0.55)]"
                >
                  <Mail />
                  {t(copy.email)}
                  <span className="grid size-10 place-items-center rounded-full bg-bg text-ink transition-transform duration-500 group-hover:rotate-45 rtl:group-hover:-rotate-45">
                    <ArrowOut />
                  </span>
                </a>
              </Magnetic>
            ) : (
              <Magnetic>
                <a
                  href="#work"
                  className="group flex h-14 items-center gap-3 rounded-full bg-ink ps-7 pe-2 text-[15.5px] font-semibold text-bg shadow-[0_18px_50px_-14px_rgba(56,189,248,0.55)]"
                >
                  {t(copy.work)}
                  <span className="grid size-10 place-items-center rounded-full bg-bg text-ink transition-transform duration-500 group-hover:rotate-45 rtl:group-hover:-rotate-45">
                    <ArrowOut />
                  </span>
                </a>
              </Magnetic>
            )}

            {personal && (
              <>
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-14 items-center gap-2.5 rounded-full border border-white/[0.1] px-6 text-[15px] text-ink transition-colors hover:border-white/25 hover:bg-white/[0.04]"
                >
                  <LinkedInMark />
                  LinkedIn
                </a>
                <a
                  href={site.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-14 items-center gap-2.5 rounded-full border border-white/[0.1] px-6 text-[15px] text-ink transition-colors hover:border-white/25 hover:bg-white/[0.04]"
                >
                  <GitHubMark />
                  GitHub
                </a>
              </>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.08]">
        <div className="mx-auto flex max-w-[1240px] 2xl:max-w-[1400px] flex-col justify-between gap-3 px-5 py-7 text-[13px] text-faint sm:flex-row sm:items-center sm:px-8">
          <p>
            <span dir="ltr">&copy; {site.year}</span> {t(site.name)}. {t(copy.built)}
          </p>
          <a href="#top" className="transition-colors hover:text-ink">
            {t(copy.top)}
          </a>
        </div>
      </footer>
    </>
  );
}
