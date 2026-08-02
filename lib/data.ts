import { getDb } from "./mongodb";
import type { Registration, RegistrationInput, User, Role, Course } from "./types";

// Prevent Next.js hot-reloads from wiping out memory data in dev mode
const globalStore = global as unknown as {
  memUsers: User[];
  memRegs: Registration[];
  memCourses: Course[];
};

const memUsers: User[] = globalStore.memUsers || [];
const memRegs: Registration[] = globalStore.memRegs || [];
const memCourses: Course[] = globalStore.memCourses || [];

if (process.env.NODE_ENV !== "production") {
  globalStore.memUsers = memUsers;
  globalStore.memRegs = memRegs;
  globalStore.memCourses = memCourses;
}

// Helper to check if an ID is a valid MongoDB ObjectId
const isValidMongoId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

function oid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function docNo(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `FR-DOC-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const db = await getDb();
  if (db) {
    const u = await db.collection<User>("users").findOne({ email });
    return u ? { ...u, _id: String(u._id) } : null;
  }
  return memUsers.find((u) => u.email === email) ?? null;
}

export async function createUser(user: Omit<User, "_id" | "createdAt">): Promise<User> {
  const db = await getDb();
  const newUser: User = {
    ...user,
    _id: oid(),
    createdAt: new Date().toISOString(),
  };
  if (db) {
    const { _id, ...userWithoutId } = newUser;
    const res = await db.collection("users").insertOne(userWithoutId);
    return { ...newUser, _id: String(res.insertedId) };
  }
  memUsers.push(newUser);
  return newUser;
}

export async function countUsers(): Promise<number> {
  const db = await getDb();
  if (db) return await db.collection("users").countDocuments();
  return memUsers.length;
}

export async function listUsers(): Promise<User[]> {
  const db = await getDb();
  if (db) {
    const users = await db.collection<User>("users").find({}).sort({ createdAt: -1 }).toArray();
    return users.map((u) => ({ ...u, _id: String(u._id.toString()) }));
  }
  return [...memUsers].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

// Unified update function to handle Name, Email, and Role
export async function updateUser(id: string, updates: Partial<User>): Promise<void> {
  const db = await getDb();
  if (db && isValidMongoId(id)) {
    const { ObjectId } = require("mongodb");
    const { _id, ...safeUpdates } = updates as any;
    await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
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
  const db = await getDb();
  if (db && isValidMongoId(id)) {
    const { ObjectId } = require("mongodb");
    await db.collection("users").deleteOne({ _id: new ObjectId(id) });
    return;
  }
  const i = memUsers.findIndex((x) => x._id === id);
  if (i >= 0) memUsers.splice(i, 1);
}

export async function createRegistration(input: RegistrationInput): Promise<Registration> {
  const db = await getDb();
  const reg: Registration = {
    ...input,
    _id: oid(),
    documentNo: docNo(),
    createdAt: new Date().toISOString(),
  };
  if (db) {
    const { _id, ...regWithoutId } = reg;
    const res = await db.collection("registrations").insertOne(regWithoutId);
    return { ...reg, _id: String(res.insertedId) };
  }
  memRegs.push(reg);
  return reg;
}

export async function listRegistrations(): Promise<Registration[]> {
  const db = await getDb();
  if (db) {
    const regs = await db.collection<Registration>("registrations").find({}).sort({ createdAt: -1 }).toArray();
    return regs.map((r) => ({ ...r, _id: String(r._id) }));
  }
  return [...memRegs].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function deleteRegistration(id: string): Promise<void> {
  const db = await getDb();
  if (db && isValidMongoId(id)) {
    const { ObjectId } = require("mongodb");
    await db.collection("registrations").deleteOne({ _id: new ObjectId(id) });
    return;
  }
  const i = memRegs.findIndex((x) => x._id === id);
  if (i >= 0) memRegs.splice(i, 1);
}

export async function getStats() {
  const regs = await listRegistrations();
  const total = regs.length;
  const normal = regs.filter((r) => r.mode === "Normal").length;
  const recording = regs.filter((r) => r.mode === "Recording").length;
  const revenue = regs.reduce((sum, r) => sum + r.amount, 0);
  const byCourse: Record<string, number> = {};
  for (const r of regs) byCourse[r.course] = (byCourse[r.course] ?? 0) + 1;
  return { total, normal, recording, revenue, byCourse };
}

// --- Courses Data Functions ---

export async function createCourse(input: Omit<Course, "_id">): Promise<Course> {
  const db = await getDb();
  const course: Course = {
    ...input,
    _id: oid(),
  };
  
  if (db) {
    const { _id, ...courseWithoutId } = course;
    const res = await db.collection("courses").insertOne(courseWithoutId);
    return { ...course, _id: String(res.insertedId) };
  }
  
  memCourses.push(course);
  return course;
}

export async function getCourses(): Promise<Course[]> {
  const db = await getDb();
  if (db) {
    const courses = await db.collection<Course>("courses").find({}).toArray();
    return courses.map((c) => ({ ...c, _id: String(c._id) }));
  }
  return [...memCourses];
}

export async function deleteCourse(id: string): Promise<void> {
  const db = await getDb();
  if (db && isValidMongoId(id)) {
    const { ObjectId } = require("mongodb");
    await db.collection("courses").deleteOne({ _id: new ObjectId(id) });
    return;
  }
  const i = memCourses.findIndex((x) => x._id === id);
  if (i >= 0) memCourses.splice(i, 1);
}

export async function updateCourse(id: string, updates: Partial<Course>): Promise<Course | null> {
  const db = await getDb();
  if (db && isValidMongoId(id)) {
    const { ObjectId } = require("mongodb");
    const { _id, ...safeUpdates } = updates as any;
    
    await db.collection("courses").updateOne(
      { _id: new ObjectId(id) },
      { $set: safeUpdates }
    );
    
    // Fetch and return the updated document
    const updated = await db.collection<Course>("courses").findOne({ _id: new ObjectId(id) });
    return updated ? { ...updated, _id: String(updated._id) } : null;
  }
  
  // Fallback for memory store (Dev Mode)
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