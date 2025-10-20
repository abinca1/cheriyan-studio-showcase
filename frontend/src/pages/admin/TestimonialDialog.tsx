import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks";

// Zod validation schema
const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().optional(),
  company: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  rating: z.number().min(1).max(5).default(5),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  sort_order: z.number().optional(),
});

type TestimonialFormData = z.infer<typeof testimonialSchema>;

interface TestimonialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  testimonial?: any | null;
}

export const TestimonialDialog: React.FC<TestimonialDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
  testimonial,
}) => {
  const defaultValues = {
    name: "",
    title: "",
    company: "",
    content: "",
    rating: 5,
    is_featured: false,
    is_active: true,
    sort_order: 0,
  };

  // React Hook Form
  const form = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;

  //--------------testimonial is null when creating a new testimonial ------------

  useEffect(() => {
    if (testimonial) {
      form.reset(testimonial);
    } else {
      form.reset(defaultValues);
    }
  }, [testimonial]);

  const onSubmit = async (data: TestimonialFormData) => {
    try {
      let response;
      if (testimonial) {
        // Update existing testimonial
        response = await apiClient.put(
          `/api/testimonials/${testimonial.id}`,
          data
        );
      } else {
        // Create new testimonial
        response = await apiClient.post("/api/testimonials/", data);
      }

      if (response?.data?.success) {
        toast({
          title: "Success",
          description: testimonial
            ? "Testimonial updated successfully"
            : "Testimonial created successfully",
        });
        await onSuccess();
        await onOpenChange(false);
        await reset(defaultValues);
      } else {
        throw new Error(testimonial ? "Update failed" : "Creation failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : testimonial
            ? "Failed to update testimonial"
            : "Failed to create testimonial",
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {testimonial ? "Edit Testimonial" : "Add New Testimonial"}
          </DialogTitle>
          <DialogDescription>
            {testimonial
              ? "Update the testimonial details."
              : "Create a new testimonial for your website."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Client name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., CEO, Manager" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Company name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Testimonial Content *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Write the testimonial content..."
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <Select
                      value={field.value.toString()}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1 Star</SelectItem>
                        <SelectItem value="2">2 Stars</SelectItem>
                        <SelectItem value="3">3 Stars</SelectItem>
                        <SelectItem value="4">4 Stars</SelectItem>
                        <SelectItem value="5">5 Stars</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4">
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
                      <FormLabel>Featured testimonial</FormLabel>
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
                  ? testimonial
                    ? "Updating..."
                    : "Creating..."
                  : testimonial
                  ? "Update Testimonial"
                  : "Create Testimonial"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default TestimonialDialog;
