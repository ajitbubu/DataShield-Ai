export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "ai-privacy-ops-maturity-model",
    title: "AI Privacy Ops Maturity Model for Enterprise Teams",
    excerpt: "A practical framework to evaluate and scale privacy operations with automation and AI copilots.",
    date: "2026-01-15"
  },
  {
    slug: "reducing-cookie-risk-with-governance",
    title: "Reducing Cookie Risk with Continuous Governance",
    excerpt: "How leading teams detect tracker drift early and enforce privacy policy in production.",
    date: "2025-12-09"
  }
];

export function getBlogBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
