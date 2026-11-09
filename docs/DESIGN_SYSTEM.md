# Design system: "Postkarte"

Light, warm and tactile. Pages should feel like a postcard someone pinned to a corkboard, not like a control panel. Real objects (postcards, polaroids, door hangers, stamps, tape) replace icons wherever a visual is needed.

## Tokens

| Token | Hex | Use |
| --- | --- | --- |
| `papier` | #fbfaf8 | page background |
| `tinte` / `tinte-soft` | #1e2247 / #5b5f84 | text, outlines, offset shadows |
| `kirsche` / `kirsche-tief` | #d92b52 / #a81c3d | primary action, brand mark, hand notes |
| `butter` | #ffe48a | highlight, hover fill, header field |
| `blush`, `minze`, `himmel`, `flieder` | #ffd3dc, #bfebd6, #c6dffa, #dcd3f7 | pastel colour fields, one per page |
| `fels`, `linie` | #f1f0f6, #e1e1ec | quiet panels, hairlines |

`gray-*` and `stone-*` are an indigo-tinted cool scale, so legacy classes still sit on the palette. Do not use `gray-200/300` for text on light backgrounds (contrast).

Type: Bricolage Grotesque (`font-display`) for headings, Figtree for body, Caveat (`.hand`) for short hand-written notes only (one per page header, never body text).

## Building blocks

- `PageIntro` (`src/components/PageIntro.tsx`): coloured field, hand note, title, lead, optional picture, wave edge. Every inner page starts with it. Pass links as children. Art options: `hanger | verified | search | compare | book | none | canton:<key> | category:<key>`.
- Visual library (`src/components/visuals/`): `CantonPoster/CantonPostcard`, `CategoryPoster/CategoryPolaroid`, `DoorHanger`, `VerifiedStamp`, `HeroScene`, `BrandMark`, `Wordmark`, `Doodle`, `Wave`, `EmptyArt`. All art is drawn in code from `art.ts` (`PAL`). Never use scraped profile photos, harvested data or AI-avatar likenesses as decoration.
- Chrome: `LuxuryHeader`, `MobileBottomNav`, `CorporateFooter`.
- CSS classes (`src/styles/globals.css`): `.field-{blush|butter|minze|himmel|flieder|weiss|ink}`, `.postcard`, `.polaroid`, `.tape`, `.squiggle`, `.marker`, `.link-draw`, `.sentence-slot`, `.brass-button` (primary, cherry), `.emerald-button` (secondary, ink outline that fills butter), `.luxury-input/.luxury-select/.luxury-textarea`.
- Panels that hold forms: `rounded-2xl border-2 border-tinte bg-white shadow-[0_5px_0_rgba(30,34,71,0.9)]`.

## Rules

1. One pastel field per page header; the body stays on paper.
2. Buttons are chunky and ink-outlined; primary = cherry, secondary = outline. Default size comes from a zero-specificity `:where()` rule, so any Tailwind utility overrides it.
3. Plain CSS in `globals.css` is not in a Tailwind layer and beats utilities at equal specificity. Use `:where()` for defaults that utilities must be able to override.
4. Style focus with `:focus-visible` (or `has-[:focus-visible]` for wrappers), never bare `:focus`.
5. Motion answers a person's action; there is no scroll-in animation on every section.
6. Copy is German (de-CH), plain verbs, sentence case. Slogan: "Eine Suche für die ganze Schweiz. Vergleichen & Direkt Buchen."

## Scope

Profile pages, profile cards and the harvested data are structurally untouched; they only received mechanical colour remaps so they sit on the light palette. Dev and internal pages (logo-concepts, web-analyzer, design-concept-*, admin/tools, ...) and unused legacy components were left as they are.
