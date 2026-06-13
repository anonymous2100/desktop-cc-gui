# Bundle Remediation Status

## Current Blocker

`S-CS-COLD/bundleSizeMain` remains a release hard blocker because `App-*.js` exceeds the `1,100,000 bytes-gzip` hardFail budget.

Current regenerated evidence:

- `dist/assets/App-JqN3Gseo.js`: `1,132,559 bytes-gzip`
- `docs/perf/cold-start-baseline.json`: `S-CS-COLD/bundleSizeMain = 1,132,559 bytes-gzip`
- `npm run perf:archive-readiness -- --release --json`: fails with `release-hard-budget-breach`

## Selected Target

Selected minimal target: `src/features/project-map/**` and `src/features/intent-canvas/**`.

Reason:

- They are reachable from the AppShell startup graph through `useAppShellLayoutNodesSection`.
- They are tool surfaces, not required to render the initial workspace shell.
- They explain a large non-startup business payload in `App-*.js`.
- They are tightly related and have an existing dependency cycle, so they should be split as one chunk instead of two separate chunks.

## Implemented Boundary

No bundle boundary is landed in this change.

The selected target remains the next remediation candidate. Keeping this change scoped to evidence collection avoids mixing release-gate semantics with a broader startup graph refactor.

## Evidence

Current evidence:

- `npm run perf:archive-readiness -- --release --json`: release mode fails with explicit blocker records.
- `docs/perf/runtime-evidence-gates.json`: keeps `bundleSizeMain` measured and above `hardFail`.
- `docs/perf/cold-start-baseline.json`: keeps Tauri/webview `firstPaintMs` and `firstInteractiveMs` unsupported until startup marker diagnostics are collected.

## Residual Risk

Release interpretation:

- The hard blocker is not removed.
- The change is not archive-ready for release closure.
- The clean next fix is to move Project Map / Intent Canvas behind a runtime dynamic import boundary or another evidence-backed startup graph split.
- This change deliberately avoids claiming release closure without measured cold-start/runtime evidence.
