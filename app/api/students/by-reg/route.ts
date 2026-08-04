import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { Student } from "@/lib/models";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const regNo = searchParams.get("regNo");

    if (!regNo) {
      return NextResponse.json({ error: "RegNo required" }, { status: 400 });
    }

    // Await DB connection first
    await getDb();
    const student = await Student.findOne({ regNo: regNo.trim().toUpperCase() });

    if (!student) {
      return NextResponse.json({ found: false }, { status: 404 });
    }

    return NextResponse.json({ found: true, student }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch student error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
