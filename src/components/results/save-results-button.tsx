"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Save, Check, Loader2, LogIn } from "lucide-react";

interface SaveResultsButtonProps {
  sessionId: string;
}

export function SaveResultsButton({ sessionId }: SaveResultsButtonProps) {
  const { data: session } = useSession();
  const [saved, setSaved] = useState(false);
  const [isPending, setIsPending] = useState(false);

  if (!session?.user?.id) {
    return (
      <Button variant="outline" size="sm" asChild>
        <Link href={`/login?callbackUrl=/results/${sessionId}`}>
          <LogIn className="w-4 h-4 mr-2" />
          Log in to Save
        </Link>
      </Button>
    );
  }

  async function handleSave() {
    if (saved || isPending) return;
    setIsPending(true);
    try {
      const res = await fetch(
        `/api/users/${session!.user.id}/recommendations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to save results");
      }
      setSaved(true);
      toast.success("Results saved to your account");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save results"
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSave}
      disabled={saved || isPending}
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : saved ? (
        <Check className="w-4 h-4 mr-2" />
      ) : (
        <Save className="w-4 h-4 mr-2" />
      )}
      {saved ? "Saved" : "Save Results"}
    </Button>
  );
}
