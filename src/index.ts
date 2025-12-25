import { AI_MODEL } from "./lib/ai.js";
import { humanizerService } from "./services/humanizer.service.js";

async function main() {
  console.log(`Starting Humanizer Core (Model: ${AI_MODEL})`);

const sampleRequest = {
  text: `
Fig. 1.
To sustain optimal ZVS/ZVDS switching behaviour and enable consistent power transfer through 3–6 GHz band, the proposed methodology combines broadband tunable matching networks that lead to monitor bias control loops as well as harmonic suppression filters. This flexibility is critical for nextgeneration 5G/B5G base stations, where compact,energy-efficient, and thermally stable PA solutions are required to ensure constant high-capacity transmission [10]. To overcome efficiencybandwidth trade-offs, this research paper presented several advanced PA architectures. For example,improved back-off efficiency through active load modulation has been provided by the Doherty Power Amplifier (DPA), However, it becomes unsuitable for complex impedance networks and exhibits poor
linearity in wide bandwidths.
  `,
  mode: "Academic" as const,
};

  try {
    console.log("Processing...");
    const result = await humanizerService.process(sampleRequest);

    console.log("\n--- ORIGINAL ---");
    console.log(result.original.text);
    console.log(`(Words: ${result.original.stats.wordCount})`);

    console.log("\n--- WriteNatural. ---");
    console.log(result.result.text);
    console.log(`(Words: ${result.result.stats.wordCount})`);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
