"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type FAQItem = {
  question: string;
  answer: string;
};

type FAQAccordionProps = {
  items: FAQItem[];
};

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const open = openIndex === index;

        return (
          <div className="rounded-xl border border-border bg-surface shadow-sm" key={item.question}>
            <button
              aria-expanded={open}
              className="flex w-full items-center justify-between px-4 py-4 text-left text-sm font-semibold text-text"
              onClick={() => setOpenIndex(open ? null : index)}
              type="button"
            >
              {item.question}
              <span className={cn("text-base text-muted transition-transform", open ? "rotate-45" : "")}>+</span>
            </button>
            {open ? <p className="px-4 pb-4 text-sm leading-6 text-muted">{item.answer}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
