import { promises as fs } from "node:fs";
import path from "node:path";

const FITS_DIR = path.join(process.cwd(), "fits");

export default async function handler(req, res) {
  if (req.method && req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const rawName = Array.isArray(req.query?.name)
    ? req.query.name[0]
    : req.query?.name;
  const slug = rawName?.toString().trim().toLowerCase();

  if (!slug) {
    return res.status(400).json({ error: "missing_fit_name" });
  }

  const targetPath = path.join(FITS_DIR, `${slug}.json`);

  try {
    const raw = await fs.readFile(targetPath, "utf-8");
    const data = JSON.parse(raw);
    return res.status(200).json(data);
  } catch (error) {
    if ("code" in error && error.code === "ENOENT") {
      return res.status(404).json({ error: "fit_not_found" });
    }

    console.error(`Failed to load fit ${slug}`, error);
    return res.status(500).json({ error: "failed_to_load_fit" });
  }
}
