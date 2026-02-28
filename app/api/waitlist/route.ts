import { NextRequest, NextResponse } from "next/server";

type WaitlistEntry = {
  email: string;
  createdAt: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __waitlistEntries: WaitlistEntry[] | undefined;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const waitlistStore = globalThis.__waitlistEntries ?? [];
if (!globalThis.__waitlistEntries) {
  globalThis.__waitlistEntries = waitlistStore;
}

export async function GET() {
  return NextResponse.json({
    count: waitlistStore.length
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = body.email?.trim().toLowerCase();

    if (!email || !EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ message: "Please provide a valid email address." }, { status: 400 });
    }

    const exists = waitlistStore.some((entry) => entry.email === email);
    if (exists) {
      return NextResponse.json({ message: "This email is already on the waitlist." }, { status: 200 });
    }

    waitlistStore.push({
      email,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ message: "Successfully joined waitlist." }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Invalid request payload." }, { status: 400 });
  }
}
