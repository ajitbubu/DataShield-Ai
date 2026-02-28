import { NextRequest, NextResponse } from "next/server";
import { Policy } from "@/data/admin";
import { adminPoliciesStore } from "@/lib/admin-store";

type PolicyPayload = {
  name?: string;
  regulation?: string;
  control?: string;
  code?: string;
  action?: "simulate" | "toggle";
  id?: string;
};

export async function GET() {
  return NextResponse.json({ data: adminPoliciesStore });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as PolicyPayload;

  if (!body.name || !body.regulation || !body.control || !body.code) {
    return NextResponse.json({ error: "Missing required policy fields." }, { status: 400 });
  }

  const validRegulations: Policy["regulation"][] = ["GDPR", "CPRA", "DPDP", "HIPAA", "GLBA", "CPA"];

  if (!validRegulations.includes(body.regulation as Policy["regulation"])) {
    return NextResponse.json({ error: "Invalid regulation." }, { status: 400 });
  }

  const newPolicy: Policy = {
    id: `pol-${Date.now()}`,
    name: body.name,
    regulation: body.regulation as Policy["regulation"],
    control: body.control,
    version: "v1.0",
    enforcementEnabled: false,
    code: body.code,
    updatedAt: new Date().toISOString()
  };

  adminPoliciesStore.unshift(newPolicy);

  return NextResponse.json({ data: newPolicy }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const body = (await request.json()) as PolicyPayload;

  if (!body.id || !body.action) {
    return NextResponse.json({ error: "Policy id and action are required." }, { status: 400 });
  }

  const idx = adminPoliciesStore.findIndex((policy) => policy.id === body.id);
  if (idx === -1) {
    return NextResponse.json({ error: "Policy not found." }, { status: 404 });
  }

  if (body.action === "toggle") {
    adminPoliciesStore[idx] = {
      ...adminPoliciesStore[idx],
      enforcementEnabled: !adminPoliciesStore[idx].enforcementEnabled,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({ data: adminPoliciesStore[idx] });
  }

  const simulation = {
    impactSummary: "Estimated: 14 pre-consent script blocks, 6 preference remediations, 2 vendor escalations.",
    confidence: 89
  };

  return NextResponse.json({ data: simulation });
}
