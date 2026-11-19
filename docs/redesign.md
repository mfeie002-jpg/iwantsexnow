# Redesign: Stadtblatt

The previous “Postkarte” system (pastel fields, polaroids, washi tape, hand lettering, chunky offset buttons) read as a crafted template and, at the same time, as a control panel: doorplates, chips, crowns, and a filter deck on the homepage. This pass throws that structure out. The site is treated as a Swiss city paper for private appointments.

## What others do

Looked at how leading directories in this vertical actually behave, plus adjacent editorial sites.

Swiss and DACH escort boards (xdate, and6, ladies-style classifieds, local canton sites) are good at one thing: you can see a photo, a city, and a phone number quickly. They are poor at almost everything else. Pages are dark, neon, and crowded. Prices are inconsistent or missing. Trust language (“100% verified”, star ratings, “VIP”) is pasted on every card. Navigation is a pile of categories. The result feels like a dashboard wearing lingerie.

Larger European and US boards (Tryst, Eros, Slixa, AdultSearch) improved the card: photo first, city in the URL, filters that remember a city. The better ones put  duration and rate on the card and make contact a single action. They still look like the same SaaS template: identical rounded cards, icon chips, a left filter column, and a hero that explains the product in three numbered steps.

Outside this vertical, the useful references are city papers and quiet commerce, not “luxury dark mode”. Monocle and NZZ Feuilleton put place names in large type and let a photograph carry the section. Aesop and The Modern House use one accent, hairline rules, and captions under images instead of type burned into the photo. A restaurant menu is a better model for a price than a badge.

## Concept

**Stadtblatt.** Paper `#f3efe6`, ink `#1c1915`, one lacquer `#8e2f2a`. Photography of places and still lifes (lake, salon, silk, alpine town), not icons and not body thumbnails used as decoration. Profile photos stay inside listing cards because they are the listing.

The page is a sheet: a sentence you can fill in, a geographic index of cities, a short run of real entries, then prose. Filters live on the search page, not as a cockpit on the homepage.

### Type

- Display: Fraunces, optical size, weight 560. Sizes: hero `clamp(2.7rem, 6.4vw, 5.3rem)`, page title `clamp(2.4rem, 5vw, 4.4rem)`, section `clamp(1.8rem, 3vw, 2.6rem)`, card name `1.35rem`.
- Body: Figtree, 17px, line-height 1.6.
- Kickers: Figtree, 12.5px, tracking 0.14em, uppercase. One per header.
- Prices: Fraunces numerals next to “30 Min.” / “60 Min.”, not a pill on the photo.

### Shapes

- Buttons and inputs: 2px corner, no offset shadow, no pill. Primary button is lacquer on paper-white type. Secondary actions are underlined text.
- Cards: photo at 4:5, caption underneath (place, name, both prices, “Schreiben” / “Profil”). No crown, no doorplate, no gradient floor.
- Sections: hairline rules, not coloured paper fields. One full-bleed photograph per major page header.
- City index: names set where the cities sit, with the real profile count beside each name, plus the remaining cantons as a line of links.

### Profile pages

Individual profile pages keep their existing dossier layout, colours, and controls. They sit in the new header, footer, and age gate. A `data-profile-sheet` wrapper restores the previous button, badge, and panel rules so the dossier does not inherit the new shapes.

## What changed in the product

- Homepage is a guide. The old on-page filter cockpit moved into `/search`, which now reads `q`, `canton`, `rubric`, `max`, `free`, and `sort` from the URL so a search can be shared. Sort by photo, confirmed availability, or price was added there.
- City browsing is a geographic index on the homepage. Existing city URLs are unchanged (`/escort-zurich`, `/orte/zug`, and the rest).
- Listing cards on the homepage, search, canton hubs, escort city pages, and category pages show both CHF prices and a direct WhatsApp link when a number is in the record. No placeholder phone is invented.
- Clubs are a guidebook list (name, place, type, hours, telephone) instead of a card grid. The old fallback number `+41 44 431 20 90` is no longer shown when a club has no phone. The visible count is the length of the vault, not a hardcoded 305.
- Compare is a table of up to four profiles (place, 30 min, 60 min, 4-hour flag, contact) instead of four overlaid photo cards.
- The 18+ gate is mounted again. It stays dismissible, stores only the existing local flag, and still lets imprint, privacy, terms, and the report page open.
- Mobile navigation is four words (Start, Suche, Clubs, Merken). It steps aside on a profile, which already has its own contact bar.
- Header and footer are typographic. Footer links are the existing routes.

Counts, prices, names, and phone numbers still come from `harvested-offers.json` and `swiss-establishments-vault.json`. No new ratings or verification claims were added to the interface.

## Left as they were

Profile detail components and their visual treatment. Admin tools, provider cockpit internals, and harvested data files. SEO routes, canonical handling in `SEO`, hreflang on that component, sitemap, and structured data. Payment and environment settings.
