"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  ClipboardList, 
  LogOut, 
  Menu, 
  ShieldCheck,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DashboardShellProps {
  children: React.ReactNode;
  email: string;
  name: string;
  image: string;
  role: string;
}

export function DashboardShell({ children, name, image, role }: DashboardShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "New Registration", href: "/dashboard/new", icon: UserPlus },
    { name: "Registrations", href: "/dashboard/registrations", icon: ClipboardList },
    { name: "Courses", href: "/dashboard/courses", icon: BookOpen },
    ...(role === "admin" ? [{ name: "User Management", href: "/dashboard/users", icon: Users }] : []),
  ];

  const NavLinks = () => (
    <div className="space-y-1 py-4">
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.name}
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col border-r bg-card px-4 py-6 justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center gap-2 px-2 py-2">
            <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg overflow-hidden bg-primary text-primary-foreground shadow">
                <img src="/Logo.jpeg" alt="Logo" className="h-full w-full object-cover" />
              </div>
            </Link>
            <div>
              <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              <h2 className="font-semibold text-sm">Future Robotics</h2>
              </Link>
              <p className="text-xs text-muted-foreground capitalize flex items-center justify-center gap-1">
                <ShieldCheck className="h-3 w-3 text-primary" /> {role}
              </p>
            </div>
          </div>
          <NavLinks />
        </div>

        <div className="border-t pt-4 px-2 space-y-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={image} alt={name} />
              <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="text-xs font-medium truncate">{name}</p>
              <p className="text-[10px] text-muted-foreground capitalize">{role} Account</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </aside>

      {/* Mobile Top Navigation Bar */}
      <div className="md:hidden flex items-center justify-between border-b bg-card px-4 py-3 sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden bg-primary text-primary-foreground shrink-0">
            <img src="/Logo.jpeg" alt="Logo" className="h-full w-full object-cover" />
          </div>
          <span className="font-semibold text-sm">Future Robotics</span>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 flex flex-col justify-between py-6">
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center gap-2 px-2 py-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg overflow-hidden bg-primary text-primary-foreground shadow">
                  <img src="/Logo.jpeg" alt="Logo" className="h-full w-full object-cover" />
                </div>
                <div>
                  <h2 className="font-semibold text-sm">Future Robotics</h2>
                  <p className="text-xs text-muted-foreground capitalize">Academy Panel</p>
                </div>
              </div>
              <NavLinks />
            </div>

            <div className="border-t pt-4 px-2 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={image} alt={name} />
                  <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  <p className="text-xs font-medium truncate">{name}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">{role}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start text-destructive hover:bg-destructive/10"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                <LogOut className="mr-2 h-4 w-4" /> Sign out
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content Viewport */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
