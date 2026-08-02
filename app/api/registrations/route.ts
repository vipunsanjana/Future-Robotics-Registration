import { NextRequest, NextResponse } from "next/server";
import { getSessionRole } from "@/lib/session";
import { createRegistration } from "@/lib/data";
import type { RegistrationInput, CourseMode } from "@/lib/types";

export async function POST(req: NextRequest) {
  const session = await getSessionRole();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: RegistrationInput;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, phone, regNo, course, amount, date, description, mode } = body;
  if (!name || !phone || !regNo || !course || !amount || !date || !description || !mode) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (mode !== "Online" && mode !== "Recording") {
    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  }

  const reg = await createRegistration({
    name,
    phone,
    regNo,
    course,
    amount: Number(amount),
    date,
    description,
    mode: mode as CourseMode,
  });

  return NextResponse.json(reg, { status: 201 });
}
