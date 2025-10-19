import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiService } from "@/services";
import type { Image } from "@/types";

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
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    button_text: "",
    button_link: "",
    image_id: 0,
    is_active: true,
    sort_order: 0,
  });
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadImages();
    }
  }, [open]);

  const loadImages = async () => {
    try {
      const response = await apiService.getImages();
      setImages(response);
    } catch (error) {
      console.error("Error loading images:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiService.createHeroSlide(formData);
      onSuccess();
      onOpenChange(false);
      setFormData({
        title: "",
        subtitle: "",
        description: "",
        button_text: "",
        button_link: "",
        image_id: 0,
        is_active: true,
        sort_order: 0,
      });
    } catch (error) {
      console.error("Error creating hero slide:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Hero Slide</DialogTitle>
          <DialogDescription>
            Create a new slide for the homepage hero section.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) =>
                  setFormData({ ...formData, subtitle: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Slide description..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="button_text">Button Text</Label>
              <Input
                id="button_text"
                value={formData.button_text}
                onChange={(e) =>
                  setFormData({ ...formData, button_text: e.target.value })
                }
                placeholder="e.g., Learn More"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="button_link">Button Link</Label>
              <Input
                id="button_link"
                value={formData.button_link}
                onChange={(e) =>
                  setFormData({ ...formData, button_link: e.target.value })
                }
                placeholder="e.g., /gallery"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image_id">Background Image *</Label>
              <select
                id="image_id"
                value={formData.image_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    image_id: parseInt(e.target.value),
                  })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                required
              >
                <option value={0}>Select an image...</option>
                {images.map((image) => (
                  <option key={image.id} value={image.id}>
                    {image.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sort_order: parseInt(e.target.value) || 0,
                  })
                }
                min="0"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: !!checked })
                }
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || formData.image_id === 0}>
              {loading ? "Creating..." : "Create Hero Slide"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default HeroSlideDialog;
