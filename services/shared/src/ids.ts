import { randomUUID } from "crypto";

export function eventId() {
  return `evt_${randomUUID()}`;
}

export function isoNow() {
  return new Date().toISOString();
}
