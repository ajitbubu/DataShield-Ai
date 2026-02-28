import { Card } from "@/components/card";

type FeatureItem = {
  title: string;
  description: string;
};

type FeatureGridProps = {
  items: FeatureItem[];
};

export function FeatureGrid({ items }: FeatureGridProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.title} className="h-full">
          <h3 className="mb-3 text-lg font-semibold text-text">{item.title}</h3>
          <p className="text-sm leading-6 text-muted">{item.description}</p>
        </Card>
      ))}
    </div>
  );
}
