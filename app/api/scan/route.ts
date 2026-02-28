import { NextRequest, NextResponse } from "next/server";
import { generateMockScan } from "@/lib/scanner";

type ScanRequest = {
  domain?: string;
};

function isValidDomain(domain: string) {
  return /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain);
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as ScanRequest;
  const domain = body.domain?.trim() ?? "";

  if (!domain || !isValidDomain(domain)) {
    return NextResponse.json({ error: "Valid domain is required." }, { status: 400 });
  }

  // Mock scan engine. Replace with headless scanner + model inference pipeline in production.
  const result = generateMockScan(domain);

  return NextResponse.json(result);
}
