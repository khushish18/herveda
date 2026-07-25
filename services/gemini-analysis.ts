import { GoogleGenAI } from "@google/genai";
import * as FileSystem from "expo-file-system/legacy";

import { GEMINI_API_KEY, GEMINI_MODEL } from "@/config/gemini";

export interface GeminiAnalysisResult {
  meal_name: string;
  confidence: number;
  foods: string[];
  estimated_calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  iron: "Low" | "Moderate" | "High";
  calcium: "Low" | "Moderate" | "High";
  vitamin_d: "Low" | "Moderate" | "High";
  folate: "Low" | "Moderate" | "High";
  health_score: number;
  ai_insights: string[];
}

const PROMPT = `You are a certified nutrition expert.

Analyze the uploaded meal image.

Return ONLY valid JSON.

Schema:
{
  "meal_name":"",
  "confidence":0,
  "foods":[],
  "estimated_calories":0,
  "protein_g":0,
  "carbs_g":0,
  "fat_g":0,
  "fiber_g":0,
  "iron":"Low|Moderate|High",
  "calcium":"Low|Moderate|High",
  "vitamin_d":"Low|Moderate|High",
  "folate":"Low|Moderate|High",
  "health_score":0,
  "ai_insights":[
      ""
  ]
}

Do not include markdown.
Do not include explanations.
Return JSON only.`;

const getMimeType = (imageUri: string) => {
  return imageUri.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";
};

export async function getNutritionChatReply(
  userMessage: string,
  profileContext: string,
): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("Missing Gemini API key.");
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const prompt = `You are HerVeda's nutrition and women's health assistant.
Use the user's profile context below to personalize the advice.
Answer only nutrition and women's health questions.
If the question is unrelated, say that you can help with nutrition and women's health topics only.
Keep the response concise, practical, warm, and relevant to Indian food habits when appropriate.

User profile context:
${profileContext}

User question:
${userMessage}`;

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  return (
    response.text?.trim() ||
    "I can help with nutrition and women's health topics only."
  );
}

export async function analyzeMealImage(
  imageUri: string,
): Promise<GeminiAnalysisResult> {
  if (!GEMINI_API_KEY) {
    throw new Error("Missing Gemini API key.");
  }
  console.log("Gemini Key Loaded:", !!GEMINI_API_KEY);
  console.log("Image URI:", imageUri);
  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const base64 = await FileSystem.readAsStringAsync(imageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  let response;

  try {
    response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          role: "user",
          parts: [
            { text: PROMPT },
            {
              inlineData: {
                mimeType: getMimeType(imageUri),
                data: base64,
              },
            },
          ],
        },
      ],
    });

    console.log("Gemini Response:", response);
    console.log("Gemini Text:", response.text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }

  const text = response.text ?? "";
  const cleaned = text.replace(/```json|```/g, "").trim();

  try {
    const parsed = JSON.parse(cleaned) as GeminiAnalysisResult;
    return parsed;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Invalid JSON returned by Gemini.";
    throw new Error(`Gemini returned invalid JSON: ${message}`);
  }
}
