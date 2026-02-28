"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { GlassCard } from "@/components/GlassCard";
import { LiveDot } from "@/components/LiveDot";
import { MetricBadge } from "@/components/MetricBadge";
import { ProgressBar } from "@/components/ProgressBar";
import { Ticker } from "@/components/Ticker";

const tickerEvents = [
  "Blocked marketing script on /checkout (EU)",
  "Consent revoked for retargeting profile",
  "DSAR request completed in 36h",
  "Policy v12 deployed to mobile SDK",
  "Tracker behavior change detected: vendor-x"
];

const trustBadges = ["GDPR", "CPRA", "DPDP", "HIPAA"];

const twinkles = [
  { left: "8%", top: "12%", delay: "0s" },
  { left: "20%", top: "78%", delay: "1.1s" },
  { left: "34%", top: "22%", delay: "0.6s" },
  { left: "47%", top: "88%", delay: "1.8s" },
  { left: "58%", top: "14%", delay: "2.3s" },
  { left: "66%", top: "36%", delay: "0.9s" },
  { left: "75%", top: "72%", delay: "1.6s" },
  { left: "89%", top: "24%", delay: "2.1s" }
];

export function HeroGlassDashboard() {
  const clusterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!clusterRef.current) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 1024px)");

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let rafId = 0;
    let enabled = false;

    const render = () => {
      rafId = 0;
      if (!clusterRef.current || !enabled) return;

      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      clusterRef.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;

      if (Math.abs(target.x - current.x) > 0.15 || Math.abs(target.y - current.y) > 0.15) {
        rafId = window.requestAnimationFrame(render);
      }
    };

    const syncMode = () => {
      enabled = desktop.matches && !reduceMotion.matches;
      if (!enabled && clusterRef.current) {
        target.x = 0;
        target.y = 0;
        current.x = 0;
        current.y = 0;
        clusterRef.current.style.transform = "translate3d(0px, 0px, 0px)";
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!enabled) return;
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      target.x = nx * 12;
      target.y = ny * 12;

      if (!rafId) {
        rafId = window.requestAnimationFrame(render);
      }
    };

    syncMode();
    reduceMotion.addEventListener("change", syncMode);
    desktop.addEventListener("change", syncMode);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      reduceMotion.removeEventListener("change", syncMode);
      desktop.removeEventListener("change", syncMode);
      window.removeEventListener("pointermove", onPointerMove);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-[#050B21] pb-14 pt-12 sm:pt-14 lg:min-h-[90vh] lg:pb-20 lg:pt-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(59,130,246,0.26),transparent_38%),radial-gradient(circle_at_88%_24%,rgba(24,182,164,0.18),transparent_44%),radial-gradient(circle_at_64%_82%,rgba(30,42,120,0.36),transparent_46%),linear-gradient(120deg,#040818_0%,#0C1845_52%,#081130_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,11,33,0.24),rgba(5,11,33,0.68))]"
      />

      <Container className="relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(540px,0.92fr)] lg:gap-8">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#9FC3FF]">
              AI-Powered Privacy Intelligence
            </p>
            <h1 className="max-w-[640px] text-4xl font-bold leading-tight text-white sm:text-5xl">
              Automate Consent. Reduce Risk. Prove Compliance.
            </h1>
            <p className="mt-6 max-w-[620px] text-base leading-7 text-[#C3D3F7] md:text-lg">
              Continuous AI monitoring, policy enforcement, and audit-ready evidence across web, mobile, and
              server-side systems so teams stay ahead of regulatory exposure.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="/company/contact">Request Demo</Button>
              <Button href="/regulations" variant="secondary">
                Explore Regulations
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {trustBadges.map((badge) => (
                <span
                  className="rounded-full border border-[#9FC3FF]/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#D8E6FF] backdrop-blur-xl"
                  key={badge}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto h-[560px] w-full max-w-[640px] lg:h-[620px]">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-[82%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-[42px] bg-[radial-gradient(circle_at_30%_22%,rgba(59,130,246,0.28),transparent_44%),radial-gradient(circle_at_72%_78%,rgba(24,182,164,0.22),transparent_46%)] blur-2xl"
            />
            {twinkles.map((dot) => (
              <span
                aria-hidden
                className="dps-twinkle pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-[#BFD8FF]/80 motion-reduce:animate-none"
                key={`${dot.left}-${dot.top}`}
                style={{ left: dot.left, top: dot.top, animationDelay: dot.delay }}
              />
            ))}

            <div className="pointer-events-none absolute inset-0 will-change-transform" ref={clusterRef}>
              <GlassCard className="dps-float-a absolute left-[2%] top-[4%] w-[44%] motion-reduce:animate-none">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#C9D7F8]">Compliance Score</p>
                <div className="mt-2 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-4xl font-bold leading-none text-white">86</p>
                    <p className="mt-1 text-xs text-[#C9D7F8]">Last 24h</p>
                  </div>
                  <MetricBadge variant="success">+4.2%</MetricBadge>
                </div>
                <svg className="mt-3 w-full text-[#8BB8FF]" viewBox="0 0 180 44">
                  <path
                    className="opacity-90"
                    d="M2 30 L30 27 L58 28 L86 23 L114 22 L142 16 L178 11"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  />
                </svg>
              </GlassCard>

              <GlassCard className="dps-float-b absolute right-[0%] top-[10%] w-[45%] motion-reduce:animate-none">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#C9D7F8]">Risk Alerts</p>
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#C9D7F8]">
                    <LiveDot />
                    Live
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-[#E2EBFF]">3 marketing scripts pre-consent</p>
                    <MetricBadge variant="danger">High</MetricBadge>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-[#E2EBFF]">Vendor behavior drift detected</p>
                    <MetricBadge variant="warning">Med</MetricBadge>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-[#E2EBFF]">Cookie text mismatch in notice</p>
                    <MetricBadge variant="info">Low</MetricBadge>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="dps-float-c absolute left-[0%] top-[35%] w-[40%] motion-reduce:animate-none">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#C9D7F8]">Consent Coverage</p>
                <p className="mt-2 text-2xl font-bold text-white">91%</p>
                <ProgressBar className="mt-3" value={91} />
                <p className="mt-2 text-xs text-[#CBD7F6]">Web + Mobile + Server-side</p>
              </GlassCard>

              <GlassCard className="dps-float-d absolute left-[4%] top-[60%] w-[38%] motion-reduce:animate-none">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#C9D7F8]">Active Trackers</p>
                <p className="mt-2 text-sm text-[#E2EBFF]">
                  Active trackers: <span className="font-semibold text-white">17</span>
                </p>
                <p className="mt-1 text-sm text-[#E2EBFF]">
                  Pre-consent: <span className="font-semibold text-[#FECACA]">3 flagged</span>
                </p>
              </GlassCard>

              <GlassCard className="dps-float-e absolute right-[2%] top-[58%] w-[40%] motion-reduce:animate-none">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#C9D7F8]">Policy Engine</p>
                <div className="mt-3 space-y-1.5 text-xs text-[#D6E4FF]">
                  <p>
                    Enforcement: <span className="font-semibold text-[#BBF7D0]">Active</span>
                  </p>
                  <p>
                    Policy version: <span className="font-semibold text-white">v12</span>
                  </p>
                  <p>
                    Simulation: <span className="font-semibold text-[#BFDBFE]">Ready</span>
                  </p>
                </div>
              </GlassCard>

              <GlassCard className="dps-float-f absolute bottom-[2%] left-[22%] w-[56%] motion-reduce:animate-none">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#C9D7F8]">Audit Ledger Events</p>
                <Ticker className="mt-2" items={tickerEvents} />
              </GlassCard>

              <GlassCard className="dps-float-g absolute left-1/2 top-[33%] z-20 w-[56%] -translate-x-1/2 motion-reduce:animate-none">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-white">Copilot Summary</p>
                  <MetricBadge variant="info">Confidence 92%</MetricBadge>
                </div>
                <div className="mt-3 space-y-2 text-xs text-[#DCE7FF]">
                  <p>
                    <span className="font-semibold text-white">Summary:</span> Consent routing is stable across key
                    jurisdictions.
                  </p>
                  <p>
                    <span className="font-semibold text-white">Risks:</span> California ad-tech path firing before
                    opt-in.
                  </p>
                  <p>
                    <span className="font-semibold text-white">Controls:</span> Enforce region gate + block non-essential
                    trackers.
                  </p>
                </div>
              </GlassCard>

              <GlassCard className="dps-float-h absolute left-[36%] top-[2%] w-[30%] motion-reduce:animate-none">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#C9D7F8]">Region Heatmap</p>
                <div className="mt-2 space-y-1.5 text-xs text-[#D6E4FF]">
                  <p className="flex items-center justify-between">
                    EU <span className="h-2 w-2 rounded-full bg-[#18B6A4]" />
                  </p>
                  <p className="flex items-center justify-between">
                    US <span className="h-2 w-2 rounded-full bg-[#3B82F6]" />
                  </p>
                  <p className="flex items-center justify-between">
                    India <span className="h-2 w-2 rounded-full bg-[#60A5FA]" />
                  </p>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
