export type NormalizedEvent = {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource?: string;
  metadata?: Record<string, unknown>;
  weight?: number;
};

export function normalize(input: any): NormalizedEvent {
  const now = new Date();
  return {
    id: input?.id ?? `${now.getTime()}`,
    timestamp: input?.timestamp ?? now.toISOString(),
    actor: input?.actor ?? "anonymous",
    action: input?.action ?? "event",
    resource: input?.resource,
    metadata: input?.metadata,
    weight: typeof input?.weight === "number" ? input.weight : 1,
  };
}
