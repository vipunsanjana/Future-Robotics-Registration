import { NextRequest, NextResponse } from "next/server";
import { getSessionRole } from "@/lib/session";
import { getDb } from "@/lib/mongodb";
import { Registration, Student, Payment, Course } from "@/lib/models";
import type { CourseMode } from "@/lib/types";

export async function POST(req: NextRequest) {
  const session = await getSessionRole();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await getDb();
    
    const body = await req.json();
    const { name, phone, regNo, course, amount, date, description, mode, email, address } = body;

    if (!name || !phone || !regNo || !course || !amount || !date || !description || !mode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (mode !== "Online" && mode !== "Recording") {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }

    const uppercaseRegNo = regNo.trim().toUpperCase();

    const existingRegistration = await Registration.findOne({
      regNo: uppercaseRegNo,
      course: course.trim(),
    });

    const courseDoc = await Course.findOne({ title: course.trim() });
    const courseCode = courseDoc ? courseDoc.courseCode : "UNKNOWN";

    let studentRecord = await Student.findOne({ regNo: uppercaseRegNo });

    if (!studentRecord) {
      studentRecord = await Student.create({
        name: name.trim(),
        phone: phone.trim(),
        regNo: uppercaseRegNo,
        course: course.trim(),
        courseCode: courseCode,
        email: email ? email.trim() : undefined,
        address: address ? address.trim() : undefined,
      });
    } else {
      if (!studentRecord.course.includes(course.trim())) {
          studentRecord.course = studentRecord.course ? `${studentRecord.course}, ${course.trim()}` : course.trim();
      }
      if (!studentRecord.courseCode.includes(courseCode)) {
          studentRecord.courseCode = studentRecord.courseCode ? `${studentRecord.courseCode}, ${courseCode}` : courseCode;
      }
      if (email) studentRecord.email = email.trim();
      if (address) studentRecord.address = address.trim();
      await studentRecord.save();
    }

    const documentNo = `DOC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const isCompleted = /Full course payment done/i.test(description);

    const payment = await Payment.create({
      studentId: studentRecord._id,
      studentName: name.trim(),
      studentRegNo: uppercaseRegNo,
      courseCode: courseCode,
      amount: Number(amount),
      date,
      description: description.trim(),
      documentNo,
      isCompleted,
    });

    let reg = existingRegistration;
    if (!existingRegistration) {
      reg = await Registration.create({
        name: name.trim(),
        phone: phone.trim(),
        regNo: uppercaseRegNo,
        course: course.trim(),
        amount: Number(amount),
        date,
        description: description.trim(),
        mode: mode as CourseMode,
        documentNo,
      });
    }

    return NextResponse.json({ registration: reg, payment }, { status: 201 });
  } catch (error: any) {
    console.error("Registration/Payment error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process transaction" },
      { status: 500 }
    );
  }
}
