"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { ArrowLeft, ShieldAlert, Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();

  const callbackUrl = params.get("callbackUrl") || "/dashboard";
  const error = params.get("error");

  const [loading, setLoading] = useState(false);

  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [status, callbackUrl, router]);

  const handleGoogle = async () => {
    setLoading(true);

    await signIn("google", {
      callbackUrl,
    });
  };

  if (status === "loading" || status === "authenticated") {
    return null;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 dark:from-zinc-950 dark:via-zinc-900 dark:to-black">

      {/* Background Glow */}
      <div className="absolute left-1/2 top-1/4 h-[320px] w-[520px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[140px]" />

      <Card className="relative w-full max-w-md border border-border/60 bg-background/90 backdrop-blur-xl shadow-2xl">

        <CardHeader className="space-y-5 text-center">

          <div className="mx-auto h-16 w-16 overflow-hidden rounded-2xl border bg-white shadow-lg">
            <img
              src="/Logo.jpeg"
              alt="Future Robotics Academy"
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <CardTitle className="text-3xl font-bold">
              Welcome Back
            </CardTitle>

            <CardDescription className="mt-2 text-base">
              Sign in with your Google account to continue.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">

          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900 dark:bg-red-950/30">
              <ShieldAlert className="mt-0.5 h-5 w-5 text-red-500" />

              <div>
                <p className="font-semibold text-red-600">
                  Access denied
                </p>

                <p className="text-sm text-red-500">
                  This Google account isn't authorized. Please contact the administrator.
                </p>
              </div>
            </div>
          )}

          <Button
            onClick={handleGoogle}
            disabled={loading}
            size="lg"
            className="
              group
              relative
              h-14
              w-full
              overflow-hidden
              rounded-xl
              border
              border-gray-200
              bg-white
              text-gray-900
              shadow-md
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-blue-300
              hover:bg-white
              hover:shadow-xl
              active:scale-[0.98]
              dark:border-zinc-700
              dark:bg-zinc-900
              dark:text-white
            "
          >
            {/* Hover Shine */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

            {loading ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <FcGoogle className="mr-3 text-2xl transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                <span className="font-semibold tracking-wide">
                  Continue with Google
                </span>
              </>
            )}
          </Button>

          <Link href="/" className="block">
            <Button
              variant="ghost"
              size="sm"
              className="w-full transition-all hover:bg-muted"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
