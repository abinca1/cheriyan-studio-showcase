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
    { icon: Camera, value: "8+", label: "Years Experience" },
    // { icon: Award, value: "50+", label: "Awards Won" },
    // { icon: Users, value: "100+", label: "Happy Clients" },
    // { icon: Heart, value: "100+", label: "Projects Completed" },
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
          {/* <div className="mb-24">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-sm bg-muted/30 animate-scale-in max-w-xs mx-auto"
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
          </div> */}

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
