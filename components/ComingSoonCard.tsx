import Image from "next/image";
import { WaitlistForm } from "@/components/WaitlistForm";

const features = [
  "AI Compliance Copilot",
  "Continuous Tracker & Risk Monitoring",
  "Policy-as-Code Enforcement + Audit Evidence"
];

export function ComingSoonCard() {
  return (
    <article className="w-full max-w-[640px] rounded-3xl border border-white/15 bg-white/[0.12] p-6 shadow-[0_30px_70px_rgba(2,8,24,0.42)] backdrop-blur-xl sm:p-8">
      <div className="mx-auto inline-flex rounded-2xl border border-white/20 bg-white/80 p-2">
        <Image
          alt="DataShield-AI"
          className="h-12 w-auto rounded-xl sm:h-14"
          height={160}
          priority
          src="/datashield-ai-wordmark-dark.svg"
          width={560}
        />
      </div>

      <p className="mt-3 text-sm font-semibold text-[#D7E4FF]">Intelligent Privacy. Automated Compliance.</p>

      <h1 className="mt-6 text-3xl font-bold leading-tight text-white sm:text-5xl">
        Autonomous Privacy Intelligence is Coming.
      </h1>
      <p className="mt-4 text-base leading-7 text-[#D4E1FF] sm:text-lg">
        Detect risk. Enforce consent. Prove compliance - automatically.
      </p>

      <ul className="mt-7 space-y-2">
        {features.map((feature) => (
          <li
            className="rounded-xl border border-white/15 bg-white/[0.08] px-4 py-3 text-left text-sm font-medium text-[#E5EEFF]"
            key={feature}
          >
            <span className="mr-2 text-[#18B6A4]">●</span>
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-7 rounded-2xl border border-white/20 bg-white/[0.08] p-4 sm:p-5">
        <p className="mb-3 text-sm font-semibold text-[#E5EDFF]">Join the enterprise waitlist</p>
        <WaitlistForm />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {["Built for GDPR", "CPRA", "DPDP", "HIPAA"].map((item) => (
          <span
            className="rounded-full border border-[#9FC3FF]/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#DCE8FF]"
            key={item}
          >
            {item}
          </span>
        ))}
      </div>
    </article>
  );
}
