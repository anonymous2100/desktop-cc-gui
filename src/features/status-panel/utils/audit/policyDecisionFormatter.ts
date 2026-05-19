import type { PolicyDecision } from "../policies";

type TranslationFn = (key: string, options?: Record<string, unknown>) => string;

export type FormattedPolicyDecision = {
  policyLabel: string;
  verdictLabel: string;
  reasonLabel: string;
  sourceLabel: string;
  hasSource: boolean;
};

function normalizeToken(value: string | null) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}

function resolveReasonLabel(t: TranslationFn, decision: PolicyDecision) {
  const reasonKey = normalizeToken(decision.reasonKey);
  if (reasonKey) {
    return t(reasonKey);
  }
  return t("statusPanel.audit.reasonUnavailable", { policy: decision.policyId });
}

export function formatPolicyDecision(
  decision: PolicyDecision,
  t: TranslationFn,
): FormattedPolicyDecision {
  const sourceId = normalizeToken(decision.sourceId);

  return {
    policyLabel: decision.policyId,
    verdictLabel: t(`statusPanel.policy.verdict.${decision.verdictContribution}`),
    reasonLabel: resolveReasonLabel(t, decision),
    sourceLabel: sourceId ?? t("statusPanel.audit.sourceUnavailable"),
    hasSource: sourceId !== null,
  };
}
