import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import heroImage from "@/assets/hero-image.jpg";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </div>

        <div
          className={`relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <Camera className="w-16 h-16 text-white mx-auto mb-6 opacity-90" />
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            Capturing Moments,
            <br />
            Creating Memories
          </h1>
          <p className="font-body text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Professional photography services specializing in fashion, weddings, portraits, and product photography
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-medium"
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
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary font-medium"
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
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
              Featured Work
            </h2>
            <p className="font-body text-muted-foreground text-lg max-w-2xl mx-auto">
              A selection of my finest photography across various genres
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {["Fashion", "Wedding", "Portrait", "Product"].map((category, index) => (
              <Link
                key={category}
                to="/gallery"
                className="group relative aspect-[3/4] overflow-hidden rounded-sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <div className="absolute inset-0 bg-muted animate-pulse" />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <h3 className="font-display text-2xl font-semibold text-white mb-2 transform transition-transform group-hover:translate-y-[-4px]">
                    {category}
                  </h3>
                  <p className="font-body text-white/80 text-sm">View Collection</p>
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
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6">
            About the Artist
          </h2>
          <p className="font-body text-lg text-muted-foreground mb-8 leading-relaxed">
            With over a decade of experience in professional photography, I specialize in capturing
            the essence of every moment. From high-fashion editorials to intimate wedding ceremonies,
            my work reflects a passion for storytelling through imagery.
          </p>
          <Button asChild size="lg" variant="outline">
            <Link to="/about">Learn More About Me</Link>
          </Button>
        </div>
      </section>

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

export default Home;
