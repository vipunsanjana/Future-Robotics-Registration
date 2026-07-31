"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, PlayCircle, Download, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { downloadRegistrationPdf } from "@/lib/pdf";
import type { Registration, CourseMode } from "@/lib/types";

const COURSES = [
  "Robotics Fundamentals",
  "Arduino & Sensors",
  "Industrial Automation",
  "Python for Robotics",
  "IoT & Embedded Systems",
  "Advanced Robotics",
];

export default function NewRegistrationPage() {
  const router = useRouter();
  const [mode, setMode] = useState<CourseMode>("Normal");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<Registration | null>(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    regNo: "",
    course: COURSES[0],
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
          mode,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save registration");
      }
      const reg: Registration = await res.json();
      setSuccess(reg);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="border-primary/30">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl">Registration Successful!</CardTitle>
            <CardDescription>
              Document <span className="font-mono font-semibold text-foreground">{success.documentNo}</span> has been created.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-secondary/30 p-4 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">Student:</span><span className="font-medium">{success.name}</span>
                <span className="text-muted-foreground">Course:</span><span className="font-medium">{success.course}</span>
                <span className="text-muted-foreground">Reg No:</span><span className="font-medium">{success.regNo}</span>
                <span className="text-muted-foreground">Amount:</span><span className="font-medium">LKR {success.amount.toLocaleString()}</span>
                <span className="text-muted-foreground">Mode:</span><span className="font-medium">{success.mode}</span>
              </div>
            </div>
            <Button className="w-full" size="lg" onClick={() => downloadRegistrationPdf(success)}>
              <Download className="mr-2 h-5 w-5" /> Download PDF Receipt
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => { setSuccess(null); setForm({ ...form, name: "", phone: "", regNo: "", description: "" }); }}>
                New Registration
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => router.push("/dashboard/registrations")}>
                View All
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">New Registration</h1>
        <p className="text-sm text-muted-foreground">Fill in the student details and generate a PDF receipt.</p>
      </div>

      {/* Mode selector */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setMode("Normal")}
          className={`rounded-xl border-2 p-4 text-left transition-all ${mode === "Normal" ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/50"}`}
        >
          <div className="mb-2 flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <span className="font-semibold">Normal Course</span>
            {mode === "Normal" && <Badge className="ml-auto">Selected</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">Live sessions with attendance, assignments, and a final project.</p>
        </button>
        <button
          type="button"
          onClick={() => setMode("Recording")}
          className={`rounded-xl border-2 p-4 text-left transition-all ${mode === "Recording" ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/50"}`}
        >
          <div className="mb-2 flex items-center gap-2">
            <PlayCircle className="h-5 w-5 text-primary" />
            <span className="font-semibold">Recording Course</span>
            {mode === "Recording" && <Badge className="ml-auto">Selected</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">Self-paced access to recorded lectures and materials.</p>
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Student Name</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} required placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" value={form.phone} onChange={handleChange} required placeholder="+94 77 123 4567" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="regNo">Registration Number</Label>
                <Input id="regNo" name="regNo" value={form.regNo} onChange={handleChange} required placeholder="FR-2025-001" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <select
                  id="course"
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {COURSES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (LKR)</Label>
                <Input id="amount" name="amount" type="number" min="1" step="1" value={form.amount} onChange={handleChange} required placeholder="15000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Registration Date</Label>
                <Input id="date" name="date" type="date" value={form.date} onChange={handleChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={form.description} onChange={handleChange} required placeholder="Course fee for Robotics Fundamentals - Month 1" rows={3} />
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={submitting}>
              {submitting ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving...</>
              ) : (
                <>Save & Generate Receipt</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
