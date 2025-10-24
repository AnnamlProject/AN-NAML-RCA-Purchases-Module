
import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available in the environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });

/**
 * Generates a project plan using the Gemini API.
 * @param fullPrompt The complete prompt including the template and guidelines.
 * @returns The generated plan as a string.
 */
export const generatePlan = async (fullPrompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: fullPrompt,
      config: {
        thinkingConfig: {
          thinkingBudget: 32768,
        },
      },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating content from Gemini API:", error);
    throw new Error("Failed to communicate with the Gemini API.");
  }
};
