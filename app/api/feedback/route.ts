import { NextRequest, NextResponse } from "next/server";
import { feedbackItems, feedbackRateLimit, FeedbackCategory } from "@/lib/feedback-store";

const allowedCategories: FeedbackCategory[] = [
  "Consent",
  "Cookies",
  "DSAR",
  "Discovery",
  "Compliance Ops",
  "Other"
];

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getClientKey(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "local";
}

export async function GET() {
  return NextResponse.json({ data: feedbackItems });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    title?: string;
    category?: string;
    description?: string;
    email?: string;
    website?: string;
  };

  const title = body.title?.trim() ?? "";
  const category = body.category?.trim() ?? "";
  const description = body.description?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const website = body.website?.trim() ?? "";

  if (website.length > 0) {
    return NextResponse.json({ error: "Spam blocked." }, { status: 400 });
  }

  if (title.length < 8 || description.length < 30) {
    return NextResponse.json({ error: "Title or description is too short." }, { status: 400 });
  }

  if (!allowedCategories.includes(category as FeedbackCategory)) {
    return NextResponse.json({ error: "Invalid category." }, { status: 400 });
  }

  if (email.length > 0 && !isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
  }

  // Basic placeholder limiter. Swap this with Redis or DB-backed throttling in production.
  const clientKey = getClientKey(request);
  const now = Date.now();
  const lastRequest = feedbackRateLimit.get(clientKey) ?? 0;

  if (now - lastRequest < 15_000) {
    return NextResponse.json({ error: "Rate limit exceeded. Please wait and try again." }, { status: 429 });
  }

  feedbackRateLimit.set(clientKey, now);

  const item = {
    id: crypto.randomUUID(),
    title,
    category: category as FeedbackCategory,
    description,
    email: email || undefined,
    createdAt: new Date().toISOString()
  };

  // In-memory store for local development. Replace with a DB insert for persistence.
  feedbackItems.unshift(item);

  return NextResponse.json({ data: item }, { status: 201 });
}
