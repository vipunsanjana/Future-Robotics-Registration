"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { ArrowLeft, Loader2, Home } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

import { Button } from "@/components/ui/button";

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
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-50 px-4 dark:bg-zinc-950">
      
      {/* Ambient Background Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[120px] mix-blend-multiply dark:bg-blue-600/10 dark:mix-blend-screen" />
        <div className="absolute -right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-[120px] mix-blend-multiply dark:bg-indigo-600/10 dark:mix-blend-screen" />
      </div>

      {/* Main Glassmorphic Card */}
      <div className="relative z-10 w-full max-w-[420px] animate-in fade-in zoom-in-95 duration-500">
        <div className="overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/60 p-8 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-900/50 dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.8)]">
          
          {/* Header Section */}
          <div className="mb-8 flex flex-col items-center text-center">
            {/* Elevated Logo */}
            <div className="mb-6 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-white/80 bg-white p-1 shadow-xl shadow-black/5 dark:border-zinc-700/50 dark:bg-zinc-950">
              <img
                src="/Logo.jpeg"
                alt="Future Robotics Academy"
                className="h-full w-full rounded-xl object-cover"
              />
            </div>

            <h1 className="bg-gradient-to-br from-zinc-900 to-zinc-600 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent dark:from-white dark:to-zinc-400">
              {error ? "Oops! Not Recognized" : "Welcome Back"}
            </h1>
            <p className="mt-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {error ? "Let's get you back on track." : "Sign in to your academy dashboard"}
            </p>
          </div>

          <div className="space-y-5">
            {error ? (
              /* Beautiful Error / Unauth State */
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5 text-center dark:border-indigo-500/10 dark:bg-indigo-500/5">
                  <p className="text-sm leading-relaxed text-indigo-800 dark:text-indigo-200/90">
                    We couldn't find an academy profile linked to this Google account. Please use an authorized email or return to the homepage to learn more.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Link href="/" className="block">
                    <Button className="h-14 w-full rounded-2xl bg-zinc-900 text-white shadow-md transition-all hover:bg-zinc-800 hover:shadow-lg dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
                      <Home className="mr-2 h-4 w-4" />
                      Go to Homepage
                    </Button>
                  </Link>
                  
                  <Link 
                    href="/login" 
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/50 dark:hover:text-white"
                  >
                    Try a different account
                  </Link>
                </div>
              </div>
            ) : (
              /* Normal Login State */
              <div className="animate-in fade-in duration-500">
                <Button
                  onClick={handleGoogle}
                  disabled={loading}
                  className="relative h-14 w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white text-zinc-900 shadow-sm transition-all duration-300 hover:bg-zinc-50 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-900"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin text-zinc-500 dark:text-zinc-400" />
                      <span className="font-semibold tracking-wide">Authenticating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <FcGoogle className="text-2xl" />
                      <span className="font-semibold tracking-wide">Continue with Google</span>
                    </div>
                  )}
                </Button>

                <Link 
                  href="/" 
                  className="mt-5 group flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/50 dark:hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Back to Website
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
