"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/solutions", label: "Solutions" },
  { href: "/regulations", label: "Regulations" },
  { href: "/pricing", label: "Pricing" },
  { href: "/company/about", label: "Company" }
];

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isHome && !isScrolled
          ? "border-transparent bg-transparent"
          : "border-b border-border/80 bg-background/85 shadow-sm backdrop-blur-xl"
      )}
    >
      <Container>
        <div className="flex h-20 items-center justify-between gap-6">
          <Link
            aria-label="DataShield-AI Home"
            className="group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight focus-visible:ring-offset-2"
            href="/"
          >
            <Image
              alt="DataShield-AI"
              className="h-9 w-auto rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-[1.02] sm:h-10"
              height={160}
              priority
              src="/datashield-ai-wordmark-dark.svg"
              width={560}
            />
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
            {navLinks.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight",
                    active ? "bg-[#e9edff] text-primary" : "text-muted hover:text-primary"
                  )}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Button className="px-4" href="/login" variant="ghost">
              Login
            </Button>
            <Button href="/company/contact">Request Demo</Button>
          </div>

          <details className="relative md:hidden">
            <summary className="cursor-pointer list-none rounded-lg border border-border bg-surface/80 px-3 py-2 text-sm font-medium text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight">
              Menu
            </summary>
            <div className="absolute right-0 mt-2 w-56 space-y-1 rounded-xl border border-border bg-surface p-2 shadow-lg">
              {navLinks.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    className={cn(
                      "block rounded-lg px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight",
                      active ? "bg-[#e9edff] text-primary" : "text-muted hover:text-primary"
                    )}
                    href={item.href}
                    key={item.href}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="my-2 h-px bg-border" />
              <Link
                className="block rounded-lg px-3 py-2 text-sm font-medium text-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight"
                href="/login"
              >
                Login
              </Link>
              <Link
                className="block rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight"
                href="/company/contact"
              >
                Request Demo
              </Link>
            </div>
          </details>
        </div>
      </Container>
    </header>
  );
}
