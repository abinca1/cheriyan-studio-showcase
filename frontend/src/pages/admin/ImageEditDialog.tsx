import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/library/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import type { Image, Category } from "@/types";
import { getImageUrl } from "@/utils/imageUtils";
import { toast } from "@/hooks";

// Zod validation schema
const editSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.any().optional(),
  category_id: z.number().min(1, "Category is required"),
  tags: z.any().optional(),
  is_featured: z.boolean().default(false),
  is_public: z.boolean().default(true),
  is_hero_image: z.boolean().default(false),
  is_profile_picture: z.boolean().default(false),
  is_thumbnail: z.boolean().default(false),
});

type EditFormData = z.infer<typeof editSchema>;

interface ImageEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  image: Image | null;
}

const ImageEditDialog: React.FC<ImageEditDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
  image,
}) => {
  // TanStack Query for categories
  const {
    data: categories = [],
    isLoading: loadingCategories,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await apiClient.get("/api/categories/");
      if (response?.data?.success) return response?.data?.data || [];
      else throw new Error("Failed to fetch categories");
    },
    enabled: open,
  });

  // React Hook Form
  const form = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: "",
      description: "",
      category_id: undefined,
      tags: "",
      is_featured: false,
      is_public: false,
      is_hero_image: false,
      is_profile_picture: false,
      is_thumbnail: false,
    },
    values: image,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;

  // Reset form when image changes

  const onSubmit = async (data: EditFormData) => {
    if (!image) return;

    try {
      const response = await apiClient.put(`/api/images/${image.id}`, data);

      if (response?.data?.success) {
        toast({
          title: "Success",
          description: "Image updated successfully",
        });
        onSuccess();
        onOpenChange(false);
        reset();
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update image",
        variant: "destructive",
      });
    }
  };

  const getImageUrlForDialog = (image: Image) => {
    return getImageUrl(image?.filename);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col p-0 rounded-lg">
        <DialogHeader className="px-6 py-4 border-b bg-white flex-shrink-0 rounded-t-lg">
          <DialogTitle>Edit Image</DialogTitle>
          <DialogDescription>
            Update the image details and settings.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {image && (
            <div className="mb-4 w-full">
              <img
                src={getImageUrlForDialog(image)}
                alt={image.title}
                className="w-full max-h-80 object-contain rounded-lg border bg-gray-50"
              />
            </div>
          )}

          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter image title" />
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
                          placeholder="Enter image description"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600">Category</FormLabel>
                      <Select
                        value={field.value ? field.value.toString() : ""}
                        onValueChange={(value) =>
                          field.onChange(value ? parseInt(value) : undefined)
                        }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem
                              key={cat?.id}
                              value={cat?.id?.toString()}
                            >
                              {cat?.name}
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
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter tags separated by commas"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="is_public"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Public (visible in gallery)</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_featured"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Featured</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_hero_image"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Hero Image (for slideshow)</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_profile_picture"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Profile Picture</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_thumbnail"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Thumbnail Image</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-white flex-shrink-0 rounded-b-lg">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Image"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default ImageEditDialog;
