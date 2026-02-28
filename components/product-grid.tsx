"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card } from "@/components/card";
import { Badge } from "@/components/badge";
import { TagFilter } from "@/components/tag-filter";
import { Product, productCategories } from "@/data/products";

type ProductGridProps = {
  items: Product[];
};

export function ProductGrid({ items }: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    if (selectedCategory === "All") {
      return items;
    }

    return items.filter((item) => item.category === selectedCategory);
  }, [items, selectedCategory]);

  return (
    <div className="space-y-6">
      <TagFilter
        onSelect={setSelectedCategory}
        options={["All", ...productCategories]}
        selected={selectedCategory}
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((product) => (
          <Card className="h-full" key={product.slug}>
            <Badge className="mb-3">{product.category}</Badge>
            <h3 className="text-xl font-semibold text-text">{product.title}</h3>
            <p className="mt-2 text-sm text-muted">{product.summary}</p>
            <p className="mt-4 text-sm font-medium text-primary">ROI: {product.roi}</p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {product.features.slice(0, 2).map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
            <Link
              className="mt-6 inline-flex text-sm font-semibold text-primary hover:text-highlight"
              href={`/products/${product.slug}`}
            >
              View product →
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
