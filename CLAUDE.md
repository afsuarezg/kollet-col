# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Kollect is a case management system for the Colombian judicial collection workflow (cobro jurídico). Cases (`expedientes`) move through stages: demanda → notificación → audiencias → sentencia → liquidación → remate → archivo. All UI strings and database column names are in Spanish — preserve that when adding fields.

## Common commands

Run from the repo root unless noted. The root `package.json` orchestrates both workspaces.

```bash
# Install everything (postinstall fans out into client/ and server/)
npm install

# Run frontend + backend in parallel (Vite proxies /api to :3001)
npm run dev

# Production build (compiles client; server is served via ts-node-dev in dev, node dist/ in prod)
npm run build
npm start
```

Per-workspace:
```bash
npm run dev --prefix client     # Vite only, http://localhost:5173
npm run dev --prefix server     # ts-node-dev only, http://localhost:3001
npm run lint --prefix client    # ESLint (no lint config in server)
npm run build --prefix client   # tsc -b && vite build
npm run build --prefix server   # tsc → dist/
```

There is **no test suite**. Don't claim tests pass — there's nothing to run.

### Node version

`better-sqlite3@9.x` (pinned in `server/package.json`) does not ship prebuilt binaries for Node 24, and source compilation requires a C++20 compiler. **Use Node 22 LTS** (`nvm use 22`). If `npm install` fails on `better-sqlite3` with "C++20 or later required", that's the cause.

## Architecture

### Three-package monorepo (no workspaces tool — plain npm prefix installs)

- `client/` — React 18 + Vite + TypeScript SPA
- `server/` — Express + TypeScript API
- `shared/types.ts` — `CaseListItem` / `CasesResponse` shared by both (imported via relative paths, not a package)

In dev, Vite proxies `/api/*` → `localhost:3001` (`client/vite.config.ts`). In prod, the Express server serves `client/dist/` as static files and falls back to `index.html` for SPA routes (`server/src/index.ts`).

### The data model is one wide table

`server/src/migrations/001_initial.sql` defines a single `cases` table with ~90 columns, organized into 12 logical groups that map 1:1 to the form's 12 tabs (Tab01 = Identificación, …, Tab12 = Solo Lectura). There is no normalization — parties, dates, monetary amounts, court info, and auto-snapshots all live as columns on `cases`.

When adding a new field, you must touch **five places in lockstep**:
1. `server/src/migrations/001_initial.sql` — add the column
2. `server/src/schemas/caseSchema.ts` — server-side Zod validator
3. `client/src/schemas/caseSchema.ts` — client-side Zod validator + `CaseFormData` type
4. `client/src/tabs/TabNN_*.tsx` — render the field in the correct tab
5. If it's read-only/auto-managed: also add it to `READONLY_COLS` in `server/src/models/case.ts` so writes are stripped

### Auto-managed read-only fields (Tab 12)

A SQLite `AFTER UPDATE` trigger (`trg_cases_update` in the migration) snapshots `etapa_procesal_actual` → `etapa_procesal_snapshot` and `observaciones_abogado` → `observaciones_abogado_snapshot` on every update, plus stamps `ultima_edicion_fecha`. These columns are filtered out of writes by `READONLY_COLS` in `server/src/models/case.ts`. **Don't try to write them from the client** — both the model layer strips them and the trigger overwrites them.

The migration runs **on every server startup** via `runMigrations()` in `server/src/db.ts`. Use `CREATE TABLE IF NOT EXISTS` / `CREATE TRIGGER IF NOT EXISTS` patterns; do not add destructive migrations. There's no migration versioning system.

### Form layer

- `client/src/components/form/CaseFormWrapper.tsx` is the single React Hook Form instance that owns all 12 tabs. Tabs receive form context via `FormProvider` and pull fields with `useFormContext()`.
- `useAutoDraft` (in `client/src/hooks/useDraft.ts`) persists the entire form state to `localStorage` every 30 seconds under key `kollect_draft_{id|'new'}`. Drafts expire after 7 days. The README mentions a 5s debounce — actual implementation is a 30s interval; trust the code.
- All Zod fields in both schemas use `.optional().catch(...)` so invalid input falls back to a safe default rather than blocking the form. This is intentional — the form must remain usable even when partial/dirty data is loaded.

### Database location

SQLite file defaults to `<repo root>/kollect.db` (resolved as `path.join(__dirname, '../../kollect.db')` in `server/src/db.ts`). Override with `DB_PATH` in `server/.env`. WAL mode is on, so expect `kollect.db-wal` and `kollect.db-shm` siblings — don't delete those while the server is running.

### Routes

Only `/api/cases` exists. Standard REST: `GET /` (paginated, `?q=` searches `demandado`/`radicacion`/`identificacion`), `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`. List endpoint returns only the `LIST_COLS` subset defined in `server/src/models/case.ts` — full record only via `GET /:id`.

Client routes (`client/src/App.tsx`): `/` → list, `/casos/:id` → form. The literal string `nuevo` in the `:id` slot means "new case" (`CaseForm.tsx`).
