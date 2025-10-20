import { apiUrl } from "@/config/env";
import apiClient from "@/lib/axios";
import type {
  LoginRequest,
  LoginResponse,
  User,
  Image,
  Category,
  Testimonial,
  HeroSlide,
  SocialMedia,
} from "@/types";

const API_BASE_URL = apiUrl;

export interface ApiError {
  message: string;
  detail: string;
}

class ApiService {
  private baseURL: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.loadTokensFromStorage();
  }

  private loadTokensFromStorage() {
    this.accessToken = localStorage.getItem("access_token");
    this.refreshToken = localStorage.getItem("refresh_token");
  }

  private saveTokensToStorage(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
  }

  private clearTokensFromStorage() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }

  private async request<T>(endpoint: string, options: any = {}): Promise<T> {
    try {
      const response = await apiClient({
        url: endpoint,
        method: options.method || "GET",
        data: options.body ? JSON.parse(options.body) : options.data,
        ...options,
      });
      return response.data;
    } catch (error: any) {
      // Axios interceptors should handle 401, but a fallback here
      if (error.response?.status === 401) {
        this.clearTokensFromStorage();
        window.location.href = "/admin/login";
      }
      throw error;
    }
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const formData = new FormData();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);

    const response = await apiClient.post("/api/auth/login", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const data = response.data;
    this.saveTokensToStorage(data.access_token, data.refresh_token);
    return data;
  }

  async logout(): Promise<void> {
    if (this.refreshToken) {
      try {
        await this.request("/api/auth/logout", {
          method: "POST",
          data: { refresh_token: this.refreshToken },
        });
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
    this.clearTokensFromStorage();
  }

  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const response = await apiClient.post("/api/auth/refresh", {
        refresh_token: this.refreshToken,
      });

      const data = response.data;
      this.saveTokensToStorage(data.access_token, data.refresh_token);
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>("/api/auth/me");
  }

  // Images API
  async getImages(params?: {
    skip?: number;
    limit?: number;
    category?: string;
    is_featured?: boolean;
    is_public?: boolean;
  }): Promise<Image[]> {
    const searchParams = new URLSearchParams();
    if (params?.skip) searchParams.append("skip", params.skip.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.category) searchParams.append("category", params.category);
    if (params?.is_featured !== undefined)
      searchParams.append("is_featured", params.is_featured.toString());

    const query = searchParams.toString();
    return this.request<Image[]>(`/api/images/${query ? `?${query}` : ""}`);
  }

  async getMyImages(params?: {
    skip?: number;
    limit?: number;
  }): Promise<Image[]> {
    const searchParams = new URLSearchParams();
    if (params?.skip) searchParams.append("skip", params.skip.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const query = searchParams.toString();
    return this.request<Image[]>(
      `/api/images/my-images${query ? `?${query}` : ""}`
    );
  }

  async uploadImage(
    file: File,
    metadata: {
      title: string;
      description?: string;
      category?: string;
      tags?: string;
      is_featured?: boolean;
      is_public?: boolean;
      is_hero_image?: boolean;
      category_id?: number;
    }
  ): Promise<Image> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", metadata.title);
    if (metadata.description)
      formData.append("description", metadata.description);
    if (metadata.category) formData.append("category", metadata.category);
    if (metadata.tags) formData.append("tags", metadata.tags);
    formData.append("is_featured", (metadata.is_featured || false).toString());
    formData.append("is_public", (metadata.is_public !== false).toString());
    formData.append(
      "is_hero_image",
      (metadata.is_hero_image || false).toString()
    );
    if (metadata.category_id)
      formData.append("category_id", metadata.category_id.toString());

    const response = await apiClient.post("/api/images/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }

  async deleteImage(imageId: number): Promise<void> {
    await this.request<void>(`/api/images/${imageId}`, {
      method: "DELETE",
    });
  }

  async updateImage(
    imageId: number,
    metadata: {
      title?: string;
      description?: string;
      tags?: string;
      category_id?: number | null;
      is_featured?: boolean;
      is_public?: boolean;
      is_hero_image?: boolean;
    }
  ): Promise<Image> {
    return this.request<Image>(`/api/images/${imageId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: metadata,
    });
  }

  // Categories API
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>("/api/categories/");
  }

  async createCategory(
    category: Omit<Category, "id" | "created_at" | "updated_at">
  ): Promise<Category> {
    return this.request<Category>("/api/categories/", {
      method: "POST",
      data: category,
    });
  }

  async updateCategory(
    id: number,
    category: Partial<Category>
  ): Promise<Category> {
    return this.request<Category>(`/api/categories/${id}`, {
      method: "PUT",
      data: category,
    });
  }

  async deleteCategory(id: number): Promise<void> {
    return this.request<void>(`/api/categories/${id}`, {
      method: "DELETE",
    });
  }

  // Testimonials API
  async getTestimonials(activeOnly: boolean = true): Promise<Testimonial[]> {
    return this.request<Testimonial[]>(
      `/api/testimonials/?active_only=${activeOnly}`
    );
  }

  async getFeaturedTestimonials(limit: number = 6): Promise<Testimonial[]> {
    return this.request<Testimonial[]>(
      `/api/testimonials/featured?limit=${limit}`
    );
  }

  async createTestimonial(
    testimonial: Omit<Testimonial, "id" | "created_at" | "updated_at">
  ): Promise<Testimonial> {
    return this.request<Testimonial>("/api/testimonials/", {
      method: "POST",
      data: testimonial,
    });
  }

  async updateTestimonial(
    id: number,
    testimonial: Partial<Testimonial>
  ): Promise<Testimonial> {
    return this.request<Testimonial>(`/api/testimonials/${id}`, {
      method: "PUT",
      data: testimonial,
    });
  }

  async deleteTestimonial(id: number): Promise<void> {
    return this.request<void>(`/api/testimonials/${id}`, {
      method: "DELETE",
    });
  }

  // Hero Slides API
  async getHeroSlides(activeOnly: boolean = true): Promise<HeroSlide[]> {
    return this.request<HeroSlide[]>(
      `/api/hero-slides/?active_only=${activeOnly}`
    );
  }

  async createHeroSlide(
    slide: Omit<HeroSlide, "id" | "created_at" | "updated_at">
  ): Promise<HeroSlide> {
    return this.request<HeroSlide>("/api/hero-slides/", {
      method: "POST",
      data: slide,
    });
  }

  async updateHeroSlide(
    id: number,
    slide: Partial<HeroSlide>
  ): Promise<HeroSlide> {
    return this.request<HeroSlide>(`/api/hero-slides/${id}`, {
      method: "PUT",
      data: slide,
    });
  }

  async deleteHeroSlide(id: number): Promise<void> {
    return this.request<void>(`/api/hero-slides/${id}`, {
      method: "DELETE",
    });
  }

  // Social Media API
  async getSocialMediaLinks(
    activeOnly: boolean = true
  ): Promise<SocialMedia[]> {
    return this.request<SocialMedia[]>(
      `/api/social-media/?active_only=${activeOnly}`
    );
  }

  async createSocialMediaLink(
    socialMedia: Omit<SocialMedia, "id" | "created_at" | "updated_at">
  ): Promise<SocialMedia> {
    return this.request<SocialMedia>("/api/social-media/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: socialMedia,
    });
  }

  async updateSocialMediaLink(
    id: number,
    socialMedia: Partial<Omit<SocialMedia, "id" | "created_at" | "updated_at">>
  ): Promise<SocialMedia> {
    return this.request<SocialMedia>(`/api/social-media/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: socialMedia,
    });
  }

  async deleteSocialMediaLink(id: number): Promise<void> {
    return this.request<void>(`/api/social-media/${id}`, {
      method: "DELETE",
    });
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  getImageUrl(imagePath: string): string {
    return `${this.baseURL}/${imagePath.replace("app/static/", "")}`;
  }
}

export const apiService = new ApiService();
