import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Camera, Star } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import Navigation from "@/shared/components/layout/Navigation";
import HeroSlideshow from "@/shared/components/common/HeroSlideshow";
import { apiService, type Testimonial } from "@/shared/services/api";
import SocialMediaLinks from "@/shared/components/common/SocialMediaLinks";
import { getImageUrl } from "@/shared/utils/imageUtils";
import fashionImage from "@/assets/gallery-fashion-1.jpg";
import weddingImage from "@/assets/gallery-wedding-1.jpg";
import portraitImage from "@/assets/gallery-portrait-1.jpg";
import productImage from "@/assets/gallery-product-1.jpg";

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    loadHeroImages();
    loadTestimonials();
  }, []);

  const loadHeroImages = async () => {
    try {
      const images = await apiService.getImages();
      const heroImageUrls = images
        .filter(img => img.is_hero_image)
        .map(img => getImageUrl(img.filename));

      setHeroImages(heroImageUrls);
    } catch (error) {
      console.error('Error loading hero images:', error);
      // Fallback to empty array if API fails
      setHeroImages([]);
    }
  };

  const loadTestimonials = async () => {
    try {
      // Get only 3 featured testimonials for homepage
      const data = await apiService.getFeaturedTestimonials(3);
      setTestimonials(data);
    } catch (error) {
      console.error('Error loading testimonials:', error);
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Hero Slideshow Background */}
        {heroImages.length > 0 && <HeroSlideshow images={heroImages} interval={5000} />}

        <div
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
            Professional photography services specializing in fashion, weddings, portraits, and product photography
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
        </div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Fashion", image: fashionImage },
              { name: "Wedding", image: weddingImage },
              { name: "Portrait", image: portraitImage },
              { name: "Product", image: productImage }
            ].map((category, index) => (
              <Link
                key={category.name}
                to="/gallery"
                className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-muted hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img
                  src={category.image}
                  alt={`${category.name} Photography`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <h3 className="text-2xl font-semibold text-white mb-2 transform transition-transform group-hover:translate-y-[-4px]">
                    {category.name}
                  </h3>
                  <p className="text-white/80 text-sm">View Collection</p>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </Link>
            ))}
          </div>

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
            With over a decade of experience in professional photography, I specialize in capturing
            the essence of every moment. From high-fashion editorials to intimate wedding ceremonies,
            my work reflects a passion for storytelling through imagery.
          </p>
          <Button asChild size="lg" variant="outline">
            <Link to="/about">Learn More About Me</Link>
          </Button>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                What Clients Say
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Hear from some of our satisfied clients about their experience
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="p-8 rounded-lg bg-card border border-border animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.title && testimonial.company
                        ? `${testimonial.title} at ${testimonial.company}`
                        : testimonial.title || testimonial.company || 'Client'
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button asChild size="lg" variant="outline">
                <Link to="/about">
                  Read More Testimonials
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
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
              © {new Date().getFullYear()} Photography By Cheriyan. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
