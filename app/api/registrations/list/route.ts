import { NextRequest, NextResponse } from "next/server";
import { getSessionRole } from "@/lib/session";
import { getDb } from "@/lib/mongodb";
import { Registration, Payment, Student, Course } from "@/lib/models"; 
import { listRegistrations } from "@/lib/data";

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
  
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    await getDb();
    const reg = await Registration.findById(id);
    
    if (!reg) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    if (reg.documentNo) {
      await Payment.deleteMany({ documentNo: reg.documentNo });
    }

    await Registration.findByIdAndDelete(id);

    if (reg.regNo) {
      const student = await Student.findOne({ regNo: reg.regNo });
      
      if (student) {
        const currentCourses = student.course 
          ? student.course.split(",").map((c: string) => c.trim()).filter(Boolean) 
          : [];
          
        const currentCourseCodes = student.courseCode 
          ? student.courseCode.split(",").map((c: string) => c.trim()).filter(Boolean) 
          : [];

        // If the student has more than 1 course, just update the strings
        if (currentCourses.length > 1 || currentCourseCodes.length > 1) {
          
          // Find the courseCode for the deleted course
          const courseDoc = await Course.findOne({ title: reg.course.trim() });
          const deletedCourseCode = courseDoc ? courseDoc.courseCode : "UNKNOWN";

          // Filter out the deleted course and courseCode
          student.course = currentCourses
            .filter((c: string) => c !== reg.course.trim())
            .join(", ");
            
          student.courseCode = currentCourseCodes
            .filter((c: string) => c !== deletedCourseCode)
            .join(", ");
            
          await student.save();
        } else {
          // If the length is 1 (or 0), this was their only course. Delete the student.
          await Student.deleteOne({ _id: student._id });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process deletion" },
      { status: 500 }
    );
  }
}
