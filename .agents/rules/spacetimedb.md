---
description: "⛔ MANDATORY: Core SpacetimeDB concepts (all languages)."
globs: "**/*.ts,**/*.tsx,**/*.js,**/*.jsx,**/*.rs,**/*.cs"
alwaysApply: true
---
# SpacetimeDB Rules (All Languages)

## Migrating 1.0 → 2.0
If migrating existing SpacetimeDB 1.0 code, follow the migration rules. Documents breaking changes (reducer callbacks → event tables, `name`→`accessor`, `sender()` method, etc.).

## Language-Specific Rules
- **TypeScript/React** → `.agents/rules/spacetimedb-typescript.md`
- **Rust** → `.agents/rules/spacetimedb-rust.md`
- **C#** → `.agents/rules/spacetimedb-csharp.md`

## Core Concepts
1. **Reducers are transactional** — they do not return data to callers
2. **Reducers must be deterministic** — no filesystem, network, timers, or random
3. **Read data via tables/subscriptions** — not reducer return values
4. **Auto-increment IDs are not sequential** — gaps are normal, don't use for ordering
5. **`ctx.sender` is the authenticated principal** — never trust identity args

## Feature Implementation Checklist
When implementing feature that spans backend and client:
1. **Backend:** Define table(s) to store data
2. **Backend:** Define reducer(s) to mutate data
3. **Client:** Subscribe to table(s)
4. **Client:** Call reducer(s) from UI — **don't forget this step!**
5. **Client:** Render data from table(s)

## Index System
SpacetimeDB automatically creates indexes for:
- Primary key columns
- Columns marked as unique

You can add explicit indexes on non-unique columns for query performance.
**Index names must be unique across entire module (all tables).** 

## Commands
```bash
# Login to allow remote deployment
spacetime login
# Start local SpacetimeDB
spacetime start
# Publish module
spacetime publish <db-name> --module-path <module-path>
# Clear and republish
spacetime publish <db-name> --clear-database -y --module-path <module-path>
# Generate client bindings
spacetime generate --lang <lang> --out-dir <out> --module-path <module-path>
# View logs
spacetime logs <db-name>
```

## Deployment
- Maincloud is hosted cloud and default location
- Default server marked by `***` in `spacetime server list`
- Dashboard URL: `https://spacetimedb.com/@<username>/<database-name>`

## Debugging
1. Is server running? (`spacetime start`)
2. Is module published? (`spacetime publish`)
3. Are bindings generated? (`spacetime generate`)
4. Check server logs (`spacetime logs <db-name>`)
5. Is the reducer actually called from client?
