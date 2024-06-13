import axios from "axios";

// Define the structure of the API response
interface PixabayResponse {
  total: number;
  totalHits: number;
  hits: {
    webformatURL: string;
  }[];
}

export async function generateImageQuery(topic: string) {
  try {
    const words = topic.split(" ");
    const query = words.join("+");
    const url = `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${query}&image_type=photo`;

    // Make the API request
    const response = await axios.get<PixabayResponse>(url);

    // Check if there are hits in the response
    if (response.data.totalHits > 0) {
      // Return the URL of the first image
      return response.data.hits[0].webformatURL;
    } else {
      return null;
    }
  } catch (error) {
    // Handle errors
    console.error("Error fetching image:", error);
    return null;
  }
}
