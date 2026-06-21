## ADDED Requirements

### Requirement: Live Runtime Cleanup Diagnostics MUST Be Low-Interruption

The realtime conversation message canvas MUST distinguish transient managed-runtime cleanup diagnostics from blocking runtime reconnect failures without changing backend lifecycle semantics.

#### Scenario: transient cleanup does not render as blocking failure
- **WHEN** an assistant diagnostic message contains `[RUNTIME_ENDED]`
- **AND** the diagnostic identifies expected managed cleanup such as `stale_reuse_cleanup` or `internal_replacement`
- **THEN** the live message canvas MUST render a low-interruption runtime status rather than the full blocking reconnect failure presentation
- **AND** the UI MUST keep the assistant message content readable

#### Scenario: blocking runtime failures keep recovery actions
- **WHEN** an assistant diagnostic message indicates broken pipe, workspace-not-connected, recovery quarantine, stale thread/session recovery, or runtime-ended without expected cleanup source
- **THEN** the live message canvas MUST keep the existing recovery actions available
- **AND** the UI MUST NOT suppress the failure as a transient cleanup status

#### Scenario: UI tone does not change lifecycle authority
- **WHEN** a runtime diagnostic is rendered with transient visual tone
- **THEN** frontend lifecycle settlement MUST still rely on existing runtime, backend, user action, or terminal turn authority
- **AND** the UI MUST NOT infer completion solely from assistant text visibility or historical output quality
