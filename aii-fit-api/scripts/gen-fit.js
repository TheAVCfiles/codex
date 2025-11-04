#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";

const [fitName = "New Fit"] = process.argv.slice(2);
const slug =
  fitName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "fit";

const fit = {
  name: fitName,
  version: "1.0.0",
  style: "describe the visual thesis",
  tone: "describe the voice",
  color_palette: ["white", "black"],
  motion_logic: "describe motion logic",
  prompt_additions: [
    "Describe how this persona should respond…",
    "Include a behavioural safeguard or guiding question.",
  ],
  metadata: {
    author: "Decrypt the Future",
    license: "Creator-owned; licensed on purchase",
    created: new Date().toISOString().slice(0, 10),
  },
};

const outputPath = path.join(process.cwd(), "fits", `${slug}.json`);
await fs.writeFile(outputPath, JSON.stringify(fit, null, 2));
console.log(`Created ${outputPath}`);
