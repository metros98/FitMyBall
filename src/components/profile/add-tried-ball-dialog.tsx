"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateTriedBallSchema, type UpdateTriedBallInput } from "@/lib/validations/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { StarRating } from "./star-rating";
import { Loader2 } from "lucide-react";
import type { TriedBallItem } from "@/types/api";

interface AddTriedBallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem: TriedBallItem | null;
  onSubmit: (data: UpdateTriedBallInput) => Promise<void>;
  isPending: boolean;
}

export function AddTriedBallDialog({
  open,
  onOpenChange,
  editItem,
  onSubmit,
  isPending,
}: AddTriedBallDialogProps) {
  const form = useForm<UpdateTriedBallInput>({
    resolver: zodResolver(updateTriedBallSchema),
    defaultValues: {
      rating: undefined,
      notes: "",
      roundsPlayed: undefined,
      wouldRecommend: undefined,
      distanceVsExpected: undefined,
      spinVsExpected: undefined,
      feelVsExpected: undefined,
    },
  });

  useEffect(() => {
    if (editItem) {
      form.reset({
        rating: editItem.rating ?? undefined,
        notes: editItem.notes ?? "",
        roundsPlayed: editItem.roundsPlayed ?? undefined,
        wouldRecommend: editItem.wouldRecommend ?? undefined,
        distanceVsExpected: (editItem.distanceVsExpected as UpdateTriedBallInput["distanceVsExpected"]) ?? undefined,
        spinVsExpected: (editItem.spinVsExpected as UpdateTriedBallInput["spinVsExpected"]) ?? undefined,
        feelVsExpected: (editItem.feelVsExpected as UpdateTriedBallInput["feelVsExpected"]) ?? undefined,
      });
    } else {
      form.reset({
        rating: undefined,
        notes: "",
        roundsPlayed: undefined,
        wouldRecommend: undefined,
        distanceVsExpected: undefined,
        spinVsExpected: undefined,
        feelVsExpected: undefined,
      });
    }
  }, [editItem, form]);

  async function handleSubmit(data: UpdateTriedBallInput) {
    await onSubmit(data);
    onOpenChange(false);
  }

  const notesValue = form.watch("notes") ?? "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editItem ? `Edit Review: ${editItem.ball.name}` : "Add Ball Review"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            {/* Rating */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <StarRating
                      value={field.value ?? null}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rounds Played */}
            <FormField
              control={form.control}
              name="roundsPlayed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rounds Played</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="e.g. 5"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : parseInt(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Would Recommend */}
            <FormField
              control={form.control}
              name="wouldRecommend"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Would recommend to others</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Performance Feedback */}
            <div className="space-y-4">
              <p className="text-sm font-medium">
                Performance vs Expectations{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </p>

              <FormField
                control={form.control}
                name="distanceVsExpected"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-slate-400">
                      Distance
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                        className="flex gap-4"
                      >
                        <div className="flex items-center gap-1.5">
                          <RadioGroupItem value="BETTER" id="dist-better" />
                          <label htmlFor="dist-better" className="text-sm">Better</label>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <RadioGroupItem value="AS_EXPECTED" id="dist-expected" />
                          <label htmlFor="dist-expected" className="text-sm">As Expected</label>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <RadioGroupItem value="WORSE" id="dist-worse" />
                          <label htmlFor="dist-worse" className="text-sm">Worse</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="spinVsExpected"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-slate-400">
                      Spin
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                        className="flex gap-4"
                      >
                        <div className="flex items-center gap-1.5">
                          <RadioGroupItem value="MORE" id="spin-more" />
                          <label htmlFor="spin-more" className="text-sm">More</label>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <RadioGroupItem value="AS_EXPECTED" id="spin-expected" />
                          <label htmlFor="spin-expected" className="text-sm">As Expected</label>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <RadioGroupItem value="LESS" id="spin-less" />
                          <label htmlFor="spin-less" className="text-sm">Less</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="feelVsExpected"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-slate-400">
                      Feel
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                        className="flex gap-4"
                      >
                        <div className="flex items-center gap-1.5">
                          <RadioGroupItem value="SOFTER" id="feel-softer" />
                          <label htmlFor="feel-softer" className="text-sm">Softer</label>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <RadioGroupItem value="AS_EXPECTED" id="feel-expected" />
                          <label htmlFor="feel-expected" className="text-sm">As Expected</label>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <RadioGroupItem value="FIRMER" id="feel-firmer" />
                          <label htmlFor="feel-firmer" className="text-sm">Firmer</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="How did this ball perform for your game?"
                      className="resize-none"
                      maxLength={500}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    {notesValue.length}/500 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editItem ? "Update Review" : "Add Review"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
