import { createHash } from "crypto";

export function sha256(payload: unknown) {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}
