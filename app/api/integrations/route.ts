import { NextRequest, NextResponse } from "next/server";
import { adminIntegrationsStore } from "@/lib/admin-store";

type IntegrationPayload = {
  id?: string;
  status?: "Connected" | "Needs Attention" | "Disconnected";
};

export async function GET() {
  return NextResponse.json({ data: adminIntegrationsStore });
}

export async function PATCH(request: NextRequest) {
  const body = (await request.json()) as IntegrationPayload;

  if (!body.id || !body.status) {
    return NextResponse.json({ error: "Integration id and status are required." }, { status: 400 });
  }

  const idx = adminIntegrationsStore.findIndex((integration) => integration.id === body.id);
  if (idx === -1) {
    return NextResponse.json({ error: "Integration not found." }, { status: 404 });
  }

  adminIntegrationsStore[idx] = {
    ...adminIntegrationsStore[idx],
    status: body.status,
    lastSync: new Date().toISOString()
  };

  return NextResponse.json({ data: adminIntegrationsStore[idx] });
}
