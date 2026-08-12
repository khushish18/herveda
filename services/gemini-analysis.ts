import { GoogleGenAI } from "@google/genai";

import { GEMINI_API_KEY, GEMINI_MODEL } from "@/config/gemini";

/**
 * Interface representing the structure of the chat response.
 * (Meal analysis types have been migrated to services/api.ts)
 */

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
