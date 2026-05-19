import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const DOMAIN_DIR = path.join(ROOT, "src/features/threads/domain-events");
const EVENT_TYPES = [
  "session.started",
  "session.ended",
  "turn.started",
  "turn.completed",
  "turn.failed",
  "message.delta.appended",
  "message.completed",
  "tool.started",
  "tool.completed",
  "usage.updated",
];

function fail(message) {
  console.error(`[agent-domain-event-schema] ${message}`);
  process.exitCode = 1;
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

for (const relativePath of [
  "eventTypes.ts",
  "eventFactories.ts",
  "eventDerivationFixtures.ts",
  "events/session.ts",
  "events/turn.ts",
  "events/message.ts",
  "events/tool.ts",
  "events/usage.ts",
]) {
  const filePath = path.join(DOMAIN_DIR, relativePath);
  if (!fs.existsSync(filePath)) {
    fail(`missing required file: ${path.relative(ROOT, filePath)}`);
  }
}

const typeSource = readText(path.join(DOMAIN_DIR, "eventTypes.ts"));
for (const eventType of EVENT_TYPES) {
  if (!typeSource.includes(`"${eventType}"`)) {
    fail(`eventTypes missing "${eventType}"`);
  }
  if (!/^(session|turn|message|tool|usage)(\.[a-z][a-z0-9-]*)+$/.test(eventType)) {
    fail(`invalid event type format: ${eventType}`);
  }
}

const combinedEventSource = ["base", "session", "turn", "message", "tool", "usage"]
  .map((name) => readText(path.join(DOMAIN_DIR, "events", `${name}.ts`)))
  .join("\n");
for (const token of ["Readonly<", "occurredAt", "workspaceId", "sessionId", "engine"]) {
  if (!combinedEventSource.includes(token)) {
    fail(`domain event types missing token "${token}"`);
  }
}

const derivationSource = readText(path.join(DOMAIN_DIR, "eventDerivationFixtures.ts"));
for (const eventType of EVENT_TYPES) {
  if (!derivationSource.includes(`"${eventType}"`)) {
    fail(`derivation fixtures missing "${eventType}"`);
  }
}

for (const reducerFile of [
  "src/features/threads/hooks/useThreadsReducer.ts",
  "src/features/threads/hooks/threadReducerTypes.ts",
]) {
  const source = readText(path.join(ROOT, reducerFile));
  if (source.includes("domainEventFactories") || source.includes("deriveDomainEventFromStateDiff")) {
    fail(`${reducerFile} must not call domain event factories in this change`);
  }
}

if (process.exitCode) {
  process.exit();
}

console.log("[agent-domain-event-schema] ok");
