import { describe, expect, it } from "vitest";
import { buildSemanticDiffSummary } from "./semanticDiffSummary";

describe("buildSemanticDiffSummary", () => {
  it("extracts concrete Spring exception handler behavior from a Java hunk", () => {
    const summary = buildSemanticDiffSummary([
      {
        path: "src/main/java/com/example/demo/exception/GlobalExceptionHandler.java",
        status: "M",
        diff: [
          "@@ -76,0 +77,10 @@",
          "+    /**",
          "+     * 处理操作日志不存在异常",
          "+     */",
          "+    @ExceptionHandler(OperationLogNotFoundException.class)",
          "+    public ResponseEntity<ApiResponse<Void>> handleOperationLogNotFoundException(OperationLogNotFoundException e) {",
          "+        return ResponseEntity",
          "+                .status(HttpStatus.NOT_FOUND)",
          "+                .body(ApiResponse.<Void>error(404, e.getMessage()));",
          "+    }",
          "+",
        ].join("\n"),
      },
    ]);

    expect(summary.intent).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          textKey: "git.semanticDiff.intent.springExceptionHandler",
          values: expect.objectContaining({
            exception: "OperationLogNotFoundException",
            method: "handleOperationLogNotFoundException",
            evidence: "src/main/java/com/example/demo/exception/GlobalExceptionHandler.java:80",
          }),
        }),
      ]),
    );
    expect(summary.behavior).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          textKey: "git.semanticDiff.behavior.springExceptionStatus",
          values: expect.objectContaining({
            exception: "OperationLogNotFoundException",
            status: "404 NOT_FOUND",
          }),
        }),
        expect.objectContaining({
          textKey: "git.semanticDiff.behavior.apiResponseError",
          values: expect.objectContaining({
            method: "handleOperationLogNotFoundException",
            code: 404,
          }),
        }),
      ]),
    );
    expect(summary.intent.map((item) => item.textKey)).not.toContain(
      "git.semanticDiff.intent.noConcreteFacts",
    );
  });

  it("extracts exported TypeScript declarations instead of only file categories", () => {
    const summary = buildSemanticDiffSummary([
      {
        path: "src/features/git/utils/semanticDiffSummary.ts",
        status: "M",
        diff: [
          "@@ -1,0 +1,2 @@",
          "+export type SemanticDiffSummary = { intent: string[] };",
          "+export function buildSemanticDiffSummary() {}",
        ].join("\n"),
      },
    ]);

    expect(summary.intent).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          textKey: "git.semanticDiff.intent.export",
          values: expect.objectContaining({ symbol: "SemanticDiffSummary" }),
        }),
        expect.objectContaining({
          textKey: "git.semanticDiff.intent.export",
          values: expect.objectContaining({ symbol: "buildSemanticDiffSummary" }),
        }),
      ]),
    );
  });

  it("recognizes test and spec evidence without claiming commands passed", () => {
    const summary = buildSemanticDiffSummary([
      {
        path: "src/features/git/utils/semanticDiffSummary.test.ts",
        status: "A",
        diff: "@@ -0,0 +1,2 @@\n+it('works', () => {})\n+expect(true).toBe(true)",
      },
      {
        path: "openspec/changes/add-semantic-diff-review/specs/git-panel-diff-view/spec.md",
        status: "A",
        diff: "@@ -0,0 +1 @@\n+## ADDED Requirements",
      },
    ]);

    expect(summary.validation.map((item) => item.textKey)).toEqual(
      expect.arrayContaining([
        "git.semanticDiff.validation.testFiles",
        "git.semanticDiff.validation.specFiles",
        "git.semanticDiff.validation.notConnected",
      ]),
    );
    expect(summary.risks.map((item) => item.textKey)).not.toContain(
      "git.semanticDiff.risk.noTests",
    );
  });

  it("flags config and deleted-file risk", () => {
    const summary = buildSemanticDiffSummary([
      {
        path: "package.json",
        status: "M",
        diff: "@@ -1 +1 @@\n-\"old\": true\n+\"old\": false",
      },
      {
        path: "src/legacy.ts",
        status: "D",
        diff: "@@ -1 +0,0 @@\n-export const legacy = true;",
      },
    ]);

    expect(summary.behavior.map((item) => item.textKey)).toContain(
      "git.semanticDiff.behavior.deleted",
    );
    expect(summary.risks.map((item) => item.textKey)).toEqual(
      expect.arrayContaining([
        "git.semanticDiff.risk.config",
        "git.semanticDiff.risk.deleted",
      ]),
    );
  });
});
