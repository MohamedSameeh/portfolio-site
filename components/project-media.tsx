"use client";

import Image from "next/image";
import type { Media } from "@/lib/projects";

/** A phone screen in a thin dark bezel. */
export function Phone({
  src,
  alt,
  sizes,
  className = "",
  ratio = "1082/2402",
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  /** Width / height of the screenshot inside the bezel. */
  ratio?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[9%/4.2%] border border-white/[0.14] bg-black p-[2.5%] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.85)] ${className}`}
    >
      <div className="relative overflow-hidden rounded-[7.5%/3.5%]" style={{ aspectRatio: ratio }}>
        <Image src={src} alt={alt} fill sizes={sizes} quality={90} className="object-cover object-top" />
      </div>
    </div>
  );
}

/** A desktop screenshot under a minimal browser bar. */
export function Browser({
  src,
  alt,
  sizes,
  className = "",
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-white/[0.12] bg-[#0b0d13] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)] ${className}`}
    >
      <div className="flex h-7 items-center gap-1.5 border-b border-white/[0.07] px-3" aria-hidden>
        <i className="size-2 rounded-full bg-white/[0.16]" />
        <i className="size-2 rounded-full bg-white/[0.16]" />
        <i className="size-2 rounded-full bg-white/[0.16]" />
      </div>
      <div className="relative aspect-[16/10]">
        <Image src={src} alt={alt} fill sizes={sizes} quality={90} className="object-cover object-top" />
      </div>
    </div>
  );
}

/** The picture area of a project tile. It fills the tile; the caption sits on top of it. */
export function CardMedia({ media, title, tint, tall }: { media: Media; title: string; tint: string; tall: boolean }) {
  if (media.type === "web") {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={media.hero}
          alt={title}
          fill
          quality={90}
          sizes="(min-width:1024px) 640px, 100vw"
          className="object-cover object-[88%_0%] transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />
      </div>
    );
  }
  if (media.type === "app") {
    const [a, b, c] = media.screens;
    const sizes = "(min-width:1024px) 240px, 42vw";
    const drift =
      "transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-3";
    return (
      <div
        className="absolute inset-0 overflow-hidden bg-[#0a0c12]"
        style={{ backgroundImage: `radial-gradient(120% 85% at 50% 0%, ${tint}, transparent 74%)` }}
      >
        {tall ? (
          <div dir="ltr" className={`absolute inset-x-0 top-[13%] ${drift}`}>
            <Phone src={a} alt="" sizes={sizes} className="absolute end-[7%] top-[70px] w-[50%] rotate-[4deg] opacity-80" />
            <Phone src={b} alt={title} sizes={sizes} className="relative ms-[9%] w-[58%]" />
          </div>
        ) : (
          <div dir="ltr" className={`absolute inset-x-0 top-[12%] mx-auto flex w-[82%] max-w-[520px] items-start justify-center ${drift}`}>
            <Phone src={a} alt="" sizes={sizes} className="mt-[8%] w-[31%] -rotate-[5deg] opacity-85" />
            <Phone src={b} alt={title} sizes={sizes} className="relative z-10 -mx-[3%] w-[36%]" />
            <Phone src={c} alt="" sizes={sizes} className="mt-[8%] w-[31%] rotate-[5deg] opacity-85" />
          </div>
        )}
      </div>
    );
  }
  return null;
}
