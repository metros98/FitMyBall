"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil } from "lucide-react";

interface ReviewItem {
  label: string;
  value: string | undefined;
}

interface ReviewSectionCardProps {
  title: string;
  stepNumber: number;
  items: ReviewItem[];
  onEdit: (step: number) => void;
}

export function ReviewSectionCard({
  title,
  stepNumber,
  items,
  onEdit,
}: ReviewSectionCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onEdit(stepNumber)}
          className="h-8 px-2 text-muted-foreground"
        >
          <Pencil className="h-3.5 w-3.5 mr-1" />
          Edit
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <dl className="space-y-2">
          {items.map((item) => (
            <div key={item.label} className="flex justify-between gap-4">
              <dt className="text-sm text-muted-foreground shrink-0">
                {item.label}
              </dt>
              <dd className="text-sm font-medium text-right">
                {item.value || (
                  <span className="text-muted-foreground italic">
                    Not provided
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
