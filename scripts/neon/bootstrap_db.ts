import { appendFileSync, readFileSync } from "node:fs";
import { provisionNeon } from "./provisionNeon";

async function main() {
  const org = process.env.NEON_PROJECT_ID;
  if (!org) {
    throw new Error("NEON_PROJECT_ID not set");
  }

  const schemaPath = process.env.SCHEMA_PATH || "./schema.sql";
  let schemaSql: string | undefined;
  let applySchema = false;
  try {
    schemaSql = readFileSync(schemaPath, "utf8");
    applySchema = true;
  } catch (error) {
    if (process.env.REQUIRE_SCHEMA === "true") {
      throw error;
    }
  }

  const result = await provisionNeon({
    org,
    name: process.env.DB_NAME || "appdb",
    roleName: process.env.DB_ROLE || "neondb_owner",
    parentId: process.env.PARENT_BRANCH_ID || undefined,
    applySchema,
    schemaSql,
  });

  const masked = {
    direct: result.uris.direct.replace(/:(?:[^@:]+)@/, ":****@"),
    pooled: result.uris.pooled.replace(/:(?:[^@:]+)@/, ":****@"),
    psqlDsn: result.uris.psqlDsn.replace(/:(?:[^@:]+)@/, ":****@"),
  };

  console.log("URIs:", masked);
  console.log(JSON.stringify({ uris: result.uris }));

  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `uris=${JSON.stringify(result.uris)}\n`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
