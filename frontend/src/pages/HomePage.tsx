import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Camera, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/layout/Navigation";
import HeroSlideshow from "@/components/business/HeroSlideshow";
import { useQuery } from "@tanstack/react-query";
import SocialMediaLinks from "@/components/business/SocialMediaLinks";
import apiClient from "@/library/axios";
import { getImageUrl } from "@/utils/imageUtils";

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Query for hero images
  const {
    data: heroImagesData = [],
    isLoading: heroImagesLoading,
    error: heroImagesError,
  } = useQuery({
    queryKey: ["hero-images"],
    queryFn: async () => {
      const response = await apiClient.get("/api/images/");
      if (response?.data?.success) {
        const images = response.data.data;
        return images.filter((img) => img.is_hero_image);
      } else {
        return [];
      }
    },
  });

  // Query for featured testimonials
  const {
    data: testimonials = [],
    isLoading: testimonialsLoading,
    error: testimonialsError,
  } = useQuery({
    queryKey: ["featured-testimonials"],
    queryFn: async () => {
      const response = await apiClient.get(
        "/api/testimonials/?limit=3&active_only=true"
      );
      if (response?.data?.success) {
        return response.data.data;
      } else {
        return [];
      }
    },
  });

  //Fetch Featured Work

  const {
    data: featuredWork = [],
    isLoading: featuredWorkLoading,
    error: featuredWorkError,
  } = useQuery({
    queryKey: ["featuredWork-images"],
    queryFn: async () => {
      const response = await apiClient.get("/api/images/");
      if (response?.data?.success) {
        const images = response.data.data;
        return images.filter((img) => img.is_thumbnail);
      } else {
        return [];
      }
    },
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Handle loading and error states
  const isLoading =
    heroImagesLoading || testimonialsLoading || featuredWorkLoading;
  const hasError = heroImagesError || testimonialsError || featuredWorkError;

  if (hasError) {
    console.error("Error loading data:", {
      heroImagesError,
      testimonialsError,
      featuredWorkError,
    });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Hero Slideshow Background */}
        {heroImagesData.length > 0 && (
          <HeroSlideshow images={heroImagesData} interval={5000} />
        )}

        {/* <div
          className={`relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Camera className="w-16 h-16 text-white mx-auto mb-6 opacity-90" />
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            Capturing Moments,
            <br />
            Creating Memories
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Professional photography services specializing in fashion, weddings,
            portraits, and product photography
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-medium shadow-lg"
            >
              <Link to="/gallery">
                Explore Portfolio
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-primary font-medium"
            >
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div> */}

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Featured Work Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Featured Work
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A selection of my finest photography across various genres
            </p>
          </div>

          {featuredWorkLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="aspect-[3/4] bg-muted rounded-lg animate-pulse"
                  style={{ animationDelay: `${index * 100}ms` }}
                />
              ))}
            </div>
          ) : featuredWork.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredWork.slice(0, 4).map((work, index) => (
                <Link
                  key={work.id}
                  to="/gallery"
                  className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-muted hover:shadow-lg transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <img
                    src={getImageUrl(work.filename)}
                    alt={work.title || `${work.category} Photography`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <h3 className="text-2xl font-semibold text-white mb-2 transform transition-transform group-hover:translate-y-[-4px]">
                      {work.category || "Featured Work"}
                    </h3>
                    <p className="text-white/80 text-sm">View Collection</p>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No featured work available at the moment.
              </p>
            </div>
          )}

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link to="/gallery">
                View Full Gallery
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary/50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            About the Artist
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            With over a decade of experience in professional photography, I
            specialize in capturing the essence of every moment. From
            high-fashion editorials to intimate wedding ceremonies, my work
            reflects a passion for storytelling through imagery.
          </p>
          <Button asChild size="lg" variant="outline">
            <Link to="/about">Learn More About Me</Link>
          </Button>
        </div>
      </section>

      {/* Testimonials Section */}
      {isLoading && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
          <div className="container mx-auto max-w-7xl">
            {/* Header Skeleton */}
            <div className="text-center mb-20">
              <div className="animate-pulse">
                <div className="h-16 bg-muted rounded w-96 mx-auto mb-6"></div>
                <div className="h-6 bg-muted rounded w-3/4 mx-auto"></div>
              </div>
            </div>

            {/* Testimonials Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-8 shadow-sm border animate-pulse h-full"
                >
                  {/* Content Skeleton */}
                  <div className="space-y-4 mb-6">
                    <div className="h-5 bg-muted rounded"></div>
                    <div className="h-5 bg-muted rounded"></div>
                    <div className="h-5 bg-muted rounded w-3/4"></div>
                  </div>

                  {/* Rating Skeleton */}
                  <div className="flex items-center gap-2 mb-6">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="h-5 w-5 bg-muted rounded"></div>
                    ))}
                    <div className="h-5 bg-muted rounded w-8 ml-2"></div>
                  </div>

                  {/* Author Skeleton */}
                  <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                    <div className="w-12 h-12 bg-muted rounded-full"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-5 bg-muted rounded w-32"></div>
                      <div className="h-4 bg-muted rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Skeleton */}
            <div className="text-center mt-16">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200/50 max-w-2xl mx-auto animate-pulse">
                <div className="h-8 bg-muted rounded w-64 mx-auto mb-4"></div>
                <div className="h-5 bg-muted rounded w-96 mx-auto mb-6"></div>
                <div className="h-12 bg-muted rounded w-48 mx-auto"></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {!isLoading && testimonials.length > 0 && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
          <div className="container mx-auto max-w-7xl">
            {/* Header */}
            <div className="text-center mb-20">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-slate-900">
                Client Testimonials
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Discover what our clients have to say about their photography
                experience with us
              </p>
            </div>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="group relative">
                  {/* Card */}
                  <div className="bg-white rounded-2xl p-6 border shadow-sm h-64 flex flex-col">
                    {/* Featured Badge */}
                    {testimonial.is_featured && (
                      <div className="absolute -top-3 -right-3">
                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                          ⭐ Featured
                        </div>
                      </div>
                    )}

                    {/* Quote */}
                    <div className="mb-6 flex-1">
                      <p className="text-slate-700 text-lg leading-relaxed italic">
                        {testimonial.content}
                      </p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-6">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < (testimonial.rating || 5)
                                ? "text-yellow-400 fill-current"
                                : "text-slate-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-slate-600 font-semibold">
                        {testimonial.rating || 5}.0
                      </span>
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white font-bold text-lg">
                        {(testimonial.name || testimonial.client_name || "C")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-slate-900 text-lg">
                          {testimonial.name || testimonial.client_name}
                        </div>
                        <div className="text-slate-600">
                          {testimonial.title ||
                            testimonial.client_title ||
                            "Client"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center mt-16">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200/50 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Ready to Create Beautiful Memories?
                </h3>
                <p className="text-slate-600 mb-6">
                  Join our satisfied clients and let us capture your special
                  moments
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3"
                >
                  <Link to="/contact">
                    Book Your Session
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {!isLoading && hasError && (
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl text-center">
            <div className="p-8 rounded-lg bg-destructive/10 border border-destructive/20">
              <h3 className="text-lg font-semibold text-destructive mb-2">
                Unable to Load Content
              </h3>
              <p className="text-muted-foreground">
                There was an error loading some content. Please try refreshing
                the page.
              </p>
            </div>
          </div>
        </section>
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
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Photography By Cheriyan. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
