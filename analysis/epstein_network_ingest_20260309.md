# Master Forensic Ledger Synthesis — 2026-03-09

Source workbook: `zero_loss_synthesis_master_20260309_CENTRALIZED.xlsx`

## Network snapshot

- Approximate graph state: **142 nodes / 327 edges**.
- Stable macro corridors: finance, operations, transport, arts/talent, analytics, legal/intake.
- Core administrative triangle repeatedly observed in threads and logistics:
  - Jeffrey Epstein (principal command hub)
  - Lesley Groff (executive assistant / scheduler / operations execution)
  - Darren Indyke (lawyer / trusts / legal manager)
  - Richard Kahn (CFO / financial manager)

## High-signal corridors and nodes

### Aviation / transport corridor

- Larry Visoski: pilot and transport coordinator.
- Associated Aircraft Group (AAG): corporate helicopter membrane (Wappingers Falls, NY).
- Helicopter tail number: `N7660S`.
- Example itinerary (2014-07-30): East 34th Street Heliport (NYC) ↔ Middletown, RI; passengers include Epstein and Karyna Shuliak.
- Additional route pattern: West Side Heliport ↔ Southampton Beach with ~$12,640 charter cost signal.

### Physical / financial hubs

- 457 Madison Avenue, NYC: J. Epstein & Co. Inc. HQ and recurring invoice/delivery node.
- 358 El Brillo Way, Palm Beach: residence and logistics node.
- Zorro Ranch, Stanley NM: remote property shipping node.
- Banking interfaces observed: American Express remittance, U.S. Bancorp Piper Jaffray, FirstBank Puerto Rico, Deutsche Bank wealth CRM.

### Communications switchboard

- `jeevacation@gmail.com` appears as a cross-channel router with elevated non-principal centrality.
- Cross-domain observations:
  - 2008 UN Goodwill Ambassador list routing.
  - 2010 flight-training coordination.
  - 2013 Gershenfeld–Hopmeier–Epstein analytics thread footer.
  - 2014 violinist vetting chain (Mark L. Epstein + Frank Salomon + Juilliard).
  - 2016 Bard bond downgrade monitoring.

### Arts / talent corridor

- Juilliard as monitored institutional node (including $60M gift chatter).
- Interlochen Center for the Arts appears in subpoena-related context.
- European training nodes: Paris / Lyon conservatories and Geneva Pilates school.
- Proxy-vetting examples include:
  - 2014 young violinist vetting thread.
  - 2009-06-21 dancer scholarship request for 1500 CHF support.
- Operational indicator: Lesley Groff executes Maison du Chocolat delivery to a Juilliard student (2015).

### Analytics corridor

- Neil Gershenfeld (MIT), Michael Hopmeier, Jeff Jonas (IBM Fellow) appear in identity/entity-resolution discussion chain (2013).

### Legal/intake corridor

- Hotline triage worksheet signals include SDNY/FBI referral logic and tags such as "JE residence", "Palm Beach", "Paris", "Bar Stern", and "no useful info".
- SDNY appears as a late-phase narrative rerouting node (2019 activation window).

## Edge weighting model

- Financial transfer = 4
- Travel coordination = 3
- Legal/intake routing = 3
- Institutional link = 2
- Operations/errand = 2
- Email mention = 1

Regulatory-friction overlay:

- Finance/transport = high (3)
- Legal/institutional = medium (2)
- Operations/analytics = low (1)

## Temporal activation pulses

- 1999–2005: finance/property infrastructure.
- 2008: social-shield communications activation.
- 2009: arts dependency request signal.
- 2010: transport + finance synchronization.
- 2013: analytics + Juilliard monitoring.
- 2014: proxy vetting + helicopter RI trip.
- 2015: operational errand layer.
- 2019: SDNY/hotline legal pressure layer.

## Connectivity map updates (post-EFTA00366339 ingest)

Key additions:

- Andrew Farkas included as personal-transport bridge node with USVI-marina overlap.
- AAG staff membrane surfaced (Misty Ferguson, John Cardenas, Gregory Ogunsanya, Michael Landry).
- Hyperion Air included as institutional/personal transport wrapper.

Representative new edges:

- Lesley Groff → FORWARDS → charter confirmation to `jeevacation@gmail.com`.
- Larry Visoski → COORDINATES → AAG S76 charter (~$12,640).
- Andrew Farkas → PROVIDES_HELI → Epstein (personal Sikorsky substitution).
- Misty Ferguson → REQUESTS → passenger names.
- John Cardenas → CONFIRMS → booking and quote.
- Hyperion Air → PAYS → helicopter/fleet invoices.

## Ready-to-ingest CSV blocks

### ARTS ingest

```csv
ingest_id,source_ref,proposed_subject,proposed_verb,proposed_object,proposed_date,proposed_doc_id,proposed_channel,proposed_confidence
ING-ARTS-001,EFTA00981774,jeevacation@gmail.com,COORDINATES,violinist vetting via Mark L. Epstein + Frank Salomon,2014,EFTA00981774,ARTS,0.95
ING-ARTS-002,EFTA02081239,Lesley Groff,EXECUTES_DELIVERY,Maison du Chocolat to Juilliard student,2015,EFTA02081239,OPERATIONS,0.95
ING-ARTS-003,EFTA00972404,jeevacation@gmail.com,MONITORS,$60M Juilliard gift announcement,2013,EFTA00972404,INSTITUTIONAL,0.90
ING-ARTS-004,2009-06-21 email,young European dancer,REQUESTS_FUNDS,jeevacation@gmail.com (1500 CHF Lyon/Geneva),2009-06-21,ARTS_EMAIL,ARTS,0.95
```

### EURO ingest

```csv
ingest_id,source_ref,proposed_subject,proposed_verb,proposed_object,proposed_date,proposed_doc_id,proposed_channel,proposed_confidence
EURO-001,2009-06-21 email,Young Lithuanian Dancer,REQUESTS_FUNDS,jeevacation@gmail.com (1500 CHF Lyon Conservatory),2009-06-21,EURO_DANCER_EMAIL,ARTS,0.95
EURO-002,2009-06-21 email,jeevacation@gmail.com,ROUTES_TO,Lyon Conservatory scholarship,2009-06-21,EURO_DANCER_EMAIL,ARTS,0.90
EURO-003,2009-06-21 email,Young Lithuanian Dancer,SEEKS_CERTIFICATION,Geneva Pilates School,2009-06-21,EURO_DANCER_EMAIL,ARTS,0.90
EURO-004,2009-06-21 email,Young Lithuanian Dancer,DISCUSSES_TOURING,Paris Dance Institutions + prima ballerina,2009-06-21,EURO_DANCER_EMAIL,ARTS,0.85
EURO-005,2009-06-21 email,Young Lithuanian Dancer,REFERENCES,Dana (intermediary),2009-06-21,EURO_DANCER_EMAIL,ARTS,0.75
EURO-006,2009-06-21 email,jeevacation@gmail.com,PROVIDES_PATRON_SUPPORT,European mobility corridor,2009-06-21,EURO_DANCER_EMAIL,ARTS,0.90
```

### DANA tentative (I-lane)

```csv
ingest_id,source_ref,proposed_subject,proposed_verb,proposed_object,proposed_date,proposed_doc_id,proposed_channel,proposed_confidence,lane,notes
DANA-001,2009-06-21 email,Young Lithuanian Dancer,REFERENCES,Dana (intermediary),2009-06-21,EURO_DANCER_EMAIL,ARTS,0.35,I,Single-name drop only; possible family/business contact
DANA-002,2009-06-21 email,Dana,POSSIBLE_INTERMEDIARY_TO,jeevacation@gmail.com,2009-06-21,EURO_DANCER_EMAIL,ARTS,0.35,I,Latent routing node — flag for future docs
DANA-003,2009-06-21 email,Dana,POSSIBLE_LINK_TO,European mobility corridor (Lyon/Geneva/Paris),2009-06-21,EURO_DANCER_EMAIL,ARTS,0.30,I,Weak signal; monitor for last-name confirmation
```

### Transport / charter ingest

```csv
ingest_id,source_ref,proposed_subject,proposed_verb,proposed_object,proposed_date,proposed_doc_id,proposed_channel,proposed_confidence,Why It Matters
INT-CHARTER-001,EFTA00366339,Lesley Groff,FORWARDS,Epstein charter confirmation to jeevacation@gmail.com,2014-07-24,EFTA00366339,TRANSPORT,0.95,Admin triangle routing confirmed
INT-CHARTER-002,EFTA00366339,Larry Visoski,COORDINATES,AAG charter (payment $12,640),2014-07-24,EFTA00366339,TRANSPORT,0.95,Visoski as transport coordinator
INT-CHARTER-003,EFTA00366339,Andrew Farkas,PROVIDES_HELI,alternative helicopter for Epstein,2014-07-24,EFTA00366339,TRANSPORT,0.95,New personal asset intermediary
INT-CHARTER-004,EFTA00366339,Misty Ferguson,REQUESTS,passenger names from AAG,2014-07-24,EFTA00366339,TRANSPORT,0.90,Corporate ops membrane
INT-CHARTER-005,EFTA00366339,John Cardenas,CONFIRMS,booking & quote for West Side NYC → Southampton,2014-07-24,EFTA00366339,TRANSPORT,0.90,Corporate ops membrane
```

### Hyperion / Dutchess additions

```csv
ingest_id,source_ref,proposed_subject,proposed_verb,proposed_object,proposed_date,proposed_doc_id,proposed_channel,proposed_confidence
HYPERION-001,EFTA00366339 + Farkas invoices,Hyperion Air,PAYS,Farkas helicopter + Epstein fleet ops,2014-2016,TRANSPORT,0.95
AAG-STAFF-001,EFTA00366339,Misty Ferguson / John Cardenas,OPERATES,AAG corporate charter membrane,2014-07-24,EFTA00366339,TRANSPORT,0.90
DUTCHESS-001,EFTA00366339 + Bard manifests,AAG / Hyperion Air,BASES_AT,Dutchess County Airport Wappingers Falls,2014,EFTA00366339,TRANSPORT,0.95
FARKAS-002,public + invoices,Andrew Farkas,PROVIDES_HELI + MARINA,Epstein (Hamptons / USVI),2014-2016,TRANSPORT,0.90
```

## Connectivity map updates (Wyden probe / IRS-DEA oversight ingest)

Key additions:

- Added a legal/oversight corridor around IRS non-audit findings from the 2025 Wyden letter.
- Added DEA/OCDETF "Chain Reaction" investigation timeline and records-demand edge.
- Reinforced finance → tax-planning pathway via Black $158–170M payments and trust-structure claims.
- Reinforced finance → philanthropy overlap via Epstein's trustee role in the Black Family Foundation.

Representative new edges (observable verbs):

- IRS → FAILS_TO_AUDIT → Epstein-Black payments + trust structures.
- IRS → FAILS_TO_REVIEW → 2006 GRAT and remainder trusts.
- Senate Finance (Wyden) → DEMANDS → IRS audit/investigation records.
- Leon Black → PAYS → Epstein $158–170M (2012–2017).
- Epstein → STRUCTURES → Black tax-avoidance trusts.
- DEA/OCDETF → INVESTIGATES → Epstein + 14 co-conspirators ("Chain Reaction").
- Wyden Senate Finance → DEMANDS → unredacted DEA memo and co-conspirator details.

### Wyden / IRS / Black / DEA additions

```csv
ingest_id,source_ref,proposed_subject,proposed_verb,proposed_object,proposed_date,proposed_doc_id,proposed_channel,proposed_confidence
WYDEN-IRS-001,Wyden 31 Jul 2025 letter to IRS Comm. Long,IRS,FAILS_TO_AUDIT,Epstein-Black $158–170M payments + GRAT trusts,2012–2025,WYDEN_IRS_LETTER_2025,LEGAL,0.95
WYDEN-IRS-002,Wyden 2025 letter + Black counsel memo,IRS,FAILS_TO_REVIEW,2006 GRAT & remainder trusts,2012–2025,WYDEN_IRS_LETTER_2025,LEGAL,0.95
WYDEN-IRS-003,Wyden 31 Jul 2025 letter,Senate Finance,DEMANDS,IRS audit/investigation records on Epstein-Black transactions,2025,WYDEN_IRS_LETTER_2025,LEGAL,0.95
BLACK-FIN-001,Dechert report + Wyden letters 2023–2026,Leon Black,PAYS,Epstein $158–170M tax/estate planning installments,2012–2017,BLACK_EPSTEIN_PAYMENTS,FINANCE,0.95
BLACK-STRUCT-001,Wyden 2025 letter + Dechert report,Epstein,STRUCTURES,Black tax-avoidance trusts (>$1B avoided),2012–2017,BLACK_TRUSTS,TAX_PLANNING,0.90
BLACK-FOUND-001,Black Foundation records,Epstein,SERVES_AS,trustee of Debra & Leon Black Family Foundation,1997–2007,BLACK_FOUNDATION,FINANCE,0.85
DEA-CHAIN-001,2015 OCDETF memo (EFTA00173953),DEA / OCDETF,INVESTIGATES,Epstein + 14 co-conspirators ("Chain Reaction" – illicit wires),2010–2015,DEA_CHAIN_MEMO,LEGAL,0.95
DEA-CHAIN-002,2015 OCDETF memo,DEA / OCDETF,COMPILES,Suspicious wire transfers tied to drug/prostitution (USVI/NYC),2010-2015,DEA_CHAIN_MEMO,LEGAL,0.90
WYDEN-DEA-001,Wyden letter 25 Feb 2026 to DEA Admin Cole,Wyden Senate Finance,DEMANDS,unredacted "Chain Reaction" memo + co-conspirator names,2026-02-25,WYDEN_DEA_LETTER,LEGAL,0.95
OCDETF-SHUT-001,Bloomberg/Reuters 2025 reports + Wyden letters,Trump DOJ,SHUTS_DOWN,OCDETF program (FY2026 budget zeroed out),2025,OCDETF_SHUTDOWN,LEGAL,0.90
```

### Deutsche Bank finance-corridor additions

```csv
ingest_id,source_ref,proposed_subject,proposed_verb,proposed_object,proposed_date,proposed_doc_id,proposed_channel,proposed_confidence
DB-001,EFTA01471309 + valuation files,Deutsche Bank,VALUES,Southern Financial LLC portfolio ~$97M,2014-2017,DB_VALUATION,FINANCE,0.95
DB-002,EFTA01471309,Paul Morris / Vahe Stepanian / Amanda Kirby,MANAGE_CLIENT,Jeffrey Epstein accounts,2014,DB_CLIENT_TEAM,FINANCE,0.90
DB-003,EFTA01471309,Harry Beller,WORKS_ON,JE accounts in some capacity,2014,DB_CLIENT_TEAM,FINANCE,0.80
DB-004,DBforce memo,Deutsche Bank,RESEARCHES,Epstein as Oracle lead,2013,DB_NETX360,FINANCE,0.85
DB-EPSTEIN-001,Wyden probe + NYDFS 2020,Deutsche Bank,PROCESSES,Millions in suspicious Epstein transactions (cash/recruiter payments),2013-2018,DB_EPSTEIN_ACCOUNTS,FINANCE,0.95
DB-EPSTEIN-002,Reuters 2026 files,Deutsche Bank,CONTINUES_SERVICES,Epstein after 2018 termination notice,2018-2019,DB_SLOW_SPLIT,FINANCE,0.90
DB-EPSTEIN-003,2023 settlement,Deutsche Bank,SETTLES,Epstein victims $75M + NYDFS $150M fine,2020-2023,DB_SETTLEMENTS,LEGAL,0.95
DB-EPSTEIN-004,Wyden 2025–2026 probe,Paul Morris,PITCHES,Epstein to Deutsche post-JPMorgan,2013,DB_ONBOARDING,FINANCE,0.85
```
