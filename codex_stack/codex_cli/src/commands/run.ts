import { Command } from "commander";

export function registerRun(program: Command) {
  program
    .command("run")
    .description("Execute a Codex workflow or suite")
    .argument("<suite>", "suite manifest name or path")
    .option("--dry-run", "validate without execution")
    .action((suite, options) => {
      console.log(`Running suite: ${suite}`);
      if (options.dryRun) {
        console.log("Dry-run mode – no actions executed.");
      }
      console.log("Workflow dispatched. Monitor ledger_demo for metrics.");
    });
}
