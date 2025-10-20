import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks";
import type { Image } from "@/types";

// Zod validation schema
const heroSlideSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  button_text: z.string().optional(),
  button_link: z.string().optional(),
  image_id: z.number().min(1, "Please select an image"),
  is_active: z.boolean().default(true),
  sort_order: z.number().min(0).default(0),
});

type HeroSlideFormData = z.infer<typeof heroSlideSchema>;

interface HeroSlideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const HeroSlideDialog: React.FC<HeroSlideDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const {
    data: images = [],
    isLoading: loadingImages,
    error: imagesError,
  } = useQuery({
    queryKey: ["images"],
    queryFn: async () => {
      const response = await apiClient.get("/api/images/my-images");
      if (response?.data?.success) return response?.data?.data || [];
      else throw new Error("Failed to fetch images");
    },
    enabled: open,
  });

  // React Hook Form
  const form = useForm<HeroSlideFormData>({
    resolver: zodResolver(heroSlideSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      button_text: "",
      button_link: "",
      image_id: 0,
      is_active: true,
      sort_order: 0,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;

  const onSubmit = async (data: HeroSlideFormData) => {
    try {
      const response = await apiClient.post("/api/hero-slides/", data);

      if (response?.data?.success) {
        toast({
          title: "Success",
          description: "Hero slide created successfully",
        });
        onSuccess();
        reset();
        onOpenChange(false);
      } else {
        throw new Error("Failed to create hero slide");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create hero slide",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Hero Slide</DialogTitle>
          <DialogDescription>
            Create a new slide for the homepage hero section.
          </DialogDescription>
        </DialogHeader>

        {imagesError && (
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load images. Please try again.
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter slide title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtitle</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter slide subtitle" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Slide description..."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="button_text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Button Text</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Learn More" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="button_link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Button Link</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., /gallery" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="image_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Background Image *</FormLabel>
                    <Select
                      value={field.value ? field.value.toString() : ""}
                      onValueChange={(value) =>
                        field.onChange(value ? parseInt(value) : 0)
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an image..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {images.map((image) => (
                          <SelectItem
                            key={image.id}
                            value={image.id.toString()}
                          >
                            {image.title}
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
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Hero Slide"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default HeroSlideDialog;
