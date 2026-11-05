# iWantSexNow.ch — Production System Rules (Swiss Escort Index & Direct Booking Marketplace)

1. NO DEMO OR PRELAUNCH GATES: Never add demo banners, fictional disclaimers, noindex tags on public pages, or previewOnlyRoutes blocks. All routes (/, /search, /compare-escorts, /profile/[id], /creator-dashboard, /admin-dashboard, /live-cam, /checkout, /create-post, /verify, /pricing) are 100% live in production.
2. ZERO AUTOMATIC OUTREACH: Never trigger automated outbound WhatsApp/SMS messages. Pilot-20 profiles (src/data/pilot-20-cohort.json) remain in DRY_RUN_ONLY_NOT_CONTACTED mode until manually copied by the admin in /admin-dashboard.
3. REAL SWISS DATA VAULT (src/data/):
   - harvested-offers.json / harvestedOffers.ts: 2,526 deduplicated Swiss profiles across 24 cantons.
   - ready-whatsapp-claims.json: 998 verified +41 numbers (977 mobile 075-079), strictly filtered against sequential placeholders.
   - swiss-establishments-vault.json: 305 Swiss clubs, sauna clubs, studios and brothels.
   - pilot-20-cohort.json: 20 pre-authorized pilot profiles (10x ZG, 10x ZH) with HMAC owner tokens.
   - managed-profile-states.json: Persistent state for all 2,526 profiles (4h availability, rates, gallery, 4K video, 80/20 PPV paid items, 1:1 live-cam, top-spot bidding).
4. DESIGN & TONE: Luxury Swiss dark theme (#0D111A / #121722 with #C8A97E gold accents). Slogan: "Eine Suche für die ganze Schweiz. Vergleichen & Direkt Buchen."