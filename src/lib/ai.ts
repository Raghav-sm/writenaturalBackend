// src/lib/ai.ts
import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.js";

// Singleton instance of the Gen AI client
export const ai = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});

// We use Gemini 3 Flash Preview as the workhorse for text transformation
export const AI_MODEL = "gemini-3-flash-preview";
