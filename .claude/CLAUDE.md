# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # start dev server (ts-node + nodemon, src/server.ts)
npm run build             # compile to dist/
npm start                 # run compiled dist/server.js
npm run typecheck         # tsc --noEmit
npm run seed               # run prisma/seed.ts directly (also runs automatically after migrate:dev via the "prisma.seed" config)
npm run migrate:dev        # prisma migrate dev
npm run migrate:deploy     # prisma migrate deploy
```

There is no local Postgres — the dev database runs in a standalone Docker container, not docker-compose:

```bash
docker start hexagonal-db   # or `docker run ...` again if it was removed, see below
docker stop hexagonal-db
```

If the container doesn't exist yet, recreate it and point `.env`'s `DATABASE_URL` at `localhost:5434`:

```bash
docker run -d --name hexagonal-db -e POSTGRES_USER=hexagonal -e POSTGRES_PASSWORD=hexagonal -e POSTGRES_DB=hexagonal -p 5434:5432 postgres:16-alpine
```

`npm test` is currently a placeholder (`exit 1`) even though Vitest is installed — no tests exist yet and no test script is wired up.

## Architecture

Hexagonal (ports & adapters) layering, one vertical slice per domain concept (currently only `product`). For each domain, four files spread across layers with a consistent naming convention:

- `src/domains/<name>.ts` — the domain type, derived via `z.infer` from a Zod schema (`src/domains/product.ts`). This schema is also used at the infra boundary (see below), not just for typing.
- `src/domains/<name>.port.ts` — the repository interface (`ProductRepository`) that the service layer depends on. This is the boundary the domain defines and infra implements.
- `src/infra/<name>.adapter.ts` — implements the port against Prisma. Prisma's generated types don't line up 1:1 with the domain type (notably `Decimal` fields vs. the domain's `number`), so adapters re-validate Prisma's output through the domain's Zod schema (`z.array(productSchema).parse(products)`) rather than returning the raw Prisma row — this both maps and validates in one step. Any new adapter method returning DB rows should follow the same `schema.parse(...)` pattern.
- `src/services/<name>.service.ts` — a factory (`createProductService(repository)`) taking a `Port` and returning use-case methods. Depends only on the port type, never on `infra/`.
- `src/controllers/<name>.controller.ts` — a factory (`createProductController(service)`) returning Express handlers.
- `src/routes/<name>.routes.ts` — wires concrete adapter → service → controller → Express `Router` for that domain. This is the one place the concrete Prisma adapter gets constructed and injected.

`src/app.ts` mounts each domain's router and the `/health` endpoint. `src/server.ts` just calls `createApp()` and listens.

When adding a new domain, replicate this same six-file shape (schema+type, port, adapter, service, controller, routes) rather than introducing a different pattern — it's what makes each domain's dependency direction (`controller → service → port ← adapter`) consistent across the codebase.

## Commit messages

Enforced via husky + commitlint (`commitlint.config.js` extends `@commitlint/config-conventional`) on the `commit-msg` hook — Conventional Commits format required: `<type>(<scope>): <description>`, type one of `build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test`.
