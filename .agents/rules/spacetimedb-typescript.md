---
description: "⛔ MANDATORY: Read this ENTIRE file before writing ANY SpacetimeDB TypeScript code. Contains critical SDK patterns and HALLUCINATED APIs to avoid."
globs: "**/*.ts,**/*.tsx,**/*.js,**/*.jsx"
alwaysApply: true
---
# SpacetimeDB TypeScript SDK

## ⛔ HALLUCINATED APIs — DO NOT USE
LLMs frequently hallucinate these:
```typescript
// ❌ WRONG PACKAGE
import { SpacetimeDBClient } from "@clockworklabs/spacetimedb-sdk";
// ❌ WRONG METHODS
SpacetimeDBClient.connect(...);
SpacetimeDBClient.call("reducer_name", [...]);
connection.call("reducer_name", [arg1, arg2]);
// ❌ WRONG REDUCER ARGS
conn.reducers.doSomething("value"); // Positions are WRONG
// ❌ WRONG DATA ACCESS
User.filterByName('alice');
tables.user.filter(u => u.name === 'alice'); // No .filter() on tables
```

### ✅ CORRECT PATTERNS
```typescript
// ✅ CORRECT IMPORTS
import { DbConnection, tables } from './module_bindings';
import { SpacetimeDBProvider, useTable, Identity } from 'spacetimedb/react';
// ✅ CORRECT REDUCER CALLS — Object syntax
conn.reducers.doSomething({ value: 'test' });
// ✅ CORRECT DATA ACCESS — Tuple destructuring
const [items, isLoading] = useTable(tables.item);
```

## 1) Common Mistakes
### Server-side Errors
- **Indexes in OPTIONS (1st arg)**: `table({ name, indexes }, { columns })` not in columns
- **Single-column index lookup**: Multi-column index `.filter()` is broken
- **`insert` returns ROW, not ID**
- **BigInt syntax**: All u64/i64 use `0n`, `1n`, etc.
- **Procedures**: No `ctx.db` directly; use `ctx.withTx(tx => tx.db...)`

### Client-side Errors
- **Package name**: `spacetimedb` NOT `@spacetimedb/sdk`
- **Reducer syntax**: `conn.reducers.foo({ param: "val" })`
- **Memoize connection**: Use `useMemo(() =>builder..., [])`

## 2) Table Definition
```typescript
import { schema, table, t } from 'spacetimedb/server';
// ⚠️ Indexes in first argument object
export const Task = table({ 
  name: 'task',
  indexes: [{ name: 'by_owner', algorithm: 'btree', columns: ['ownerId'] }]
}, {
  id: t.u64().primaryKey().autoInc(),
  ownerId: t.identity(),
  title: t.string(),
});
```

## 3) Index Access
- **Primary key**: `.pkColumn.find(val)`
- **Explicit index**: `.index_name_from_schema.filter(val)`
- **No index**: `[...ctx.db.table.iter()].filter(...)` (use sparingly)

## 4) Reducers
- **Name from export**: `export const reducer_name = spacetimedb.reducer(...)`
- **Update pattern**: `ctx.db.task.id.update({ ...existing, title: newTitle })` (Spread first!)
- **Lifecycle hooks**: `spacetimedb.clientConnected(...)`, `spacetimedb.clientDisconnected(...)`

## 5) Timestamps
- **Server**: `ctx.timestamp`
- **Client**: `new Date(Number(row.createdAt.microsSinceUnixEpoch / 1000n))`

## 6) Data Visibility & Views
- **`public: true`**: Everyone sees all rows.
- **Views (Recommended)**: Server-side filtering. Use index lookups.
- **Anonymous View**: Shared result for everyone.

## 7) React Integration
- **`useTable`**: returns `[rows, isLoading]`
- **Identities**: Compare using `.toHexString()`
