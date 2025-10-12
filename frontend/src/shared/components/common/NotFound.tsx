import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Navigation } from "../layout";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="animate-fade-in">
            <h1 className="font-display text-9xl sm:text-[12rem] font-bold text-muted mb-8">
              404
            </h1>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6">
              Page Not Found
            </h2>
            <p className="font-body text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Sorry, the page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/">
                  <Home className="mr-2 h-5 w-5" />
                  Go Home
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
