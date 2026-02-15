"use client";

import { useEffect } from "react";
import { useQuiz } from "@/components/quiz/quiz-context";
import { RadioOptionGroup } from "@/components/quiz/radio-option-group";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  BALL_BRANDS,
  BALL_MODELS_BY_BRAND,
  HANDICAP_OPTIONS,
  ROUNDS_PER_YEAR_OPTIONS,
  PRIORITY_TYPE_OPTIONS,
  MOST_IMPORTANT_OPTIONS,
} from "@/lib/quiz/constants";

export function StepBackground() {
  const { form } = useQuiz();

  const watchedBrand = form.watch("currentBall.brand");
  const showModelField =
    watchedBrand && watchedBrand !== "" && watchedBrand !== "dont_know";
  const isOtherBrand = watchedBrand === "other";
  const modelOptions = showModelField
    ? BALL_MODELS_BY_BRAND[watchedBrand] ?? []
    : [];

  // Reset model when brand changes
  useEffect(() => {
    form.setValue("currentBall.model", "");
  }, [watchedBrand, form]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Your Golf Background</h2>
        <p className="text-muted-foreground mt-1">
          Tell us about your game so we can find the right ball.
        </p>
      </div>

      {/* Current Ball Brand */}
      <FormField
        control={form.control}
        name="currentBall.brand"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Current ball (optional)</FormLabel>
            <Select
              onValueChange={(val) => {
                field.onChange(val);
                // Ensure currentBall object exists
                if (!form.getValues("currentBall")) {
                  form.setValue("currentBall", { brand: val, model: "" });
                }
              }}
              value={field.value ?? ""}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {BALL_BRANDS.map((brand) => (
                  <SelectItem key={brand.value} value={brand.value}>
                    {brand.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Current Ball Model - dynamic based on brand */}
      {showModelField &&
        (isOtherBrand ? (
          <FormField
            control={form.control}
            name="currentBall.model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ball model</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your ball model"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="currentBall.model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ball model</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {modelOptions.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

      {/* Handicap */}
      <FormField
        control={form.control}
        name="handicap"
        render={({ field, fieldState }) => (
          <FormItem>
            <RadioOptionGroup
              label="Handicap / Skill Level"
              name="handicap"
              options={HANDICAP_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          </FormItem>
        )}
      />

      {/* Rounds Per Year */}
      <FormField
        control={form.control}
        name="roundsPerYear"
        render={({ field, fieldState }) => (
          <FormItem>
            <RadioOptionGroup
              label="Average rounds per year"
              name="roundsPerYear"
              options={ROUNDS_PER_YEAR_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
              layout="horizontal"
            />
          </FormItem>
        )}
      />

      {/* Priority Type */}
      <FormField
        control={form.control}
        name="priorityType"
        render={({ field, fieldState }) => (
          <FormItem>
            <RadioOptionGroup
              label="What do you prioritize most?"
              name="priorityType"
              options={PRIORITY_TYPE_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          </FormItem>
        )}
      />

      {/* Most Important */}
      <FormField
        control={form.control}
        name="mostImportant"
        render={({ field, fieldState }) => (
          <FormItem>
            <RadioOptionGroup
              label="What's most important to play your best?"
              name="mostImportant"
              options={MOST_IMPORTANT_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          </FormItem>
        )}
      />
    </div>
  );
}
