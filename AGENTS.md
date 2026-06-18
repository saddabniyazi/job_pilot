<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Read Before Anything Else

Read in this exact order before any implementation:

1. context/project-overview.md
2. context/architecture.md
3. context/ui-tokens.md
4. context/ui-rules.md
5. context/ui-registry.md
6. context/code-standards.md
7. context/library-docs.md
8. context/build-plan.md
9. context/progress-tracker.md

## Rules That Never Change

- Never use hardcoded hex values or raw Tailwind color classes
- Update `progress-tracker.md` and `ui-registry.md` after every feature
- Before any third party library — load its installed skill first,
  then read `context/library-docs.md` for project-specific rules
- If the same problem persists after one corrective prompt —
  stop immediately and run /recover

## Available Skills

- `/architect` — before any complex feature. Think before building.
- `/imprint` — after any new UI component. Capture patterns.
- `/review` — before demo or when something feels off.
- `/recover` — when something breaks after one failed correction.
- `/remember save` — when a feature spans multiple sessions.
- `/remember restore` — when returning after a multi-session feature.

## InsForge Project Rules & MCP Instructions

Follow these rules whenever you are integrating with the InsForge backend or using InsForge MCP tools. These are concise, high-impact points extracted from the official InsForge documentation and project-specific guidance.

- Always call the InsForge MCP `fetch-docs` or `fetch-sdk-docs` tool before writing integration code. These tools return the latest SDK patterns and project-specific instructions.
- Use `fetch-docs` with `"instructions"` for essential backend setup (start here on new projects).
- Use `fetch-sdk-docs` for feature-specific SDK docs. Common keys: `db`, `auth`, `storage`, `functions`, `ai`, `realtime`, `payments` with languages: `typescript`, `swift`, `kotlin`, `rest-api`.
- To scaffold a starter project pre-configured for your backend, use the MCP `download-template` tool (provides configured `baseUrl` and `anonKey`).
- InsForge MCP provides infra commands for resource management — prefer MCP tools for schema, buckets, and deployments:
  - `get-backend-metadata`, `run-raw-sql`, `get-table-schema`
  - `create-bucket`, `list-buckets`, `delete-bucket`
  - `create-function`, `update-function`, `delete-function`
  - `create-deployment` for frontend deployment
- SDK usage (TypeScript): `npm install @insforge/sdk@latest` and create a client with `createClient({ baseUrl, anonKey })` — always read the MCP docs for the exact method signatures before coding.
- Use SDKs for application logic (auth, DB CRUD, storage, AI calls). Use MCP tools for infrastructure and project scaffolding.
- InsForge SDK operations return the `{ data, error }` structure — always handle both fields and validate responses.
- Security: never commit API keys, anon keys, or secrets. Use environment variables and server-side calls for secret-bearing operations (e.g., AI keys, OpenRouter keys).
- Note on Tailwind: InsForge instructions may recommend a specific Tailwind version for template compatibility; always check `fetch-docs` guidance before changing major UI tooling.

These InsForge rules are a supplement to the project-level rules in this repo — follow them when you touch backend integrations or run MCP operations.

# InsForge JobPilot Development Workflow

## Overview

This document prescribes the official development workflow for integrating JobPilot with the InsForge backend. It is written as production-grade SDK-style documentation: clear headings, step-by-step procedures, warnings, and notes. Follow this workflow exactly and in order for predictable, auditable integrations.

### 🚨 CRITICAL: Follow these steps in order

- Step 1: Read Project Context
- Step 2: Fetch Latest InsForge Documentation
- Step 3: Verify Compatibility
- Step 4: Configure Environment
- Step 5: Database Design
- Step 6: Authentication Flow
- Step 7: Storage & Resume Workflow
- Step 8: Agent Workflows
- Step 9: Recommended Folder Structure
- Step 10: Implementation Order
- Step 11: Security Rules
- Step 12: Testing
- Step 13: Deployment Checklist

---

## Step 1: Read Project Context

1. Read these repository context files in order: `context/project-overview.md`, `context/architecture.md`, `context/ui-tokens.md`, `context/ui-rules.md`, `context/code-standards.md`, `context/library-docs.md`, `context/build-plan.md`, `context/progress-tracker.md`.
2. Confirm you understand the UI token rules (no raw hex or Tailwind built-in colors) before implementing any UI that links to backend flows.
3. NOTE: The `library-docs.md` contains project-specific patterns for InsForge usage. Use it as the canonical local guide after MCP docs.

---

## Step 2: Fetch Latest InsForge Documentation

1. Always call the InsForge MCP `fetch-docs` (`instructions`) first for project-level instructions.
2. Then call `fetch-sdk-docs` for each feature you will use (language: `typescript`): `auth`, `db`, `storage`, `functions`, `realtime`, `ai` as relevant.

Warning: Do not implement or scaffold code before you fetch these docs — InsForge may change API signatures and recommended patterns.

---

## Step 3: Verify Compatibility

1. Verify Tailwind version compatibility with any InsForge starter templates. If MCP docs recommend Tailwind `3.4` for templates but the repo uses `tailwindcss: ^4`, open an issue and proceed with manual integration. Do NOT scaffold MCP templates that require a different major Tailwind version without approval.
2. Confirm Node / Next.js runtime versions match the project's `package.json` and `next.config.ts` policies.

Note: Version mismatches are the most common source of integration failures. Stop and address compatibility before coding.

---

## Step 4: Configure Environment

1. Add required environment variables locally (do NOT commit):

```
NEXT_PUBLIC_INSFORGE_URL=
NEXT_PUBLIC_INSFORGE_ANON_KEY=
INSFORGE_SERVICE_ROLE_KEY=         # server-only, do not expose to browser
OPENAI_API_KEY=                     # if using AI features via server
```

2. Create `lib/insforge-client.ts` (browser) and `lib/insforge-server.ts` (server) stubs. Use `createClient()` for browser and `createServerClient()` for server with cookie glue per `library-docs.md`.
3. Validate local dev environment by calling `insforge.auth.getCurrentUser()` in a safe dev route and confirming no secrets are logged.

Warning: Never place `INSFORGE_SERVICE_ROLE_KEY` in `NEXT_PUBLIC_*` vars or commit it.

---

## Step 5: Database Design (High-level)

Use the canonical schema aligned to the project architecture. Create a migration file `/migrations/0001_init.sql` containing the DDL below. Run migrations via MCP `run-raw-sql` when ready.

Recommended tables and fields (trimmed to essentials):

- `users` — managed by InsForge auth (do not duplicate). Reference by `users.id`.
- `profiles` — `id`, `user_id`, `name`, `avatar_url`, `headline`, `location`, `skills json[]`, `created_at`, `updated_at`.
- `jobs` — `id`, `user_id`, `run_id`, `source`, `source_url`, `external_apply_url`, `title`, `company`, `location`, `salary`, `job_type`, `about_role`, `match_score int`, `match_reason text`, `matched_skills json[]`, `missing_skills json[]`, `found_at timestamptz`, `created_at`, `updated_at`.
- `applications` — `id`, `user_id`, `job_id`, `status enum`, `resume_key`, `cover_letter`, `applied_at`.
- `agent_runs` — `id`, `user_id`, `run_type`, `params json`, `status`, `started_at`, `finished_at`, `metrics json`.
- `agent_logs` — `id`, `run_id`, `level`, `message`, `meta json`, `created_at`.
- `resumes` — `id`, `user_id`, `file_key`, `public_url`, `uploaded_at`, `parsed_text`, `metadata json`.

Indexes: index `user_id` on all user-scoped tables; index `jobs(found_at)`; index `agent_runs(status, started_at)`.

Note: Enforce `user_id` scoping on every query — see `library-docs.md` patterns.

---

## Step 6: Authentication Workflow

Follow InsForge SDK best practices for authentication.

### Flow

1. Sign-up: client calls `insforge.auth.signUp({ email, password, name, redirectTo })`.
2. Verification: support both code entry and link flows; implement `/auth/verify` page to accept `insforge` callback or code input.
3. Sign-in: client calls `insforge.auth.signInWithPassword({ email, password })`.
4. OAuth: use `insforge.auth.signInWithOAuth(provider, { redirectTo })`. Prefer `skipBrowserRedirect` only for non-standard flows.
5. Session handling:
  - Browser: create `lib/insforge-client.ts` and use `auth.getCurrentUser()` to populate client state. SDK refreshes via httpOnly cookie.
  - Server: use `lib/insforge-server.ts`'s `createServerClient()` in Server Components, API routes, and Server Actions to run privileged operations.

### Protecting routes

In Server Components use:

```
const insforge = await createInsforgeServer();
const { data } = await insforge.auth.getUser();
if (!data?.user) redirect('/auth/sign-in');
```

Warning: Do not persist access tokens in localStorage. Rely on SDK-managed httpOnly cookies and server client for sensitive operations.

---

## Step 7: Storage & Resume Workflow

1. Storage buckets: create buckets via MCP or dashboard (`resumes`, `images`, `uploads`). Use `insforge.storage.from(bucketName)` API.
2. Upload pattern: upload file (File/Blob) directly from browser with `upsert` when replacing base resume. Save both returned `key` and `url` to the DB.
3. Public URL: use `getPublicUrl(key)` only for display. For downloads that require private access, use signed URLs or server-side download proxy.
4. Resume ingestion:
  - Upload to `resumes/{user_id}/resume.pdf` with `upsert: true`.
  - After upload, save `file_key` and `public_url` to `resumes` table.
  - Queue a server-side job (Agent Run) to parse the file and save `parsed_text` to DB.

Warning: Never download user-uploaded files to server disk; use buffers/streams and upload/download via storage APIs.

---

## Step 8: Agent Workflows (Realtime / Background)

1. Agent runs: implement `agent_runs` table and `agent_logs` table. Use `run_id` to correlate.
2. Agents that perform web browsing (Browserbase / Stagehand) must be triggered by server-side route handlers or server actions that enqueue a run and return an immediate acknowledgement.
3. Use InsForge Functions (or server jobs) for short-lived compute; for longer tasks use external queuing + serverless function triggers.
4. Realtime: use InsForge realtime features for UI subscriptions where needed (e.g., agent run updates). Use client-side realtime only in Client Components with `insforge` browser client. Always validate events server-side.

Note: Agent logs must be written to `agent_logs` synchronously where possible, and any errors should be stored with run metadata for post-mortem analysis.

---

## Step 9: Recommended Folder Structure

Follow the app/router conventions and this exact layout for clarity and maintainability:

- `/app`
  - `auth/` — `sign-in`, `sign-up`, `verify`, `callback`
  - `dashboard/` — server-protected dashboard
  - `jobs/` — listing and details
  - `profile/` — user profile pages
  - `upload-resume/` — resume upload UI
  - `api/` — route handlers
   - `agent/` — `run/route.ts`, `status/route.ts`
   - `jobs/` — `fetch/route.ts`, `save/route.ts`
   - `resumes/` — `upload/route.ts`, `parse/route.ts`
- `/actions` — server actions (profile.ts, uploadResume.ts, saveJob.ts, runAgent.ts)
- `/lib` — `insforge-client.ts`, `insforge-server.ts`, `browserbase.ts`, `stagehand.ts`, `jobs.ts`
- `/components` — `ui/`, `dashboard/`, `jobs/`
- `/types` — shared TypeScript types
- `/migrations` — SQL migration files
- `/scripts` — helpers (migrate, seed)

Use kebab-case for folders and PascalCase for component filenames per `code-standards.md`.

---

## Step 10: Implementation Order

Follow this recommended implementation order for minimal blast radius and fast validation:

1. Fetch InsForge docs and confirm APIs (`fetch-docs`, `fetch-sdk-docs`).
2. Add environment variables and create `lib/insforge-client.ts` + `lib/insforge-server.ts` (stubs only).
3. Draft SQL migration in `/migrations/0001_init.sql` and review with DB team / MCP metadata.
4. Implement auth pages (`/auth/sign-in`, `/auth/sign-up`, `/auth/verify`) and server-protected `dashboard` page. Validate sign-up/sign-in flows end-to-end.
5. Implement `resumes` upload UI and server action hooking into storage upload; save file metadata to DB.
6. Implement agent run enqueue route and minimal agent runner that logs to `agent_runs` and `agent_logs`.
7. Wire realtime subscriptions for agent run updates in a client-only component.
8. Harden queries with proper `user_id` scoping and test every mutation.

Note: Each step must be accompanied by at least one integration test (see Testing section).

---

## Step 11: Security Rules

- Environment secrets: `INSFORGE_SERVICE_ROLE_KEY` must never be public. Store in CI/CD secret manager and in developer `.env.local` only for local dev.
- Use `createServerClient()` for server-side privileged operations. Never construct server clients in browser code.
- Always scope DB operations to `user_id` for user-scoped data.
- Sanitize and validate all incoming API payloads with explicit zod schemas or equivalent.
- Use httpOnly cookies and rely on SDK-managed refresh tokens. Do not roll your own token storage unless absolutely necessary.
- Log errors to `agent_logs` and central monitoring; do not log PII or secrets.

Warning: Exposing service role keys in client bundles or logs will result in immediate revocation and a security incident.

---

## Step 12: Testing Strategy

1. Unit tests: small helpers, parsing logic, and DB helper functions. Use Jest or Vitest per project conventions.
2. Integration tests: auth flows (sign-up, sign-in, verification), storage upload flow (mock storage), DB migrations, agent enqueue + minimal runner.
3. E2E tests (optional): use Playwright to validate sign-up → resume upload → agent run UI flow.
4. Contract tests: validate that SDK calls in `/lib/insforge-server.ts` match `fetch-sdk-docs` signatures (simple smoke tests against a dev InsForge instance).

Test data rules:
- Use a separate dev InsForge project instance or local mock.
- Use ephemeral test users and clean up uploaded files and DB rows after tests.

---

## Step 13: Deployment Checklist

Before deploying to production, verify the following:

- [ ] All required env vars present in CI/CD secrets: `NEXT_PUBLIC_INSFORGE_URL`, `NEXT_PUBLIC_INSFORGE_ANON_KEY`, `INSFORGE_SERVICE_ROLE_KEY` (server only), `OPENAI_API_KEY` (if used).
- [ ] Database migrations applied via MCP `run-raw-sql` or approved migration pipeline.
- [ ] Storage buckets created and correct CORS/policy settings verified.
- [ ] Auth providers (Google/GitHub) configured in InsForge dashboard and `redirectTo` URLs whitelisted.
- [ ] Service role keys rotated and stored in secrets manager; no service key in build logs.
- [ ] Realtime subscriptions tested against production InsForge instance at low load.
- [ ] Monitoring/alerting configured for agent failures (use `agent_logs` + central alerts).
- [ ] Rollback plan and DB snapshot in place.

---

## Required MCP Workflow (summary)

1. `fetch-docs` → fetch `instructions` (always first).
2. `fetch-sdk-docs` for `auth`, `db`, `storage`, `realtime`, `functions` as required.
3. `get-backend-metadata` and `get-table-schema` to inspect existing schema.
4. Use `run-raw-sql` to apply migration SQL from `/migrations/0001_init.sql`.
5. Use `create-bucket` for storage buckets and `create-function` for serverless functions if needed.

Warning: Always run MCP `get-backend-metadata` prior to creating or altering tables to avoid naming collisions with managed auth tables.

---

If you want, I can now: (A) generate `/migrations/0001_init.sql`, (B) create `lib/insforge-client.ts` and `lib/insforge-server.ts` stubs, or (C) draft the auth UI pages. Which should I do next?

<!-- INSFORGE:START -->
## InsForge backend

This project uses [InsForge](https://insforge.dev): an all-in-one, open-source Postgres-based backend (BaaS) that gives this app a database, authentication, file storage, edge functions, realtime, an AI model gateway, and payments through one platform.

- **Project:** **jsm_jobPilot** (API base `https://ygy579ha.ap-southeast.insforge.app`)
- **Skills:** these InsForge skills are installed for supported coding agents. Reach for them before implementing any InsForge feature instead of guessing the API:
  - `insforge`: app code with the `@insforge/sdk` client (database CRUD, auth, storage, edge functions, realtime, AI, email, and Stripe payments).
  - `insforge-cli`: backend and infrastructure via the `insforge` CLI (projects, SQL, migrations, RLS policies, storage buckets, functions, secrets, payment setup, schedules, deploys).
  - `insforge-debug`: diagnosing failures (SDK/HTTP errors, RLS denials, auth and OAuth issues) and running security or performance audits.
  - `insforge-integrations`: wiring external auth providers (Clerk, Auth0, WorkOS, Better Auth, etc.) for JWT-based RLS, or the OKX x402 payment facilitator.
  - `find-skills`: discovering additional skills on demand.
- **Credentials:** app code reads keys from `.env.local`; the CLI reads `.insforge/project.json`. Never hardcode or commit keys.

Key patterns:

- Database inserts take an array: `insert([{ ... }])`.
- Reference users with `auth.users(id)`; use `auth.uid()` in RLS policies.
- For storage uploads, persist both the returned `url` and `key`.
<!-- INSFORGE:END -->
