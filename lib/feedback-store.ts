export type FeedbackCategory =
  | "Consent"
  | "Cookies"
  | "DSAR"
  | "Discovery"
  | "Compliance Ops"
  | "Other";

export type FeedbackItem = {
  id: string;
  title: string;
  category: FeedbackCategory;
  description: string;
  email?: string;
  createdAt: string;
};

const seed: FeedbackItem[] = [
  {
    id: "seed-1",
    title: "Cross-region consent sync is brittle",
    category: "Consent",
    description:
      "We cannot reliably propagate preference changes across all customer touchpoints within minutes.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()
  },
  {
    id: "seed-2",
    title: "Cookie scans miss scripts in experiments",
    category: "Cookies",
    description:
      "A/B test variants inject tags that are not captured by our current weekly scanning process.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString()
  },
  {
    id: "seed-3",
    title: "DSAR evidence collection takes too long",
    category: "DSAR",
    description:
      "Teams compile fulfillment artifacts manually across tools, creating deadline risk.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString()
  }
];

const globalForFeedback = globalThis as unknown as {
  feedbackItems?: FeedbackItem[];
  feedbackRateLimit?: Map<string, number>;
};

if (!globalForFeedback.feedbackItems) {
  globalForFeedback.feedbackItems = seed;
}

if (!globalForFeedback.feedbackRateLimit) {
  globalForFeedback.feedbackRateLimit = new Map<string, number>();
}

export const feedbackItems = globalForFeedback.feedbackItems;
export const feedbackRateLimit = globalForFeedback.feedbackRateLimit;
