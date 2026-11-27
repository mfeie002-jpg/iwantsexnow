# Profile media provenance — Swiss Night V2

Checked against the local Git snapshot `58d2603:src/data/harvested-offers.json` and the integration baseline `9cd79c2` on 2026-11-27.

- Both datasets contain 2,590 entries. All 611 current entries with AI portrait media have an exact matching profile ID in the historical snapshot.
- None of those 611 historical entries has a suitable recoverable profile photo after rejecting portal backgrounds, stock media, placeholders, AI artwork, logos and site chrome. The only remaining external candidate under a broad first pass was a Google favicon; that was rejected too.
- Therefore no historical photo recovery mapping is created. No identity is inferred from names, city, phone number, similar-looking people or unrelated media.
- Existing attributable gallery candidates remain associated with their unchanged profile IDs. The image component tries only those candidates, then displays a neutral unavailable state without a substitute person.
- Attribution in an imported record does not establish ownership, consent, identity verification or redistribution rights. These matters remain unresolved unless separately evidenced.
- No new remote images were harvested for this check. Original imported datasets were not modified.

The presentation model rejects stock providers, brand and AI asset paths, background/default media, unsafe local paths, IP-address destinations and credential-bearing URLs. Remote bytes remain subject to the server image proxy's independent host, redirect, size, timeout and content checks.
