# MoveMint MVP Wiring (Ritual → Receipt)

This guide implements the minimal loop:

1. QR entry captures identity/session context.
2. Instructor logs TES/Axis/Sequence scores in parser UI.
3. Commit posts to `/api/movemint/events`.
4. API writes immutable ledger row using `forensic_hash` uniqueness.
5. Dashboard renders coherence trend + fracture spikes.

## 1) Prisma model

Add this to `prisma/schema.prisma` in the Next.js app that owns the ledger DB:

```prisma
model MoveMintEvent {
  id             String   @id @default(cuid())
  student_id     String
  routine_id     String
  tes            Float
  axis_stability Float
  sequence_count Float
  forensic_hash  String   @unique
  timestamp      DateTime @default(now())

  @@index([student_id, timestamp])
  @@index([routine_id, timestamp])
}
```

Then run:

```bash
npx prisma migrate dev --name movemint_event
npx prisma generate
```

## 2) API route: hardened event mint endpoint

Create `pages/api/movemint/events.ts`:

```ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const {
      student_id,
      routine_id = "PILOT_V1",
      tes,
      axis_stability,
      sequence_count,
      forensic_hash,
      timestamp,
    } = req.body ?? {};

    if (!student_id || !forensic_hash) {
      return res
        .status(400)
        .json({ ok: false, error: "student_id and forensic_hash required" });
    }

    const toFloat = (n: unknown) => {
      const parsed = typeof n === "string" ? parseFloat(n) : n;
      return Number.isFinite(parsed as number) ? (parsed as number) : null;
    };

    const tesF = toFloat(tes);
    const axisF = toFloat(axis_stability);
    const seqF = toFloat(sequence_count);

    if (tesF === null || axisF === null || seqF === null) {
      return res.status(400).json({
        ok: false,
        error: "tes / axis_stability / sequence_count must be numbers",
      });
    }

    const event = await prisma.moveMintEvent.create({
      data: {
        student_id,
        routine_id,
        tes: tesF,
        axis_stability: axisF,
        sequence_count: seqF,
        forensic_hash,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
      },
    });

    return res.status(200).json({ ok: true, artifactId: event.id });
  } catch (err: any) {
    if (String(err?.code) === "P2002") {
      return res.status(200).json({ ok: true, duplicate: true });
    }

    console.error(err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
```

## 3) Axis Parser commit call

If parser is served by Next.js:

```ts
async function commitToLedger(item: {
  studentId: string;
  routineId?: string;
  hash: string;
  data: { tes: number; axis_stability: number; sequence_count: number };
}) {
  const payload = {
    student_id: item.studentId,
    routine_id: item.routineId || "PILOT_V1",
    tes: item.data.tes,
    axis_stability: item.data.axis_stability,
    sequence_count: item.data.sequence_count,
    forensic_hash: item.hash,
    timestamp: new Date().toISOString(),
  };

  const response = await fetch("/api/movemint/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const out = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error((out as { error?: string }).error || "Commit failed");

  return out;
}
```

If parser is hosted separately (iPad hitting laptop dev server):

```ts
const API_BASE = "http://YOUR-LAPTOP-IP:3000";
await fetch(`${API_BASE}/api/movemint/events`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
```

## 4) Stable forensic hash input

Hash only receipt-safe values:

```text
student_id|routine_id|tes|axis_stability|sequence_count|YYYY-MM-DD|instructor_id(optional)
```

WebCrypto helper (Safari/iPad compatible):

```ts
async function sha256Hex(str: string): Promise<string> {
  const enc = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
```

## 5) Dashboard primitives

- **Coherence line** = rolling average of `(tes + axis_stability + sequence_count) / 3`.
- **Fracture spikes** = points where `axis_stability < 0.7`.

This allows visual progress tracking without biometric media.

## 6) Launch sequence

1. Run migration and regenerate Prisma client.
2. Add API route.
3. Wire parser commit button to `commitToLedger`.
4. Print QR card(s) and run one live session.
5. Mint at least 5 receipts.
6. Verify dashboard line movement.
