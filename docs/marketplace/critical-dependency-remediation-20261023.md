# Critical dependency remediation — 2026-10-23

Supersedes the critical-dependency release blocker in the earlier reconciliation record.

- Next.js 15.5.9 -> 15.5.28; matching eslint-config-next 15.5.28.
- jsPDF 3.0.4 -> 4.2.1, with a real project-brief PDF text/wrapping/Blob-output compatibility test.
- Removed unused application dependency vercel 41.x. No application code or npm script imports it. This removes both vulnerable tar instances rather than forcing a major-version override under an old CLI.
- Supabase SDK and the seven previously accepted storage/SQL files are unchanged, as are public action gates and noindex source.

Lockfile-only audit: 36 findings (3 critical) before; 19 after (0 critical, 11 high, 7 moderate, 1 low). jsPDF and tar have no remaining findings. Next.js retains a moderate transitive finding. Lower-severity findings remain and are not represented as a clean security audit.

CI now rejects critical dependency findings and tests the PDF export API used by the application. No database migration or live-data test is required by these dependency-only changes.

Advisory references:
- https://github.com/advisories/GHSA-2464-fhr4-w9xw
- https://github.com/advisories/GHSA-wfv2-pwc8-crg5
- https://github.com/advisories/GHSA-23hp-3jrh-7fpw
