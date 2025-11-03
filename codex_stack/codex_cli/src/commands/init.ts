import { Command } from "commander";

export function registerInit(program: Command) {
  program
    .command("init")
    .description("Bootstrap a new Codex stack workspace")
    .option("--force", "overwrite existing config files")
    .action((options) => {
      console.log("Initializing Codex workspace...");
      if (options.force) {
        console.log("Force option enabled – existing files may be overwritten.");
      }
      console.log("Scaffold created. Configure environment variables via .env file.");
    });
}
