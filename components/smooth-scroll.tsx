"use client";

import { useReducedMotion } from "framer-motion";
import { ReactLenis } from "lenis/react";

/** Inertial scrolling for the whole document. Off for reduced-motion users. */
export function SmoothScroll() {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return <ReactLenis root options={{ lerp: 0.105, wheelMultiplier: 1, anchors: true }} />;
}
