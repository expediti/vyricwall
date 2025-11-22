import { GoogleGenAI } from "@google/genai";

// Initialize API client
// NOTE: process.env.API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateWallpaperImage = async (
  prompt: string, 
  category: string,
  aspectRatio: string = "3:4"
): Promise<{ success: boolean; imageBase64?: string; error?: string }> => {
  try {
    // Construct a descriptive prompt for high-quality wallpaper
    const enhancedPrompt = `
      Create a stunning, high-resolution 4k digital wallpaper.
      Subject: ${prompt}
      Style: Minimalist, Cinematic, Vibrant colors, sharp details, no text.
      Category Context: ${category}
      
      The image should be suitable for a wallpaper, visually balanced and aesthetically pleasing.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: enhancedPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio, 
        }
      }
    });

    // Extract image data from parts
    if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                return { success: true, imageBase64: part.inlineData.data };
            }
        }
    }

    return { success: false, error: "No image data received." };

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return { success: false, error: error.message || "Failed to generate image." };
  }
};