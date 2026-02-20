export async function hashEntry(entry) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(JSON.stringify(entry));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
