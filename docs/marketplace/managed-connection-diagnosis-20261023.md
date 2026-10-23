# Existing managed backend connection: recovery diagnosis

23 October 2026. Existing Softgen project:
https://softgen.ai/project/4d3af0ab-bad5-4906-84f5-bdd09bdb40d6

## Confirmed observations and attributed findings

Direct Softgen runtime inspection on 22 October found a zero-byte .env.local,
no SUPABASE/DATABASE runtime variable names and no CLI project-binding files.
The same project settings offered Connect Now / Authorize instead of a connected
resource. These findings do not prove whether a historical resource exists in
Softgen's infrastructure.

On 23 October, the existing project's built-in assistant inspected its platform
context and configuration files. It reported supabase_connected=false, an empty
.env.local, no configured URL/public key, and no recoverable managed resource
identifier in the inspected files. This is the built-in assistant's report,
consistent with the direct runtime observations; it is not an independent
management-API inventory or proof that every historical resource is absent.

The built-in assistant was explicitly constrained to identify/recover only the
existing binding: no provisioning, external account authorization, migrations,
personal-data writes, deployments, gate changes or overwriting draft work.
It found no existing binding it could repair.

## Application work preserved

Private draft service and owner-scoped Supabase adapter exist locally and in the
Softgen workspace. Existing noindex and action-gate files are unchanged. Fresh
local draft/adapter/publication tests on 23 October: 46 passed, zero failed.
Prior 22 October hosted tests: 46 passed; local build and HTTP safeguards passed.
No live persistence or RLS acceptance has been claimed.

## Remaining recovery path

Softgen must identify and restore any historical managed resource mapping for
this project before live schema and two-user storage acceptance can run.
The visible connection action might provision a new resource; it must not be
used as a substitute for recovery under the user's no-replacement constraint.
Ask Softgen support to inspect historical mapping and restore an existing
resource only. A support message has not been sent; sending it under the user's
account requires explicit authorization. Do not request separate Supabase
credentials or send secrets.
