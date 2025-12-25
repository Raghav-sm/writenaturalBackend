// src/index.ts
import { humanizerService } from "./src/services/humanizer.service.js";
import { env } from "./src/config/env.js";

async function main() {
  console.log(
    `Starting Humanizer Core (Model: ${require("./lib/ai").AI_MODEL})`
  );

  const sampleRequest = {
    text: "The utilization of this methodology facilitates outcomes that are optimal for the user base. It leverages synergy to maximize KPIs.",
    mode: "Professional" as const,
  };

  try {
    console.log("Processing...");
    const result = await humanizerService.process(sampleRequest);

    console.log("\n--- ORIGINAL ---");
    console.log(result.original.text);
    console.log(`(Words: ${result.original.stats.wordCount})`);

    console.log("\n--- HUMANIZED ---");
    console.log(result.result.text);
    console.log(`(Words: ${result.result.stats.wordCount})`);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
