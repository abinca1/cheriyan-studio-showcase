// Shared type definitions
export interface NavigationLink {
  name: string;
  path: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

export interface BusinessHours {
  weekdays: string;
  saturday: string;
  sunday: string;
}

// Re-export feature-specific types
export type { Category, GalleryImage } from "@/features/gallery/types";
