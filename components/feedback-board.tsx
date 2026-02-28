"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Card } from "@/components/card";
import { Button } from "@/components/button";
import type { FeedbackCategory, FeedbackItem } from "@/lib/feedback-store";

type FeedbackResponse = {
  data: FeedbackItem[];
};

type SortOption = "Newest" | "Most Upvoted";

const categories: FeedbackCategory[] = [
  "Consent",
  "Cookies",
  "DSAR",
  "Discovery",
  "Compliance Ops",
  "Other"
];

export function FeedbackBoard() {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("Newest");
  const [upvotes, setUpvotes] = useState<Record<string, number>>({});
  const [formError, setFormError] = useState<string>("");

  useEffect(() => {
    async function fetchFeedback() {
      const res = await fetch("/api/feedback", { cache: "no-store" });
      const body = (await res.json()) as FeedbackResponse;
      setItems(body.data);
      setLoading(false);
    }

    fetchFeedback().catch(() => {
      setFormError("Unable to load feedback right now.");
      setLoading(false);
    });
  }, []);

  const sorted = useMemo(() => {
    const copy = [...items];
    if (sortBy === "Newest") {
      return copy.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    }

    return copy.sort((a, b) => (upvotes[b.id] ?? 0) - (upvotes[a.id] ?? 0));
  }, [items, sortBy, upvotes]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const category = String(formData.get("category") ?? "") as FeedbackCategory;
    const description = String(formData.get("description") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const website = String(formData.get("website") ?? "").trim();

    if (title.length < 8 || description.length < 30) {
      setFormError("Please provide a more specific title and description.");
      return;
    }

    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, category, description, email, website })
    });

    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setFormError(body.error ?? "Unable to submit feedback.");
      return;
    }

    const body = (await res.json()) as { data: FeedbackItem };
    setItems((prev) => [body.data, ...prev]);
    event.currentTarget.reset();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <h2 className="text-xl font-semibold text-text">Share a Pain Point</h2>
        <p className="mt-2 text-sm text-muted">
          Tell us what slows your privacy operations. We use this board to prioritize roadmap improvements.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-text" htmlFor="title">
              Title
            </label>
            <input
              className="w-full rounded-xl border border-border px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-highlight"
              id="title"
              minLength={8}
              name="title"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text" htmlFor="category">
              Category
            </label>
            <select
              className="w-full rounded-xl border border-border px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-highlight"
              id="category"
              name="category"
              required
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text" htmlFor="description">
              Description
            </label>
            <textarea
              className="h-28 w-full rounded-xl border border-border px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-highlight"
              id="description"
              minLength={30}
              name="description"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text" htmlFor="email">
              Email (optional)
            </label>
            <input
              className="w-full rounded-xl border border-border px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-highlight"
              id="email"
              name="email"
              type="email"
            />
          </div>

          <input
            aria-hidden="true"
            autoComplete="off"
            className="hidden"
            name="website"
            tabIndex={-1}
            type="text"
          />

          {formError ? <p className="text-sm font-medium text-danger">{formError}</p> : null}

          <Button type="submit">Submit feedback</Button>
        </form>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-text">Pain Point Board</h2>
          <div className="flex items-center gap-2 rounded-lg border border-border p-1 text-sm">
            {(["Newest", "Most Upvoted"] as SortOption[]).map((option) => (
              <button
                className={`rounded-md px-3 py-1 ${
                  sortBy === option ? "bg-primary text-white" : "text-muted hover:text-primary"
                }`}
                key={option}
                onClick={() => setSortBy(option)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <Card>
            <p className="text-sm text-muted">Loading feedback...</p>
          </Card>
        ) : (
          sorted.map((item) => (
            <Card key={item.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">{item.category}</p>
                  <h3 className="mt-1 text-lg font-semibold text-text">{item.title}</h3>
                </div>
                <button
                  className="rounded-lg border border-border px-3 py-1 text-sm font-medium text-muted transition-colors hover:border-primary hover:text-primary"
                  onClick={() => setUpvotes((prev) => ({ ...prev, [item.id]: (prev[item.id] ?? 0) + 1 }))}
                  type="button"
                >
                  ▲ {upvotes[item.id] ?? 0}
                </button>
              </div>
              <p className="mt-3 text-sm text-muted">{item.description}</p>
              <p className="mt-4 text-xs text-muted">{new Date(item.createdAt).toLocaleString()}</p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
