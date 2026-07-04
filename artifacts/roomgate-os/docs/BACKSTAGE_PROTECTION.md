# Backstage Protection

All guest payloads must pass through `src/lib/guestAllowList.ts`.
`assertGuestPayload` throws at runtime when unapproved fields are present.
The script `scripts/banned-terms-check.mjs` scans guest-bound files for banned terms.
