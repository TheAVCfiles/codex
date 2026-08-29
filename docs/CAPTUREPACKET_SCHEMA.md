# CapturePacket canonical JSON schema (MVP)

Status: Phase 1 public specification only  
Repo: TheAVCfiles/codex  
Raw storage: PRIVATE_RUNOFF_REPO_TBD  
Writes: prohibited until separately approved

## Purpose
- Define the minimal, canonical, append-only CapturePacket schema to represent raw user source material (Runoff) and its provenance.
- All CapturePackets default to `visibility_class: "private_raw"` and `public_safe: false`. No raw Runoff may be written to codex (public) by default.

## JSON Schema (concise, draft)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "CapturePacket",
  "type": "object",
  "required": [
    "id",
    "created_at",
    "created_by",
    "source_surface",
    "raw_blob_ref",
    "checksum",
    "declared_state",
    "visibility_class",
    "public_safe"
  ],
  "properties": {
    "id": {
      "type": "string",
      "description": "UUID v4"
    },
    "created_at": {
      "type": "string",
      "format": "date-time"
    },
    "created_by": {
      "type": "string",
      "description": "github username or creator identity"
    },
    "source_surface": {
      "type": "object",
      "properties": {
        "client": {
          "type": "string",
          "examples": ["ChatUI", "DecryptPage", "MobileApp"]
        },
        "window_id": {
          "type": ["string", "null"]
        },
        "device": {
          "type": "string",
          "enum": ["mobile", "desktop", "tablet", "unknown"]
        },
        "capture_mode": {
          "type": "string",
          "enum": ["text", "voice", "screenshot", "file", "mixed"]
        }
      },
      "additionalProperties": false
    },
    "raw_blob_ref": {
      "type": "string",
      "description": "repo path or inline text: PRIVATE_RUNOFF_REPO_TBD/runoff/YYYY-MM/DD/{id}.json or attachments/{id}/file"
    },
    "raw_text_preview": {
      "type": "string"
    },
    "declared_state": {
      "type": "string",
      "enum": [
        "runoff",
        "marking",
        "wings",
        "backstage",
        "performance",
        "canon",
        "fermata",
        "cutoff"
      ],
      "default": "runoff"
    },
    "visibility_class": {
      "type": "string",
      "enum": [
        "private_raw",
        "internal_backstage",
        "public_safe_demo",
        "canonical_public",
        "legal_hold",
        "client_confidential"
      ],
      "default": "private_raw"
    },
    "public_safe": {
      "type": "boolean",
      "default": false
    },
    "public_safe_approval": {
      "type": "object",
      "properties": {
        "approved_by": {
          "type": "string"
        },
        "approved_at": {
          "type": "string",
          "format": "date-time"
        },
        "rationale": {
          "type": "string"
        }
      },
      "required": ["approved_by", "approved_at", "rationale"],
      "additionalProperties": false
    },
    "inferred_topics": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "candidate_destinations": {
      "type": "array",
      "items": {
        "type": "object"
      }
    },
    "provenance_chain": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "event_id": {
            "type": "string"
          },
          "timestamp": {
            "type": "string",
            "format": "date-time"
          },
          "actor": {
            "type": "string"
          },
          "action": {
            "type": "string"
          },
          "details": {
            "type": "string"
          },
          "evidence_refs": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "additionalProperties": false
      }
    },
    "processing_history": {
      "type": "array",
      "items": {
        "type": "object"
      }
    },
    "permissions": {
      "type": "object",
      "properties": {
        "owner": {
          "type": "string"
        },
        "viewers": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "editors": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      },
      "additionalProperties": false
    },
    "source_refs": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "checksum": {
      "type": "string",
      "description": "sha256 of raw content"
    },
    "signature": {
      "type": "string",
      "description": "optional cryptographic signature"
    }
  },
  "additionalProperties": false
}
```

## Operational rules
- Raw blob is append-only. If correction is needed, create a new CapturePacket with a provenance event linking to the superseded capture.id.
- Companion metadata may be stored (e.g., `PRIVATE_RUNOFF_REPO_TBD/metadata/{capture-id}.json`) but the raw_blob file itself must not be edited.
- Default values: `visibility_class = "private_raw"`; `public_safe = false`.

## Visibility & gating
- Only when:
  - `visibility_class` is one of `["public_safe_demo","canonical_public"]`,
  - AND `public_safe == true`,
  - AND `public_safe_approval` exists,
  - AND the human has explicitly approved the specific public write,
  may any agent write to a public repo.
- All attempted writes to public repos must be preflighted (see `STAGING_POLICY.md`).

## Example minimal CapturePacket (illustrative)
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "created_at": "2026-08-29T12:00:00Z",
  "created_by": "TheAVCfiles",
  "source_surface": {
    "client": "ChatUI",
    "device": "mobile",
    "capture_mode": "text"
  },
  "raw_blob_ref": "PRIVATE_RUNOFF_REPO_TBD/runoff/2026-08/29/123e4567.json",
  "raw_text_preview": "Holy shit, what if Stripe reconciliation worked like choreography...",
  "declared_state": "runoff",
  "visibility_class": "private_raw",
  "public_safe": false,
  "checksum": "sha256-...",
  "provenance_chain": [
    {
      "event_id": "evt-1",
      "timestamp": "2026-08-29T12:00:00Z",
      "actor": "capture-client",
      "action": "captured",
      "details": "mobile capture"
    }
  ]
}
```
