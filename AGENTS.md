# Agent Instructions

## Package Manager
Use **npm**: `npm install`, `npm run dev`, `npm run build`

## File-Scoped Commands
| Task | Command |
|------|---------|
| Typecheck | `npx tsc --noEmit path/to/file.ts` |
| Test | `npx vitest run path/to/file.test.ts` |
| Lint | `npx eslint path/to/file.ts` |

## SpacetimeDB Rules
Follow the canonical rules for database logic and client SDK:
- **General Rules:** See [.agents/rules/spacetimedb.md](.agents/rules/spacetimedb.md)
- **TypeScript SDK:** See [.agents/rules/spacetimedb-typescript.md](.agents/rules/spacetimedb-typescript.md)

## Key Conventions
- **Framework**: Preact with hooks (useState, useEffect, useMemo)
- **Styling**: Tailwind CSS (loaded via CDN, use utility classes)
- **Data Source**: Fetches from Google Spreadsheets via Papa Parse
- **Shared States**: Use `src/types.ts` for unified models
- **Tests**: Use `vitest` + `Testing Library for Preact` in `test/` directory
