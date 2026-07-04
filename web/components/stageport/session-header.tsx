import { Session } from "@/lib/stageport-types";

export function SessionHeader({ session }: { session: Session }) {
  return <div>{session.sessionId}</div>;
}
