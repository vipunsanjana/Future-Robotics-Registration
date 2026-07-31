import { NextRequest, NextResponse } from "next/server";
import { getSessionRole } from "@/lib/session";
import { listRegistrations, deleteRegistration } from "@/lib/data";

export async function GET() {
  const session = await getSessionRole();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const regs = await listRegistrations();
  return NextResponse.json(regs);
}

export async function DELETE(req: NextRequest) {
  const session = await getSessionRole();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await deleteRegistration(id);
  return NextResponse.json({ success: true });
}
