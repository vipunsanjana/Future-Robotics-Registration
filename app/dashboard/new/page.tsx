"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Bot, PlayCircle, Download, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { downloadRegistrationPdf } from "@/lib/pdf";
import type { CourseMode, Course } from "@/lib/types";

export default function NewRegistrationPage() {
  const router = useRouter();
  const [mode, setMode] = useState<CourseMode>("Online");
  const [submitting, setSubmitting] = useState(false);
  const [isSearchingStudent, setIsSearchingStudent] = useState(false);
  
  // Using 'any' here since the API now returns { registration, payment } wrapper
  const [success, setSuccess] = useState<any>(null);
  const [error, setError] = useState("");

  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    regNo: "",
    course: "", 
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    description: "",
  });

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Course[]) => {
        setAllCourses(data);
        const initialFiltered = data.filter((c) => c.status === "Online");
        if (initialFiltered.length > 0) {
          setForm((prev) => ({ ...prev, course: initialFiltered[0].title }));
        }
      })
      .catch(() => setAllCourses([]))
      .finally(() => setLoadingCourses(false));
  }, []);

  const filteredCourses = useMemo(() => {
    return allCourses.filter((c) => c.status === mode);
  }, [allCourses, mode]);

  const handleModeChange = (newMode: CourseMode) => {
    setMode(newMode);
    const newFiltered = allCourses.filter((c) => c.status === newMode);
    
    setForm((prev) => ({
      ...prev,
      course: newFiltered.length > 0 ? newFiltered[0].title : "",
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Auto-fill student data if regNo exists
  const handleRegNoBlur = async () => {
    if (!form.regNo.trim()) return;
    
    setIsSearchingStudent(true);
    try {
      const res = await fetch(`/api/students/by-reg?regNo=${encodeURIComponent(form.regNo.trim())}`);
      if (res.ok) {
        const data = await res.json();
        if (data.found && data.student) {
          setForm((prev) => ({
            ...prev,
            name: data.student.name || prev.name,
            phone: data.student.phone || prev.phone,
          }));
        }
      }
    } catch (err) {
      console.error("Failed to fetch student data:", err);
    } finally {
      setIsSearchingStudent(false);
    }
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
      const data = await res.json();
      setSuccess(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    // Extract properties to handle both nested and old flat formats safely
    const docNo = success.payment?.documentNo || success.registration?.documentNo || success.documentNo;
    const sName = success.registration?.name || success.name;
    const sCourse = success.registration?.course || success.course;
    const sRegNo = success.registration?.regNo || success.regNo;
    const sAmount = success.payment?.amount ?? success.registration?.amount ?? success.amount ?? 0;
    const sMode = success.registration?.mode || success.mode;

    return (
      <div className="mx-auto max-w-2xl px-2 sm:px-0">
        <Card className="border-primary/30">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <CardTitle className="text-xl sm:text-2xl">Registration Successful!</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Document <span className="font-mono font-semibold text-foreground">{docNo}</span> has been created.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-secondary/30 p-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">Student:</span>
                <span className="font-medium truncate">{sName}</span>

                <span className="text-muted-foreground">Course:</span>
                <span className="font-medium truncate">{sCourse}</span>

                <span className="text-muted-foreground">Reg No:</span>
                <span className="font-medium">{sRegNo}</span>

                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">LKR {Number(sAmount).toLocaleString()}</span>

                <span className="text-muted-foreground">Mode:</span>
                <span className="font-medium">{sMode}</span>
              </div>
            </div>
            <Button className="w-full" size="lg" onClick={() => downloadRegistrationPdf(success.registration || success)}>
              <Download className="mr-2 h-5 w-5" /> Download PDF Receipt
            </Button>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="w-full sm:flex-1" onClick={() => { 
                setSuccess(null); 
                setForm({ ...form, name: "", phone: "", regNo: "", description: "" }); 
              }}>
                New Registration
              </Button>
              <Button variant="outline" className="w-full sm:flex-1" onClick={() => router.push("/dashboard/registrations")}>
                View All
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-2 sm:px-0 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">New Registration</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">Fill in the student details and generate a PDF receipt.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => handleModeChange("Online")}
          className={`rounded-xl border-2 p-3.5 sm:p-4 text-left transition-all ${mode === "Online" ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/50"}`}
        >
          <div className="mb-1.5 flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary shrink-0" />
            <span className="font-semibold text-sm sm:text-base">Online Course</span>
            {mode === "Online" && <Badge className="ml-auto text-[10px]">Selected</Badge>}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">Live sessions with attendance, assignments, and a final project.</p>
        </button>
        <button
          type="button"
          onClick={() => handleModeChange("Recording")}
          className={`rounded-xl border-2 p-3.5 sm:p-4 text-left transition-all ${mode === "Recording" ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/50"}`}
        >
          <div className="mb-1.5 flex items-center gap-2">
            <PlayCircle className="h-5 w-5 text-primary shrink-0" />
            <span className="font-semibold text-sm sm:text-base">Recording Course</span>
            {mode === "Recording" && <Badge className="ml-auto text-[10px]">Selected</Badge>}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">Self-paced access to recorded lectures and materials.</p>
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Student Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="regNo" className="flex items-center gap-2">
                  Registration Number
                  {isSearchingStudent && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
                </Label>
                <Input 
                  id="regNo" 
                  name="regNo" 
                  value={form.regNo} 
                  onChange={handleChange} 
                  onBlur={handleRegNoBlur}
                  required 
                  placeholder="FR-2025-001" 
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="name">Student Name</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} required placeholder="John Doe" />
              </div>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" value={form.phone} onChange={handleChange} required placeholder="+94 77 123 4567" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="course">Course</Label>
                <select
                  id="course"
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  required
                  disabled={loadingCourses || filteredCourses.length === 0}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                >
                  {loadingCourses ? (
                    <option value="">Loading courses...</option>
                  ) : filteredCourses.length === 0 ? (
                    <option value="">No {mode} courses available</option>
                  ) : (
                    filteredCourses.map((c) => (
                      <option key={String(c._id ?? c.title)} value={c.title}>
                        {c.title}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="amount">Amount (LKR)</Label>
                <Input id="amount" name="amount" type="number" min="1" step="1" value={form.amount} onChange={handleChange} required placeholder="15000" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="date">Registration Date</Label>
                <Input id="date" name="date" type="date" value={form.date} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={form.description} onChange={handleChange} required placeholder="Course fee for selected course - Full course payment done" rows={3} />
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={submitting || loadingCourses || filteredCourses.length === 0}>
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
