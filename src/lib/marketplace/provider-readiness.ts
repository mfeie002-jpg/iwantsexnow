import type { ProviderSession } from "../server/provider-session";

/**
 * This release has no audited provider evidence store or approved legal policy.
 * Deliberately no environment switch, request evidence or write adapter.
 * Changing this boundary requires a separately reviewed implementation.
 */
export function providerReadiness(session: ProviderSession) {
  return {
    mode: "demo" as const,
    onboarding: {
      state: "blocked" as const,
      canSubmit: false as const,
      emailConfirmed: session.emailConfirmed,
      blockers: [
        ...(!session.emailConfirmed ? ["email_confirmation_required"] : []),
        "managed_schema_and_rls_unverified",
        "operator_and_legal_policy_unapproved",
        "first_party_provenance_unverified",
        "identity_age_and_consent_unverified",
      ],
    },
    publication: {
      eligible: false as const,
      reason: "trusted_evidence_store_unavailable" as const,
    },
  };
}
