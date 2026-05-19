export type GovernanceEvidenceSource = "openspec" | "trellis" | "script" | "workflow";

export type GovernanceEvidenceStatus = "pass" | "warn" | "fail" | "unknown";

export type GovernanceEvidence = {
  readonly id: string;
  readonly source: GovernanceEvidenceSource;
  readonly status: GovernanceEvidenceStatus;
  readonly title: string;
  readonly summary: string;
  readonly updatedAt?: string;
};

export type WorkspaceGovernanceFileReader = (path: string) => Promise<string | null>;

export type WorkspaceGovernanceSnapshot = {
  readonly files: readonly string[];
  readonly readFile: WorkspaceGovernanceFileReader;
};

