"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-surface-base flex items-center justify-center px-4">
      <div className="text-center max-w-md space-y-6" role="alert">
        <div className="mx-auto w-16 h-16 rounded-full bg-red-950 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-display font-bold text-white">
            Something went wrong
          </h1>
          <p className="text-slate-400">
            We encountered an error processing your request. Please try again.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button onClick={() => reset()} className="bg-brand text-white hover:bg-brand-hover">
            Try Again
          </Button>
          <Button variant="outline" className="border-slate-600 text-slate-200 hover:border-slate-400 hover:text-white hover:bg-surface-elevated" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
