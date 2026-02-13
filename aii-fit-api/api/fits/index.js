import { promises as fs } from "node:fs";
import path from "node:path";

const FITS_DIR = path.join(process.cwd(), "fits");

export default async function handler(req, res) {
  if (req.method && req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  try {
    const files = (await fs.readdir(FITS_DIR)).filter((file) =>
      file.endsWith(".json"),
    );
    const fits = await Promise.all(
      files.map(async (file) => {
        const raw = await fs.readFile(path.join(FITS_DIR, file), "utf-8");
        const data = JSON.parse(raw);
        return {
          slug: file.replace(/\.json$/, ""),
          name: data.name,
          version: data.version,
        };
      }),
    );

    fits.sort((a, b) => a.slug.localeCompare(b.slug));

    return res.status(200).json({ fits });
  } catch (error) {
    console.error("Failed to list fits", error);
    return res.status(500).json({ error: "failed_to_list_fits" });
  }
}
