# Preview truthfulness and navigation cleanup — 22 October 2026

Prepared against `main@482ebd0e0c7cde2d84fb710b6a848ed252953e7b` for PR review. This is source and local verification evidence; no merge, Softgen synchronization, deployment, database change or live release was performed.

## Resulting behavior

- Homepage and city previews describe fictitious profiles, ratings and status values instead of asserting real verification, inventory, availability, safety guarantees or live brokerage.
- The old simulated chat is a read-only help dialog. It collects no messages, invents no staff replies and promises no support response.
- Homepage enquiry/newsletter forms and simulated success messages are removed. Contact and Imprint are explicit status pages; no operator name, phone or email is invented. About, FAQ and Safety describe the actual preview state.
- Shared desktop/mobile navigation contains implemented preview destinations only. Unsupported category/region/location links and fabricated notification/inventory badges are removed. The unsupported Lucerne card is removed; city breadcrumbs point to the existing homepage city section. Other stale literal links point to existing relevant pages.
- Sample profiles no longer open a telephone or WhatsApp destination. Their contact buttons open the contact-status page. Their verification/activity/review labels are explicitly examples. The same labeling cleanup covers member/search/comparison and alternative design previews.
- Global `noindex, nofollow`, all twelve original action gates, API authorization and database code remain in place. The existing action-gate map was compared with the base version and is unchanged.

## Fresh local validation

| Check | Result |
|---|---|
| TypeScript (`npx tsc --noEmit`) | Passed |
| Production build (`npm run build`) | Passed; 51 generated static pages. The build reports lint warnings, with no errors. |
| Existing preview checks | 173/173 assertions passed; all 51 static pages include noindex |
| New preview integrity check | 2,146/2,146 assertions passed; 345 internal links to 49 paths; no missing route or anchor |
| Publication policy | 19/19 tests passed |
| Analyzer policy | 12/12 tests passed |
| Mocked authenticated handler | 3/3 tests passed |
| Local API rejection | 5/5 cases passed; rejected operations do not invoke upstream services |
| Local HTTP preview sweep | 68/68 routes passed, including expected error-page status codes; 12/12 original action gates present and noindex preserved |
| Browser checks | Homepage sample search reduced four results to one; help dialog contains no message input and Escape restores focus; phone menu opens and follows FAQ/contact links; sample-profile contact button opens contact-status page |
| Phone layout | 390px viewport, 390px document width, 351px menu; no horizontal page overflow; persistent notice stays below the modal layer |
| Diff hygiene | `git diff --check` passed; no dependency, Vercel, API or Supabase configuration changes |

The CI workflow now runs `scripts/preview-integrity.cjs` against built output and `scripts/preview-http-smoke.mjs` against its existing localhost server. The HTTP sweep refuses non-loopback origins and external destinations. These checks supplement the existing noindex, action-gate and authorization tests.

## Remaining release boundary

Contact/Imprint pages deliberately acknowledge that confirmed operator/contact details are still required. They are not final legal or support readiness acceptance. Genuine authentication, provider verification, consent, moderation, messaging, bookings and payments remain future implementation work. Keep the preview safeguards until those capabilities pass separate acceptance. This PR does not authorize publication.
