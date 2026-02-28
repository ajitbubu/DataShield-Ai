import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { blogPosts, getBlogBySlug } from "@/data/blog";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.excerpt
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <p className="text-sm font-semibold text-primary">{post.date}</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-text">{post.title}</h1>
        <p className="mt-5 text-base leading-7 text-muted">
          This is a placeholder article page. Expand this route with MDX or CMS-backed content for production.
        </p>
      </Container>
    </section>
  );
}
