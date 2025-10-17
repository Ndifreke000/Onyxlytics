# Onyxlytics — Solana Analytics Dashboard

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/ndifreke000s-projects/v0-dashboard-m-o-n-k-y)

Onyxlytics is a developer-first analytics dashboard focused on the Solana blockchain. It provides real-time network metrics, validator and transaction insights, query tooling and visualization primitives. The frontend is a Next.js app paired with lightweight server-side API routes for Solana RPC access and a query-execution layer.

This README documents the architecture, workflow, Work Breakdown Structure (WBS), backend tasks, smart contract integration points, known incomplete areas, and recommended next steps to bring this project to production readiness.

## Table of contents
- Project snapshot
- Architecture (components + data flow)
- Workflow and developer experience
- Work Breakdown Structure (WBS) — milestones and tasks
- Backend responsibilities and API contracts
- Smart contract / Solana integration plan
- Incomplete files, TODOs and risk list
- How to run locally, tests and quality gates
- Next steps and recommended priorities

## Project snapshot
- Framework: Next.js (app router), TypeScript
- Focus: Solana network analytics + query editor and visualizations
- Key folders:
  - `app/` — Next.js pages + API routes
  - `components/` — React UI primitives & dashboard pieces
  - `lib/` — Solana RPC helpers and query helpers
  - `hooks/` — client hooks (metrics polling)
  - `data/`, `mock.json` — mocked data used by UI
  - `types/` — shared TypeScript interfaces

## Architecture

High level components:

- Browser / Client UI (Next.js pages in `app/*` and `components/`)
  - Dashboard widgets, charts and query editor.
  - Polling hook `useSolanaMetrics` for live updates.

- Server-side API layer (Next.js route handlers in `app/api/solana/*`)
  - `/api/solana/metrics` — aggregates calls to Solana RPC and returns normalized metrics
  - `/api/solana/query` — receives a query string and executes via `lib/solana-rpc.executeQuery`

- Solana RPC client (`lib/solana-rpc.ts`)
  - Small wrapper around JSON-RPC endpoints (getSlot, getSupply, getVersion, getClusterNodes, getTransactionCount, getBlockTime)
  - `executeQuery` provides a simple parser to map a query to underlying RPC calls (currently very basic)

- Data & mocks
  - `mock.json` and `data/chat-mock.ts` provide sample data used by pages/components during development

Data flow (textual diagram):

Client UI -> fetch /api/solana/metrics -> Next.js Route -> lib/solana-rpc -> Solana RPC node

Client UI -> POST /api/solana/query { query } -> Next.js Route -> lib/solana-rpc.executeQuery -> Solana RPC node -> result

Auth & security: currently not implemented (no API keys, rate-limiting, or RBAC). Plan to add API key or proxy with rate limiting for production RPC access.

## Workflow & developer experience

- Local dev: `pnpm dev` or `npm run dev` to start Next.js in development mode
- Build: `npm run build` (Next.js production build)
- Lint: `npm run lint` (ESLint configured)
- The app uses mocked data by default (see `mock.json`) so UI work can progress without real RPC traffic.

## Work Breakdown Structure (WBS)

Priority breakdown into 3 milestone groups: Minimum Viable Product (MVP), Harden & Integrate, Production Launch.

MVP (2–3 sprints):
1. Stabilize metrics API
	- Harden `lib/solana-rpc` error handling and add configurable RPC endpoint via environment variable
	- Add caching (in-memory TTL) for expensive RPC calls
2. Query editor execution
	- Upgrade `executeQuery` to a safe parser, whitelist allowed fields and prevent costly RPC patterns
	- Add request size/timeout guards
3. Connect UI to live API
	- Replace mock dataset where appropriate; wire charts and widgets to `/api/solana/metrics`
4. Basic docs and run instructions (this README)

Harden & Integrate (3–4 sprints):
5. Add auth & rate-limiting
	- Add API key/secret support for server routes; restrict publicly exposed endpoints
	- Use Vercel/Cloudflare Workers or an express server proxy for controlling RPC access if needed
6. Smart contract program integration (optional per feature)
	- Design on-chain data pipelines, e.g., pull program-specific TVL, program accounts, token balances
	- Integrate with Anchor/IDL parsing if consuming program-defined data
7. Persistent storage & ingestion
	- Add a small time-series DB (InfluxDB, Timescale) or Postgres + materialized views for historical queries
8. Tests, CI and monitoring
	- Unit tests for lib functions, API integration tests using local RPC mocks or test validator

Production Launch (1–2 sprints):
9. Observability & security reviews
10. Performance tuning & capacity planning

## Backend responsibilities & API contracts

API: GET /api/solana/metrics
- Response (success): { success: true, data: { slot, supply, version, timestamp, validatorCount, avgSlotTime } }
- Error response: { success: false, error: string }

API: POST /api/solana/query
- Request: { query: string }
- Response (success): { success: true, query, result, timestamp }

Server responsibilities checklist:
- Validate and sanitize incoming queries
- Map high-level queries to RPC calls using a safe, tested layer
- Add caching for hot endpoints (slot, supply, validator list)
- Add observability (request metrics, latencies, error rates)
- Add API access control for production

### Contract / data shapes (developer contract)
- `lib/solana-rpc.getSolanaMetrics()` returns { slot, supply, version, timestamp }
- `lib/solana-rpc.getClusterNodes()` returns array of validator info (per Solana JSON-RPC shape)

## Smart contract / on-chain integration plan

The project currently queries Solana network-level RPC endpoints. For program-level analytics (TVL, account balances, event logs), follow this plan:

1. Identify target programs (e.g., Serum, Raydium, custom programs)
2. For programs using Anchor, fetch the IDL (via on-chain or source) and generate types to decode account data
3. Implement a worker/ingest process that:
	- Fetches program accounts via `getProgramAccounts` with filters
	- Decodes account data into typed records
	- Persists snapshots to Postgres or a time-series DB for aggregation
4. Expose server API endpoints that summarize program-level metrics (TVL, active accounts, deposits/withdrawals)
5. For high-throughput event tracking, consider using a block-processor or confirmed-block subscription (WebSocket) with checkpointing

Security notes for smart contract integrations:
- Never process untrusted user-provided IDLs or account decoders without sandboxing
- Use read-only RPC keys and separate production ingestion keys
- Rate limit getProgramAccounts and large RPC queries; prefer filtered queries and batched decoding

## Known incomplete files, TODOs, and areas needing work

I scanned the repository and prioritized items that block shipping the backend or smart contract integration. The list below indicates files or sections that require implementation, improvement or verification.

High-priority (should fix for MVP):
- `lib/solana-rpc.ts` — executeQuery is a very small parser that maps keyword presence to RPC calls. Replace with a safe query parser and white-listed field handling. Add environment-configurable RPC endpoint and in-memory cache.
- `app/api/solana/query/route.ts` — currently trusts the incoming query string as-is. Add validation, parsing and rate-limiting (API key / secret) for production usage.
- `app/api/solana/metrics/route.ts` — add caching and defensive parsing of RPC results. Validator count currently derived from `getClusterNodes` without validation.

Medium-priority:
- `mock.json` and many components (`components/dashboard/*`, `components/chat/*`) are still using mocked data. Replace or progressively remove mocks where live data is available.
- `hooks/use-solana-metrics.ts` — polling is implemented, but error handling and backoff retry strategies should be added.
- Add unit tests for `lib/solana-rpc` RPC wrapper and API routes.

Low-priority / optional:
- Add program-specific ingestion (`getProgramAccounts`) and a background worker for decoding program accounts.
- Add persistent storage for historical metrics (optional for MVP but recommended for analytics)

Repository scan (selected files flagged during scan):
- `lib/solana-rpc.ts` — core RPC client and `executeQuery` (needs hardening)
- `app/api/solana/metrics/route.ts` — aggregator API (no cache, no auth)
- `app/api/solana/query/route.ts` — query execution (no validation)
- `hooks/use-solana-metrics.ts` — polling hook (improve error handling/backoff)
- `mock.json`, `data/chat-mock.ts` — mock datasets used broadly
- UI components under `components/dashboard/*` that still read from `mock.json` (chart, widget, mobile-header, etc.)

Files that contain placeholders or mock-backed behavior (examples):
- `components/dashboard/chart/index.tsx` — uses `mock.json` and keeps mock data in state
- `components/dashboard/query-editor/index.tsx` — example queries are present; the load/save flow may be mocked

## How to run locally

Prerequisites: Node.js 18+, pnpm (or npm/yarn)

1. Install dependencies

```bash
pnpm install
```

2. Run development server

```bash
pnpm dev
```

3. Open http://localhost:3000

Notes:
- The app uses `mock.json` to render UI by default. To call live RPC endpoints, set the environment variable `SOLANA_RPC_URL` (or update `lib/solana-rpc.ts` to read from process.env) and run the app in a secure environment.

## Quality gates (quick checks)

From scanning package.json the repo uses Next.js 14 and TypeScript. Automated checks to add/enable:
- Unit tests (Jest / Vitest) — not present yet
- Linting — `npm run lint` is available
- CI — Not configured; recommend GitHub Actions to run lint, typecheck and tests

## Next steps & recommended priorities (concrete)

1. Hardening `lib/solana-rpc`
	- Add configurable RPC URL (env var)
	- Add TTL caching for `getSolanaMetrics` and `getClusterNodes`
	- Add typed return shapes and unit tests
2. Secure API routes
	- Add basic API-key or JWT-based access control, or gate heavy endpoints behind server-only operations
3. Replace critical UI mocks with live data once backend is stable
4. Implement program-level ingestion worker if you need TVL or program analytics
5. Add CI with unit tests and lint

## Appendix — Developer contract snippets

Example: Make RPC URL configurable (in Node/Next server environment)

const RPC_URL = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com"

Cache pattern (simple in-memory TTL): store last result + timestamp, serve cached value if still valid

## Final notes

This README is intentionally pragmatic: it gives a clear path from the current mock-driven UI to a hardened backend with program-level analytics. If you'd like, I can:

- Implement the `SOLANA_RPC_URL` environment wiring and caching in `lib/solana-rpc.ts` (small patch)
- Add request validation and basic API key protection to `app/api/solana/query/route.ts`
- Create unit tests for `lib/solana-rpc`

Tell me which of the concrete next steps above you want me to implement and I will start with a prioritized todo and a patch.
