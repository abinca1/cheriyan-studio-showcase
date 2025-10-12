import { useState, useEffect } from "react";
import { Navigation } from "@/shared/components";
import { X } from "lucide-react";
import { Button } from "@/shared/components/ui";
import { apiService, type Image, type Category as ApiCategory } from "@/shared/services/api";
import SocialMediaLinks from "@/shared/components/common/SocialMediaLinks";

import type { Category, GalleryImage } from "../types";

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [imagesData, categoriesData] = await Promise.all([
        apiService.getImages(),
        apiService.getCategories()
      ]);
      setImages(imagesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading gallery data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Convert API categories to gallery categories and add categories from images
  const imageCategories = [...new Set(images.map(img => img.category).filter(Boolean))];
  const allCategories = [...new Set([...categories.map(cat => cat.name), ...imageCategories])];
  const galleryCategories: Category[] = ["All", ...allCategories];

  // Convert API images to gallery images and filter
  const galleryImages: GalleryImage[] = images.map(img => ({
    id: img.id,
    src: `http://localhost:8000/static/images/${img.filename}`,
    category: img.category || "Uncategorized",
    title: img.title
  }));

  const filteredImages =
    selectedCategory === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="font-display text-5xl sm:text-6xl font-bold mb-4">
              Gallery
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore my portfolio of professional photography across various genres
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {galleryCategories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                className="font-body"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Gallery Grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="font-body text-muted-foreground">Loading gallery...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredImages.map((image, index) => (
              <div
                key={image.id}
                className="group relative aspect-[3/4] overflow-hidden rounded-sm cursor-pointer animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="font-body text-white text-sm font-medium">
                      {image.title}
                    </p>
                    <p className="font-body text-white/70 text-xs">
                      {image.category}
                    </p>
                  </div>
                </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredImages.length === 0 && (
            <div className="text-center py-12">
              <p className="font-body text-muted-foreground">
                No images found in this category.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/10"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-6 w-6" />
          </Button>

          <div className="max-w-6xl max-h-[90vh] flex items-center justify-center">
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="max-w-full max-h-full object-contain rounded-sm"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="absolute bottom-4 left-0 right-0 text-center text-white">
            <p className="font-body text-lg font-medium mb-1">
              {selectedImage.title}
            </p>
            <p className="font-body text-sm text-white/70">
              {selectedImage.category}
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            {/* Social Media Links */}
            <div className="flex justify-center">
              <SocialMediaLinks
                className="justify-center"
                iconSize={24}
                showLabels={false}
              />
            </div>

            {/* Copyright */}
            <p className="font-body text-sm text-muted-foreground">
              © {new Date().getFullYear()} Photography by Cheriyan. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GalleryPage;
