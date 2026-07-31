export type Role = "admin" | "manager";

export interface User {
  _id?: string;
  email: string;
  name: string;
  image?: string;
  role: Role;
  createdAt: string;
}

export type CourseMode = "Normal" | "Recording";

export interface Registration {
  _id?: string;
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
}
