# Contributing to Onyxlytics

Thank you for wanting to contribute! This guide covers local setup, backend building, authentication flows (sign in / sign up), how query sharing works, where to implement settings (image uploads, social links), and how to add Rust (Solana) contracts.

Table of contents
- Local dev setup
- Backend & DB
- Authentication (sign up / sign in)
- Query sharing model
- Settings & uploads
- Adding Rust contracts (Solana)
- Tests and CI

Local dev setup
---------------

1. Clone and fork repo

```bash
git clone git@github.com:Ndifreke000/Onyxlytics.git
cd Onyxlytics
```

2. Ensure prerequisites

- Node 18+
- Corepack -> pnpm (we use pnpm@10) — recommended for reproducible installs
- PostgreSQL (or Supabase) running locally
- (Optional) Rust and Solana/Anchor tooling if you will work on contracts

3. Install dependencies

```bash
corepack enable
corepack prepare pnpm@10.x --activate
pnpm install
```

Backend & DB
------------

We recommend using Postgres with Prisma or just SQL migrations.

Example migration (psql):

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  name TEXT,
  image_url TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE saved_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  body TEXT,
  visibility TEXT DEFAULT 'private',
  created_at TIMESTAMP DEFAULT now()
);
```

API patterns

- Keep API routes minimal and server-side: place in `app/api/*`.
- Use parameterized queries for DB access or Prisma client. Example (server-side):

```ts
// app/api/queries/route.ts
import { db } from '@/lib/db'

export async function GET(req) {
  const user = await getServerUser(req)
  const rows = await db.query('SELECT * FROM saved_queries WHERE visibility = $1 OR owner_id = $2', ['public', user.id])
  return new Response(JSON.stringify(rows))
}
```

Authentication (sign up / sign in)
---------------------------------

Options:
- NextAuth + Prisma adapter (serverless-friendly)
- Supabase Auth
- Clerk (managed)

Minimal flow with NextAuth and Prisma:

1. Install NextAuth and adapter

```bash
pnpm add next-auth @next-auth/prisma-adapter
pnpm add -D prisma
```

2. Add NextAuth route: `app/api/auth/[...nextauth]/route.ts`

3. Configure providers (Email, GitHub, Twitter)

4. On sign up, create a user row in `users` table and return a session

5. Protect pages or API routes by verifying session server-side using `getServerSession`.

How users can see other users' queries
-------------------------------------

Use the `visibility` column on `saved_queries`:

- private: only owner
- org: shared to team/org (requires teams table and membership)
- public: everyone

Server-side enforcement example:

```ts
const queries = await db.query(
  `SELECT * FROM saved_queries WHERE visibility = 'public' OR owner_id = $1`,
  [user.id]
)
```

If implementing org/team sharing, join on `team_members` table to check membership.

Settings & uploads
------------------

Profile settings to add:
- Display name
- Avatar image upload
- Social links (Twitter/X handle, LinkedIn URL, GitHub)
- Email preferences

Image upload recommended flow:

1. Frontend requests signed upload URL from `POST /api/uploads/request` with filename and content-type.
2. Server creates a signed URL for S3 (or Supabase) and returns it.
3. Frontend PUTs file to the signed URL and then PATCHes user profile with the `image_url`.

Example endpoint (node/express style pseudocode):

```js
app.post('/api/uploads/request', async (req, res) => {
  const { filename, contentType } = req.body
  const key = `avatars/${user.id}/${filename}`
  const signedUrl = await s3.getSignedUrl('putObject', { Bucket, Key: key, ContentType: contentType })
  res.json({ url: signedUrl, publicUrl: `https://cdn.example.com/${key}` })
})
```

Social link & OAuth guidance

- For linking Twitter/X and LinkedIn, prefer OAuth. Store provider token metadata in a `user_providers` table.
- If you only need links, let users paste their profile URL in settings.

Adding Rust (Solana) contracts
-----------------------------

Where to put contracts:

- Add a `contracts/` directory at repo root. Each program gets its subfolder:
  - `contracts/your-program/`

Tooling (recommended): Anchor + Solana CLI

Install:

```bash
# Rust toolchain
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup default stable

# Solana
sh -c "$(curl -sSfL https://run.solana.com)"

# Anchor
cargo install --git https://github.com/coral-xyz/anchor --tag v0.27.0 anchor-cli --locked
```

Create & build program

```bash
cd contracts
anchor init my_program --javascript
cd my_program
anchor build
```

Testing & deploy

```bash
anchor test
anchor deploy --provider.cluster devnet
```

Integrating with the application

- After deploying, record the program ID in the frontend env (e.g., `NEXT_PUBLIC_MY_PROGRAM_ID`).
- Add client helpers in `lib/solana-rpc.ts` to call the program (use `@solana/web3.js` or Anchor's IDL client).

Example: calling a program server-side

```ts
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js'

const conn = new Connection(process.env.SOLANA_RPC_URL)
const programId = new PublicKey(process.env.MY_PROGRAM_ID)

// Use Anchor or raw web3.js to build and submit txs
```

Tests and CI
------------

- Add unit tests for important utility functions (Vitest recommended)
- Add integration tests for API routes (supertest)
- In CI, ensure `pnpm install` runs with an up-to-date `pnpm-lock.yaml` (frozen-lockfile). If you change `package.json`, regenerate and commit `pnpm-lock.yaml`.

Branching & PRs
---------------

- Follow conventional commits for changelogs
- Open PR against `main` and include a brief description, screenshots, and testing notes

Need help?
----------

Open an issue describing the problem and include logs, repro steps and environment details.

Thanks again — we appreciate your contributions!
