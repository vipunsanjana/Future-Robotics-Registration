"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Cpu, Mail, ArrowLeft, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/dashboard";
  const error = params.get("error");
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
      <div className="absolute left-1/2 top-1/4 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      <Card className="relative w-full max-w-md border-border/60 shadow-xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Cpu className="h-7 w-7" />
          </div>
          <CardTitle className="text-2xl">Welcome to Future Robotics</CardTitle>
          <CardDescription>
            Sign in with your Google account to access the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-left animate-in fade-in slide-in-from-top-1 duration-300">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
              <div>
                <p className="text-sm font-semibold text-destructive">Access denied</p>
                <p className="mt-0.5 text-xs text-destructive/80">
                  This Google account isn&apos;t registered. Please contact your administrator to get access.
                </p>
              </div>
            </div>
          )}

          <Button
            className="w-full"
            size="lg"
            variant="outline"
            onClick={handleGoogle}
            disabled={loading}
          >
            <Mail className="mr-2 h-5 w-5" />
            {loading ? "Signing in..." : "Continue with Google"}
          </Button>

          <Link href="/" className="block">
            <Button variant="ghost" className="w-full" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
