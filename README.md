## Onyxlytics — 2025

![Onyxlytics](public/assets/logo.png)

Build status: ⚠️ (push to GitHub triggers Vercel; make sure `pnpm-lock.yaml` is up to date)

Short description
-----------------

Onyxlytics is a developer-first analytics and query collaboration platform built with Next.js (app router), modern React, and an extensible backend surface that integrates with blockchain contracts (Solana) and traditional storage/DB layers. This README explains the architecture, how to run locally, and where to extend the system (including adding Rust contracts).

Quick links
-----------

- App entry: `app/page.tsx`
- API routes: `app/api/*` and `app/api/solana/*`
- UI components: `components/` and `components/dashboard/`
- Lib helpers: `lib/`
- Solana EDA & RPC helpers: `lib/solana-eda.ts`, `lib/solana-rpc.ts`

Visual architecture (Mermaid)
----------------------------

```mermaid
flowchart LR
    A[Client] --> B[Frontend]
    B --> C[API Layer]
    C --> D[(Database)]
    C --> E[(Storage)]
    C --> F[Contracts]
    
    subgraph Client
        A
    end
    
    subgraph Frontend
        B
        direction TB
        B1[Next.js Routes]
        B2[Components]
        B3[Hooks]
    end
    
    subgraph "API Layer"
        C
        direction TB
        C1[REST APIs]
        C2[RPC Client]
    end
    
    subgraph Backend
        D
        E
        F
    end

    %% Direct client calls
    B --> C2
    C2 --> F
```

Sequence: Sign up / sign in
--------------------------

```mermaid
sequenceDiagram
    User->>Frontend: Sign up
    Frontend->>Auth: Create account
    Auth->>Database: Save user
    Auth-->>Frontend: Token
    Frontend-->>User: Success
```

Animated visuals
----------------

For animations, we recommend:

- Using lightweight Lottie or small animated SVGs for the README and marketing pages.
- Use mermaid live to generate interactive diagrams for developer docs.

Local dev (recommended)
-----------------------

Prereqs:

- Node 18+ and Corepack (pnpm via corepack)
- pnpm (we recommend pnpm@10.x)
- Rust & Solana tooling (optional if working with contracts)

Commands:

```bash
# enable corepack and prepare pnpm
corepack enable
corepack prepare pnpm@10.x --activate

# install deps
pnpm install

# run dev (Next.js)
pnpm dev
```

Environment variables
---------------------

Create a `.env.local` with (example):

```
NEXT_PUBLIC_APP_NAME=Onyxlytics
DATABASE_URL=postgres://user:pass@localhost:5432/onyx
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-with-secure-random
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SOLANA_RPC_URL=https://api.devnet.solana.com
```

Backend & Auth recommendations
------------------------------

- Use NextAuth (or Clerk/Supabase Auth) for session management. Add an adapter for Postgres (Prisma) or Supabase.
- Keep auth logic in `app/api/auth/*` or a dedicated `/lib/auth.ts`.
- Store user preferences and query metadata in Postgres. Use a simple schema:

```sql
-- users table (minimal)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image_url TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now()
);

-- saved_queries
CREATE TABLE saved_queries (
  id UUID PRIMARY KEY,
  owner_id UUID REFERENCES users(id),
  title TEXT,
  body TEXT,
  visibility TEXT DEFAULT 'private', -- public|org|private
  created_at TIMESTAMP DEFAULT now()
);
```

Sharing model: how users see others' queries
-------------------------------------------

- Each `saved_queries` row has a `visibility` field.
  - private: only owner
  - org: users in same organization/team
  - public: visible to all authenticated users
- When serving a list, filter by `visibility` and user/team membership. Example pseudocode:

```js
// server-side
const queries = await db.query('select * from saved_queries where visibility = $1 or owner_id = $2', ['public', userId])
```

Settings UX (what to include)
-----------------------------

- Profile: display name, bio, upload avatar (to S3 / Supabase Storage)
- Social links: Twitter/X handle, LinkedIn URL, GitHub
- Security: change password, enable 2FA
- Notifications: toggle email/digest preferences

File upload (images):

- Flow: Frontend uploads to signed URL endpoint (server generates signed URL to S3 or Supabase); server returns URL; frontend persists URL in user's profile.

Minimal server flow:

1. POST /api/uploads/request -> server returns signed URL
2. Frontend PUTs file to signed URL
3. Call PATCH /api/user/profile with image_url

Social linking (Twitter/X & LinkedIn)
------------------------------------

- Use OAuth flows (recommended) or let users paste profile links.
- For OAuth, create apps in Twitter/X and LinkedIn, add callback to `NEXTAUTH_URL/api/auth/callback/<provider>`.

Contribution guide (high-level)
-------------------------------

- Fork -> branch (feat/<area>) -> PR with description and screenshots
- Follow code style: TypeScript, Prettier, ESLint
- Add tests for new features (Vitest / Jest + React Testing Library)
- Run `pnpm lint` and `pnpm test` before PR

Where to add Rust (Solana contracts)
-----------------------------------

Project layout suggestion for contracts:

- Create a top-level `programs/` or `contracts/` directory for Rust programs.
  - `contracts/price-oracle/` — contains Cargo.toml and Anchor.toml if using Anchor

If you're using Anchor (recommended for Solana devs):

1. Install Anchor + Solana CLI (see Anchor docs)
2. Create program: `anchor init price_oracle`
3. Build: `anchor build`
4. Deploy to devnet: `anchor deploy --provider.cluster devnet`

Integrating contracts with the app:

- Add a client helper in `lib/solana-client.ts` or `lib/solana-rpc.ts` (there are already helpers in `lib/` in this repo).
- Use `@solana/web3.js` in the frontend to call programs, or call server-side API routes that sign & submit transactions.

Example contract dev workflow (local)

```bash
# in /contracts/price-oracle
anchor build
anchor test   # runs tests written in Rust
anchor deploy --provider.cluster devnet

# After deploy, update program IDs in frontend env
```

Security & privacy
------------------

- Avoid returning raw query contents for private queries.
- Log access to shared queries; include audit entries in DB for sensitive operations.
- Sanitize user-submitted SQL and use parameterized queries when executing.

CI / Deployment notes
---------------------

- Vercel uses a frozen lockfile by default. If you change `package.json` update `pnpm-lock.yaml` and commit it. Alternatively set install command to `pnpm install --no-frozen-lockfile` in Vercel settings (not recommended for reproducibility).

Where to get help
-----------------

- Create an issue in this repository describing the problem and include logs and steps to reproduce.

License
-------

MIT — see `LICENSE` (add one if missing)

Thanks
------
Thanks for contributing — see `CONTRIBUTING.md` for detailed developer workflows.
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

\`\`\`bash
pnpm install
\`\`\`

2. Run development server

\`\`\`bash
pnpm dev
\`\`\`

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
