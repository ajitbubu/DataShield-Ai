import { Metadata } from "next";
import { Container } from "@/components/container";
import { ProductGrid } from "@/components/product-grid";
import { SectionHeader } from "@/components/section-header";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Products",
  description: "Explore consent, discovery, DSAR, governance, and AI compliance modules."
};

export default function ProductsPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeader
          badge="Products"
          description="DataPrivacy Shield modules are designed to work independently or as an integrated privacy platform."
          title="Privacy Product Suite"
        />
        <ProductGrid items={products} />
      </Container>
    </section>
  );
}
