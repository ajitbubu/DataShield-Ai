import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/container";

const footerColumns = [
  {
    title: "Products",
    links: [
      { href: "/products/consent-management", label: "Consent Management" },
      { href: "/products/data-discovery", label: "Data Discovery" },
      { href: "/products/dsar-automation", label: "DSAR Automation" }
    ]
  },
  {
    title: "Solutions",
    links: [
      { href: "/solutions/privacy-teams", label: "For Privacy Teams" },
      { href: "/solutions/security-teams", label: "For Security Teams" },
      { href: "/solutions/engineering-teams", label: "For Engineering Teams" }
    ]
  },
  {
    title: "Regulations",
    links: [
      { href: "/regulations/gdpr", label: "GDPR" },
      { href: "/regulations/cpra-ccpa", label: "CPRA / CCPA" },
      { href: "/regulations/dpdp", label: "India DPDP" }
    ]
  },
  {
    title: "Company",
    links: [
      { href: "/company/about", label: "About" },
      { href: "/company/security", label: "Security" },
      { href: "/company/contact", label: "Contact" }
    ]
  },
  {
    title: "Legal",
    links: [
      { href: "/legal/privacy", label: "Privacy" },
      { href: "/legal/terms", label: "Terms" }
    ]
  }
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface pt-14 sm:pt-16">
      <Container>
        <div className="grid gap-10 md:grid-cols-6">
          <div className="md:col-span-2">
            <Image
              alt="DataShield-AI"
              className="h-10 w-auto rounded-lg shadow-sm"
              height={160}
              src="/datashield-ai-wordmark-dark.svg"
              width={560}
            />
            <p className="mt-3 max-w-sm text-sm leading-6 text-muted">
              AI-powered privacy infrastructure for enterprise teams managing consent, governance, and compliance at
              scale.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 md:col-span-4 lg:grid-cols-5">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <p className="mb-3 text-sm font-semibold text-text">{column.title}</p>
                <ul className="space-y-2 text-sm text-muted">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        className="transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight"
                        href={link.href}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Container>

      <div className="mt-12 border-t border-border bg-background py-5">
        <Container>
          <p className="text-xs text-muted">© {new Date().getFullYear()} DataPrivacy Shield. All rights reserved.</p>
        </Container>
      </div>
    </footer>
  );
}
