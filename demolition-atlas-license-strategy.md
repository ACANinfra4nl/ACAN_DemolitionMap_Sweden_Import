# Demolition Atlas — License & Governance Strategy
*ACAN Netherlands · March 2026*

---

## Data governance architecture

```
┌─────────────────────────────────────────────────────────────────┐
│              Demolition Atlas — data governance overview        │
│                                                                  │
│  ┌─────────────────────────┐   ┌──────────────────────────────┐ │
│  │  Private / protected    │   │  Public database layer       │ │
│  │  layer                  │   │                              │ │
│  │  GDPR — not licensed,   │   │  ODbL 1.0 — open, copyleft  │ │
│  │  not published          │   │                              │ │
│  │                         │   │  • Address, coordinates      │ │
│  │  • Submitter email      │   │  • Demolition status &       │ │
│  │  • Submitter name /     │   │    description               │ │
│  │    contact              │   │  • Entry metadata            │ │
│  │  • Reviewer notes w/    │   │    (date, category)          │ │
│  │    personal data        │   │                              │ │
│  └─────────────────────────┘   └──────────────────────────────┘ │
│                    ↑ strict separation ↑                         │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │          Content layer (photos & documents)              │   │
│  │          Licensed separately per content type            │   │
│  │                                                          │   │
│  │  ┌────────────────┐ ┌────────────────┐ ┌─────────────┐  │   │
│  │  │ Submitter      │ │ Linked /       │ │ Official    │  │   │
│  │  │ photos         │ │ scraped        │ │ docs        │  │   │
│  │  │ CC BY-SA 4.0   │ │ Original lic.  │ │ Public dom. │  │   │
│  │  │                │ │ applies        │ │ / src. lic. │  │   │
│  │  └────────────────┘ └────────────────┘ └─────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │    GDPR obligations (Netherlands — Autoriteit            │   │
│  │    Persoonsgegevens)                                     │   │
│  │    Apply regardless of chosen license — run in parallel  │   │
│  │                                                          │   │
│  │  • Publish a privacy notice explaining what personal     │   │
│  │    data is collected and why                             │   │
│  │  • Define retention period for submitter emails —        │   │
│  │    delete when no longer needed                          │   │
│  │  • Appoint a contact point (data controller) —           │   │
│  │    becomes mandatory once ACAN is formalised             │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## The core challenge: two data layers, two different needs

The Demolition Atlas involves two distinct IP layers that require separate licensing treatment:

1. **The database** — the structured collection of entries (addresses, descriptions, status, metadata). This is the "atlas" as a whole.
2. **The content** — photos submitted by users, linked images, documents. These carry their own independent copyright.

These require different licenses because they are different types of intellectual property.

---

## Recommended license stack

### For the database: ODbL 1.0

**ODbL (Open Database License)** is a copyleft license that allows users to freely use the data, edit existing data, and add new data — but if someone publicly uses an adapted version of the database, they must also offer that adapted database under the ODbL. This prevents a private interest from taking demolition records, enriching them, and locking the result away.

This is the same license used by **OpenStreetMap** — a near-perfect precedent: OSM moved from a Creative Commons license to ODbL specifically to have more legal security and a more specific license for databases rather than creative works.

**Why not CC BY-SA?** Creative Commons themselves recommend against using their licenses (other than CC0) for data and databases — they were designed for creative content, not structured datasets. ODbL is specifically built for database rights and may create contractual obligations even in jurisdictions where database rights would not otherwise exist, which matters for international ACAN chapters.

**License text:** https://opendatacommons.org/licenses/odbl/1-0/

### For submitter photos: CC BY-SA 4.0

Photos carry separate copyright from the database. Submitters must explicitly grant a license when they submit. CC BY-SA 4.0 requires attribution and that any derivative work stays open, matching the spirit of ODbL for the database layer.

> **Important:** This needs to be a condition in the submission form — a checkbox consent: *"I license this photo under CC BY-SA 4.0."*

**License text:** https://creativecommons.org/licenses/by-sa/4.0/

### For linked / scraped images and external documents

For images linked from elsewhere or scraped from other sources, a license cannot be applied — those images carry their original copyright. The recommended approach is to:

- Store only the URL and metadata, not the image file itself
- Clearly indicate the source and its known license in the entry

Official documents (demolition permits, etc.) are typically public government records and may already be in the public domain, but this should be checked per source.

---

## GDPR: runs independently of licensing

Licensing and GDPR are separate tracks. GDPR governs how personal data is handled regardless of the chosen license.

Dutch law emphasises **privacy by design and default**, requiring systems to collect the minimum necessary data and use anonymisation or pseudonymisation whenever possible.

### Key obligations

**Right now (unformalised):** Even without a legal entity, ACAN is already a "data controller" the moment it collects submitter emails. Every data processing activity must be based on a valid legal ground (such as consent), and individuals must be clearly informed about how their data is collected, used, and shared. A simple privacy notice on the submission form is required.

**On formalisation:** The Dutch Data Protection Authority (Autoriteit Persoonsgegevens) supervises GDPR compliance. The formalised entity becomes the registered data controller.

**Retention:** Personal data must not be retained indefinitely. Submitter emails are needed during the review process; once an entry is approved or rejected, there is no longer a clear purpose for keeping the email unless the submitter consented to ongoing contact.

**Supervisory authority:** Autoriteit Persoonsgegevens — https://www.autoriteitpersoonsgegevens.nl/en

---

## Practical implementation steps

### Phase 1 — Now (pre-formalisation)

- [ ] Add ODbL to all published data exports and the site footer: *"Database © ACAN Demolition Atlas contributors, ODbL 1.0"*
- [ ] Add CC BY-SA 4.0 consent checkbox to the submission form for photos
- [ ] Add a minimal privacy notice to the form explaining email use (review process only, deleted after)
- [ ] Store submitter emails separately from published data — technical separation, not just policy
- [ ] Publish a Terms of Use page stating the accuracy disclaimer and non-commercial use restriction

### Phase 2 — On formalisation as an NGO/foundation

- [ ] Formally adopt ODbL and CC BY-SA 4.0 as the project's licenses via a board resolution
- [ ] Register as data controller with the Autoriteit Persoonsgegevens
- [ ] Create a Contributor License Agreement (CLA) or Terms of Contribution that all submitters accept — this gives ACAN the legal standing to publish and sublicense contributed data

### Phase 3 — International ACAN chapters

- [ ] Each national chapter applies the same ODbL + CC BY-SA stack to their own fork or database
- [ ] ODbL's choice-of-law clause is deliberately flexible: the license allows for the choice of law to be where the licence is being enforced (the place where the court sits), rather than specifying a single jurisdiction — making it well-suited for a multi-country network like ACAN

---

## License comparison reference

| License | Type | Scope | Attribution | Share-alike | Best for |
|---|---|---|---|---|---|
| ODbL 1.0 | Database | Database rights | Yes | Yes | The Atlas database |
| CC BY-SA 4.0 | Content | Copyright | Yes | Yes | Submitted photos |
| CC0 | Public domain | Both | No | No | Max openness, no enforcement |
| ODC-BY | Database | Database rights | Yes | No | Attribution-only databases |
| CC BY 4.0 | Content | Copyright | Yes | No | Permissive content |

---

## Disclaimer & non-commercial use statement

### Accuracy disclaimer

Although the volunteers and non-profit forces that manage the Sloopkaart follow a protocol to check the accuracy of the buildings entered in the atlas at the best of their capacities, ACAN Netherlands cannot take responsibility for the exact correctness of the information published on the same.

This disclaimer should appear prominently on the website, in data export files, and in any Terms of Use document. It is compatible with the ODbL license, which itself contains no warranty provisions — meaning users of the data already accept it as-is under the license terms.

### Non-commercial use

The Sloopkaart is not intended to be used for commercial and for-profit purposes, including for commercial circular demolition purposes.

> **Important distinction:** This is currently a statement of intent, not a legally enforceable restriction. The ODbL license does not restrict commercial use by itself. There are two options to give this more weight:
>
> 1. **Terms of Use (recommended for now):** State the non-commercial intent explicitly in a Terms of Use page on the website. This creates a contractual condition of access, separate from the open data license, and can be enforced under Dutch contract law. This approach preserves the open data ethos while setting a clear boundary.
>
> 2. **License-level restriction:** Switching to a license with a NonCommercial clause (e.g. CC BY-NC-SA) would make the restriction enforceable at the license level, but would disqualify the database from being considered "open data" under standard definitions, potentially limiting use by researchers and public authorities.
>
> The recommended path is option 1 — a separate Terms of Use clause — which keeps the data open while clearly expressing ACAN's intent and creating a basis for challenge if the data is misused commercially.

**Suggested Terms of Use wording:**

> *"The Sloopkaart / Demolition Atlas is made available for research, heritage advocacy, public interest, and non-commercial purposes. Use of this data for commercial or for-profit purposes — including but not limited to commercial demolition, circular demolition trading, or property speculation — is not permitted and contrary to the intent of this project."*

This clause should be added to the Phase 1 implementation checklist as a site Terms of Use page.

---

## Key note on legal advice

The **CLA / Terms of Contribution** document, once ACAN formalises, is worth having a Dutch lawyer review briefly. That is the document that gives the foundation the right to publish what contributors submit — and it needs to hold up legally. The Terms of Use clause covering non-commercial use is also worth a brief legal review to ensure it is enforceable under Dutch law. Everything else in this document can be implemented immediately without specialist legal support.

---

*Prepared based on: Open Data Commons (opendatacommons.org), Creative Commons (creativecommons.org), Dutch GDPR Implementation Act (UAVG), Autoriteit Persoonsgegevens guidance.*
