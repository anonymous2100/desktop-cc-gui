import { describe, expect, it } from "vitest";
import { createGovernanceEvidence, normalizeGovernanceEvidenceStatus } from "./governanceEvidence";

describe("governanceEvidence", () => {
  it("normalizes unknown status values to unknown", () => {
    expect(normalizeGovernanceEvidenceStatus("pass")).toBe("pass");
    expect(normalizeGovernanceEvidenceStatus("warn")).toBe("warn");
    expect(normalizeGovernanceEvidenceStatus("broken")).toBe("unknown");
    expect(normalizeGovernanceEvidenceStatus(null)).toBe("unknown");
  });

  it("sanitizes DTO status while preserving evidence content", () => {
    expect(
      createGovernanceEvidence({
        id: "script:test",
        source: "script",
        status: "fail",
        title: "Script",
        summary: "Failed",
      }),
    ).toEqual({
      id: "script:test",
      source: "script",
      status: "fail",
      title: "Script",
      summary: "Failed",
    });
  });
});

