"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, LayoutDashboard } from "lucide-react";

type AuthCtaProps = {
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "outline" | "ghost" | "secondary" | "link" | "destructive";
  className?: string;
  loggedOutLabel: string;
  loggedInLabel?: string;
};

export function AuthCta({
  size = "default",
  variant = "default",
  className,
  loggedOutLabel,
  loggedInLabel = "Go to Dashboard",
}: AuthCtaProps) {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <Button size={size} variant={variant} className={className} disabled>
        <span className="opacity-0">{loggedOutLabel}</span>
      </Button>
    );
  }

  if (status === "authenticated") {
    return (
      <Link href="/dashboard">
        <Button size={size} variant={variant} className={className}>
          <LayoutDashboard className="mr-2 h-4 w-4" />
          {loggedInLabel}
        </Button>
      </Link>
    );
  }

  return (
    <Link href="/login">
      <Button size={size} variant={variant} className={className}>
        {loggedOutLabel} <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </Link>
  );
}
