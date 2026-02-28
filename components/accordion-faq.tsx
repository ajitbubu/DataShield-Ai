"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type FAQItem = {
  question: string;
  answer: string;
};

type AccordionFAQProps = {
  items: FAQItem[];
};

export function AccordionFAQ({ items }: AccordionFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div className="rounded-xl border border-border bg-surface" key={item.question}>
            <button
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-text"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              type="button"
            >
              {item.question}
              <span className={cn("text-lg transition-transform", isOpen ? "rotate-45" : "")}>+</span>
            </button>
            {isOpen ? <p className="px-4 pb-4 text-sm text-muted">{item.answer}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
