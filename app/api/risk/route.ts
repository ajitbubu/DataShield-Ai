import { NextRequest, NextResponse } from "next/server";
import { adminRisksStore } from "@/lib/admin-store";

type RiskPayload = {
  id?: string;
  owner?: string;
  status?: "Open" | "In Progress" | "Resolved";
};

export async function GET() {
  return NextResponse.json({ data: adminRisksStore });
}

export async function PATCH(request: NextRequest) {
  const body = (await request.json()) as RiskPayload;

  if (!body.id) {
    return NextResponse.json({ error: "Risk id is required." }, { status: 400 });
  }

  const idx = adminRisksStore.findIndex((risk) => risk.id === body.id);
  if (idx === -1) {
    return NextResponse.json({ error: "Risk not found." }, { status: 404 });
  }

  adminRisksStore[idx] = {
    ...adminRisksStore[idx],
    owner: body.owner ?? adminRisksStore[idx].owner,
    status: body.status ?? adminRisksStore[idx].status
  };

  return NextResponse.json({ data: adminRisksStore[idx] });
}
