## Verification Report: wire-project-map-auto-ingestion

### Summary

| Dimension | Status |
|---|---|
| Completeness | 17/17 tasks complete; 7 requirements synced into `project-xray-panel` |
| Correctness | Scheduler, request contract, worker prompt, candidate safety, processed markers, topology repair, enablement, JSON repair, dialog layout, and canvas control preference mapped to tests |
| Consistency | Auto Ingestion now reuses the Project Map generation queue instead of hidden synchronous writes |

### Evidence

- OpenSpec strict validation recorded in tasks: `openspec validate wire-project-map-auto-ingestion --strict` passed.
- Change validation in this calibration: `openspec validate wire-project-map-auto-ingestion --strict` passed.
- Main spec validation in this calibration: `openspec validate project-xray-panel --strict` passed.
- Full workspace validation in this calibration: `openspec validate --all --strict --no-interactive` passed with `317 passed, 0 failed`.
- Diff hygiene in this calibration: `git diff --check` passed.
- Focused validation recorded in tasks:
  - `useProjectMapDataset.test.tsx`
  - `ProjectMapPanel.test.tsx`
  - `projectMapGenerationWorker.test.ts`
  - `autoIngestion.test.ts`
  - `projectMapLayoutCss.test.ts`
  - `projectMapPersistence.test.ts`
  - `incrementalGeneration.test.ts`
- TypeScript validation recorded in tasks: `npm run typecheck` passed.

### Requirement Mapping

#### Auto Ingestion run lifecycle

- Enabled Auto Ingestion evaluates interval, threshold, `lastCheckedAt`, and pending/running auto-run guards.
- Threshold hits create queued `kind="auto"` runs with `scope.kind="auto"` and consumed message hashes.
- Existing pending/running auto runs block duplicate queueing.
- Successful auto runs mark consumed messages processed; failed/cancelled runs do not.

#### Candidate safety and graph reachability

- `createCandidate` keeps generated updates as candidate review items or candidate nodes.
- `autoApplyEvidenceBacked` still enqueues real work while keeping weak memory-only claims candidates.
- Auto-generated top-level nodes keep root reachability even when the AI payload omits the existing root.
- Persisted orphan roots are repaired on read.

#### Enablement and structured output repair

- Enabling Auto Ingestion opens engine/model configuration first.
- Cancelling leaves `enabled=false`.
- Invalid or prose AI output gets one JSON-only repair turn through the same engine/model.
- Repair failure keeps the run failed and does not write dataset changes or processed markers.

#### Dialog and canvas chrome

- Generation and Auto Ingestion dialogs use compact minimum width with content-adaptive desktop expansion and narrow-screen fallback.
- Enable dialog keeps model refresh inline with the model control row.
- Canvas controls default collapsed, persist user preference in local UI state, and graph actions do not overwrite that preference.

### Archive Decision

Ready for archive preparation. The behavior is synced into `project-xray-panel`, and strict validation passes.
