import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { apiService, Image, Testimonial, HeroSlide, Category, SocialMedia } from '../../../shared/services/api';
import { Button } from '../../../shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/components/ui/card';
import { Badge } from '../../../shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../shared/components/ui/tabs';
import { Alert, AlertDescription } from '../../../shared/components/ui/alert';
import {
  Upload,
  Image as ImageIcon,
  Users,
  Settings,
  LogOut,
  Plus,
  Eye,
  Edit,
  Trash2,
  Star,
  MessageSquare,
  Monitor,
  Tag
} from 'lucide-react';
import { ImageUploadDialog } from './ImageUploadDialog';
import { ImageEditDialog } from './ImageEditDialog';
import { ImageGrid } from './ImageGrid';
import { TestimonialDialog } from './TestimonialDialog';
import { HeroSlideDialog } from './HeroSlideDialog';
import { SocialMediaDialog } from './SocialMediaDialog';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [images, setImages] = useState<Image[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [socialMediaLinks, setSocialMediaLinks] = useState<SocialMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingImage, setEditingImage] = useState<Image | null>(null);
  const [showTestimonialDialog, setShowTestimonialDialog] = useState(false);
  const [showHeroSlideDialog, setShowHeroSlideDialog] = useState(false);
  const [showSocialMediaDialog, setShowSocialMediaDialog] = useState(false);
  const [editingSocialMedia, setEditingSocialMedia] = useState<SocialMedia | null>(null);

  const loadImages = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getMyImages({ limit: 50 });
      setImages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load images');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTestimonials = async () => {
    try {
      const data = await apiService.getTestimonials(false); // Load all testimonials
      setTestimonials(data);
    } catch (err) {
      console.error('Failed to load testimonials:', err);
    }
  };

  const loadHeroSlides = async () => {
    try {
      const data = await apiService.getHeroSlides(false); // Load all slides
      setHeroSlides(data);
    } catch (err) {
      console.error('Failed to load hero slides:', err);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await apiService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadSocialMediaLinks = async () => {
    try {
      const data = await apiService.getSocialMediaLinks(false); // Load all links
      setSocialMediaLinks(data);
    } catch (err) {
      console.error('Failed to load social media links:', err);
    }
  };

  const loadAllData = async () => {
    await Promise.all([
      loadImages(),
      loadTestimonials(),
      loadHeroSlides(),
      loadCategories(),
      loadSocialMediaLinks()
    ]);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleImageUpload = async (imageData: any) => {
    try {
      await loadImages(); // Refresh the images list
      setShowUploadDialog(false);
    } catch (err) {
      console.error('Failed to refresh images:', err);
    }
  };

  const handleEditImage = (image: Image) => {
    setEditingImage(image);
    setShowEditDialog(true);
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      await apiService.deleteImage(imageId);
      setImages(images.filter(img => img.id !== imageId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete image');
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const stats = {
    totalImages: images.length,
    featuredImages: images.filter(img => img.is_featured).length,
    publicImages: images.filter(img => img.is_public).length,
    privateImages: images.filter(img => !img.is_public).length,
    heroImages: images.filter(img => img.is_hero_image).length,
    totalTestimonials: testimonials.length,
    featuredTestimonials: testimonials.filter(t => t.is_featured).length,
    totalHeroSlides: heroSlides.length,
    activeHeroSlides: heroSlides.filter(s => s.is_active).length,
    totalCategories: categories.length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome back, {user?.full_name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">{user?.username}</Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Images</CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalImages}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hero Images</CardTitle>
              <Monitor className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.heroImages}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hero Slides</CardTitle>
              <Monitor className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeHeroSlides}/{stats.totalHeroSlides}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Testimonials</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.featuredTestimonials}/{stats.totalTestimonials}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCategories}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Featured</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.featuredImages}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="images" className="space-y-6">
          <TabsList>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="hero-slides">Hero Slides</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="social-media">Social Media</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="images" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Image Gallery</h2>
              <Button onClick={() => setShowUploadDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
            </div>

            <ImageGrid
              images={images}
              isLoading={isLoading}
              onDelete={handleDeleteImage}
              onEdit={handleEditImage}
            />
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload New Image</CardTitle>
                <CardDescription>
                  Add a new image to your gallery
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setShowUploadDialog(true)} size="lg">
                  <Upload className="h-5 w-5 mr-2" />
                  Choose Image to Upload
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hero-slides" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Hero Slides Management</h2>
              <Button onClick={() => setShowHeroSlideDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Hero Slide
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Hero Slides</CardTitle>
                <CardDescription>
                  Manage hero section slides for the homepage
                </CardDescription>
              </CardHeader>
              <CardContent>
                {heroSlides.length === 0 ? (
                  <div className="text-center py-8">
                    <Monitor className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No hero slides found. Create your first slide!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {heroSlides.map((slide) => (
                      <div key={slide.id} className="border rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{slide.title}</h3>
                          {slide.subtitle && <p className="text-sm text-gray-600">{slide.subtitle}</p>}
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant={slide.is_active ? "default" : "secondary"}>
                              {slide.is_active ? "Active" : "Inactive"}
                            </Badge>
                            <span className="text-xs text-gray-500">Order: {slide.sort_order}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => console.log('Edit hero slide:', slide.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => console.log('Delete hero slide:', slide.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testimonials" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Testimonials Management</h2>
              <Button onClick={() => setShowTestimonialDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Testimonial
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Testimonials</CardTitle>
                <CardDescription>
                  Manage customer testimonials displayed on the website
                </CardDescription>
              </CardHeader>
              <CardContent>
                {testimonials.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No testimonials found. Add your first testimonial!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {testimonials.map((testimonial) => (
                      <div key={testimonial.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-medium">{testimonial.name}</h3>
                              {testimonial.title && (
                                <span className="text-sm text-gray-600">- {testimonial.title}</span>
                              )}
                              {testimonial.company && (
                                <span className="text-sm text-gray-600">at {testimonial.company}</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{testimonial.content}</p>
                            <div className="flex items-center space-x-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                              <Badge variant={testimonial.is_featured ? "default" : "secondary"}>
                                {testimonial.is_featured ? "Featured" : "Regular"}
                              </Badge>
                              <Badge variant={testimonial.is_active ? "default" : "secondary"}>
                                {testimonial.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => console.log('Edit testimonial:', testimonial.id)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => console.log('Delete testimonial:', testimonial.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Categories Management</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Image Categories</CardTitle>
                <CardDescription>
                  Manage categories for organizing images
                </CardDescription>
              </CardHeader>
              <CardContent>
                {categories.length === 0 ? (
                  <div className="text-center py-8">
                    <Tag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No categories found. Create your first category!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                      <div key={category.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{category.name}</h3>
                          <Badge variant={category.is_active ? "default" : "secondary"}>
                            {category.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        {category.description && (
                          <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Slug: {category.slug}</span>
                          <div className="flex space-x-1">
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social-media" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Social Media Links</h2>
              <Button onClick={() => {
                setEditingSocialMedia(null);
                setShowSocialMediaDialog(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Social Media Link
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>
                  Manage social media links displayed on your website
                </CardDescription>
              </CardHeader>
              <CardContent>
                {socialMediaLinks.length === 0 ? (
                  <div className="text-center py-8">
                    <Tag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No social media links found. Add your first link!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {socialMediaLinks.map((link) => (
                      <div key={link.id} className="border rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-medium">{link.platform.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <h3 className="font-medium">{link.display_name}</h3>
                            <p className="text-sm text-gray-600">{link.url}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant={link.is_active ? "default" : "secondary"}>
                                {link.is_active ? "Active" : "Inactive"}
                              </Badge>
                              <span className="text-xs text-gray-500">Order: {link.sort_order}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingSocialMedia(link);
                              setShowSocialMediaDialog(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => console.log('Delete social media link:', link.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Username</label>
                  <p className="text-sm text-gray-600">{user?.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <p className="text-sm text-gray-600">{user?.full_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <Badge variant={user?.is_admin ? "default" : "secondary"}>
                    {user?.is_admin ? "Administrator" : "User"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Upload Dialog */}
      <ImageUploadDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        onUpload={handleImageUpload}
      />

      {/* Edit Dialog */}
      <ImageEditDialog
        open={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open);
          if (!open) setEditingImage(null);
        }}
        onSuccess={loadImages}
        image={editingImage}
      />

      {/* Testimonial Dialog */}
      <TestimonialDialog
        open={showTestimonialDialog}
        onOpenChange={setShowTestimonialDialog}
        onSuccess={loadTestimonials}
      />

      {/* Hero Slide Dialog */}
      <HeroSlideDialog
        open={showHeroSlideDialog}
        onOpenChange={setShowHeroSlideDialog}
        onSuccess={loadHeroSlides}
      />

      {/* Social Media Dialog */}
      <SocialMediaDialog
        open={showSocialMediaDialog}
        onOpenChange={(open) => {
          setShowSocialMediaDialog(open);
          if (!open) setEditingSocialMedia(null);
        }}
        onSuccess={loadSocialMediaLinks}
        socialMedia={editingSocialMedia}
      />
    </div>
  );
};
