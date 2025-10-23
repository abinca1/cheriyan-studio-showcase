// UI-related type definitions
export interface NavigationLink {
  name: string;
  path: string;
  icon?: string;
}

export interface GalleryImage {
  id: number;
  src: string;
  category: string;
  title: string;
  description?: string;
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

export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "textarea" | "select" | "file";
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}
