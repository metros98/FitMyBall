"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RotateCcw, Heart, ClipboardCheck, Settings } from "lucide-react";

const actions = [
  { label: "Retake Quiz", href: "/quiz", icon: RotateCcw },
  { label: "My Favorites", href: "/profile/favorites", icon: Heart },
  { label: "Balls I've Tried", href: "/profile/tried-balls", icon: ClipboardCheck },
  { label: "Settings", href: "/profile/settings", icon: Settings },
];

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((action) => (
        <Button key={action.href} variant="outline" asChild>
          <Link href={action.href}>
            <action.icon className="mr-2 h-4 w-4" />
            {action.label}
          </Link>
        </Button>
      ))}
    </div>
  );
}
