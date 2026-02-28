import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Compliance Copilot | DataPrivacy Shield",
  description:
    "Enterprise AI Compliance Copilot for privacy, legal, and security teams to analyze regulatory obligations and map controls."
};

export default function CopilotRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
