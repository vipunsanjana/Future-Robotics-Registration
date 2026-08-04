"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Users, Shield, Trash2, Loader2, Crown, UserPlus, Edit2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { User } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function UsersPage() {
  const router = useRouter();
  const [sessionRole, setSessionRole] = useState<string | null>(null);
  
  // States for deleting & updating status
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  // States for Custom Delete Dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // States for Creating
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "manager">("manager");
  const [creating, setCreating] = useState(false);
  
  // States for Editing
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editEmail, setEditEmail] = useState("");
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<"admin" | "manager">("manager");

  const [formError, setFormError] = useState<string | null>(null);
  
  // State for our awesome message
  const [awesomeMessage, setAwesomeMessage] = useState<string | null>(null);

  const showAwesomeMessage = (msg: string) => {
    setAwesomeMessage(msg);
    setTimeout(() => setAwesomeMessage(null), 3000);
  };

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((s) => {
        if (!s?.user) {
          router.push("/api/auth/signin");
          return;
        }
        setSessionRole(s.user.role ?? "manager");
      })
      .catch(() => {
        router.push("/api/auth/signin");
      });
  }, [router]);

  const { data: users, mutate, isLoading, error } = useSWR<User[]>(
    sessionRole === "admin" ? "/api/users" : null,
    fetcher
  );

  if (sessionRole === null) {
    return (
      <div className="flex h-40 items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading...
      </div>
    );
  }

  if (sessionRole !== "admin") {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
        <Shield className="h-10 w-10 text-muted-foreground" />
        <p className="text-lg font-semibold">Admin access required</p>
        <p className="text-sm text-muted-foreground">You need an admin account to manage users.</p>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Back to dashboard
        </Button>
      </div>
    );
  }

  const handleRoleChange = async (id: string, role: "admin" | "manager") => {
    setUpdating(id);
    try {
      await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role }),
      });
      await mutate();
      showAwesomeMessage("Awesome! User role updated successfully! 👑");
    } finally {
      setUpdating(null);
    }
  };

  // Open the custom dialog instead of the browser confirm
  const confirmDelete = (id: string) => {
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Actually execute the delete
  const executeDelete = async () => {
    if (!userToDelete) return;
    setDeleting(userToDelete);
    try {
      await fetch(`/api/users?id=${userToDelete}`, { method: "DELETE" });
      await mutate();
      setDeleteDialogOpen(false);
      showAwesomeMessage("Awesome! User deleted successfully! 🎉");
    } finally {
      setDeleting(null);
      setUserToDelete(null);
    }
  };

  const handleCreate = async () => {
    setFormError(null);
    if (!newEmail.trim() || !newEmail.includes("@")) {
      setFormError("Please enter a valid email address.");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail.trim(), name: newName.trim(), role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Failed to add user.");
        return;
      }
      setNewEmail("");
      setNewName("");
      setNewRole("manager");
      setCreateDialogOpen(false);
      await mutate();
      showAwesomeMessage("Awesome! New account created successfully! ✨");
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const openEditDialog = (user: User) => {
    setEditingId(typeof user._id === "string" ? user._id : user._id?.toString() ?? null);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role as "admin" | "manager");
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    setFormError(null);
    if (!editEmail.trim() || !editEmail.includes("@")) {
      setFormError("Please enter a valid email address.");
      return;
    }
    
    setUpdating(editingId);
    try {
      await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, email: editEmail, name: editName, role: editRole }),
      });
      setEditDialogOpen(false);
      await mutate();
      showAwesomeMessage("Awesome! User details updated successfully! 🚀");
    } catch {
      setFormError("Failed to update user.");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-sm text-muted-foreground">Manage admin and manager accounts.</p>
        </div>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" /> Add Manager
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new account</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="manager@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="name">Name (optional)</Label>
                <Input
                  id="name"
                  placeholder="Full name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Select value={newRole} onValueChange={(v) => setNewRole(v as "admin" | "manager")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formError && <p className="text-sm text-destructive">{formError}</p>}
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setCreateDialogOpen(false)} disabled={creating}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={creating}>
                {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {creating ? "Adding..." : "Add account"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* The Awesome Message Banner */}
      {awesomeMessage && (
        <div className="flex animate-in fade-in slide-in-from-top-2 items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          {awesomeMessage}
        </div>
      )}

      {/* Custom Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-sm text-muted-foreground">
            Are you absolutely sure you want to remove this user? They will lose access immediately and this action cannot be undone.
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
                  Removing...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Yes, Remove User
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={editRole} onValueChange={(v) => setEditRole(v as "admin" | "manager")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formError && <p className="text-sm text-destructive">{formError}</p>}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditDialogOpen(false)} disabled={updating === editingId}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updating === editingId}>
              {updating === editingId ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5" /> All Users ({users?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-40 items-center justify-center text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading...
            </div>
          ) : error ? (
            <div className="flex h-40 items-center justify-center text-sm text-destructive">
              Failed to load users.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((u) => {
                    const userId = typeof u._id === "string" ? u._id : u._id?.toString() ?? "";

                    return (
                      <TableRow key={userId || u.email}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={u.image} alt={u.name} />
                              <AvatarFallback>{u.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{u.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                        <TableCell>
                          <Badge variant={u.role === "admin" ? "default" : "secondary"}>
                            {u.role === "admin" ? <Crown className="mr-1 h-3 w-3" /> : <Shield className="mr-1 h-3 w-3" />}
                            {u.role === "admin" ? "Admin" : "Manager"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={updating === userId}
                              onClick={() => handleRoleChange(userId, u.role === "admin" ? "manager" : "admin")}
                            >
                              {updating === userId ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : u.role === "admin" ? (
                                "Demote to Manager"
                              ) : (
                                "Promote to Admin"
                              )}
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => openEditDialog(u)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              disabled={deleting === userId}
                              onClick={() => confirmDelete(userId)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              {deleting === userId ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
