import { apiUrl } from "@/config/env";
import { useEffect, useState } from "react";

interface HeroSlideshowProps {
  images: any[];
  interval?: number;
}

const HeroSlideshow = ({ images, interval = 5000 }: HeroSlideshowProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval, isPaused]);
  console.log("URL", `${apiUrl}${images[0]?.file_path}`);

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center ken-burns transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${apiUrl}/${image?.file_path})`,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
    </div>
  );
};

export default HeroSlideshow;
