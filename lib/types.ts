import type { ObjectId } from "mongodb";

export type Role = "admin" | "manager";

export interface User {
  _id?: string | ObjectId;
  email: string;
  name: string;
  image?: string;
  role: Role;
  createdAt: string;
}

export type CourseMode = "Online" | "Recording";
export type CourseStatus = "Online" | "Recording";

export interface Course {
  _id?: string | ObjectId;
  courseCode: string;
  title: string;
  lecturer: string;
  duration: string;
  fee: number;
  status: CourseStatus;
}

export interface Student {
  _id?: string | ObjectId;
  name: string;
  phone: string;
  regNo: string;
  course: string;
  courseCode: string;
  email?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Registration {
  _id?: string | ObjectId;
  name: string;
  phone: string;
  regNo: string;
  course: string;
  amount: number;
  date: string;
  description: string;
  mode: CourseMode;
  documentNo: string;
  createdAt: string;
}

export interface RegistrationInput {
  name: string;
  phone: string;
  regNo: string;
  course: string;
  amount: number;
  date: string;
  description: string;
  mode: CourseMode;
  email?: string;
  address?: string;
}

export interface Payment {
  _id?: string | ObjectId;
  studentId: string;
  studentName: string;
  studentRegNo: string;
  amount: number;
  date: string;
  description: string;
  documentNo: string;
  isCompleted: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
