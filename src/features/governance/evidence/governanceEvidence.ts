import type { GovernanceEvidence, GovernanceEvidenceStatus } from "./types";

export function normalizeGovernanceEvidenceStatus(
  status: string | null | undefined,
): GovernanceEvidenceStatus {
  if (status === "pass" || status === "warn" || status === "fail" || status === "unknown") {
    return status;
  }
  return "unknown";
}

export function createGovernanceEvidence(
  evidence: GovernanceEvidence,
): GovernanceEvidence {
  return {
    ...evidence,
    status: normalizeGovernanceEvidenceStatus(evidence.status),
  };
}

export function createDegradedGovernanceEvidence(
  id: string,
  source: GovernanceEvidence["source"],
  title: string,
  summary: string,
): GovernanceEvidence {
  return createGovernanceEvidence({
    id,
    source,
    status: "unknown",
    title,
    summary,
  });
}

