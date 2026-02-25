import { Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-hero-radial flex items-center justify-center px-4">
      <div className="text-center max-w-md space-y-6">
        <div className="mx-auto w-20 h-20 rounded-full bg-surface-active flex items-center justify-center">
          <Circle className="w-10 h-10 text-slate-500" strokeWidth={3} />
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-4xl font-bold text-white">
            Looks Like That One Went OB
          </h1>
          <p className="text-slate-400 text-lg mt-3">
            The ball you&apos;re looking for isn&apos;t in our catalog &mdash;
            it may have been moved or the link might be wrong.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
          <Button className="bg-brand text-white hover:bg-brand-hover" asChild>
            <Link href="/browse">Browse All Balls</Link>
          </Button>
          <Button variant="outline" className="border-slate-600 text-slate-200 hover:border-slate-400 hover:text-white hover:bg-surface-elevated" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
