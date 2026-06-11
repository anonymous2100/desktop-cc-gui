# Runtime Evidence Gates

Generated at: 2026-06-11T07:23:55.566Z

## Performance Evidence

| Source | Scenario | Metric | Value | Unit | Class | Target | Hard Fail | Reason | Next Action |
|---|---|---|---:|---|---|---:|---:|---|---|
| docs/perf/baseline.json | S-LL-200 | commitDurationP50 | 10.15 | ms | proxy |  |  | Fixture or replay evidence; useful for regression comparison, not release-grade runtime proof. | Keep as regression baseline and add runtime/browser evidence before release-grade closure. |
| docs/perf/baseline.json | S-LL-200 | commitDurationP95 | 10.15 | ms | proxy |  |  | Fixture or replay evidence; useful for regression comparison, not release-grade runtime proof. | Keep as regression baseline and add runtime/browser evidence before release-grade closure. |
| docs/perf/baseline.json | S-LL-200 | firstPaintAfterMount | 35.81 | ms | proxy |  |  | Fixture or replay evidence; useful for regression comparison, not release-grade runtime proof. | Keep as regression baseline and add runtime/browser evidence before release-grade closure. |
| docs/perf/baseline.json | S-LL-500 | commitDurationP50 | 13.84 | ms | proxy |  |  | Fixture or replay evidence; useful for regression comparison, not release-grade runtime proof. | Keep as regression baseline and add runtime/browser evidence before release-grade closure. |
| docs/perf/baseline.json | S-LL-500 | commitDurationP95 | 13.84 | ms | proxy |  |  | Fixture or replay evidence; useful for regression comparison, not release-grade runtime proof. | Keep as regression baseline and add runtime/browser evidence before release-grade closure. |
| docs/perf/baseline.json | S-LL-500 | firstPaintAfterMount | 33.48 | ms | proxy |  |  | Fixture or replay evidence; useful for regression comparison, not release-grade runtime proof. | Keep as regression baseline and add runtime/browser evidence before release-grade closure. |
| docs/perf/baseline.json | S-LL-1000 | commitDurationP50 | 18.03 | ms | proxy |  |  | Fixture or replay evidence; useful for regression comparison, not release-grade runtime proof. | Keep as regression baseline and add runtime/browser evidence before release-grade closure. |
| docs/perf/baseline.json | S-LL-1000 | commitDurationP95 | 18.03 | ms | proxy |  |  | Fixture or replay evidence; useful for regression comparison, not release-grade runtime proof. | Keep as regression baseline and add runtime/browser evidence before release-grade closure. |
| docs/perf/baseline.json | S-LL-1000 | firstPaintAfterMount | 36.91 | ms | proxy |  |  | Fixture or replay evidence; useful for regression comparison, not release-grade runtime proof. | Keep as regression baseline and add runtime/browser evidence before release-grade closure. |
| docs/perf/baseline.json | S-LL-1000 | scrollFrameDropPct | 0 | % | proxy | 1 | 5 | jsdom proxy; browser scroll gate is follow-up | Add browser-level scroll gate for the 1000-row scenario. |
| docs/perf/baseline.json | S-CI-50 | keystrokeToCommitP95 | 0.09 | ms | proxy | 16 | 32 | Fixture or replay evidence; useful for regression comparison, not release-grade runtime proof. | Keep as regression baseline and add runtime/browser evidence before release-grade closure. |
| docs/perf/baseline.json | S-CI-50 | inputEventLossCount | 0 | count | proxy |  |  | Fixture or replay evidence; useful for regression comparison, not release-grade runtime proof. | Keep as regression baseline and add runtime/browser evidence before release-grade closure. |
| docs/perf/baseline.json | S-CI-50 | compositionToCommit | 0 | ms | proxy |  |  | Fixture or replay evidence; useful for regression comparison, not release-grade runtime proof. | Keep as regression baseline and add runtime/browser evidence before release-grade closure. |
| docs/perf/baseline.json | S-CI-100-IME | keystrokeToCommitP95 | 0.03 | ms | proxy | 16 | 32 | Fixture or replay evidence; useful for regression comparison, not release-grade runtime proof. | Keep as regression baseline and add runtime/browser evidence before release-grade closure. |
| docs/perf/baseline.json | S-CI-100-IME | inputEventLossCount | 0 | count | proxy |  |  | Fixture or replay evidence; useful for regression comparison, not release-grade runtime proof. | Keep as regression baseline and add runtime/browser evidence before release-grade closure. |
| docs/perf/baseline.json | S-CI-100-IME | compositionToCommit | 0.13 | ms | proxy |  |  | Fixture or replay evidence; useful for regression comparison, not release-grade runtime proof. | Keep as regression baseline and add runtime/browser evidence before release-grade closure. |
| docs/perf/baseline.json | S-RS-FT | firstTokenLatency | 5000 | ms | proxy | 2000 | 5000 | turn start to first assistant delta | Correlate replay metrics with runtime visible-lag and terminal-pressure traces. |
| docs/perf/baseline.json | S-RS-FT | interTokenJitterP95 | 920 | ms | proxy | 500 | 920 | Fixture or replay evidence; useful for regression comparison, not release-grade runtime proof. | Correlate replay metrics with runtime visible-lag and terminal-pressure traces. |
| docs/perf/baseline.json | S-RS-PE | dedupHitRatio | 0.25 | ratio | proxy |  |  | Fixture or replay evidence; useful for regression comparison, not release-grade runtime proof. | Correlate replay metrics with runtime visible-lag and terminal-pressure traces. |
| docs/perf/baseline.json | S-RS-PE | assemblerLatency | 4.09 | ms | proxy |  |  | replay reducer-path proxy latency | Correlate replay metrics with runtime visible-lag and terminal-pressure traces. |
| docs/perf/baseline.json | S-CS-COLD | bundleSizeMain | 1121481 | bytes | measured | 950000 | 1100000 | App-GOSdMQOY.js | Track for regression. |
| docs/perf/baseline.json | S-CS-COLD | bundleSizeVendor | 741552 | bytes | measured | 680000 | 760000 | subset-shared.chunk-BukY6QKG.js | Track for regression. |
| docs/perf/baseline.json | S-CS-COLD | firstPaintMs | unsupported | ms | unsupported |  |  | Tauri webview headless cold-start timing is not available in this script; bundle baseline is recorded. | Collect real Tauri webview cold-start timing on a supported runner. |
| docs/perf/baseline.json | S-CS-COLD | firstInteractiveMs | unsupported | ms | unsupported |  |  | Tauri webview headless cold-start timing is not available in this script; bundle baseline is recorded. | Collect real Tauri webview cold-start timing on a supported runner. |
| docs/perf/long-list-browser-scroll.json | S-LL-1000 | browserScrollFrameDropPct | 0 | % | measured |  |  | browser=/Applications/Google Chrome.app/Contents/MacOS/Google Chrome | Track for regression. |

## Realtime Correlation

- First token latency: 5000 ms
- Inter-token jitter P95: 920 ms
- Visible lag risk: high
- Terminal pressure: not-directly-measured
- Next action: Add runtime trace that correlates ingress cadence, batch flush, render-visible cadence, and terminal settlement.

## Cold Start

- First paint evidence: unsupported
- First interactive evidence: unsupported
- Reason: Tauri webview headless cold-start timing is not available in this script; bundle baseline is recorded.
- Next action: Collect Tauri webview timing on supported macOS/Windows/Linux runners.
