// Gallery feature types
export type Category = "All" | "Fashion" | "Wedding" | "Portrait" | "Product";

export interface GalleryImage {
  id: number;
  src: string;
  category: Category;
  title: string;
}
