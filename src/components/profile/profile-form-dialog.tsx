"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userProfileSchema, type UserProfileInput } from "@/lib/validations/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { UserProfileItem } from "@/types/api";

interface ProfileFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editProfile: UserProfileItem | null;
  onSubmit: (data: UserProfileInput) => Promise<void>;
  isPending: boolean;
}

export function ProfileFormDialog({
  open,
  onOpenChange,
  editProfile,
  onSubmit,
  isPending,
}: ProfileFormDialogProps) {
  const form = useForm<UserProfileInput>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      profileName: "",
      isDefault: false,
      preferredFeel: undefined,
      budgetRange: undefined,
      colorPreference: undefined,
      typicalTemp: undefined,
      driverBallSpeed: null,
      ironDistance8: null,
    },
  });

  useEffect(() => {
    if (editProfile) {
      form.reset({
        profileName: editProfile.profileName,
        isDefault: editProfile.isDefault,
        preferredFeel: editProfile.preferredFeel ?? undefined,
        budgetRange: editProfile.budgetRange ?? undefined,
        colorPreference: editProfile.colorPreference ?? undefined,
        typicalTemp: editProfile.typicalTemp ?? undefined,
        driverBallSpeed: editProfile.driverBallSpeed,
        ironDistance8: editProfile.ironDistance8,
      });
    } else {
      form.reset({
        profileName: "",
        isDefault: false,
        preferredFeel: undefined,
        budgetRange: undefined,
        colorPreference: undefined,
        typicalTemp: undefined,
        driverBallSpeed: null,
        ironDistance8: null,
      });
    }
  }, [editProfile, form]);

  async function handleSubmit(data: UserProfileInput) {
    await onSubmit(data);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editProfile ? "Edit Profile" : "Create New Profile"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="profileName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Name</FormLabel>
                  <FormControl>
                    <Input placeholder='e.g. "Summer Setup"' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Set as default profile</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferredFeel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Feel</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select feel" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="very_soft">Very Soft</SelectItem>
                      <SelectItem value="soft">Soft</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="firm">Firm</SelectItem>
                      <SelectItem value="very_firm">Very Firm</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budgetRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Range</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="budget">Budget (under $25/dz)</SelectItem>
                      <SelectItem value="mid_range">Mid-range ($25-40/dz)</SelectItem>
                      <SelectItem value="premium">Premium ($40-55/dz)</SelectItem>
                      <SelectItem value="tour">Tour ($55+/dz)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="typicalTemp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Typical Playing Temperature</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select temperature" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cold">Cold (below 50°F)</SelectItem>
                      <SelectItem value="cool">Cool (50-65°F)</SelectItem>
                      <SelectItem value="moderate">Moderate (65-80°F)</SelectItem>
                      <SelectItem value="warm">Warm (80-95°F)</SelectItem>
                      <SelectItem value="hot">Hot (above 95°F)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="driverBallSpeed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Driver Ball Speed (mph)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={100}
                      max={200}
                      placeholder="e.g. 150"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? null
                            : parseInt(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ironDistance8"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>8-Iron Distance (yards)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={50}
                      max={300}
                      placeholder="e.g. 140"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? null
                            : parseInt(e.target.value)
                        )
                      }
                    />
                  </FormControl>
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
                {editProfile ? "Update Profile" : "Create Profile"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
