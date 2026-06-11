#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const PERF_BASELINE_PATH = "docs/perf/baseline.json";
const BROWSER_SCROLL_PATH = "docs/perf/long-list-browser-scroll.json";
const REALTIME_TURN_TRACE_PATH = "docs/perf/realtime-turn-trace.json";
const LARGE_FILE_WATCHLIST_PATH = ".artifacts/large-files-near-threshold.json";
const OUTPUT_JSON_PATH = "docs/perf/runtime-evidence-gates.json";
const OUTPUT_PERF_MARKDOWN_PATH = "docs/perf/runtime-evidence-gates.md";
const OUTPUT_OPENSPEC_MARKDOWN_PATH = "openspec/docs/runtime-evidence-gates-2026-05-24.md";

const compatibilityPaths = [
  {
    name: "listClaudeSessions",
    classification: "retain-compatibility",
    reason: "Native Claude continuity and diagnostic listing path; not the sidebar membership truth source.",
    verification: "rg references in src/services/tauri.ts, useThreadActions fallback seed, and focused tests.",
  },
  {
    name: "listProjectRelatedCodexSessions",
    classification: "retain-compatibility",
    reason: "Project-related Codex diagnostics and continuity path; shared projection remains canonical for membership.",
    verification: "rg references in src/services/tauri/sessionManagement.ts and src/services/tauri.test.ts.",
  },
  {
    name: "legacy bare-session metadata lookup",
    classification: "retain-legacy",
    reason: "Recovery fallback for older persisted/session metadata shapes.",
    verification: "Spec and Rust test evidence keep stable-key plus legacy bare-session metadata compatibility.",
  },
  {
    name: "legacy cursor parsing",
    classification: "retain-legacy",
    reason: "Backward-compatible pagination fallback for older cursor payloads.",
    verification: "Session-management closeout records this as a protected compatibility path.",
  },
];

function repoPath(path) {
  return resolve(process.cwd(), path);
}

async function readJsonIfExists(path) {
  const absolutePath = repoPath(path);
  if (!existsSync(absolutePath)) {
    return null;
  }
  return JSON.parse(await readFile(absolutePath, "utf-8"));
}

async function writeText(path, value) {
  const absolutePath = repoPath(path);
  await mkdir(dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, value, "utf-8");
}

function runJson(command, args) {
  try {
    const output = execFileSync(command, args, { cwd: process.cwd(), encoding: "utf-8" });
    return JSON.parse(output);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
      changes: [],
    };
  }
}

function markdownCell(value) {
  return String(value ?? "")
    .replace(/\|/g, "\\|")
    .replace(/\r?\n/g, " ");
}

function classifyMetric(metric) {
  const note = `${metric.notes ?? ""} ${metric.unsupportedReason ?? ""}`.toLowerCase();
  if (metric.value == null || metric.unsupportedReason) {
    return "unsupported";
  }
  if (metric.metric === "browserScrollFrameDropPct") {
    return "measured";
  }
  if (
    note.includes("proxy")
    || note.includes("jsdom")
    || note.includes("fixture")
    || metric.scenario?.startsWith("S-LL")
    || metric.scenario?.startsWith("S-CI")
    || metric.scenario?.startsWith("S-RS")
  ) {
    return "proxy";
  }
  return "measured";
}

function metricReason(metric, evidenceClass) {
  if (metric.unsupportedReason) {
    return metric.unsupportedReason;
  }
  if (metric.notes) {
    return metric.notes;
  }
  if (evidenceClass === "proxy") {
    return "Fixture or replay evidence; useful for regression comparison, not release-grade runtime proof.";
  }
  return "Directly measured from generated artifact.";
}

function metricNextAction(metric, evidenceClass) {
  if (metric.scenario === "S-LL-1000" && metric.metric === "scrollFrameDropPct") {
    return "Add browser-level scroll gate for the 1000-row scenario.";
  }
  if (metric.scenario === "S-CS-COLD" && metric.metric?.endsWith("Ms")) {
    return "Collect real Tauri webview cold-start timing on a supported runner.";
  }
  if (metric.scenario?.startsWith("S-RS")) {
    return "Correlate replay metrics with runtime visible-lag and terminal-pressure traces.";
  }
  if (evidenceClass === "proxy") {
    return "Keep as regression baseline and add runtime/browser evidence before release-grade closure.";
  }
  if (evidenceClass === "unsupported") {
    return "Provide supported environment evidence or preserve explicit qualifier.";
  }
  return "Track for regression.";
}

function missingSourceMetrics(path, reason = "missing") {
  const sourceState = reason === "invalid" ? "Invalid source file" : "Missing source file";
  if (path === BROWSER_SCROLL_PATH) {
    return [{
      scenario: "S-LL-1000",
      metric: "browserScrollFrameDropPct",
      value: null,
      unit: "%",
      unsupportedReason: `${sourceState}: ${path}. Run npm run perf:long-list:browser-scroll to collect browser scroll evidence or record an unsupported result.`,
    }];
  }
  return [{
    scenario: "runtime-perf-baseline",
    metric: "sourceFileAvailable",
    value: null,
    unit: "status",
    unsupportedReason: `${sourceState}: ${path}. Run the corresponding performance baseline command before claiming runtime evidence closure.`,
  }];
}

function buildPerfEvidence(fragments) {
  return fragments.flatMap(({ path, fragment }) => {
    const metrics = Array.isArray(fragment?.metrics)
      ? fragment.metrics
      : missingSourceMetrics(path, fragment == null ? "missing" : "invalid");
    return metrics.map((metric) => {
      const evidenceClass = classifyMetric(metric);
      return {
        source: path,
        scenario: metric.scenario,
        metric: metric.metric,
        value: metric.value,
        unit: metric.unit,
        evidenceClass,
        budget: metric.budget ?? null,
        reason: metricReason(metric, evidenceClass),
        nextAction: metricNextAction(metric, evidenceClass),
      };
    });
  });
}

function findMetric(perfEvidence, scenario, metric) {
  return perfEvidence.find((entry) => entry.scenario === scenario && entry.metric === metric);
}

function toFiniteNumber(value) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function buildRealtimeSummary(perfEvidence, turnTraceFragment) {
  const firstToken = findMetric(perfEvidence, "S-RS-FT", "firstTokenLatency");
  const jitter = findMetric(perfEvidence, "S-RS-FT", "interTokenJitterP95");
  const assembler = findMetric(perfEvidence, "S-RS-PE", "assemblerLatency");
  const visibleTextLag = findMetric(perfEvidence, "S-RS-VL", "visibleTextLagP95");
  const reducerAmplification = findMetric(perfEvidence, "S-RS-RA", "reducerAmplificationMedian");
  const batchFlushDuration = findMetric(perfEvidence, "S-RS-FD", "batchFlushDurationP95");
  const terminalSettlement = findMetric(perfEvidence, "S-RS-TS", "terminalSettlementP95");
  const firstTokenValue = toFiniteNumber(firstToken?.value);
  const jitterValue = toFiniteNumber(jitter?.value);
  const visibleLagRisk = firstTokenValue == null && jitterValue == null
    ? "unsupported"
    : (firstTokenValue ?? 0) >= 2000 || (jitterValue ?? 0) >= 500
      ? "high"
      : "bounded";
  const traceEvidenceClass = turnTraceFragment && typeof turnTraceFragment === "object"
    ? "proxy"
    : "unsupported";
  return {
    firstTokenLatencyMs: firstToken?.value ?? null,
    interTokenJitterP95Ms: jitter?.value ?? null,
    assemblerLatencyMs: assembler?.value ?? null,
    visibleTextLagP95Ms: visibleTextLag?.value ?? null,
    reducerAmplificationMedian: reducerAmplification?.value ?? null,
    batchFlushDurationP95Ms: batchFlushDuration?.value ?? null,
    terminalSettlementP95Ms: terminalSettlement?.value ?? null,
    evidenceClass: visibleLagRisk === "unsupported" ? "unsupported" : "proxy",
    visibleLagRisk,
    terminalPressure: "not-directly-measured",
    turnTraceEvidenceClass: traceEvidenceClass,
    turnTraceSource: turnTraceFragment ? REALTIME_TURN_TRACE_PATH : null,
    nextAction: "Add runtime trace that correlates ingress cadence, batch flush, render-visible cadence, and terminal settlement.",
  };
}

const REALTIME_TRACE_BUDGETS = {
  "S-RS-VL": {
    target: 2000,
    hardFail: 5000,
    reason: "Replay-derived first-delta -> first-visible-text P95; jsdom/PerformanceObserver path is the follow-up.",
    nextAction: "Wire PerformanceObserver in Tauri webview to record first visible text growth and bring this to measured.",
  },
  "S-RS-RA": {
    target: 2,
    hardFail: 4,
    reason: "Replay-derived reducer amplification median; reflects fixture batch grouping.",
    nextAction: "Cross-check with renderer-side reducer commit count under live Tauri session.",
  },
  "S-RS-FD": {
    target: 8,
    hardFail: 16,
    reason: "Replay-derived batch flush duration P95; replay group window is the surrogate.",
    nextAction: "Replace with measured wall-clock gap between batcher flush-start and flush-end in the renderer hot path.",
  },
  "S-RS-TS": {
    target: 100,
    hardFail: 250,
    reason: "Replay-derived terminal settlement P95 (last reducer commit -> agentCompleted).",
    nextAction: "Wire real Tauri/webview terminal signal (provider final + reducer final) and reclassify to measured.",
  },
};

function buildRealtimeTraceBudgets(perfEvidence) {
  // Enrich existing baseline rows with target / hardFail / clearer next-action.
  // Returns the (mutated) perfEvidence so callers can append the same array.
  for (const entry of perfEvidence) {
    const budget = REALTIME_TRACE_BUDGETS[entry.scenario];
    if (budget && entry.metric === (
      entry.scenario === "S-RS-VL" ? "visibleTextLagP95"
        : entry.scenario === "S-RS-RA" ? "reducerAmplificationMedian"
        : entry.scenario === "S-RS-FD" ? "batchFlushDurationP95"
        : entry.scenario === "S-RS-TS" ? "terminalSettlementP95"
        : null
    )) {
      entry.budget = { target: budget.target, hardFail: budget.hardFail };
      entry.reason = budget.reason;
      entry.nextAction = budget.nextAction;
      entry.evidenceClass = "proxy";
      entry.source = "docs/perf/realtime-extended-baseline.json";
    }
  }
  return perfEvidence;
}

function buildColdStartSummary(perfEvidence) {
  const firstPaint = findMetric(perfEvidence, "S-CS-COLD", "firstPaintMs");
  const firstInteractive = findMetric(perfEvidence, "S-CS-COLD", "firstInteractiveMs");
  return {
    firstPaintEvidence: firstPaint?.evidenceClass ?? "unsupported",
    firstInteractiveEvidence: firstInteractive?.evidenceClass ?? "unsupported",
    reason: firstPaint?.reason ?? firstInteractive?.reason ?? "Cold-start timing source is missing.",
    nextAction: "Collect Tauri webview timing on supported macOS/Windows/Linux runners.",
  };
}

function qualifierForChange(changeName) {
  if (
    changeName.includes("session")
    || changeName.includes("stale-thread")
    || changeName.includes("sidebar-list")
    || changeName.includes("claude-sidebar")
  ) {
    return "Keep local manual QA and Windows/Claude-manual qualifiers explicit before archive.";
  }
  if (changeName.includes("optimize") || changeName.includes("perf") || changeName.includes("bundle")) {
    return "Archive only after evidence report identifies measured/proxy/unsupported boundaries.";
  }
  return "Review validation and platform qualifiers before archive.";
}

function buildArchiveReadiness(openSpecState) {
  const changes = Array.isArray(openSpecState?.changes) ? openSpecState.changes : [];
  const completed = changes
    .filter((change) => change.status === "complete")
    .map((change) => ({
      name: change.name,
      tasks: `${change.completedTasks}/${change.totalTasks}`,
      recommendation: "archive-candidate-after-qualifier-review",
      qualifier: qualifierForChange(change.name),
    }));
  const inProgress = changes
    .filter((change) => change.status !== "complete")
    .map((change) => ({
      name: change.name,
      tasks: `${change.completedTasks}/${change.totalTasks}`,
      recommendation: "not-archive-ready",
    }));
  return {
    source: "openspec list --json",
    completed,
    inProgress,
    error: openSpecState?.error ?? null,
  };
}

function splitFacadeNote(path) {
  if (path === "src/services/tauri.ts") {
    return "Preserve service exports, payload mapping, and web/Tauri fallback semantics.";
  }
  if (path.startsWith("src-tauri/src/")) {
    return "Preserve command registration, Rust module facade, payload shape, and cross-platform paths.";
  }
  if (path.includes("/hooks/")) {
    return "Preserve hook input/output shape and async cleanup semantics.";
  }
  if (path.startsWith("src/styles/")) {
    return "Preserve selector names, import order, and cascade compatibility.";
  }
  if (path.startsWith("src/i18n/")) {
    return "Passive i18n debt; do not displace P0/P1 runtime hot-path cleanup.";
  }
  if (path.endsWith(".test.tsx") || path.endsWith(".test.ts")) {
    return "Test debt; split only with matching test readability and coverage preservation.";
  }
  return "Declare public facade before splitting.";
}

function buildLargeFileSummary(largeFileReport) {
  const findings = Array.isArray(largeFileReport?.results) ? largeFileReport.results : [];
  const ranked = findings
    .map((finding) => {
      const failThreshold = toFiniteNumber(finding.failThreshold);
      const lines = toFiniteNumber(finding.lines);
      return {
        path: finding.path,
        lines: finding.lines,
        priority: finding.priority,
        policyId: finding.policyId,
        headroom: failThreshold == null || lines == null ? null : failThreshold - lines,
        facade: splitFacadeNote(finding.path),
      };
    })
    .sort((left, right) => {
      const priorityOrder = { P0: 0, P1: 1, P2: 2 };
      return (priorityOrder[left.priority] ?? 3) - (priorityOrder[right.priority] ?? 3)
        || (left.headroom ?? Number.POSITIVE_INFINITY) - (right.headroom ?? Number.POSITIVE_INFINITY)
        || left.path.localeCompare(right.path);
    });
  return {
    source: existsSync(repoPath(LARGE_FILE_WATCHLIST_PATH)) ? LARGE_FILE_WATCHLIST_PATH : null,
    generatedAt: largeFileReport?.generatedAt ?? null,
    status: largeFileReport?.status ?? "missing",
    candidates: ranked.slice(0, 10),
    nextAction: ranked.length === 0
      ? "Run npm run check:large-files:near-threshold before selecting a split batch."
      : "Pick one coherent runtime boundary; do not batch unrelated hot paths together.",
  };
}

function createPerfMarkdown(report) {
  const lines = [
    "# Runtime Evidence Gates",
    "",
    `Generated at: ${report.generatedAt}`,
    "",
    "## Performance Evidence",
    "",
    "| Source | Scenario | Metric | Value | Unit | Class | Target | Hard Fail | Reason | Next Action |",
    "|---|---|---|---:|---|---|---:|---:|---|---|",
  ];
  for (const entry of report.performanceEvidence) {
    lines.push(`| ${markdownCell(entry.source)} | ${markdownCell(entry.scenario)} | ${markdownCell(entry.metric)} | ${markdownCell(entry.value ?? "unsupported")} | ${markdownCell(entry.unit)} | ${entry.evidenceClass} | ${markdownCell(entry.budget?.target ?? "")} | ${markdownCell(entry.budget?.hardFail ?? "")} | ${markdownCell(entry.reason)} | ${markdownCell(entry.nextAction)} |`);
  }
  lines.push("", "## Realtime Correlation", "");
  lines.push(`- First token latency: ${report.realtimeSummary.firstTokenLatencyMs ?? "unsupported"} ms`);
  lines.push(`- Inter-token jitter P95: ${report.realtimeSummary.interTokenJitterP95Ms ?? "unsupported"} ms`);
  lines.push(`- Visible text lag P95: ${report.realtimeSummary.visibleTextLagP95Ms ?? "unsupported"} ms (turn-trace correlation gate)`);
  lines.push(`- Reducer amplification median: ${report.realtimeSummary.reducerAmplificationMedian ?? "unsupported"} ratio`);
  lines.push(`- Batch flush duration P95: ${report.realtimeSummary.batchFlushDurationP95Ms ?? "unsupported"} ms`);
  lines.push(`- Terminal settlement P95: ${report.realtimeSummary.terminalSettlementP95Ms ?? "unsupported"} ms`);
  lines.push(`- Visible lag risk: ${report.realtimeSummary.visibleLagRisk}`);
  lines.push(`- Terminal pressure: ${report.realtimeSummary.terminalPressure}`);
  lines.push(`- Turn trace evidence class: ${report.realtimeSummary.turnTraceEvidenceClass ?? "unsupported"} (source: ${report.realtimeSummary.turnTraceSource ?? "n/a"})`);
  lines.push(`- Next action: ${report.realtimeSummary.nextAction}`);
  lines.push("", "## Cold Start", "");
  lines.push(`- First paint evidence: ${report.coldStartSummary.firstPaintEvidence}`);
  lines.push(`- First interactive evidence: ${report.coldStartSummary.firstInteractiveEvidence}`);
  lines.push(`- Reason: ${report.coldStartSummary.reason}`);
  lines.push(`- Next action: ${report.coldStartSummary.nextAction}`);
  lines.push("");
  return lines.join("\n");
}

function createOpenSpecMarkdown(report) {
  const lines = [
    "# Runtime Evidence Gate Governance Report",
    "",
    `Generated at: ${report.generatedAt}`,
    "",
    "## Archive Readiness",
    "",
    "| Change | Tasks | Recommendation | Qualifier |",
    "|---|---:|---|---|",
  ];
  for (const change of report.archiveReadiness.completed) {
    lines.push(`| ${markdownCell(change.name)} | ${change.tasks} | ${change.recommendation} | ${markdownCell(change.qualifier)} |`);
  }
  lines.push("", "## In Progress", "");
  if (report.archiveReadiness.inProgress.length === 0) {
    lines.push("- No in-progress active changes.");
  } else {
    for (const change of report.archiveReadiness.inProgress) {
      lines.push(`- ${change.name}: ${change.tasks}, ${change.recommendation}`);
    }
  }
  lines.push("", "## Compatibility / Cleanup Matrix", "");
  lines.push("| Path | Classification | Reason | Verification |");
  lines.push("|---|---|---|---|");
  for (const entry of report.compatibilityPaths) {
    lines.push(`| ${markdownCell(entry.name)} | ${entry.classification} | ${markdownCell(entry.reason)} | ${markdownCell(entry.verification)} |`);
  }
  lines.push("", "## Large-File Optimization Queue", "");
  lines.push(`Source: ${report.largeFileSummary.source ?? "missing"}`);
  lines.push("");
  lines.push("| Path | Priority | Lines | Headroom | Facade / Boundary |");
  lines.push("|---|---|---:|---:|---|");
  for (const candidate of report.largeFileSummary.candidates) {
    lines.push(`| ${markdownCell(candidate.path)} | ${candidate.priority} | ${candidate.lines} | ${candidate.headroom ?? "n/a"} | ${markdownCell(candidate.facade)} |`);
  }
  lines.push("", `Next action: ${report.largeFileSummary.nextAction}`, "");
  return lines.join("\n");
}

async function main() {
  const perfBaseline = await readJsonIfExists(PERF_BASELINE_PATH);
  const browserScroll = await readJsonIfExists(BROWSER_SCROLL_PATH);
  const realtimeTurnTrace = await readJsonIfExists(REALTIME_TURN_TRACE_PATH);
  const largeFileReport = await readJsonIfExists(LARGE_FILE_WATCHLIST_PATH);
  const openSpecState = runJson("openspec", ["list", "--json"]);
  const performanceEvidence = buildPerfEvidence([
    { path: PERF_BASELINE_PATH, fragment: perfBaseline },
    { path: BROWSER_SCROLL_PATH, fragment: browserScroll },
  ]);
  // Enrich baseline rows in place; the function mutates and returns the same array.
  const realtimeTraceBudgets = buildRealtimeTraceBudgets(performanceEvidence);
  const report = {
    schemaVersion: "1.0",
    generatedAt: new Date().toISOString(),
    sources: {
      perfBaseline: existsSync(repoPath(PERF_BASELINE_PATH)) ? PERF_BASELINE_PATH : null,
      browserScroll: existsSync(repoPath(BROWSER_SCROLL_PATH)) ? BROWSER_SCROLL_PATH : null,
      realtimeTurnTrace: existsSync(repoPath(REALTIME_TURN_TRACE_PATH)) ? REALTIME_TURN_TRACE_PATH : null,
      largeFileWatchlist: existsSync(repoPath(LARGE_FILE_WATCHLIST_PATH)) ? LARGE_FILE_WATCHLIST_PATH : null,
      openSpec: "openspec list --json",
    },
    performanceEvidence,
    realtimeSummary: buildRealtimeSummary(performanceEvidence, realtimeTurnTrace),
    realtimeTraceBudgets,
    coldStartSummary: buildColdStartSummary(performanceEvidence),
    archiveReadiness: buildArchiveReadiness(openSpecState),
    compatibilityPaths,
    largeFileSummary: buildLargeFileSummary(largeFileReport),
  };
  await writeText(OUTPUT_JSON_PATH, `${JSON.stringify(report, null, 2)}\n`);
  await writeText(OUTPUT_PERF_MARKDOWN_PATH, createPerfMarkdown(report));
  await writeText(OUTPUT_OPENSPEC_MARKDOWN_PATH, createOpenSpecMarkdown(report));
  console.info(`runtime evidence report written: ${OUTPUT_JSON_PATH}`);
  console.info(`runtime evidence markdown written: ${OUTPUT_PERF_MARKDOWN_PATH}`);
  console.info(`openspec governance report written: ${OUTPUT_OPENSPEC_MARKDOWN_PATH}`);
}

export const runtimeEvidenceReportInternals = {
  buildLargeFileSummary,
  buildPerfEvidence,
  buildRealtimeSummary,
  buildRealtimeTraceBudgets,
};

const isDirectExecution =
  process.argv[1] != null &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isDirectExecution) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
