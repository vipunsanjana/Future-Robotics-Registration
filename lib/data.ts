import { getNativeDb } from "./mongodb";
import type {
  Registration,
  RegistrationInput,
  User,
  Course,
  Student,
  Payment,
} from "./types";
import { ObjectId } from "mongodb";

const globalStore = global as unknown as {
  memUsers: User[];
  memRegs: Registration[];
  memCourses: Course[];
  memStudents: Student[];
  memPayments: Payment[];
};

const memUsers: User[] = globalStore.memUsers || [];
const memRegs: Registration[] = globalStore.memRegs || [];
const memCourses: Course[] = globalStore.memCourses || [];
const memStudents: Student[] = globalStore.memStudents || [];
const memPayments: Payment[] = globalStore.memPayments || [];

if (process.env.NODE_ENV !== "production") {
  globalStore.memUsers = memUsers;
  globalStore.memRegs = memRegs;
  globalStore.memCourses = memCourses;
  globalStore.memStudents = memStudents;
  globalStore.memPayments = memPayments;
}

const isValidMongoId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

function oid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function docNo(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `FR-DOC-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

// --- Users ---

export async function findUserByEmail(email: string): Promise<User | null> {
  const db = await getNativeDb();
  if (db) {
    const u = (await db.collection("users").findOne({ email })) as any;
    return u ? { ...u, _id: u._id.toString() } : null;
  }
  return memUsers.find((u) => u.email === email) ?? null;
}

export async function createUser(user: Omit<User, "_id" | "createdAt">): Promise<User> {
  const db = await getNativeDb();
  const newUser: User = {
    ...user,
    _id: oid(),
    createdAt: new Date().toISOString(),
  };
  if (db) {
    const { _id, ...userWithoutId } = newUser;
    const res = await db.collection("users").insertOne(userWithoutId);
    return { ...newUser, _id: res.insertedId.toString() };
  }
  memUsers.push(newUser);
  return newUser;
}

export async function countUsers(): Promise<number> {
  const db = await getNativeDb();
  if (db) return await db.collection("users").countDocuments();
  return memUsers.length;
}

export async function listUsers(): Promise<User[]> {
  const db = await getNativeDb();
  if (db) {
    const users = (await db.collection("users").find({}).sort({ createdAt: -1 }).toArray()) as any[];
    return users.map((u) => ({ ...u, _id: u._id.toString() }));
  }
  return [...memUsers].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function updateUser(id: string, updates: Partial<User>): Promise<void> {
  const db = await getNativeDb();
  if (db && isValidMongoId(id)) {
    const { _id, ...safeUpdates } = updates as any;
    await db.collection("users").updateOne(
      { _id: new ObjectId(id) as any },
      { $set: safeUpdates }
    );
    return;
  }
  
  const u = memUsers.find((x) => x._id === id);
  if (u) {
    if (updates.name !== undefined) u.name = updates.name;
    if (updates.email !== undefined) u.email = updates.email;
    if (updates.role !== undefined) u.role = updates.role;
  }
}

export async function deleteUser(id: string): Promise<void> {
  const db = await getNativeDb();
  if (db && isValidMongoId(id)) {
    await db.collection("users").deleteOne({ _id: new ObjectId(id) as any });
    return;
  }
  const i = memUsers.findIndex((x) => x._id === id);
  if (i >= 0) memUsers.splice(i, 1);
}

// --- Students ---

export async function findStudentByRegNo(regNo: string): Promise<Student | null> {
  const uppercaseRegNo = regNo.trim().toUpperCase();
  const db = await getNativeDb();
  if (db) {
    const student = (await db.collection("students").findOne({ regNo: uppercaseRegNo })) as any;
    return student ? { ...student, _id: student._id.toString() } : null;
  }
  return memStudents.find((s) => s.regNo === uppercaseRegNo) ?? null;
}

// --- Registrations, Payments & Student Auto-sync ---

export async function createRegistration(input: RegistrationInput): Promise<Registration> {
  const db = await getNativeDb();
  const uppercaseRegNo = input.regNo.trim().toUpperCase();
  const courseTitle = input.course.trim();

  // 1. Check if registration for this course already exists
  if (db) {
    const existingReg = await db.collection("registrations").findOne({
      regNo: uppercaseRegNo,
      course: courseTitle,
    });
    if (existingReg) {
      throw new Error("Student with this Registration No. is already registered for this course.");
    }
  } else {
    const existingReg = memRegs.find(
      (r) => r.regNo === uppercaseRegNo && r.course === courseTitle
    );
    if (existingReg) {
      throw new Error("Student with this Registration No. is already registered for this course.");
    }
  }

  // 2. Fetch course code
  let courseCode = "UNKNOWN";
  if (db) {
    const courseDoc = (await db.collection("courses").findOne({ title: courseTitle })) as any;
    if (courseDoc && courseDoc.courseCode) {
      courseCode = courseDoc.courseCode;
    }
  } else {
    const courseDoc = memCourses.find((c) => c.title === courseTitle);
    if (courseDoc) courseCode = courseDoc.courseCode;
  }

  // 3. Create or update Student
  let studentId = oid();
  let studentRecord = await findStudentByRegNo(uppercaseRegNo);

  if (!studentRecord) {
    const newStudent: Student = {
      _id: studentId,
      name: input.name.trim(),
      phone: input.phone.trim(),
      regNo: uppercaseRegNo,
      course: courseTitle,
      courseCode: courseCode,
      email: input.email?.trim(),
      address: input.address?.trim(),
    };

    if (db) {
      const { _id, ...studentWithoutId } = newStudent;
      const res = await db.collection("students").insertOne(studentWithoutId);
      studentId = res.insertedId.toString();
    } else {
      memStudents.push(newStudent);
    }
  } else {
    studentId = studentRecord._id!.toString();
    const updatedCourse = studentRecord.course ? `${studentRecord.course}, ${courseTitle}` : courseTitle;
    const updatedCourseCode = studentRecord.courseCode ? `${studentRecord.courseCode}, ${courseCode}` : courseCode;

    if (db && isValidMongoId(studentId)) {
      await db.collection("students").updateOne(
        { _id: new ObjectId(studentId) as any },
        {
          $set: {
            course: updatedCourse,
            courseCode: updatedCourseCode,
            ...(input.email && { email: input.email.trim() }),
            ...(input.address && { address: input.address.trim() }),
          },
        }
      );
    } else if (studentRecord) {
      studentRecord.course = updatedCourse;
      studentRecord.courseCode = updatedCourseCode;
      if (input.email) studentRecord.email = input.email.trim();
      if (input.address) studentRecord.address = input.address.trim();
    }
  }

  // 4. Create Payment (Sets isCompleted based on description)
  const documentNumber = docNo();
  const isCompleted = /Full course payment done/i.test(input.description);

  const newPayment: Payment = {
    _id: oid(),
    studentId: studentId,
    studentName: input.name.trim(),
    studentRegNo: uppercaseRegNo,
    amount: Number(input.amount),
    date: input.date,
    description: input.description.trim(),
    documentNo: documentNumber,
    isCompleted: isCompleted,
    createdAt: new Date().toISOString(),
  };

  if (db) {
    const { _id, ...paymentWithoutId } = newPayment;
    await db.collection("payments").insertOne(paymentWithoutId);
  } else {
    memPayments.push(newPayment);
  }

  // 5. Create Registration Record
  const reg: Registration = {
    ...input,
    regNo: uppercaseRegNo,
    amount: Number(input.amount),
    _id: oid(),
    documentNo: documentNumber,
    createdAt: new Date().toISOString(),
  };

  if (db) {
    const { _id, ...regWithoutId } = reg;
    const res = await db.collection("registrations").insertOne(regWithoutId);
    return { ...reg, _id: res.insertedId.toString() };
  }

  memRegs.push(reg);
  return reg;
}

export async function listRegistrations(): Promise<Registration[]> {
  const db = await getNativeDb();
  if (db) {
    const regs = (await db.collection("registrations").find({}).sort({ createdAt: -1 }).toArray()) as any[];
    return regs.map((r) => ({ ...r, _id: r._id.toString() }));
  }
  return [...memRegs].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function deleteRegistration(id: string): Promise<void> {
  const db = await getNativeDb();
  if (db && isValidMongoId(id)) {
    await db.collection("registrations").deleteOne({ _id: new ObjectId(id) as any });
    return;
  }
  const i = memRegs.findIndex((x) => x._id === id);
  if (i >= 0) memRegs.splice(i, 1);
}

export async function getStats() {
  const regs = await listRegistrations();
  const regsCourse = await getCourses();
  const total = regs.length;
  const normal = regs.filter((r) => r.mode === "Online").length;
  const recording = regs.filter((r) => r.mode === "Recording").length;
  const totalCourse = regsCourse.length;
  const byCourse: Record<string, number> = {};
  for (const r of regs) byCourse[r.course] = (byCourse[r.course] ?? 0) + 1;
  return { total, normal, recording, totalCourse, byCourse };
}

// --- Courses ---

export async function createCourse(input: Omit<Course, "_id">): Promise<Course> {
  const db = await getNativeDb();
  const course: Course = {
    ...input,
    _id: oid(),
  };
  
  if (db) {
    const { _id, ...courseWithoutId } = course;
    const res = await db.collection("courses").insertOne(courseWithoutId);
    return { ...course, _id: res.insertedId.toString() };
  }
  
  memCourses.push(course);
  return course;
}

export async function getCourses(): Promise<Course[]> {
  const db = await getNativeDb();
  if (db) {
    const courses = (await db.collection("courses").find({}).toArray()) as any[];
    return courses.map((c) => ({ ...c, _id: c._id.toString() }));
  }
  return [...memCourses];
}

export async function deleteCourse(id: string): Promise<void> {
  const db = await getNativeDb();
  if (db && isValidMongoId(id)) {
    await db.collection("courses").deleteOne({ _id: new ObjectId(id) as any });
    return;
  }
  const i = memCourses.findIndex((x) => x._id === id);
  if (i >= 0) memCourses.splice(i, 1);
}

export async function updateCourse(id: string, updates: Partial<Course>): Promise<Course | null> {
  const db = await getNativeDb();
  if (db && isValidMongoId(id)) {
    const { _id, ...safeUpdates } = updates as any;
    
    await db.collection("courses").updateOne(
      { _id: new ObjectId(id) as any },
      { $set: safeUpdates }
    );
    
    const updated = (await db.collection("courses").findOne({ _id: new ObjectId(id) as any })) as any;
    return updated ? { ...updated, _id: updated._id.toString() } : null;
  }
  
  const c = memCourses.find((x) => x._id === id);
  if (c) {
    if (updates.courseCode !== undefined) c.courseCode = updates.courseCode;
    if (updates.title !== undefined) c.title = updates.title;
    if (updates.lecturer !== undefined) c.lecturer = updates.lecturer;
    if (updates.duration !== undefined) c.duration = updates.duration;
    if (updates.fee !== undefined) c.fee = updates.fee;
    if (updates.status !== undefined) c.status = updates.status;
    return c;
  }
  return null;
}
