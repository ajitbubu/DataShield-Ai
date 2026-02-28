import { NextRequest, NextResponse } from "next/server";
import { AdminRole } from "@/data/admin";
import { adminUsersStore } from "@/lib/admin-store";

type UserPayload = {
  id?: string;
  name?: string;
  email?: string;
  role?: AdminRole;
};

export async function GET() {
  return NextResponse.json({ data: adminUsersStore });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as UserPayload;

  if (!body.email || !body.role) {
    return NextResponse.json({ error: "Email and role are required." }, { status: 400 });
  }

  const invite = {
    id: `u-${Date.now()}`,
    name: body.name ?? body.email.split("@")[0],
    email: body.email,
    role: body.role,
    status: "Invited" as const
  };

  adminUsersStore.push(invite);

  return NextResponse.json({ data: invite }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const body = (await request.json()) as UserPayload;

  if (!body.id || !body.role) {
    return NextResponse.json({ error: "User id and role are required." }, { status: 400 });
  }

  const idx = adminUsersStore.findIndex((user) => user.id === body.id);
  if (idx === -1) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  adminUsersStore[idx] = { ...adminUsersStore[idx], role: body.role };

  return NextResponse.json({ data: adminUsersStore[idx] });
}
