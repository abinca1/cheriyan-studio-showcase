import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAVIGATION_LINKS, APP_NAME } from "@/constants";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOverLightContent, setIsOverLightContent] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setIsScrolled(scrollY > 20);

          // Check if we're over light content sections (after hero section)
          setIsOverLightContent(scrollY > window.innerHeight * 0.8);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = NAVIGATION_LINKS;
  const isHomePage = location.pathname === "/";

  // Determine header classes based on route and scroll state
  const getHeaderClasses = () => {
    // Mobile: always show same background as desktop (no transparent), Desktop: transparent when not scrolled on home
    if (!isScrolled && isHomePage) {
      return "bg-black/20 md:bg-transparent backdrop-blur-lg md:backdrop-blur-none border-b border-white/20 md:border-transparent shadow-lg md:shadow-none";
    }

    // Only home page gets glass effects
    if (isHomePage) {
      // Home page: glass effect over hero, solid over content
      return isOverLightContent
        ? "bg-gray-900/95 backdrop-blur-lg border-b border-gray-700/50 shadow-lg"
        : "bg-black/20 backdrop-blur-lg border-b border-white/20 shadow-lg";
    }

    // All other pages get solid background (no glass effect)
    return "bg-gray-900/95 border-b border-gray-700/50 shadow-lg";
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${getHeaderClasses()}`}
      style={{
        willChange: isScrolled ? "backdrop-filter, background-color" : "auto",
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <Link
            to="/"
            className={`font-display text-xl font-semibold tracking-tight transition-colors duration-500 ease-in-out text-white hover:text-gray-300`}
          >
            {APP_NAME}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-body text-sm tracking-wide transition-colors duration-500 ease-in-out relative group ${
                  location.pathname === link.path
                    ? "text-white"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 w-full h-0.5 bg-accent transition-transform duration-300 ease-in-out origin-left ${
                    location.pathname === link.path
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:text-white hover:bg-white/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div
            className={`md:hidden py-3 border-t animate-fade-in transition-colors duration-500 ease-in-out border-gray-700`}
          >
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`font-body text-sm tracking-wide transition-colors duration-500 ease-in-out px-4 py-2 ${
                    location.pathname === link.path
                      ? "text-white bg-gray-700/50"
                      : "text-white/80 hover:text-white hover:bg-gray-700/30"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
