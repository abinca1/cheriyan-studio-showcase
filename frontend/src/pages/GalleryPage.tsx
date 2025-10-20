import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/layout/Navigation";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Image, type Category as ApiCategory } from "@/types";
import SocialMediaLinks from "@/components/business/SocialMediaLinks";
import { getImageUrl } from "@/utils/imageUtils";
import apiClient from "@/lib/axios";

import type { GalleryImage } from "@/types";

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Query for images
  const {
    data: images = [],
    isLoading: imagesLoading,
    error: imagesError,
  } = useQuery<Image[]>({
    queryKey: ["gallery-images"],
    queryFn: async () => {
      const response = await apiClient.get("/api/images/");
      if (response?.data?.success) {
        return response.data.data;
      } else {
        return [];
      }
    },
  });

  // Query for categories
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery<ApiCategory[]>({
    queryKey: ["gallery-categories"],
    queryFn: async () => {
      const response = await apiClient.get("/api/categories/");
      if (response?.data?.success) {
        return response.data.data;
      } else {
        return [];
      }
    },
  });

  // Handle loading and error states
  const isLoading = imagesLoading || categoriesLoading;
  const hasError = imagesError || categoriesError;

  if (hasError) {
    console.error("Error loading gallery data:", {
      imagesError,
      categoriesError,
    });
  }

  // Convert API categories to gallery categories and add categories from images
  const imageCategories = [
    ...new Set(images.map((img) => img.category).filter(Boolean)),
  ];
  const allCategories = [
    ...new Set([...categories.map((cat) => cat.name), ...imageCategories]),
  ];
  const galleryCategories: string[] = ["All", ...allCategories];

  // Convert API images to gallery images and filter
  const galleryImages: GalleryImage[] = images.map((img) => ({
    id: img.id,
    src: getImageUrl(img.filename),
    category: img.category || "Uncategorized",
    title: img.title,
  }));

  const filteredImages =
    selectedCategory === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  // Navigation functions for lightbox
  const currentImageIndex = selectedImage
    ? filteredImages.findIndex((img) => img.id === selectedImage.id)
    : -1;

  const goToPrevious = () => {
    if (currentImageIndex > 0) {
      setSelectedImage(filteredImages[currentImageIndex - 1]);
    }
  };

  const goToNext = () => {
    if (currentImageIndex < filteredImages.length - 1) {
      setSelectedImage(filteredImages[currentImageIndex + 1]);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedImage) return;

      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedImage, currentImageIndex]);

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
              Explore my portfolio of professional photography across various
              genres
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
          {isLoading ? (
            <div className="text-center py-12">
              <p className="font-body text-muted-foreground">
                Loading gallery...
              </p>
            </div>
          ) : hasError ? (
            <div className="text-center py-12">
              <p className="font-body text-muted-foreground">
                Failed to load gallery. Please try again later.
              </p>
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

          {!isLoading && !hasError && filteredImages.length === 0 && (
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
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/10 z-10"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Previous Button */}
          {currentImageIndex > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 z-10"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          )}

          {/* Next Button */}
          {currentImageIndex < filteredImages.length - 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 z-10"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          )}

          <div className="max-w-6xl max-h-[90vh] flex items-center justify-center">
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="max-w-full max-h-full object-contain rounded-sm"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Image Info */}
          <div className="absolute bottom-4 left-0 right-0 text-center text-white">
            <p className="font-body text-lg font-medium mb-1">
              {selectedImage.title}
            </p>
            <p className="font-body text-sm text-white/70 mb-2">
              {selectedImage.category}
            </p>
            <p className="font-body text-xs text-white/50">
              {currentImageIndex + 1} of {filteredImages.length}
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
              © {new Date().getFullYear()} Photography by Cheriyan. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GalleryPage;
