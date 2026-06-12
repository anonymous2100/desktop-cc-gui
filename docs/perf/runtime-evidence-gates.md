# Runtime Evidence Gates

Generated at: 2026-06-12T05:34:49.658Z

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
| docs/perf/baseline.json | S-RS-PE | assemblerLatency | 4.18 | ms | proxy |  |  | replay reducer-path proxy latency | Correlate replay metrics with runtime visible-lag and terminal-pressure traces. |
| docs/perf/realtime-extended-baseline.json | S-RS-VL | visibleTextLagP95 | 24 | ms | proxy | 2000 | 5000 | Replay-derived first-delta -> first-visible-text P95; jsdom/PerformanceObserver path is the follow-up. | Wire PerformanceObserver in Tauri webview to record first visible text growth and bring this to measured. |
| docs/perf/realtime-extended-baseline.json | S-RS-RA | reducerAmplificationMedian | 4 | ratio | proxy | 2 | 4 | Replay-derived reducer amplification median; reflects fixture batch grouping. | Cross-check with renderer-side reducer commit count under live Tauri session. |
| docs/perf/realtime-extended-baseline.json | S-RS-FD | batchFlushDurationP95 | 13.33 | ms | proxy | 8 | 16 | Replay-derived batch flush duration P95; replay group window is the surrogate. | Replace with measured wall-clock gap between batcher flush-start and flush-end in the renderer hot path. |
| docs/perf/realtime-extended-baseline.json | S-RS-TS | terminalSettlementP95 | 60 | ms | proxy | 100 | 250 | Replay-derived terminal settlement P95 (last reducer commit -> agentCompleted). | Wire real Tauri/webview terminal signal (provider final + reducer final) and reclassify to measured. |
| docs/perf/baseline.json | S-CS-COLD | bundleSizeMain | 1121481 | bytes | measured | 950000 | 1100000 | App-GOSdMQOY.js | Track for regression. |
| docs/perf/baseline.json | S-CS-COLD | bundleSizeVendor | 741552 | bytes | measured | 680000 | 760000 | subset-shared.chunk-BukY6QKG.js | Track for regression. |
| docs/perf/baseline.json | S-CS-COLD | firstPaintMs | unsupported | ms | unsupported |  |  | Tauri webview headless cold-start timing is not available in this script; bundle baseline is recorded. | Collect real Tauri webview cold-start timing on a supported runner. |
| docs/perf/baseline.json | S-CS-COLD | firstInteractiveMs | unsupported | ms | unsupported |  |  | Tauri webview headless cold-start timing is not available in this script; bundle baseline is recorded. | Collect real Tauri webview cold-start timing on a supported runner. |
| docs/perf/composer-baseline.json | S-CI-50 | keystrokeToCommitP95 | 0.08 | ms | proxy |  |  | Fixture or replay evidence; useful for regression comparison, not release-grade runtime proof. | Keep as regression baseline and add runtime/browser evidence before release-grade closure. |
| docs/perf/composer-baseline.json | S-CI-50 | inputEventLossCount | 0 | count | proxy |  |  | Fixture or replay evidence; useful for regression comparison, not release-grade runtime proof. | Keep as regression baseline and add runtime/browser evidence before release-grade closure. |
| docs/perf/composer-baseline.json | S-CI-50 | compositionToCommit | 0 | ms | proxy |  |  | Fixture or replay evidence; useful for regression comparison, not release-grade runtime proof. | Keep as regression baseline and add runtime/browser evidence before release-grade closure. |
| docs/perf/composer-baseline.json | S-CI-100-IME | keystrokeToCommitP95 | 0.03 | ms | proxy |  |  | Fixture or replay evidence; useful for regression comparison, not release-grade runtime proof. | Keep as regression baseline and add runtime/browser evidence before release-grade closure. |
| docs/perf/composer-baseline.json | S-CI-100-IME | inputEventLossCount | 0 | count | proxy |  |  | Fixture or replay evidence; useful for regression comparison, not release-grade runtime proof. | Keep as regression baseline and add runtime/browser evidence before release-grade closure. |
| docs/perf/composer-baseline.json | S-CI-100-IME | compositionToCommit | 0.12 | ms | proxy |  |  | Fixture or replay evidence; useful for regression comparison, not release-grade runtime proof. | Keep as regression baseline and add runtime/browser evidence before release-grade closure. |
| docs/perf/long-list-browser-scroll.json | S-LL-1000 | browserScrollFrameDropPct | 0 | % | measured |  |  | browser=/Applications/Google Chrome.app/Contents/MacOS/Google Chrome | Track for regression. |

## Realtime Correlation

- First token latency: 5000 ms
- Inter-token jitter P95: 920 ms
- Visible text lag P95: 24 ms (turn-trace correlation gate)
- Reducer amplification median: 4 ratio
- Batch flush duration P95: 13.33 ms
- Terminal settlement P95: 60 ms
- Visible lag risk: high
- Terminal pressure: not-directly-measured
- Turn trace evidence class: proxy (source: docs/perf/realtime-turn-trace.json)
- Next action: Add runtime trace that correlates ingress cadence, batch flush, render-visible cadence, and terminal settlement.

## Renderer Resource Pressure

- Backpressure flush cap: 200 events / 131072 bytes
- Backpressure evidence: proxy
- Listener owner pilot surfaces: events.terminal-output, events.runtime-log-line, events.runtime-log-status, focus-refresh-wave
- Media owner pilot surfaces: message-image-grid, message-deferred-image
- Residual listener risk: Full-app listener inventory remains manual; pilot surfaces are tracked first.

## Backend IO / Bridge Payload

- Scan cache substrate: ScanCache<K,V>.get_or_compute/invalidate/invalidate_matching
- JSONL states: append-only, full-rescan, corrupt-fallback
- Bridge pilot command: get_git_log
- Bridge payload target: 1048576 bytes / 2000 items
- Bridge residual risk: session catalog, local usage, Claude history, workspace files, project map relations

## Workspace File Listing

- Diagnostics label: workspaces.file.listing-budget
- Initial listing target: 1048576 bytes / 2000 entries
- Subtree target entries: 500
- Shared index fields: pathTokens, directoryTokens, sourceVersion, freshness, invalidatedPaths
- Long-list commit P95: 18.03 ms
- Browser scroll drop: 0%
- Content safety: Diagnostics store hashes, counts, sourceVersion, and payload sizes; file contents and raw paths are excluded.

## Markdown Precompute

- Diagnostics label: perf.messages.markdown.precompute
- Threshold: 10000 chars or fenced-code, math, table, raw-html
- Modes: worker-precompute, main, cache-hit, fallback
- Unsafe HTML boundary: Worker output is not trusted DOM; rich React render and sanitization remain on the main renderer path.
- Content safety: Diagnostics store source length/hash and structural counts; raw Markdown, prompt text, assistant body, tool output, and file content are excluded.

## Cold Start

- First paint evidence: unsupported
- First interactive evidence: unsupported
- Reason: Tauri webview headless cold-start timing is not available in this script; bundle baseline is recorded.
- Next action: Collect Tauri webview timing on supported macOS/Windows/Linux runners.
