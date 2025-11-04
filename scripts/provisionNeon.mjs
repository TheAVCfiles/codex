/**
 * Provisions a new database on Neon by:
 * 1. Creating a new branch.
 * 2. Creating the specified database on that branch.
 * 3. Returning the connection string for the new database.
 *
 * The calling script (e.g., bootstrap_db.js) is responsible for
 * connecting and running the schema.
 */
export async function provisionNeon({ org, name, schemaSql }) {
  const apiKey = process.env.NEON_API_KEY;
  if (!apiKey) {
    throw new Error('NEON_API_KEY not set in environment');
  }

  const API_BASE = 'https://console.neon.tech/api/v2';
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  // 1. Create a new branch
  // We'll name the branch based on the database name for clarity.
  const branchName = `branch_for_${name.replace(/[^a-zA-Z0-9_]/g, '_')}`;
  console.log(`Provisioning Neon branch '${branchName}' for project ${org}...`);

  let branchData;
  try {
    const createBranchUrl = `${API_BASE}/projects/${org}/branches`;
    const branchBody = {
      branch: {
        name: branchName,
      },
    };

    const branchRes = await fetch(createBranchUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(branchBody),
    });

    if (!branchRes.ok) {
      const errorText = await branchRes.text();
      throw new Error(`Neon branch creation failed (${branchRes.status}): ${errorText}`);
    }
    branchData = await branchRes.json();
    console.log(`Branch '${branchData.branch.id}' created successfully.`);
  } catch (error) {
    console.error('Error in branch creation step:', error instanceof Error ? error.message : error);
    throw error;
  }

  const branchId = branchData?.branch?.id;
  if (!branchId) {
    throw new Error('Neon branch creation response missing branch identifier');
  }

  const baseConnectionUri =
    branchData?.connection_uri ||
    branchData?.connection_uris?.[0]?.connection_uri ||
    branchData?.branch?.connection_uri ||
    branchData?.branch?.connection_uris?.[0]?.connection_uri;

  if (!baseConnectionUri) {
    throw new Error('Unable to determine Neon branch connection URI');
  }

  // 2. Create the new database on that branch
  console.log(`Creating database '${name}' on branch '${branchId}'...`);
  try {
    const createDbUrl = `${API_BASE}/projects/${org}/branches/${branchId}/databases`;
    const dbBody = {
      database: {
        name,
      },
    };

    const dbRes = await fetch(createDbUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(dbBody),
    });

    if (!dbRes.ok) {
      const errorText = await dbRes.text();
      // If DB creation fails, we should ideally roll back by deleting the branch
      // For now, just log and throw.
      console.error(`Failed to create database '${name}'. Rolling back branch not yet implemented.`);
      throw new Error(`Neon database creation failed (${dbRes.status}): ${errorText}`);
    }
    await dbRes.json();
    console.log(`Database '${name}' created successfully.`);
  } catch (error) {
    console.error('Error in database creation step:', error instanceof Error ? error.message : error);
    throw error;
  }

  // 3. Construct and return the new database URL
  // The baseConnectionUri is for the default 'postgres' db.
  // We replace the path with our new database name.
  const dbUrl = new URL(baseConnectionUri);
  dbUrl.pathname = `/${name}`;
  const databaseUrl = dbUrl.toString();

  console.log(
    `Provisioning complete. Database URL: ${databaseUrl.replace(/:[^@:]+@/, ':****@')}`
  );

  // The schemaSql is NOT used here; the bootstrapper script handles it.
  return { databaseUrl };
}
