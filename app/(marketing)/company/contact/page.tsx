import { Metadata } from "next";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact DataPrivacy Shield to request a demo or speak with sales."
};

export default function ContactPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <h1 className="text-4xl font-bold tracking-tight text-text">Contact Sales</h1>
        <p className="mt-4 max-w-3xl text-lg text-muted">
          Tell us about your privacy stack, regulatory scope, and timeline. Our team will follow up with a tailored demo.
        </p>

        <Card className="mt-10 max-w-2xl">
          <form className="space-y-4" aria-label="Demo request form">
            <div>
              <label className="mb-1 block text-sm font-medium text-text" htmlFor="name">
                Name
              </label>
              <input className="w-full rounded-xl border border-border px-3 py-2 text-sm" id="name" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text" htmlFor="workEmail">
                Work Email
              </label>
              <input className="w-full rounded-xl border border-border px-3 py-2 text-sm" id="workEmail" required type="email" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text" htmlFor="company">
                Company
              </label>
              <input className="w-full rounded-xl border border-border px-3 py-2 text-sm" id="company" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text" htmlFor="message">
                What are you solving?
              </label>
              <textarea className="h-28 w-full rounded-xl border border-border px-3 py-2 text-sm" id="message" />
            </div>
            <Button type="submit">Request a Demo</Button>
          </form>
        </Card>
      </Container>
    </section>
  );
}
