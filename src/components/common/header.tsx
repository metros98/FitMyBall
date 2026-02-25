"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "./user-menu";

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 bg-surface-slate backdrop-blur-lg border-b border-[#1E293B]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo + Nav */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-xl font-display font-bold text-brand"
          >
            FitMyBall
          </Link>
          <nav className="hidden sm:flex items-center gap-6">
            <Link
              href="/quiz"
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Find My Ball
            </Link>
            <Link
              href="/browse"
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Browse Balls
            </Link>
            <Link
              href="/compare"
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Compare
            </Link>
          </nav>
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <div className="h-9 w-9 rounded-full bg-surface-active animate-pulse" />
          ) : session ? (
            <UserMenu />
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button size="sm" className="bg-brand text-white hover:bg-brand-hover" asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
