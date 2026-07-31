import { NextRequest, NextResponse } from "next/server";
import { getSessionRole } from "@/lib/session";
import { getStats } from "@/lib/data";

export async function GET() {
  const session = await getSessionRole();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const stats = await getStats();
  return NextResponse.json(stats);
}
