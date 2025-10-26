import { useState, useEffect } from "react";
import Navigation from "@/components/layout/Navigation";
import { Camera, Award, Users, Heart, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import SocialMediaLinks from "@/components/business/SocialMediaLinks";
import photographerPortrait from "@/assets/photographer-portrait.jpg";
import apiClient from "@/library/axios";
import { getImageUrl } from "@/utils/imageUtils";

const AboutPage = () => {
  const stats = [
    { icon: Camera, value: "5+", label: "Years Experience" },
    // { icon: Award, value: "50+", label: "Awards Won" },
    { icon: Users, value: "100+", label: "Happy Clients" },
    { icon: Heart, value: "100+", label: "Projects Completed" },
  ];

  // Use TanStack Query for testimonials
  const {
    data: testimonials = [],
    isLoading: loading,
    error: testimonialsError,
  } = useQuery({
    queryKey: ["featured-testimonials-about"],
    queryFn: async () => {
      const response = await apiClient.get(
        "/api/testimonials/?active_only=true"
      );
      if (response?.data?.success) {
        return response.data.data;
      } else {
        return [];
      }
    },
  });
  const {
    data: profileImages = [],
    isLoading: profileImagesLoading,
    error: profileImagesError,
  } = useQuery({
    queryKey: ["profile-images"],
    queryFn: async () => {
      const response = await apiClient.get("/api/images/");
      if (response?.data?.success) {
        const images = response.data.data;
        return images.filter((img) => img.is_profile_picture)[0];
      } else {
        return {};
      }
    },
  });

  if (testimonialsError || profileImagesError) {
    console.error("Error loading data:", {
      testimonialsError,
      profileImagesError,
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="font-display text-5xl sm:text-6xl font-bold mb-4">
              About Me
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              Passionate photographer dedicated to capturing life's most
              beautiful moments
            </p>
          </div>

          {/* Bio Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <div className="relative animate-scale-in">
              <div className="aspect-[3/4] overflow-hidden rounded-sm bg-muted">
                {profileImagesLoading ? (
                  <div className="w-full h-full bg-muted animate-pulse" />
                ) : profileImages?.filename ? (
                  <img
                    src={getImageUrl(profileImages.filename)}
                    alt={profileImages.title || "Cheriyan Simon"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={photographerPortrait}
                    alt="Cheriyan Simon"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            <div className="space-y-6 animate-fade-in">
              <h2 className="font-display text-4xl font-bold">
                Hello, I'm Cheriyan Simon
              </h2>
              <div className="space-y-4 font-body text-muted-foreground leading-relaxed">
                <p>
                  With over eight years of experience in professional
                  photography, I've had the privilege of capturing countless
                  precious moments and creating lasting memories for my clients.
                </p>
                <p>
                  My journey began with a simple camera and an unwavering
                  passion for visual storytelling. Today, I specialize in
                  fashion, wedding, portrait, and product photography, bringing
                  a unique artistic vision to every project.
                </p>
                <p>
                  I believe that great photography is about more than just
                  technical skill—it's about understanding people, emotions, and
                  the stories that deserve to be told. Every photograph I take
                  is crafted with care, attention to detail, and a commitment to
                  excellence. I'm dedicated to capturing life's most beautiful
                  moments and creating memories that last a lifetime.
                </p>
                <p>
                  When I'm not behind the camera, you'll find me exploring new
                  techniques, studying light, and seeking inspiration in
                  everyday moments. I'm constantly evolving my craft to provide
                  my clients with timeless, beautiful images.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-sm bg-muted/30 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <stat.icon className="w-8 h-8 mx-auto mb-4 text-accent" />
                <div className="font-display text-4xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="font-body text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Social Media Section */}
          <div className="text-center mb-24">
            <h2 className="font-display text-3xl font-bold mb-8">
              Connect With Me
            </h2>
            <p className="font-body text-muted-foreground mb-8 max-w-2xl mx-auto">
              Follow my work and stay updated with the latest projects and
              behind-the-scenes content
            </p>
            <div className="flex justify-center">
              <SocialMediaLinks
                className="justify-center"
                iconSize={28}
                showLabels={true}
              />
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="mb-16">
            <h2 className="font-display text-4xl font-bold text-center mb-12">
              Client Testimonials
            </h2>
            {loading ? (
              <div className="text-center py-12">
                <p className="font-body text-muted-foreground">
                  Loading testimonials...
                </p>
              </div>
            ) : testimonialsError ? (
              <div className="text-center py-12">
                <p className="font-body text-muted-foreground">
                  Failed to load testimonials. Please try again later.
                </p>
              </div>
            ) : testimonials.length === 0 ? (
              <div className="text-center py-12">
                <p className="font-body text-muted-foreground">
                  No testimonials available.
                </p>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </div>

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

export default AboutPage;
