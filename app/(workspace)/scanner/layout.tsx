import type { Metadata } from "next";
import { ScannerThemeProvider } from "@/components/scanner/scanner-theme";

export const metadata: Metadata = {
  title: "AI Cookie Scanner Dashboard | DataPrivacy Shield",
  description:
    "AI-powered cookie scanner with continuous privacy risk monitoring, consent violation detection, and intelligent enforcement recommendations."
};

export default function ScannerLayout({ children }: { children: React.ReactNode }) {
  return <ScannerThemeProvider>{children}</ScannerThemeProvider>;
}
