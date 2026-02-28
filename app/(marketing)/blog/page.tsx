import Link from "next/link";
import { Metadata } from "next";
import { Card } from "@/components/card";
import { Container } from "@/components/container";
import { blogPosts } from "@/data/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights on privacy operations, regulation readiness, and AI governance."
};

export default function BlogPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <h1 className="text-4xl font-bold tracking-tight text-text">Privacy Ops Blog</h1>
        <p className="mt-4 max-w-3xl text-lg text-muted">
          Practical insights for privacy, legal, and engineering leaders.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {blogPosts.map((post) => (
            <Card key={post.slug}>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">{post.date}</p>
              <h2 className="mt-2 text-2xl font-semibold text-text">{post.title}</h2>
              <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
              <Link className="mt-5 inline-flex text-sm font-semibold text-primary hover:text-highlight" href={`/blog/${post.slug}`}>
                Read post →
              </Link>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
