import { apiUrl } from '@/config/env';

/**
 * Generate the full URL for an image file
 * @param filename - The image filename
 * @returns Full URL to the image
 */
export const getImageUrl = (filename: string): string => {
  return `${apiUrl}/static/images/${filename}`;
};

/**
 * Generate image URLs for multiple filenames
 * @param filenames - Array of image filenames
 * @returns Array of full URLs
 */
export const getImageUrls = (filenames: string[]): string[] => {
  return filenames.map(getImageUrl);
};

/**
 * Extract filename from a full image URL
 * @param url - Full image URL
 * @returns Just the filename
 */
export const getFilenameFromUrl = (url: string): string => {
  return url.split('/').pop() || '';
};
