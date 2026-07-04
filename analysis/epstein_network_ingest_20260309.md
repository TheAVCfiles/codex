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

### Bard deep-dive additions

```csv
ingest_id,source_ref,proposed_subject,proposed_verb,proposed_object,proposed_date,proposed_doc_id,proposed_channel,proposed_confidence
BARD-001,DOJ files + Botstein emails,Leon Botstein,SOLICITS_DONATION,Epstein (multiple visits + island trip),2011-2017,BARD_CORPUS,INSTITUTIONAL,0.95
BARD-002,2016 itinerary,Karyna Shuliak / Epstein,LANDS_HELI,Bard campus (with others),2016-07-27,BARD_TRIP,TRANSPORT,0.95
BARD-003,Black donation records,Epstein,INTRODUCES,Leon Black to Botstein ($250k result),2012,BARD_FINANCE,FINANCE,0.90
BARD-004,Botstein statement,Epstein,DONATES,Bard High School Early College ($75k + laptops),2011-2016,BARD_DONATION,INSTITUTIONAL,0.95
BARD-005,WilmerHale review,Bard College,REVIEWS,Botstein-Epstein ties,2026-02-19,BARD_REVIEW,LEGAL,0.90
```

### Black philanthropy + finance artery additions

```csv
ingest_id,source_ref,proposed_subject,proposed_verb,proposed_object,proposed_date,proposed_doc_id,proposed_channel,proposed_confidence
BLACK-PHIL-001,DOJ files + Bard records,Leon Black,DONATES,Bard arts programs ($250k via Epstein intro),2013-2014,BARD_CORPUS,INSTITUTIONAL,0.95
BLACK-PHIL-002,Black foundation records,Epstein,INTRODUCES,Leon Black to Bard/Botstein (island trip),2012,EPSTEIN_BLACK,FINANCE,0.95
BLACK-PHIL-003,Dartmouth records,Leon Black,DONATES,Black Family Visual Arts Center ($48M),2012,DARTMOUTH,INSTITUTIONAL,0.90
BLACK-PHIL-004,FFOR records,Leon & Debra Black,CO-FOUNDS,Melanoma Research Alliance + OCD research ($50M+),2007-2020,BLACK_FOUNDATION,HEALTH,0.90
BLACK-PHIL-005,Epstein foundation records,Epstein,SERVES_AS,trustee of Black Family Foundation,1997-2007,BLACK_FOUNDATION,FINANCE,0.85
BLACK-FIN-001,Dechert report + Senate Wyden,Leon Black,PAYS,Epstein $158M (tax/estate planning installments),2012-2017,BLACK_EPSTEIN_PAYMENTS,FINANCE,0.95
BLACK-FIN-002,Senate Finance Committee,Epstein,STRUCTURES,Black tax-avoidance trusts (> $1B avoided),2012-2017,BLACK_TRUSTS,TAX_PLANNING,0.90
BLACK-FIN-003,Black Foundation records,Epstein,SERVES_AS,trustee of Black Family Foundation,1997-2007,BLACK_FOUNDATION,FINANCE,0.85
BLACK-FIN-004,2026 unsealed records,Epstein,MANAGES_FINANCES,art adviser receiving $2.5M from Black,2010s,EPSTEIN_ART_ADVISER,FINANCE,0.85
BLACK-FIN-005,USVI settlement,Leon Black,SETTLES,US Virgin Islands $62.5M (Epstein claims release),2023,BLACK_USVI_SETTLEMENT,LEGAL,0.95
```

### Wyden / IRS / Treasury oversight rows

```csv
ingest_id,source_ref,proposed_subject,proposed_verb,proposed_object,proposed_date,proposed_doc_id,proposed_channel,proposed_confidence
WYDEN-001,Dechert report + Wyden 2023 letter,Leon Black,PAYS,Epstein $158–170M tax/estate planning,2012-2017,BLACK_EPSTEIN_PAYMENTS,FINANCE,0.95
WYDEN-002,Dechert + Senate review,Epstein,STRUCTURES,Black 2006 GRAT + trusts avoiding >$1B taxes,2012-2017,BLACK_TRUSTS,TAX_PLANNING,0.95
WYDEN-003,USVI settlement 2023,Epstein,FUNDS,USVI operations via Black payments,2012-2017,USVI_SETTLEMENT,FINANCE,0.95
WYDEN-004,Wyden IRS letter July 2025,IRS,FAILS_TO_AUDIT,Epstein-Black transactions,2012-2025,WYDEN_IRS,LEGAL,0.95
IRS-LAPSE-001,Wyden 31 Jul 2025 letter to IRS Comm. Long,IRS,FAILS_TO_AUDIT,Epstein-Black $158–170M + GRAT trusts,2012-2025,WYDEN_IRS_LETTER,LEGAL,0.95
IRS-LAPSE-002,Wyden letter + Black counsel memo,IRS,FAILS_TO_REVIEW,2006 GRAT & remainder trust,2012-2025,WYDEN_IRS_LETTER,LEGAL,0.95
IRS-LAPSE-003,Wyden 2025 letter,Senate Finance,DEMANDS,IRS audit/investigation records on Epstein transactions,2025,WYDEN_IRS_LETTER,LEGAL,0.95
TAX-SCHEME-001,Wyden/Dechert 2023-2025,Epstein,ENGINEERS,Black GRAT + step-up-basis avoidance (>$1B),2012-2017,BLACK_TAX_SCHEMES,TAX_PLANNING,0.95
TREASURY-FAIL-001,Wyden 2024-2026,Treasury,FAILS_TO_AUDIT,Epstein-Black $158–170M + trusts,2012-2025,WYDEN_TREASURY,LEGAL,0.95
TREASURY-FAIL-002,Wyden letters,Treasury,BLOCKS,full Produce Epstein Treasury Records Act access,2023-2026,WYDEN_TREASURY,LEGAL,0.90
```
