import { useState } from "react";
import Navigation from "@/components/Navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import fashionImage from "@/assets/gallery-fashion-1.jpg";
import weddingImage from "@/assets/gallery-wedding-1.jpg";
import productImage from "@/assets/gallery-product-1.jpg";
import portraitImage from "@/assets/gallery-portrait-1.jpg";

type Category = "All" | "Fashion" | "Wedding" | "Portrait" | "Product";

interface GalleryImage {
  id: number;
  src: string;
  category: Category;
  title: string;
}

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const categories: Category[] = ["All", "Fashion", "Wedding", "Portrait", "Product"];

  const images: GalleryImage[] = [
    { id: 1, src: fashionImage, category: "Fashion", title: "Fashion Editorial 1" },
    { id: 2, src: weddingImage, category: "Wedding", title: "Wedding Moment 1" },
    { id: 3, src: productImage, category: "Product", title: "Product Shot 1" },
    { id: 4, src: portraitImage, category: "Portrait", title: "Portrait 1" },
    { id: 5, src: fashionImage, category: "Fashion", title: "Fashion Editorial 2" },
    { id: 6, src: weddingImage, category: "Wedding", title: "Wedding Moment 2" },
    { id: 7, src: portraitImage, category: "Portrait", title: "Portrait 2" },
    { id: 8, src: productImage, category: "Product", title: "Product Shot 2" },
  ];

  const filteredImages =
    selectedCategory === "All"
      ? images
      : images.filter((img) => img.category === selectedCategory);

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
            {categories.map((category) => (
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

          {filteredImages.length === 0 && (
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
          <div className="text-center">
            <p className="font-body text-sm text-muted-foreground">
              © {new Date().getFullYear()} Cheriyan Nooranal Photography. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Gallery;
