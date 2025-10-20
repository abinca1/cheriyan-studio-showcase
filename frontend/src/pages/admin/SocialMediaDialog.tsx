import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import apiClient from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks";
import type { SocialMedia } from "@/types";

// Zod validation schema
const socialMediaSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  display_name: z.string().min(1, "Display name is required"),
  url: z.string().url("Please enter a valid URL"),
  icon_name: z.string().optional().or(z.literal("")),
  is_active: z.boolean().default(true),
  sort_order: z.number().min(0).default(0),
});

type SocialMediaFormData = z.infer<typeof socialMediaSchema>;

interface SocialMediaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  socialMedia?: SocialMedia | null;
}

export const SocialMediaDialog: React.FC<SocialMediaDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
  socialMedia,
}) => {
  const defaultValues = {
    platform: "",
    display_name: "",
    url: "",
    icon_name: "",
    is_active: true,
    sort_order: 0,
  };
  // React Hook Form
  const form = useForm<SocialMediaFormData>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;

  //--------------socialMedia is null when creating a new social media ------------

  const onSubmit = async (data: SocialMediaFormData) => {
    try {
      let response;
      if (socialMedia) {
        // Update existing social media
        response = await apiClient.put(
          `/api/social-media/${socialMedia.id}`,
          data
        );
      } else {
        // Create new social media
        response = await apiClient.post("/api/social-media/", data);
      }

      if (response?.data?.success) {
        toast({
          title: "Success",
          description: socialMedia
            ? "Social media link updated successfully"
            : "Social media link created successfully",
        });

        await onSuccess();
        await onOpenChange(false);
        await reset(undefined);
      } else {
        throw new Error(socialMedia ? "Update failed" : "Creation failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : socialMedia
            ? "Failed to update social media link"
            : "Failed to create social media link",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset(defaultValues);
      onOpenChange(false);
    }
  };

  const iconOptions = [
    { value: "MessageCircle", label: "WhatsApp" },
    { value: "Instagram", label: "Instagram" },
    { value: "Facebook", label: "Facebook" },
    { value: "Twitter", label: "Twitter" },
    { value: "Linkedin", label: "LinkedIn" },
    { value: "Youtube", label: "YouTube" },
    { value: "Mail", label: "Email" },
    { value: "Phone", label: "Phone" },
    { value: "Globe", label: "Website" },
  ];

  // Don't render if form is not ready
  if (!form) {
    return null;
  }
  useEffect(() => {
    if (socialMedia) {
      form.reset(socialMedia);
    } else {
      form.reset(defaultValues);
    }
  }, [socialMedia]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {socialMedia
              ? "Edit Social Media Link"
              : "Add New Social Media Link"}
          </DialogTitle>
          <DialogDescription>
            {socialMedia
              ? "Update the social media link details."
              : "Add a new social media link to your website."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., whatsapp, instagram, facebook"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="display_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., WhatsApp, Instagram"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL *</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" placeholder="https://..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an icon..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {iconOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sort_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sort Order</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        placeholder="0"
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Active</FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? socialMedia
                    ? "Updating..."
                    : "Creating..."
                  : socialMedia
                  ? "Update Link"
                  : "Create Link"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default SocialMediaDialog;
