# Local technical verification — 27 November 2026

This is a bounded technical verification of `bc798cada62024c951652e7809401bbd9b20f95b`, not a full product acceptance or production release. No source code was changed during this verification pass.

## Reproducible environment

- Branch holding the implementation: `feat/swiss-night-v2-20261127`.
- Implementation checkout: `C:\Users\thest\Documents\GitHub\rearea\iwantsexnow-swiss-night-v2`.
- Detached QA worktree: `C:\Users\thest\Documents\GitHub\rearea\iwantsexnow-qa-20261127`, at the exact implementation commit above.
- Node.js `v26.4.0`, Next.js `15.5.28`. QA reused the implementation checkout's installed dependencies through a `node_modules` junction. This was not a clean dependency installation.
- Optimized local server bound to `127.0.0.1:4181`; HTTP tests used `IWSN_TEST_BASE_URL=http://127.0.0.1:4181`.
- Existing development servers were left running. No production secrets or environment files were copied into the QA worktree.

## Results

| Check | Result | Evidence |
|---|---|---|
| `next build` | Exit 0; 47/47 static pages generated | [build.log](build.log) |
| `next lint --quiet` | Exit 0; no ESLint warnings or errors | [lint.log](lint.log) |
| `tsc --noEmit --pretty false` | Exit 0; no diagnostics | [typecheck.log](typecheck.log) |
| General technical regression selection | 66 passed, 0 failed, 0 skipped | [technical-tests.log](technical-tests.log) |
| Authentication/privacy regression selection | 43 passed, 0 failed, 0 skipped | [private-security-tests.log](private-security-tests.log) |

Total: **109 selected tests passed**. The full product suite was not rerun in this pass. Earlier reports with other test counts describe their earlier revisions; they are not acceptance evidence for all functionality at this revision. Browser interaction tests and new desktop/mobile screenshots were not completed in this pass.

Build and lint were checked separately because the build skips lint. The Next.js CLI emits a deprecation notice for `next lint`; this is distinct from an ESLint warning or failure. The first attempt to write the empty TypeScript diagnostic stream failed in the log wrapper; the corrected wrapper and TypeScript check were rerun successfully. An empty `typecheck.log` therefore represents no compiler diagnostics, not a missing execution.

## Executed test selections

Both commands ran with `node --test`, against the local optimized server where HTTP was required.

General selection:

```text
tests/analyzer-proxy.test.mjs
tests/analyzer-proxy-handler.test.mjs
tests/css-selector-compatibility.test.mjs
tests/dependency-runtime.test.mjs
tests/image-signature.test.mjs
tests/image-proxy-and-footer.test.mjs
tests/profile-image-hydration.test.mjs
tests/night-image-visibility.test.mjs
tests/catalogue-privacy.test.mjs
tests/integration-client.test.mjs
tests/security-gates.test.mjs
tests/marketplace-publication.test.mjs
```

Authentication/privacy selection:

```text
tests/private-provider-flow.test.mjs
tests/supabase-drafts.test.mjs
tests/night-legacy-boundaries.test.mjs
tests/provider-workspace-v2.test.mjs
```

These tests establish implementation contracts including a single homepage footer, rejection of private/unknown image-proxy targets, raster signature checking, neutral fallback after original-image failures, fail-closed authentication and database failures, owner separation, protection against fabricated payment/identity claims, private-data projection, and truthful report receipts. Backend adapter tests use simulated services; passing them does not establish current production RLS or database configuration.

## Preservation and outstanding production evidence

`git diff --name-only 042f20f bc798ca -- src/data supabase/migrations` returned no paths. The continuation therefore changed neither the source datasets nor migration files. Direct JSON inspection found 2,590 catalogue records and 108 establishment records. Counts and source flags do not establish identity, ownership, age, publication consent or image rights.

The original checkout was observed clean on `main` at `5f009f9f20009f157a265a69adfe8a23d64285d8` during this pass. It had advanced independently from the older `d337498` snapshot. This pass did not switch, reset, merge or modify that checkout.

The existing [provider P0 report](../../launch/SWISS-NIGHT-V2-PROVIDER-P0.md) still leaves these matters unresolved:

- Rights, age, consent and profile-ownership evidence for the imported catalogue.
- Current production authentication configuration, allowlists and RLS.
- Deployment of the private report-intake migration and an operational production receipt/handling workflow.
- Availability of every external source image and measured mobile performance.

First-party publication prerequisite tests do not establish rights for the separate imported-catalogue path. Historical managed-environment acceptance dated 23 October is not current production acceptance.

No external messages, provider contacts, paid-service calls, pushes, merges or deployments were performed during this pass. All evidence remains local.
