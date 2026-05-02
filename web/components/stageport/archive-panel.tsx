import { ArchiveEvent } from "@/lib/stageport-types";

export function ArchivePanel({ archive }: { archive: ArchiveEvent[] }) { return <div>{archive.length}</div>; }
