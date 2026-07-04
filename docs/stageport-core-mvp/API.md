# StagePort Core MVP API (Draft)

## `POST /sessions`

Create session.

### Request

```json
{
  "tenantId": "tenant_001",
  "sourceType": "upload",
  "authorId": "user_abc"
}
```

### Response

```json
{
  "sessionId": "sess_123",
  "status": "initialized",
  "currentState": "GLISSADE"
}
```

## `POST /sessions/{id}/signals`

Append signal frame (or simulated frame).

## `POST /sessions/{id}/primitives`

Create/suggest primitive.

```json
{
  "primitiveName": "PASSE",
  "params": { "side": "L" },
  "confidence": 0.87
}
```

## `POST /sessions/{id}/transitions`

Advance AURE FSM.

```json
{
  "toState": "JETE",
  "reason": "primitive_sequence_valid",
  "operator": "reviewer_001"
}
```

## `POST /sessions/{id}/score`

Run PyRouette score computation.

## `POST /sessions/{id}/review`

Reviewer decision endpoint.

```json
{
  "action": "promote",
  "target": "PRIMITIVE#12",
  "annotation": "valid turnout and axis control"
}
```

## `POST /sessions/{id}/finalize`

Mint receipt and archive session.

### Response

```json
{
  "receiptId": "rcpt_456",
  "hash": "sha256:...",
  "finalizedAt": "2026-04-09T21:38:00Z"
}
```
