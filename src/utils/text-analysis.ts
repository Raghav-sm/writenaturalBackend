// src/utils/text-analysis.ts

export interface TextStats {
  wordCount: number;
  charCount: number;
}

export function analyzeText(text: string): TextStats {
  const words = text.trim().split(/\s+/);
  return {
    wordCount: words.length,
    charCount: text.length,
  };
}

// Basic heuristic to detect if text is empty or nonsense (expandable)
export function isValidInput(text: string): boolean {
  return text.length > 0 && text.trim().length > 0;
}
