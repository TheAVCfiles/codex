import { Command } from "commander";
import { registerInit } from "./commands/init.js";
import { registerConnect } from "./commands/connect.js";
import { registerRun } from "./commands/run.js";
import { registerReport } from "./commands/report.js";

const program = new Command();
program
  .name("codex")
  .description("Codex developer operations toolkit")
  .version("0.1.0");

registerInit(program);
registerConnect(program);
registerRun(program);
registerReport(program);

program.parseAsync(process.argv).catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
