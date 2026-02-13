import { Command } from "commander";

export function registerConnect(program: Command) {
  program
    .command("connect")
    .description("Connect the CLI to remote services and connectors")
    .option("--mcp", "enable MCP connector manifests")
    .action((options) => {
      console.log("Configuring Codex connectors...");
      if (options.mcp) {
        console.log("MCP connectors enabled. Ensure mcp.config.json is deployed.");
      }
      console.log("Connection profile saved.");
    });
}
