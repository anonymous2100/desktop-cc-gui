import type {
  CheckpointValidationEvidence,
  CheckpointValidationKind,
  CheckpointVerdict,
  CommandSummary,
  FileChangeSummary,
  SubagentInfo,
} from "../../types";

export type PolicyVerdictContribution = CheckpointVerdict | "no_contribution";

export type CheckpointPolicyEvidence = {
  failedCommand: CommandSummary | null;
  failedCommandKind: CheckpointValidationKind | null;
  failedSubagent: SubagentInfo | null;
  failedValidation: CheckpointValidationEvidence | null;
  fileChanges: readonly FileChangeSummary[];
  hasCompletedSubagentSet: boolean;
  hasCompletedTodoSet: boolean;
  hasEvidence: boolean;
  hasReadyValidations: boolean;
  hasRunningCommand: boolean;
  hasRunningSubagent: boolean;
  hasSuccessfulCommand: boolean;
  hasInProgressTodo: boolean;
  isProcessing: boolean;
  requiredKinds: readonly CheckpointValidationKind[];
  validations: readonly CheckpointValidationEvidence[];
};

export type PolicyDecision = {
  policyId: string;
  verdictContribution: PolicyVerdictContribution;
  reasonKey: string | null;
  sourceId: string | null;
};

export type Policy = {
  id: string;
  appliesTo(evidence: CheckpointPolicyEvidence): boolean;
  evaluate(evidence: CheckpointPolicyEvidence): PolicyDecision;
};

export type PolicyChainResult = {
  verdict: CheckpointVerdict;
  decisions: readonly PolicyDecision[];
};

export type PolicyAuditEntry = {
  id: string;
  createdAt: number;
  verdict: CheckpointVerdict;
  decisions: readonly PolicyDecision[];
};
