import Navigation from "@/components/Navigation";
import { Camera, Award, Users, Heart } from "lucide-react";
import photographerPortrait from "@/assets/photographer-portrait.jpg";

const About = () => {
  const stats = [
    { icon: Camera, value: "10+", label: "Years Experience" },
    { icon: Award, value: "50+", label: "Awards Won" },
    { icon: Users, value: "500+", label: "Happy Clients" },
    { icon: Heart, value: "1000+", label: "Projects Completed" },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Bride",
      text: "Cheriyan captured our wedding day beautifully. Every moment felt authentic and the photos are stunning.",
    },
    {
      name: "Michael Chen",
      role: "Fashion Designer",
      text: "Working with Cheriyan is always a pleasure. His eye for detail and creative vision is unmatched.",
    },
    {
      name: "Emma Williams",
      role: "Business Owner",
      text: "The product photography exceeded our expectations. Professional, timely, and absolutely gorgeous results.",
    },
  ];

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
              Passionate photographer dedicated to capturing life's most beautiful moments
            </p>
          </div>

          {/* Bio Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <div className="relative animate-scale-in">
              <div className="aspect-[3/4] overflow-hidden rounded-sm">
                <img
                  src={photographerPortrait}
                  alt="Cheriyan Nooranal"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-6 animate-fade-in">
              <h2 className="font-display text-4xl font-bold">
                Hello, I'm Cheriyan Nooranal
              </h2>
              <div className="space-y-4 font-body text-muted-foreground leading-relaxed">
                <p>
                  With over a decade of experience in professional photography, I've had the
                  privilege of capturing countless precious moments and creating lasting memories
                  for my clients.
                </p>
                <p>
                  My journey began with a simple camera and an unwavering passion for visual
                  storytelling. Today, I specialize in fashion, wedding, portrait, and product
                  photography, bringing a unique artistic vision to every project.
                </p>
                <p>
                  I believe that great photography is about more than just technical skill—it's
                  about understanding people, emotions, and the stories that deserve to be told.
                  Every photograph I take is crafted with care, attention to detail, and a
                  commitment to excellence.
                </p>
                <p>
                  When I'm not behind the camera, you'll find me exploring new techniques,
                  studying light, and seeking inspiration in everyday moments. I'm constantly
                  evolving my craft to provide my clients with timeless, beautiful images.
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
                <div className="font-display text-4xl font-bold mb-2">{stat.value}</div>
                <div className="font-body text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Testimonials Section */}
          <div className="mb-16">
            <h2 className="font-display text-4xl font-bold text-center mb-12">
              Client Testimonials
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="p-8 rounded-sm bg-card border border-border animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <p className="font-body text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <div className="font-body font-semibold">{testimonial.name}</div>
                    <div className="font-body text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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

export default About;
