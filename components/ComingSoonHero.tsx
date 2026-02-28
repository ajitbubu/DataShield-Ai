import Image from "next/image";
import Link from "next/link";
import { WaitlistForm } from "@/components/WaitlistForm";

const features = [
  "AI Compliance Copilot",
  "Continuous Risk Monitoring",
  "Policy-as-Code Enforcement",
  "Real-Time Audit Intelligence"
];

const trustMarks = ["Built for GDPR", "CPRA", "DPDP", "HIPAA"];

const sparkles = [
  { left: "9%", top: "14%", delay: "0s" },
  { left: "18%", top: "66%", delay: "1.2s" },
  { left: "31%", top: "28%", delay: "0.7s" },
  { left: "44%", top: "79%", delay: "1.9s" },
  { left: "59%", top: "20%", delay: "1.1s" },
  { left: "71%", top: "74%", delay: "2.3s" },
  { left: "83%", top: "36%", delay: "1.5s" }
];

export function ComingSoonHero() {
  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#050b21]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_14%,rgba(59,130,246,0.24),transparent_42%),radial-gradient(circle_at_84%_22%,rgba(24,182,164,0.17),transparent_45%),radial-gradient(circle_at_52%_88%,rgba(30,42,120,0.34),transparent_46%),linear-gradient(125deg,#050b21_0%,#0d1b4d_52%,#091231_100%)]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/30" />

      {sparkles.map((sparkle) => (
        <span
          aria-hidden
          className="dps-twinkle pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-[#C5D9FF]/75 motion-reduce:animate-none"
          key={`${sparkle.left}-${sparkle.top}`}
          style={{ left: sparkle.left, top: sparkle.top, animationDelay: sparkle.delay }}
        />
      ))}

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1200px] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl text-center">
          <div className="mx-auto mb-8 inline-flex rounded-2xl border border-white/20 bg-white/10 p-2 shadow-soft backdrop-blur-xl">
            <Image
              alt="DataShield-AI"
              className="h-12 w-auto rounded-xl sm:h-14"
              height={160}
              priority
              src="/datashield-ai-wordmark-dark.svg"
              width={560}
            />
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#A8C8FF]">Coming Soon</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
            Autonomous Privacy Intelligence Is Coming.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#D7E3FF] sm:text-lg">
            Detect risk. Enforce consent. Prove compliance - automatically.
          </p>

          <ul className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
            {features.map((feature) => (
              <li
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-left text-sm font-medium text-[#E5EEFF] backdrop-blur-xl"
                key={feature}
              >
                <span className="mr-2 text-[#18B6A4]">●</span>
                {feature}
              </li>
            ))}
          </ul>

          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-white/20 bg-white/14 p-5 shadow-[0_20px_50px_rgba(2,8,22,0.35)] backdrop-blur-2xl sm:p-6">
            <p className="mb-3 text-sm font-semibold text-[#E8EEFF]">Join the enterprise waitlist</p>
            <WaitlistForm />
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            {trustMarks.map((mark) => (
              <span
                className="rounded-full border border-[#9FC3FF]/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#DCE8FF] backdrop-blur"
                key={mark}
              >
                {mark}
              </span>
            ))}
          </div>

          <footer className="mt-10 border-t border-white/15 pt-6 text-sm text-[#C4D3F7]">
            <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-5">
              <span>© 2026 DataShield-AI</span>
              <Link className="transition-colors hover:text-white" href="/legal/privacy">
                Privacy policy
              </Link>
              <a className="transition-colors hover:text-white" href="mailto:hello@datashield-ai.com">
                hello@datashield-ai.com
              </a>
            </div>
          </footer>
        </div>
      </div>
    </section>
  );
}
