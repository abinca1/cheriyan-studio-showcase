import React from "react";
import { apiService } from "@/services";
import type { Image } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Star,
  Eye,
  EyeOff,
  MoreVertical,
  Edit,
  Trash2,
  Download,
  Calendar,
} from "lucide-react";

interface ImageGridProps {
  images: Image[];
  isLoading: boolean;
  onDelete: (imageId: number) => void;
  onEdit: (image: Image) => void;
}

export const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  isLoading,
  onDelete,
  onEdit,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-square bg-gray-200 animate-pulse" />
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Eye className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No images yet
        </h3>
        <p className="text-gray-500 mb-4">
          Upload your first image to get started
        </p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getImageUrl = (image: Image) => {
    return apiService.getImageUrl(image.file_path);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {images.map((image) => (
        <Card
          key={image.id}
          className="overflow-hidden group hover:shadow-lg transition-shadow"
        >
          {/* Image */}
          <div className="aspect-square relative overflow-hidden bg-gray-100">
            <img
              src={getImageUrl(image)}
              alt={image.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlmYTZiNyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=";
              }}
            />

            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex space-x-2">
                <Button size="sm" variant="secondary">
                  <Eye className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="secondary">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(image)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => onDelete(image.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Status badges */}
            <div className="absolute top-2 left-2 flex space-x-1">
              {image.is_featured && (
                <Badge variant="default" className="text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
              <Badge
                variant={image.is_public ? "secondary" : "outline"}
                className="text-xs"
              >
                {image.is_public ? (
                  <>
                    <Eye className="h-3 w-3 mr-1" />
                    Public
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3 w-3 mr-1" />
                    Private
                  </>
                )}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <CardContent className="p-4">
            <h3
              className="font-medium text-gray-900 mb-1 truncate"
              title={image.title}
            >
              {image.title}
            </h3>

            {image.description && (
              <p
                className="text-sm text-gray-600 mb-2 line-clamp-2"
                title={image.description}
              >
                {image.description}
              </p>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(image.created_at)}
              </div>
              {image.category && (
                <Badge variant="outline" className="text-xs">
                  {image.category}
                </Badge>
              )}
            </div>

            {image.tags && (
              <div className="mt-2 flex flex-wrap gap-1">
                {image.tags
                  .split(",")
                  .slice(0, 3)
                  .map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag.trim()}
                    </Badge>
                  ))}
                {image.tags.split(",").length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{image.tags.split(",").length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* File info */}
            <div className="mt-2 text-xs text-gray-400">
              {image.file_size && (
                <span>{(image.file_size / 1024 / 1024).toFixed(2)} MB</span>
              )}
              {image.mime_type && image.file_size && <span> • </span>}
              {image.mime_type && (
                <span>{image.mime_type.split("/")[1].toUpperCase()}</span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
export default ImageGrid;
