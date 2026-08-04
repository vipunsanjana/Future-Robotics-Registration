import { NextRequest, NextResponse } from "next/server";
import { getSessionRole } from "@/lib/session";
import { getCourses, createCourse, deleteCourse, updateCourse } from "@/lib/data"; 
import type { Course, CourseStatus } from "@/lib/types";

// GET handler to fetch all courses
export async function GET(req: NextRequest) {
  const session = await getSessionRole();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const courses = await getCourses();
    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

// POST handler to add a new course
export async function POST(req: NextRequest) {
  const session = await getSessionRole();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Partial<Course>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { courseCode, title, lecturer, duration, fee, status } = body;

  // Validate required fields
  if (!courseCode || !title || !lecturer || !duration || fee === undefined || !status) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Validate CourseStatus type
  if (status !== "Online" && status !== "Recording") {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const newCourse = await createCourse({
      courseCode,
      title,
      lecturer,
      duration,
      fee: Number(fee),
      status: status as CourseStatus,
    });

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}

// DELETE handler to remove a course
export async function DELETE(req: NextRequest) {
  const session = await getSessionRole();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
  }

  try {
    await deleteCourse(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}

// PUT handler to update an existing course
export async function PUT(req: NextRequest) {
  const session = await getSessionRole();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Partial<Course>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { _id, courseCode, title, lecturer, duration, fee, status } = body;

  if (!_id) {
    return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
  }

  try {
    // FIX: Assert _id as a string here to resolve the TS error
    const updatedCourse = await updateCourse(_id as string, {
      courseCode,
      title,
      lecturer,
      duration,
      fee: fee ? Number(fee) : undefined,
      status: status as CourseStatus,
    });
    
    return NextResponse.json(updatedCourse, { status: 200 });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}
