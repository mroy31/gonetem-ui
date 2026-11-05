# Proposal

## Why

gonetem-ui has accumulated substantial behavior (project lifecycle, topology orchestration, consoles, captures) with no durable specification of what it guarantees. Recording the current behavior as specs gives future changes a baseline to diff against and makes implicit contracts — IPC surface, error handling, stream-to-event plumbing — explicit.

## What Changes

- No code changes. This change documents existing, observed behavior as the project's baseline capability specs.
- Adds 10 capability specs covering the main-process API layer (`src/api/*`), the preload IPC surface (`src/preload.ts`), and the renderer-visible behavior tied to them.
- Deliberately excludes gRPC RPCs defined in `proto/netem.proto` but never wired into the UI (`LinkAdd`/`LinkDel`/`LinkUpdate`, `TopologyStartAll`/`TopologyStopAll`, `ServerCleanContainers`, `NodeCopyFrom`/`NodeCopyTo`, `ProjectGetNodeConfigs`): specs describe what gonetem-ui promises, not what the server protocol permits.

## Capabilities

### New Capabilities
- `server-connection`: connecting to the gonetem server, version handshake, TLS credentials, autoconnect on launch
- `app-preferences`: persisted user options (server URI, autoconnect, TLS, external console command) and window bounds via electron-store
- `project-management`: open/create/save/close of `.gnet` projects and attaching to server-side projects
- `topology-definition`: reading, writing, checking the topology file (network.yml) and recording the graph as PNG
- `topology-lifecycle`: running/reloading a topology with streamed progress and per-node messages
- `node-management`: node start/stop/restart, interface up/down, node configuration file viewing
- `node-consoles`: external terminal spawning and internal xterm consoles over the NodeExec duplex stream
- `packet-capture`: streaming interface captures from a node interface into Wireshark
- `server-image-pull`: pulling server-side docker images with per-image progress
- `localization`: fr/en UI translations with persisted dynamic translation keys

### Modified Capabilities
<!-- none: no existing specs -->

## Impact

- No source, dependency, or build impact.
- `openspec/specs/` gains 10 capability specs (via sync of this change's deltas).
- Future changes to `src/api/*`, `src/preload.ts`, or the renderer must stay consistent with these specs or amend them.
