import { NextRequest, NextResponse } from "next/server";
import { adminAuditStore } from "@/lib/admin-store";

export async function GET(request: NextRequest) {
  const user = request.nextUrl.searchParams.get("user");
  const regulation = request.nextUrl.searchParams.get("regulation");

  const filtered = adminAuditStore.filter((event) => {
    const byUser = !user || event.user === user;
    const byRegulation = !regulation || event.regulation === regulation;
    return byUser && byRegulation;
  });

  return NextResponse.json({ data: filtered });
}
