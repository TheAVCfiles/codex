# StagePort Core MVP Data Model

## Sessions

- `PK`: `TENANT#<tenantId>`
- `SK`: `SESSION#<sessionId>`
- Attributes: `status`, `sourceType`, `startedAt`, `endedAt`, `currentState`, `authorId`, `score`, `hash`

## Signals

- `PK`: `SESSION#<sessionId>`
- `SK`: `SIGNAL#<ts>`
- Attributes: `jointMap`, `latencyMs`, `morph`, `zAxis`, `confidence`

## Primitives

- `PK`: `SESSION#<sessionId>`
- `SK`: `PRIMITIVE#<seq>`
- Attributes: `primitiveName`, `params`, `baseValue`, `confidence`, `reviewStatus`

## StateTransitions

- `PK`: `SESSION#<sessionId>`
- `SK`: `STATE#<ts>`
- Attributes: `fromState`, `toState`, `reason`, `operator`

## Scores

- `PK`: `SESSION#<sessionId>`
- `SK`: `SCORE#FINAL`
- Attributes: `tes`, `pcs`, `goe`, `bv`, `total`, `rulesetVersion`

## Receipts

- `PK`: `TENANT#<tenantId>`
- `SK`: `RECEIPT#<receiptId>`
- Attributes: `sessionId`, `authorId`, `hash`, `finalizedAt`

## AuditLog

- `PK`: `SESSION#<sessionId>`
- `SK`: `AUDIT#<ts>#<eventId>`
- Attributes: `eventType`, `actor`, `payload`

## DocumentationRequests

- `PK`: `TENANT#<tenantId>`
- `SK`: `DOCREQ#<requestId>`
- Attributes: `requester`, `status`, `packageType`
