import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import type { SocialMedia } from "@/types";

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
  const [formData, setFormData] = useState({
    platform: socialMedia?.platform || "",
    url: socialMedia?.url || "",
    icon_name: socialMedia?.icon_name || "",
    display_name: socialMedia?.display_name || "",
    is_active: socialMedia?.is_active ?? true,
    sort_order: socialMedia?.sort_order || 0,
  });
  const [loading, setLoading] = useState(false);

  const isEditing = !!socialMedia;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        await apiService.updateSocialMediaLink(socialMedia.id, formData);
      } else {
        await apiService.createSocialMediaLink(formData);
      }

      onSuccess();
      onOpenChange(false);

      if (!isEditing) {
        setFormData({
          platform: "",
          url: "",
          icon_name: "",
          display_name: "",
          is_active: true,
          sort_order: 0,
        });
      }
    } catch (error) {
      console.error("Error saving social media link:", error);
    } finally {
      setLoading(false);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Social Media Link" : "Add New Social Media Link"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the social media link details."
              : "Add a new social media link to your website."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="platform">Platform *</Label>
              <Input
                id="platform"
                value={formData.platform}
                onChange={(e) =>
                  setFormData({ ...formData, platform: e.target.value })
                }
                placeholder="e.g., whatsapp, instagram, facebook"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="display_name">Display Name *</Label>
              <Input
                id="display_name"
                value={formData.display_name}
                onChange={(e) =>
                  setFormData({ ...formData, display_name: e.target.value })
                }
                placeholder="e.g., WhatsApp, Instagram"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">URL *</Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                placeholder="https://..."
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="icon_name">Icon</Label>
              <select
                id="icon_name"
                value={formData.icon_name}
                onChange={(e) =>
                  setFormData({ ...formData, icon_name: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                required
              >
                <option value="">Select an icon...</option>
                {iconOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
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
            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : isEditing
                ? "Update Link"
                : "Create Link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default SocialMediaDialog;
