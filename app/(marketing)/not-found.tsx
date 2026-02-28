import Link from "next/link";
import { Container } from "@/components/container";

export default function NotFound() {
  return (
    <section className="py-20">
      <Container className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-text">Page not found</h1>
        <p className="mt-3 text-muted">The page you requested does not exist.</p>
        <Link className="mt-6 inline-flex font-semibold text-primary hover:text-highlight" href="/">
          Return to homepage
        </Link>
      </Container>
    </section>
  );
}
