import {
  EXTERNAL_TERMS,
  INTERNAL_TERMS,
  type TranslationKey,
} from "./registry";

export function translate(
  key: TranslationKey,
  mode: "internal" | "external" = "external",
) {
  if (mode === "internal") return INTERNAL_TERMS[key] || key;
  return EXTERNAL_TERMS[key] || key;
}
