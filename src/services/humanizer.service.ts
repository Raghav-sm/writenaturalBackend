// src/services/humanizer.service.ts
import { ai, AI_MODEL } from "../lib/ai.js";
import { SYSTEM_INSTRUCTION,MODE_CONFIG} from "../config/prompts.js";
import type {HumanizerMode,} from "../config/prompts.js";
import { analyzeText } from "../utils/text-analysis.js";
import type { TextStats } from "../utils/text-analysis.js";
import { z } from "zod";

// Input Validation Schema
export const HumanizeRequestSchema = z.object({
  text: z.string().min(10).max(5000), 
  mode: z.enum(["Academic", "Professional", "Casual", "Creative", "Technical"]),
});

export type HumanizeRequest = z.infer<typeof HumanizeRequestSchema>;

export interface HumanizeResponse {
  original: {
    text: string;
    stats: TextStats;
  };
  result: {
    text: string;
    stats: TextStats;
  };
  mode: HumanizerMode;
  modelUsed: string;
}

export class HumanizerService {
  /**
   * The Main Pipeline
   */
  async process(request: HumanizeRequest): Promise<HumanizeResponse> {
    // 1. Validation (Zod)
    const validatedData = HumanizeRequestSchema.parse(request);

    // 2. Text Analysis (Non-LLM)
    // We calculate this upfront for usage tracking (later integration with DB)
    const originalStats = analyzeText(validatedData.text);

    // 3. Strategy Generation (Deterministic)
    // We select the prompt based on the mode. No AI decision making here.
    const modeInstruction = MODE_CONFIG[validatedData.mode];

    // 4. Constrained AI Rewrite (Gemini)
    const rawResult = await this.callGemini(
      validatedData.text,
      modeInstruction
    );

    // 5. Post-Processing & Noise Injection (Rule-based)
    // This removes common AI formatting artifacts if Gemini slips up
    const finalResult = this.cleanOutput(rawResult);

    const resultStats = analyzeText(finalResult);

    return {
      original: {
        text: validatedData.text,
        stats: originalStats,
      },
      result: {
        text: finalResult,
        stats: resultStats,
      },
      mode: validatedData.mode,
      modelUsed: AI_MODEL,
    };
  }

  /**
   * Encapsulated Gemini Interaction
   */
  private async callGemini(
    text: string,
    modeInstruction: string
  ): Promise<string> {
    try {
      // We use the models accessor from the new SDK
      const response = await ai.models.generateContent({
        model: AI_MODEL,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7, // Slightly higher temp for "human" variance
          maxOutputTokens: 8192,
        },
        contents: [
          {
            role: "user",
            parts: [
              { text: `MODE: ${modeInstruction}` },
              { text: `INPUT TEXT:\n"${text}"` },
            ],
          },
        ],
      });

      // Handle potential empty responses or blocks
      if (!response.text) {
        throw new Error(
          "AI returned empty response. Content might have triggered safety filters."
        );
      }

      return response.text;
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Failed to process text with AI provider.");
    }
  }

  /**
   * Rule-based cleanup to ensure "No AI Shimmer"
   * This is where we strictly enforce formatting rules the AI might miss.
   */
  private cleanOutput(text: string): string {
    let clean = text.trim();

    // Remove wrapping quotes if the AI added them
    if (clean.startsWith('"') && clean.endsWith('"')) {
      clean = clean.slice(1, -1);
    }

    // Remove common AI prefixes
    const prefixesToRemove = [
      "Here is the rewritten text:",
      "Here is a humanized version:",
      "Rewritten:",
      "Output:",
    ];

    for (const prefix of prefixesToRemove) {
      if (clean.toLowerCase().startsWith(prefix.toLowerCase())) {
        clean = clean.substring(prefix.length).trim();
      }
    }

    return clean;
  }
}

// Export singleton for easy use
export const humanizerService = new HumanizerService();
