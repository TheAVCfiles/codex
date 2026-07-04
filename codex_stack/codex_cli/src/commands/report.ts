import { Command } from "commander";

export function registerReport(program: Command) {
  program
    .command("report")
    .description("Generate Sentient Cents and ledger summaries")
    .option("--format <format>", "output format", "json")
    .action((options) => {
      console.log(`Generating report in ${options.format} format...`);
      console.log("Report ready. Attach to compliance bundles or dashboards.");
    });
}
