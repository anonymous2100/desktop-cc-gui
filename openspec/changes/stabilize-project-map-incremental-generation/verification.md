## Verification Report: stabilize-project-map-incremental-generation

### Summary

| Dimension | Status |
|---|---|
| Completeness | 41/41 tasks complete; 7 requirements synced into main spec |
| Correctness | Incremental merge, scoped node merge, evidence navigation, prompt, Codex output extraction, and candidate-resolution behavior mapped to focused tests |
| Consistency | Main spec `project-map-incremental-generation` created and validated |

### Evidence

- OpenSpec strict validation recorded in tasks: `openspec validate stabilize-project-map-incremental-generation --strict` passed.
- Main spec validation in this calibration: `openspec validate project-map-incremental-generation --strict` passed.
- Full workspace validation in this calibration: `openspec validate --all --strict --no-interactive` passed with `317 passed, 0 failed`.
- Diff hygiene in this calibration: `git diff --check` passed.
- Focused validation recorded in tasks:
  - `ProjectMapPanel.test.tsx`
  - `useProjectMapDataset.test.tsx`
  - `projectMapGenerationWorker.test.ts`
  - `projectMapPersistence.test.ts`
  - `incrementalGeneration.test.ts`
  - `candidates.test.ts`
- TypeScript, lint, build, and OpenSpec checks are recorded as passing in tasks 5, 12, 13, and 14.

### Requirement Mapping

#### Incremental global Project Map generation

- Repeated global collection preserves omitted existing nodes and lenses.
- Lens stats are recalculated from the merged node set instead of treating model omissions as deletion.

#### Scoped node generation merge

- Complete node updates only selected-node scope plus source-backed children.
- Calibrate node updates verification/confidence/stale fields in scope.
- Completed calibration does not imply candidate confirmation; unresolved candidates remain visible.

#### Evidence-aware merge semantics

- Existing and generated sources are deduped/unioned.
- Confidence cannot be blindly upgraded to high without supporting sources.
- Calibration can lower confidence and mark stale when evidence contradicts a node.

#### Manual pruning

- Delete-node action removes the selected node, descendants, parent-child links, and affected pending candidates.
- Root deletion clears all Project Map nodes and recalculates lens stats.

#### Evidence navigation and editor companion

- File-backed evidence opens through the center editor with line navigation.
- Project Map evidence opens keep Project Map as the companion surface.
- Closing the last Project Map evidence file returns to Project Map rather than conversation canvas.
- Non-file evidence remains inert.

#### Prompt and output robustness

- Collect / Complete / Calibrate prompts are action-specific and incremental.
- Path-like labels and refs can be normalized into readable workspace evidence.
- Codex final assistant fields such as `last_agent_message` are parsed before declaring JSON failure.

### Archive Decision

Ready for archive preparation. The change has a synced main spec and no open critical issues in the recorded verification evidence.
