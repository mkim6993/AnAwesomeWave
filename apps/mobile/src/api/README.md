# API Layer Structure

This directory contains all API client functions organized by domain/feature.

## Structure

```
api/
├── client.ts          # Shared fetch wrapper with base configuration
├── operator.ts        # Operator admin endpoints
└── [feature].ts       # One file per domain/feature
```

## Guidelines

### Adding New Endpoints

1. **Add to existing file** if it belongs to an existing domain:
   ```typescript
   // api/operator.ts
   export const operatorApi = {
     disconnectAll: () => fetchApi(...),
     newEndpoint: () => fetchApi(...),  // ← Add here
   };
   ```

2. **Create new file** for a new domain:
   ```typescript
   // api/analytics.ts
   import { fetchApi } from './client';
   
   export const analyticsApi = {
     getStats: () => fetchApi('/analytics/stats'),
   };
   ```

### Key Principles

- ✅ **Pure functions**: No React, just async functions
- ✅ **Use `fetchApi`**: Don't duplicate fetch logic
- ✅ **Export named object**: `export const domainApi = { ... }`
- ✅ **TypeScript types**: Import from `@/types/api/[domain]`

### Related Files

When adding an API endpoint, also update:
- **Types**: `src/types/api/[domain].ts`
- **Hooks**: `src/hooks/api/use[Domain].ts`
