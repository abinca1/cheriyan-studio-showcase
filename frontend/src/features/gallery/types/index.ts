// Gallery feature types
export type Category = string; // Allow any category name from the API

export interface GalleryImage {
  id: number;
  src: string;
  category: Category;
  title: string;
}
