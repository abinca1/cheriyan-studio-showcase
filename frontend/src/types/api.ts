// API-related type definitions
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface User {
  id: number;
  username: string;
  email?: string;
  is_active: boolean;
  is_admin?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Image {
  id: number;
  title: string;
  description?: string;
  filename: string;
  file_path: string;
  category?: string;
  tags?: string;
  is_featured: boolean;
  is_public: boolean;
  is_hero_image: boolean;
  category_id?: number;
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  slug: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Testimonial {
  id: number;
  client_name: string;
  client_title?: string;
  content: string;
  rating?: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface HeroSlide {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  image_path: string;
  button_text?: string;
  button_link?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at?: string;
}

export interface SocialMedia {
  id: number;
  platform: string;
  url: string;
  icon_class?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at?: string;
}
