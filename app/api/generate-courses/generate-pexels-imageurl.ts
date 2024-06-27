import { createClient, Photo, ErrorResponse } from "pexels";

const PEXELS_API_KEY = "b34NZQrdqu3vubNk7l3AY4bBB1gvOGXmVwjwkJeEEq9djA69uRlMB151"; // Replace with your actual API key

export const generatePexelsImageUrl = async (
  query: string
): Promise<string | null> => {
  try {
    const client = createClient(PEXELS_API_KEY);
    const response = (await client.photos.search({ query, per_page: 1 })) as
      | PhotosWithTotalResults
      | ErrorResponse;

    if ("photos" in response && response.photos.length > 0) {
      const photo: Photo = response.photos[0];
      return photo.src.medium;
    } else {
      console.error("No photos found or error response received:", response);
      return null;
    }
  } catch (error) {
    console.error("Error fetching the image:", error);
    return null;
  }
};

// No need to redefine Photo and ErrorResponse here if imported correctly
// Define your types if not already defined
interface PhotosWithTotalResults {
  total_results: number;
  page: number;
  per_page: number;
  photos: Photo[];
  next_page: string;
}

// Example usage:
// const photo: Photo = { ... };
// const errorResponse: ErrorResponse = { ... };
