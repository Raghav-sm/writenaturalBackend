// src/config/env.ts
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  GEMINI_API_KEY: z.string().min(1, "Gemini API Key is required"),
  PORT: z.string().default("3000"),
});

export const env = envSchema.parse(process.env);
