import { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog";
import { copilotSessions } from "@/data/copilot";
import { products } from "@/data/products";
import { getRegulationCategorySlug, regulationCategories, regulations } from "@/data/regulations";
import { scanHistory } from "@/data/scanner";
import { solutions } from "@/data/solutions";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://dataprivacyshield.com";
  const now = new Date();

  const staticRoutes = [
    "",
    "/products",
    "/solutions",
    "/regulations",
    "/regulations/search",
    "/copilot",
    "/copilot/history",
    "/admin",
    "/admin/users",
    "/admin/roles",
    "/admin/policies",
    "/admin/risk",
    "/admin/integrations",
    "/admin/audit",
    "/admin/settings",
    "/scanner",
    "/scanner/history",
    "/feedback",
    "/company/about",
    "/company/security",
    "/company/contact",
    "/pricing",
    "/blog",
    "/legal/privacy",
    "/legal/terms"
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now
  }));

  const productRoutes = products.map((product) => ({
    url: `${base}/products/${product.slug}`,
    lastModified: now
  }));

  const solutionRoutes = solutions.map((solution) => ({
    url: `${base}/solutions/${solution.slug}`,
    lastModified: now
  }));

  const regulationRoutes = regulations.map((regulation) => ({
    url: `${base}/regulations/${regulation.slug}`,
    lastModified: new Date(regulation.lastUpdated)
  }));

  const regulationCategoryRoutes = regulationCategories.map((category) => ({
    url: `${base}/regulations/category/${getRegulationCategorySlug(category)}`,
    lastModified: now
  }));

  const copilotSessionRoutes = copilotSessions.map((session) => ({
    url: `${base}/copilot/session/${session.id}`,
    lastModified: new Date(session.updatedAt)
  }));

  const blogRoutes = blogPosts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date)
  }));

  const scannerRoutes = scanHistory.map((scan) => ({
    url: `${base}/scanner/${scan.scanId}`,
    lastModified: new Date(scan.scannedAt)
  }));

  return [
    ...staticRoutes,
    ...productRoutes,
    ...solutionRoutes,
    ...regulationRoutes,
    ...regulationCategoryRoutes,
    ...copilotSessionRoutes,
    ...scannerRoutes,
    ...blogRoutes
  ];
}
