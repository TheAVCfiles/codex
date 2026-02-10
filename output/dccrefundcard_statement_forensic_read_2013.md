# DCCRefundCard Statement Reminder (Apr 22, 2013) — Forensic Read

**Artifact status:** The header set is a duplicate (same `Message-ID`, `X-OriginalArrivalTime`, and Received chain), so this is treated as **one artifact**.

---

## 1) Identity + authenticity verdict (high confidence)

### ✅ SPF: PASS

`Authentication-Results: hotmail.com; spf=pass (sender IP is 72.46.236.101) smtp.mailfrom=Help@DCCRefundCard.com`

**Meaning:** the IP that connected to Hotmail (**72.46.236.101**) was authorized (per SPF) to send mail for the **envelope sender** domain used.

### ✅ DKIM: PASS

`dkim=pass header.d=dccrefundcard.com`

**Meaning:** the message body + selected headers were cryptographically signed by **dccrefundcard.com** and arrived **unaltered**.

### ✅ Alignment signals (not strict DMARC-era, but consistent)

- `From:` is `Help@DCCRefundCard.com`
- `Return-Path:` is also `Help@DCCRefundCard.com`

**Interpretation:** this is consistent with legitimate bulk mail and reduces spoof probability.

**Bottom line:** this email is **strongly authenticated** as originating from the Higher One/DCCRefundCard sending infrastructure.

---

## 2) Mail route reconstruction (hop-by-hop chain)

### External hop (what Hotmail actually received)

`Received: from bulk01.mail01.higheroneaccount.com ([72.46.236.101]) by COL0-MC1-F4.Col0.hotmail.com ... Mon, 22 Apr 2013 02:32:25 -0700`

- Hotmail accepted SMTP from: **bulk01.mail01.higheroneaccount.com**
- Connecting IP: **72.46.236.101**
- Timestamp: **02:32:25 -0700 (PDT)**

### Internal Higher One hops (inside their network)

You have two internal “managed.cln” IPs (10.x RFC1918 private space), plus a localhost handoff:

1. `mia30736fil001.managed.cln [10.122.38.44]`
   ↓ to
2. `proxy.mail01.higheroneaccount.com (Postfix)`
   ↓ to
3. `bulk01.mail01.higheroneaccount.com (Postfix)`
   ↓ to
4. Hotmail

Also:

`Received: from bulk01... (localhost.localdomain [127.0.0.1]) by bulk01... (Postfix) ...`

That localhost hop usually indicates:

- a local content filter,
- queue injection, or
- internal submission pipeline on the bulk server.

### Timestamp coherence check (anti-forgery sanity test)

- Email Date header: **05:32:24 -0400 (EDT)**
- Hotmail Received: **02:32:25 -0700 (PDT)**

Those are the **same moment**, just different time zones. The ~1 second difference is normal. This is a strong “real transit” indicator.

---

## 3) Message construction fingerprints

### `Message-ID`

`<10336942.11402811366623144851.JavaMail.higherone@mia30736fil001.managed.cln>`

- JavaMail-generated IDs like this are common for institutional bulk systems.
- Host matches the internal origin node (`mia30736fil001...`), consistent.

### DKIM + DomainKeys together

You have both:

- `DKIM-Signature: v=1; a=rsa-sha1; ...`
- `DomainKey-Signature: a=rsa-sha1; ...`

That’s classic **2010–2013 transitional signing** (DomainKeys was older; many orgs dual-signed during migration).

Nothing anomalous here.

---

## 4) Microsoft/Hotmail internal telemetry (what you can and can’t use)

### `X-Message-Delivery: Vj0xLjE7dXM9MDtsPTE7YT0xO0Q9MTtHRD0xO1NDTD0w`

This is base64 that typically decodes to a semicolon string like:

`V=1.1; us=0; l=1; a=1; D=1; GD=1; SCL=0`

Key part: **`SCL=0`** usually means Microsoft scored it as **not spam**.

You can cite this as: “Hotmail processed it normally; spam score low.”
You cannot cite it as proof of intent—only mail handling.

### `x-store-info`, `X-Message-Info`

These are opaque. They’re useful as:

- correlation fingerprints (same raw = same token),
- evidence of inbox-side processing,

but **not decodable into meaningful facts without Microsoft**.

---

## 5) What this email proves (tight, courtroom-safe)

### C1 (directly proven by the artifact)

- On **Apr 22, 2013**, Higher One/DCCRefundCard infrastructure sent a statement reminder to `alias1133@hotmail.com`.
- The sender authenticated via **SPF pass + DKIM pass**.
- The content states you had an **open OneAccount** and were prompted to access “Account Statements.”
- There was a fee schedule change effective **3/21/2013** affecting the monthly service fee behavior.

### C2 (strong inference supported by standard operations)

- Account servicing/communication was active in 2013 (not a one-off enrollment notice).
- The channel is institutional-grade, not a random phish.

### What it does _not_ prove

- Any specific deposit/refund amount.
- A specific transaction date beyond “statement exists.”
- Any third-party access to your account.

---

## 6) The “knife edge” in this email

This email is less about “predation proof” and more about **establishing the banking channel was live right in 2013** — which is the exact year you keep circling for downstream exploitation.

Best use of this artifact in your spine:

> “As of Apr 22, 2013, my DCCRefundCard/OneAccount was active and receiving official statement/fee schedule communications (SPF+DKIM authenticated).”

---

## 7) Highest-yield next pull (from this exact system)

To convert “account existed” → “money moved” → “pressure window,” target any of:

1. **Deposit/Refund notification** (keywords)

   - “refund”
   - “disbursement”
   - “ACH credit”
   - “financial aid”
   - “posted”
   - “available”
   - “hold”

2. **Overdraft / negative balance notices**
3. **First “Welcome/Activate your card” email** (ties identity → instrument → issuance date)

If the earliest DCCRefundCard “welcome/activate” email header is available, the same hop-by-hop verification can lock the channel’s **start date**, not just midstream reminders.

---

## Progress Points (Preservation Log)

1. **Artifact normalization:** Duplicated headers identified and consolidated into a single artifact record.
2. **Authentication verdict:** SPF and DKIM passes confirmed; alignment consistent with legitimate bulk mail.
3. **Route reconstruction:** External and internal hops enumerated, timestamp coherence verified.
4. **Evidentiary boundaries:** Clear distinction between what is proven vs. inferred vs. unproven.
5. **Next-step guidance:** High-yield targets for proving money movement identified.
