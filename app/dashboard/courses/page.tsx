"use client";

import { useEffect, useState, useMemo } from "react";
import { Trash2, Search, Loader2, CheckCircle2, AlertTriangle, BookOpen, Plus, Edit, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Course } from "@/lib/types";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Online" | "Recording">("all");
  
  // States for deleting
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

  // States for adding
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    courseCode: "",
    title: "",
    lecturer: "",
    duration: "",
    fee: 0,
    status: "Online"
  });

  // States for editing
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<Partial<Course> | null>(null);
  
  // State for our awesome message
  const [awesomeMessage, setAwesomeMessage] = useState<string | null>(null);

  const showAwesomeMessage = (msg: string) => {
    setAwesomeMessage(msg);
    setTimeout(() => setAwesomeMessage(null), 3000);
  };

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setCourses(d))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.courseCode.toLowerCase().includes(q) ||
        c.lecturer.toLowerCase().includes(q)
      );
    });
  }, [courses, search, statusFilter]);

  // Open the delete custom dialog
  const confirmDelete = (id: string | { toString(): string }) => {
    setCourseToDelete(String(id));
    setDeleteDialogOpen(true);
  };

  // Open the edit custom dialog
  const openEditDialog = (course: Course) => {
    setCourseToEdit(course);
    setEditDialogOpen(true);
  };

  // Execute the delete
  const executeDelete = async () => {
    if (!courseToDelete) return;
    setDeleting(courseToDelete);
    try {
      await fetch(`/api/courses?id=${courseToDelete}`, { method: "DELETE" });
      setCourses(courses.filter((c) => String(c._id) !== courseToDelete));
      setDeleteDialogOpen(false);
      showAwesomeMessage("Awesome! Course deleted successfully! 🎉");
    } finally {
      setDeleting(null);
      setCourseToDelete(null);
    }
  };

  // Execute the add course
  const executeAddCourse = async () => {
    setAdding(true);
    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCourse),
      });
      
      if (response.ok) {
        const addedCourse = await response.json();
        setCourses([addedCourse, ...courses]);
        setAddDialogOpen(false);
        setNewCourse({ courseCode: "", title: "", lecturer: "", duration: "", fee: 0, status: "Online" }); // Reset form
        showAwesomeMessage("Awesome! New course added successfully! 🚀");
      }
    } catch (error) {
      console.error("Failed to add course:", error);
    } finally {
      setAdding(false);
    }
  };

  // Execute the edit course
  const executeEditCourse = async () => {
    if (!courseToEdit || !courseToEdit._id) return;
    setEditing(true);
    try {
      const response = await fetch("/api/courses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseToEdit),
      });
      
      if (response.ok) {
        const updatedCourse = await response.json();
        setCourses(courses.map(c => c._id === updatedCourse._id ? updatedCourse : c));
        setEditDialogOpen(false);
        setCourseToEdit(null);
        showAwesomeMessage("Awesome! Course updated successfully! ✨");
      }
    } catch (error) {
      console.error("Failed to update course:", error);
    } finally {
      setEditing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Courses</h1>
          <p className="text-sm text-muted-foreground">Manage your academy's course offerings and curriculum.</p>
        </div>
        <Button className="gap-2 w-full sm:w-auto" onClick={() => setAddDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Add New Course
        </Button>
      </div>

      {awesomeMessage && (
        <div className="flex animate-in fade-in slide-in-from-top-2 items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          {awesomeMessage}
        </div>
      )}

      {/* --- ADD NEW COURSE DIALOG --- */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Course</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Course Code</label>
                <Input 
                  placeholder="e.g. ROB101" 
                  value={newCourse.courseCode} 
                  onChange={(e) => setNewCourse({...newCourse, courseCode: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Course Title</label>
                <Input 
                  placeholder="e.g. Intro to Robotics" 
                  value={newCourse.title} 
                  onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Lecturer Name</label>
              <Input 
                placeholder="e.g. Dr. Smith" 
                value={newCourse.lecturer} 
                onChange={(e) => setNewCourse({...newCourse, lecturer: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration</label>
                <Input 
                  placeholder="e.g. 3 Months" 
                  value={newCourse.duration} 
                  onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Fee (LKR)</label>
                <Input 
                  type="number" 
                  placeholder="e.g. 15000" 
                  value={newCourse.fee || ""} 
                  onChange={(e) => setNewCourse({...newCourse, fee: Number(e.target.value)})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <div className="flex gap-2">
                <Button 
                  type="button"
                  variant={newCourse.status === "Online" ? "default" : "outline"}
                  onClick={() => setNewCourse({...newCourse, status: "Online"})}
                  className="w-full"
                >
                  Online
                </Button>
                <Button 
                  type="button"
                  variant={newCourse.status === "Recording" ? "default" : "outline"}
                  onClick={() => setNewCourse({...newCourse, status: "Recording"})}
                  className="w-full"
                >
                  Recording
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setAddDialogOpen(false)} disabled={adding}>
              Cancel
            </Button>
            <Button onClick={executeAddCourse} disabled={adding}>
              {adding ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Course"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- EDIT COURSE DIALOG --- */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
          </DialogHeader>
          {courseToEdit && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Course Code</label>
                  <Input 
                    placeholder="e.g. ROB101" 
                    value={courseToEdit.courseCode || ""} 
                    onChange={(e) => setCourseToEdit({...courseToEdit, courseCode: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Course Title</label>
                  <Input 
                    placeholder="e.g. Intro to Robotics" 
                    value={courseToEdit.title || ""} 
                    onChange={(e) => setCourseToEdit({...courseToEdit, title: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Lecturer Name</label>
                <Input 
                  placeholder="e.g. Dr. Smith" 
                  value={courseToEdit.lecturer || ""} 
                  onChange={(e) => setCourseToEdit({...courseToEdit, lecturer: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration</label>
                  <Input 
                    placeholder="e.g. 3 Months" 
                    value={courseToEdit.duration || ""} 
                    onChange={(e) => setCourseToEdit({...courseToEdit, duration: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fee (LKR)</label>
                  <Input 
                    type="number" 
                    placeholder="e.g. 15000" 
                    value={courseToEdit.fee || ""} 
                    onChange={(e) => setCourseToEdit({...courseToEdit, fee: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <div className="flex gap-2">
                  <Button 
                    type="button"
                    variant={courseToEdit.status === "Online" ? "default" : "outline"}
                    onClick={() => setCourseToEdit({...courseToEdit, status: "Online"})}
                    className="w-full"
                  >
                    Online
                  </Button>
                  <Button 
                    type="button"
                    variant={courseToEdit.status === "Recording" ? "default" : "outline"}
                    onClick={() => setCourseToEdit({...courseToEdit, status: "Recording"})}
                    className="w-full"
                  >
                    Recording
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} disabled={editing}>
              Cancel
            </Button>
            <Button onClick={executeEditCourse} disabled={editing}>
              {editing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : "Update Course"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- DELETE CONFIRMATION DIALOG --- */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md w-[95vw]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-sm text-muted-foreground">
            Are you absolutely sure you want to delete this course? This action cannot be undone and the data will be permanently removed from the server.
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)} 
              disabled={!!deleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={executeDelete} 
              disabled={!!deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Yes, Delete it
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <CardTitle className="text-lg">All Courses ({filtered.length})</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search title, code, or lecturer..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-full sm:w-64 md:w-72"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {(["all", "Online", "Recording"] as const).map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={statusFilter === s ? "default" : "outline"}
                    onClick={() => setStatusFilter(s)}
                    className="flex-1 sm:flex-none"
                  >
                    {s === "all" ? "All" : s}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-40 items-center justify-center text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
              No courses found. Add some awesome courses!
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Course Code</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[200px]">Course Title</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[150px]">Lecturer</TableHead>
                    <TableHead className="whitespace-nowrap">Duration</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Fee (LKR)</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((c) => (
                    <TableRow key={String(c._id ?? c.courseCode)}>
                      <TableCell className="font-mono text-xs font-medium whitespace-nowrap">
                        {c.courseCode}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 font-medium">
                          <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="truncate max-w-[200px] block">{c.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm whitespace-nowrap">
                          <UserCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                          {c.lecturer}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm whitespace-nowrap">{c.duration}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant={c.status === "Online" ? "default" : "secondary"}>
                          {c.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium whitespace-nowrap">
                        {c.fee.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {/* EDIT BUTTON UPDATE */}
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            title="Edit Course"
                            onClick={() => openEditDialog(c)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => confirmDelete(c._id!)}
                            disabled={deleting === c._id}
                            title="Delete"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            {deleting === c._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
