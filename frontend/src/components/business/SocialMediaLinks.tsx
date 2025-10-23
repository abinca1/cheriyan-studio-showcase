import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  Globe,
  LucideIcon,
} from "lucide-react";
import apiClient from "@/library/axios";

// Custom WhatsApp Icon Component
const WhatsAppIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 24,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516" />
  </svg>
);

interface SocialMediaLinksProps {
  className?: string;
  iconSize?: number;
  showLabels?: boolean;
}

const iconMap: Record<string, LucideIcon | React.ComponentType<any>> = {
  MessageCircle: WhatsAppIcon, // Use custom WhatsApp icon for MessageCircle
  WhatsApp: WhatsAppIcon, // Also support direct WhatsApp reference
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  Globe,
};

export const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({
  className = "",
  iconSize = 24,
  showLabels = false,
}) => {
  // TanStack Query for social media links
  const {
    data: socialLinks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["social-media", "active"],
    queryFn: async () => {
      const response = await apiClient.get(
        "/api/social-media/?active_only=true"
      );
      if (response?.data?.success) return response?.data?.data || [];
      else throw new Error("Failed to fetch social media links");
    },
  });

  if (isLoading) {
    return (
      <div className={`flex space-x-4 ${className}`}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-300 rounded-full"
            style={{ width: iconSize, height: iconSize }}
          />
        ))}
      </div>
    );
  }

  if (error) {
    console.error("Error loading social media links:", error);
    return null;
  }

  if (socialLinks.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {socialLinks.map((link) => {
        const IconComponent = iconMap[link.platform] || Globe;

        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group transition-all duration-300 hover:scale-110"
            title={link.platform}
          >
            <div className="flex items-center space-x-2 p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-accent hover:text-accent-foreground transition-colors">
              <IconComponent
                size={iconSize}
                className="text-muted-foreground group-hover:text-foreground transition-colors"
              />
              {showLabels && (
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {link.platform}
                </span>
              )}
            </div>
          </a>
        );
      })}
    </div>
  );
};

export default SocialMediaLinks;
