import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://datashield-ai.com"),
  title: {
    default: "DataShield-AI | Coming Soon",
    template: "%s | DataShield-AI"
  },
  description:
    "AI-powered privacy intelligence and automated compliance platform launching soon.",
  keywords: [
    "Data privacy",
    "DataShield-AI",
    "AI privacy intelligence",
    "Consent management",
    "DSAR automation",
    "Cookie governance",
    "Privacy compliance",
    "AI compliance copilot"
  ],
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "DataShield-AI | Coming Soon",
    description: "AI-powered privacy intelligence and automated compliance platform launching soon.",
    url: "https://datashield-ai.com",
    siteName: "DataShield-AI",
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "DataShield-AI | Coming Soon",
    description: "AI-powered privacy intelligence and automated compliance platform launching soon."
  },
  alternates: {
    canonical: "/"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
