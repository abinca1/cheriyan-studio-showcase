import { apiUrl } from '@/config/env';

const API_BASE_URL = apiUrl;

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
  email: string;
  username: string;
  full_name: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Image {
  id: number;
  title: string;
  description?: string;
  filename: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  category?: string;
  tags?: string;
  is_featured: boolean;
  is_public: boolean;
  is_hero_image: boolean;
  category_id?: number;
  owner_id: number;
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  slug: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at?: string;
}

export interface Testimonial {
  id: number;
  name: string;
  title?: string;
  company?: string;
  content: string;
  rating: number;
  image_url?: string;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at?: string;
}

export interface HeroSlide {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  button_text?: string;
  button_link?: string;
  is_active: boolean;
  sort_order: number;
  image_id: number;
  created_at: string;
  updated_at?: string;
}

export interface SocialMedia {
  id: number;
  platform: string;
  url: string;
  icon_name: string;
  display_name: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at?: string;
}

export interface ApiError {
  detail: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
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
    this.accessToken = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
  }

  private saveTokensToStorage(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  private clearTokensFromStorage() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401 && this.refreshToken) {
      // Try to refresh the token
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        // Retry the original request
        headers['Authorization'] = `Bearer ${this.accessToken}`;
        const retryResponse = await fetch(url, {
          ...options,
          headers,
        });
        return this.handleResponse<T>(retryResponse);
      } else {
        this.clearTokensFromStorage();
        throw new Error('Authentication failed');
      }
    }

    return this.handleResponse<T>(response);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || `HTTP ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }

    return response.text() as unknown as T;
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await fetch(`${this.baseURL}/api/auth/login`, {
      method: 'POST',
      body: formData,
    });

    const data = await this.handleResponse<LoginResponse>(response);
    this.saveTokensToStorage(data.access_token, data.refresh_token);
    return data;
  }

  async logout(): Promise<void> {
    if (this.refreshToken) {
      try {
        await this.request('/api/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refresh_token: this.refreshToken }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    this.clearTokensFromStorage();
  }

  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const data = await fetch(`${this.baseURL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: this.refreshToken }),
      });

      const response = await this.handleResponse<LoginResponse>(data);
      this.saveTokensToStorage(response.access_token, response.refresh_token);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/api/auth/me');
  }

  // Image methods
  async getImages(params?: {
    skip?: number;
    limit?: number;
    category?: string;
    is_featured?: boolean;
  }): Promise<Image[]> {
    const searchParams = new URLSearchParams();
    if (params?.skip) searchParams.append('skip', params.skip.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.is_featured !== undefined) searchParams.append('is_featured', params.is_featured.toString());

    const query = searchParams.toString();
    return this.request<Image[]>(`/api/images/${query ? `?${query}` : ''}`);
  }

  async getMyImages(params?: { skip?: number; limit?: number }): Promise<Image[]> {
    const searchParams = new URLSearchParams();
    if (params?.skip) searchParams.append('skip', params.skip.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const query = searchParams.toString();
    return this.request<Image[]>(`/api/images/my-images${query ? `?${query}` : ''}`);
  }

  async uploadImage(file: File, metadata: {
    title: string;
    description?: string;
    category?: string;
    tags?: string;
    is_featured?: boolean;
    is_public?: boolean;
    is_hero_image?: boolean;
    category_id?: number;
  }): Promise<Image> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', metadata.title);
    if (metadata.description) formData.append('description', metadata.description);
    if (metadata.category) formData.append('category', metadata.category);
    if (metadata.tags) formData.append('tags', metadata.tags);
    formData.append('is_featured', (metadata.is_featured || false).toString());
    formData.append('is_public', (metadata.is_public !== false).toString());
    formData.append('is_hero_image', (metadata.is_hero_image || false).toString());
    if (metadata.category_id) formData.append('category_id', metadata.category_id.toString());

    const response = await fetch(`${this.baseURL}/api/images/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
      body: formData,
    });

    return this.handleResponse<Image>(response);
  }

  async deleteImage(imageId: number): Promise<void> {
    await this.request(`/api/images/${imageId}`, {
      method: 'DELETE',
    });
  }

  async updateImage(imageId: number, metadata: {
    title?: string;
    description?: string;
    tags?: string;
    category_id?: number | null;
    is_featured?: boolean;
    is_public?: boolean;
    is_hero_image?: boolean;
  }): Promise<Image> {
    return this.request<Image>(`/api/images/${imageId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata),
    });
  }

  // Categories API
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/api/categories/');
  }

  async createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
    return this.request<Category>('/api/categories/', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  }

  async updateCategory(id: number, category: Partial<Category>): Promise<Category> {
    return this.request<Category>(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  }

  async deleteCategory(id: number): Promise<void> {
    return this.request<void>(`/api/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Testimonials API
  async getTestimonials(activeOnly: boolean = true): Promise<Testimonial[]> {
    const response = await this.request<ApiResponse<Testimonial[]>>(`/api/testimonials/?active_only=${activeOnly}`);
    return response.data;
  }

  async getFeaturedTestimonials(limit: number = 6): Promise<Testimonial[]> {
    const response = await this.request<ApiResponse<Testimonial[]>>(`/api/testimonials/featured?limit=${limit}`);
    return response.data;
  }

  async createTestimonial(testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>): Promise<Testimonial> {
    return this.request<Testimonial>('/api/testimonials/', {
      method: 'POST',
      body: JSON.stringify(testimonial),
    });
  }

  async updateTestimonial(id: number, testimonial: Partial<Testimonial>): Promise<Testimonial> {
    return this.request<Testimonial>(`/api/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(testimonial),
    });
  }

  async deleteTestimonial(id: number): Promise<void> {
    return this.request<void>(`/api/testimonials/${id}`, {
      method: 'DELETE',
    });
  }

  // Hero Slides API
  async getHeroSlides(activeOnly: boolean = true): Promise<HeroSlide[]> {
    return this.request<HeroSlide[]>(`/api/hero-slides/?active_only=${activeOnly}`);
  }

  async createHeroSlide(slide: Omit<HeroSlide, 'id' | 'created_at' | 'updated_at'>): Promise<HeroSlide> {
    return this.request<HeroSlide>('/api/hero-slides/', {
      method: 'POST',
      body: JSON.stringify(slide),
    });
  }

  async updateHeroSlide(id: number, slide: Partial<HeroSlide>): Promise<HeroSlide> {
    return this.request<HeroSlide>(`/api/hero-slides/${id}`, {
      method: 'PUT',
      body: JSON.stringify(slide),
    });
  }

  async deleteHeroSlide(id: number): Promise<void> {
    return this.request<void>(`/api/hero-slides/${id}`, {
      method: 'DELETE',
    });
  }

  // Social Media API
  async getSocialMediaLinks(activeOnly: boolean = true): Promise<SocialMedia[]> {
    const response = await this.request<ApiResponse<SocialMedia[]>>(`/api/social-media/?active_only=${activeOnly}`);
    return response.data;
  }

  async createSocialMediaLink(socialMedia: Omit<SocialMedia, 'id' | 'created_at' | 'updated_at'>): Promise<SocialMedia> {
    const response = await this.request<ApiResponse<SocialMedia>>('/api/social-media/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(socialMedia),
    });
    return response.data;
  }

  async updateSocialMediaLink(id: number, socialMedia: Partial<Omit<SocialMedia, 'id' | 'created_at' | 'updated_at'>>): Promise<SocialMedia> {
    const response = await this.request<ApiResponse<SocialMedia>>(`/api/social-media/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(socialMedia),
    });
    return response.data;
  }

  async deleteSocialMediaLink(id: number): Promise<void> {
    return this.request<void>(`/api/social-media/${id}`, {
      method: 'DELETE',
    });
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  getImageUrl(imagePath: string): string {
    return `${this.baseURL}/static/${imagePath.replace('app/static/', '')}`;
  }
}

export const apiService = new ApiService();
