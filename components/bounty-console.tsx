"use client";

import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* A visualisation of the agent system at work. The system itself is a
   headless Python service; these lines follow its real log format. */

const AGENTS = [
  { id: "web_scraping", label: "Web scraping" },
  { id: "lead_generation", label: "Lead generation" },
  { id: "ai_research_automation", label: "AI research" },
  { id: "ai_agent_development", label: "Agent development" },
  { id: "data_cleaning_analysis", label: "Data cleaning" },
] as const;

const STEPS = ["discover", "route", "evaluate", "bid", "produce", "review", "submit"] as const;

type AgentState = "idle" | "evaluating" | "bidding" | "working" | "reviewing" | "submitted";

type Frame = {
  ts: string;
  src: string;
  msg: string;
  step: number;
  agent: number;
  state: AgentState;
  tone?: "warn" | "ok";
};

const SCRIPT: Frame[] = [
  { ts: "02:09:28", src: "poller", msg: "discovery: 14 open bounties, 3 new", step: 0, agent: 0, state: "idle" },
  { ts: "02:09:31", src: "dispatcher", msg: "bounty mx7c024m routed to web_scraping (score 2.25)", step: 1, agent: 0, state: "evaluating" },
  { ts: "02:09:34", src: "lifecycle", msg: "[web_scraping] fit, bid 5000c on mx7c024m", step: 3, agent: 0, state: "bidding" },
  { ts: "02:09:35", src: "outbox", msg: "bid stored with idempotency key, sent once", step: 3, agent: 0, state: "bidding" },
  { ts: "02:11:02", src: "poller", msg: "event bounty.hired: web_scraping HIRED", step: 4, agent: 0, state: "working", tone: "ok" },
  { ts: "02:11:04", src: "lifecycle", msg: "[web_scraping] source plan: 6 public pages to read", step: 4, agent: 0, state: "working" },
  { ts: "02:12:47", src: "lifecycle", msg: "[web_scraping] self-review round 1: FAIL, 2 rows without a read source", step: 5, agent: 0, state: "reviewing", tone: "warn" },
  { ts: "02:13:20", src: "lifecycle", msg: "[web_scraping] self-review round 2: PASS", step: 5, agent: 0, state: "reviewing", tone: "ok" },
  { ts: "02:13:22", src: "lifecycle", msg: "[web_scraping] SUBMITTED mx7c024m", step: 6, agent: 0, state: "submitted", tone: "ok" },
  { ts: "02:13:30", src: "dispatcher", msg: "bounty mx7eetyt routed to lead_generation (score 1.40)", step: 1, agent: 1, state: "evaluating" },
  { ts: "02:13:33", src: "lifecycle", msg: "[lead_generation] not a fit: needs account access", step: 2, agent: 1, state: "evaluating", tone: "warn" },
  { ts: "02:13:33", src: "dispatcher", msg: "bounty mx7eetyt released by lead_generation (not_a_fit)", step: 1, agent: 1, state: "idle" },
  { ts: "02:13:41", src: "dispatcher", msg: "bounty mx725b5p routed to data_cleaning_analysis (score 1.85)", step: 1, agent: 4, state: "evaluating" },
  { ts: "02:13:45", src: "lifecycle", msg: "[data_cleaning_analysis] fit, bid 4200c on mx725b5p", step: 3, agent: 4, state: "bidding" },
];

const STATE_STYLE: Record<AgentState, string> = {
  idle: "text-faint",
  evaluating: "text-accent",
  bidding: "text-accent",
  working: "text-ink",
  reviewing: "text-amber-300",
  submitted: "text-ok",
};

/* Server render and first paint show the run mid-way, so it is never empty. */
const START = 7;

export function BountyConsole({ lines = 6, className = "" }: { lines?: number; className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const inView = useInView(host, { margin: "-10% 0px" });
  const reduced = useReducedMotion();
  const [cursor, setCursor] = useState(START);

  useEffect(() => {
    if (!inView || reduced) return;
    const id = window.setInterval(() => setCursor((c) => (c + 1) % SCRIPT.length), 1700);
    return () => window.clearInterval(id);
  }, [inView, reduced]);

  const current = SCRIPT[cursor];
  const visible = SCRIPT.slice(Math.max(0, cursor - lines + 1), cursor + 1);

  const agentState = (index: number): AgentState => {
    for (let i = cursor; i >= 0; i--) {
      if (SCRIPT[i].agent === index) return SCRIPT[i].state;
    }
    return "idle";
  };

  return (
    <div
      ref={host}
      dir="ltr"
      className={`flex flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-[#080a10] font-mono text-[12px] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.05)] ${className}`}
    >
      <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex gap-1.5" aria-hidden>
            <i className="size-2.5 rounded-full bg-white/[0.14]" />
            <i className="size-2.5 rounded-full bg-white/[0.14]" />
            <i className="size-2.5 rounded-full bg-white/[0.14]" />
          </span>
          <span className="text-dim">python -m bounty_agents run</span>
        </div>
        <span className="flex items-center gap-2 text-faint">
          <span className="pulse-dot size-1.5 rounded-full bg-ok text-ok" />
          polling, 30s
        </span>
      </div>

      <div className="grid flex-1 grid-cols-1 sm:grid-cols-[minmax(0,0.82fr)_minmax(0,1.5fr)]">
        <ul className="border-b border-white/[0.07] p-2.5 sm:border-b-0 sm:border-e">
          {AGENTS.map((a, i) => {
            const s = agentState(i);
            const active = current.agent === i && s !== "idle";
            return (
              <li
                key={a.id}
                className={`flex items-center justify-between gap-3 rounded-lg px-2.5 py-[9px] transition-colors duration-500 ${
                  active ? "bg-white/[0.045]" : ""
                }`}
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <span
                    className={`size-1.5 shrink-0 rounded-full transition-colors duration-500 ${
                      s === "idle" ? "bg-white/20" : s === "submitted" ? "bg-ok" : "bg-accent"
                    }`}
                  />
                  <span className={`truncate font-sans text-[12.5px] ${active ? "text-ink" : "text-dim"}`}>{a.label}</span>
                </span>
                <span className={`shrink-0 text-[11px] transition-colors duration-500 ${STATE_STYLE[s]}`}>{s}</span>
              </li>
            );
          })}
        </ul>

        <ol className="flex min-h-[200px] flex-col justify-end gap-[7px] p-4 leading-[1.5]" aria-live="off">
          {visible.map((f, i) => {
            const last = i === visible.length - 1;
            return (
              <li
                key={`${f.ts}-${f.msg}`}
                className={`flex gap-3 transition-opacity duration-500 ${last ? "opacity-100" : "opacity-55"}`}
              >
                <span className="shrink-0 text-faint">{f.ts}</span>
                <span className="hidden w-[76px] shrink-0 text-accent/80 md:inline">{f.src}</span>
                <span
                  className={`min-w-0 break-words ${
                    f.tone === "warn" ? "text-amber-300/90" : f.tone === "ok" ? "text-ok" : "text-ink/85"
                  }`}
                >
                  {f.msg}
                  {last && <span className="caret ms-1 inline-block h-[13px] w-[7px] translate-y-[2px] bg-accent/80" />}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <ol className="flex items-center gap-1 overflow-hidden border-t max-sm:flex-wrap border-white/[0.07] px-3 py-3">
        {STEPS.map((s, i) => {
          const done = i < current.step;
          const now = i === current.step;
          return (
            <li key={s} className="flex min-w-0 items-center gap-1 sm:flex-1">
              <span
                className={`truncate rounded-md px-2 py-1 text-[10.5px] transition-colors duration-500 ${
                  now ? "bg-accent/15 text-accent" : done ? "text-dim" : "text-faint/70"
                }`}
              >
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <span className={`h-px min-w-2 flex-1 transition-colors duration-500 max-sm:hidden ${done ? "bg-accent/50" : "bg-white/[0.08]"}`} />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* How the service is put together. Used in the case study. */
export function BountyArchitecture() {
  const box = "rounded-xl border border-white/[0.08] bg-white/[0.025] px-3.5 py-3";
  return (
    <div dir="ltr" className="grid grid-cols-1 gap-3 font-mono text-[11.5px] text-dim sm:grid-cols-[1fr_auto_1.4fr_auto_1fr] sm:items-stretch">
      <div className={`${box} flex flex-col justify-center gap-1`}>
        <span className="text-ink">Bounty Agent API</span>
        <span>raw HTTP, strict request models</span>
      </div>
      <span className="hidden self-center text-accent sm:block" aria-hidden>
        &#8644;
      </span>
      <div className="grid gap-2">
        <div className={`${box} flex items-center justify-between`}>
          <span className="text-ink">poller + webhook</span>
          <span>durable cursor</span>
        </div>
        <div className={`${box} flex items-center justify-between border-accent/30 bg-accent/[0.05]`}>
          <span className="text-accent">dispatcher</span>
          <span>one agent per bounty</span>
        </div>
        <div className={`${box} flex items-center justify-between`}>
          <span className="text-ink">lifecycle</span>
          <span>bid, produce, review, submit</span>
        </div>
        <div className={`${box} flex items-center justify-between`}>
          <span className="text-ink">SQLite (WAL)</span>
          <span>events, outbox, locks</span>
        </div>
      </div>
      <span className="hidden self-center text-accent sm:block" aria-hidden>
        &#8644;
      </span>
      <div className={`${box} flex flex-col justify-center gap-1`}>
        <span className="text-ink">Google Gemini</span>
        <span>shared rate pacing, URL context</span>
      </div>
    </div>
  );
}
