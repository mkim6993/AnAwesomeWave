# API Layer Architecture

This directory contains the complete API integration layer using **React Query** and **Zod** for type-safe, validated API calls.

## 📁 Structure

```
api/
├── client.ts          # Base HTTP client (fetch wrapper)
├── types.ts           # API response schemas with Zod validation
├── services/          # Pure API fetch functions (framework-agnostic)
│   ├── party.ts
│   └── index.ts
└── queries/           # React Query hooks (React-specific)
    ├── party.ts
    └── index.ts
```

## 🎯 Design Principles

### 1. **Separation of Concerns**
- `client.ts` - Low-level HTTP configuration
- `services/` - Business logic for API calls (no React dependencies)
- `queries/` - React Query hooks for state management
- `types.ts` - Runtime validation and TypeScript types

### 2. **Type Safety Chain**
```
Backend (Fastify + Zod) 
  → Shared Schemas (@AnAwesomeWave/shared)
    → API Response Types (types.ts)
      → Service Functions (services/)
        → React Query Hooks (queries/)
          → Components
```

### 3. **Testability**
- Services can be unit tested without React
- Mocking is straightforward at any layer
- Zod validates responses at runtime

## 📖 Usage Guide

### In a Component

```tsx
import { useCreateParty, useParty } from '@/api/queries';

function MyComponent() {
  // Query (GET)
  const { data, isLoading, error } = useParty('party-id');
  
  // Mutation (POST/PUT/DELETE)
  const createPartyMutation = useCreateParty();
  
  const handleCreate = async () => {
    try {
      const result = await createPartyMutation.mutateAsync({
        name: 'My Party',
        organizerId: 'user-id',
      });
      console.log('Created:', result.party);
    } catch (error) {
      console.error('Failed:', error);
    }
  };
  
  return (
    <View>
      {isLoading && <Text>Loading...</Text>}
      {error && <Text>Error: {error.message}</Text>}
      {data && <Text>{data.party?.name}</Text>}
      
      <Button 
        onPress={handleCreate}
        disabled={createPartyMutation.isPending}
      />
    </View>
  );
}
```

### In Tests or Non-React Code

```ts
import { createParty } from '@/api/services';

// Can be used anywhere, not just in React components
const result = await createParty({
  name: 'Test Party',
  organizerId: 'test-user',
});
```

## 🔧 Adding New Endpoints

Follow this checklist for each new endpoint:

### 1. Define Response Schema (`types.ts`)

```ts
export const GetPartiesResponseSchema = z.object({
  success: z.boolean(),
  parties: z.array(PartySchema),
});
export type GetPartiesResponse = z.infer<typeof GetPartiesResponseSchema>;
```

### 2. Create Service Function (`services/party.ts`)

```ts
export async function getParties(): Promise<GetPartiesResponse> {
  const response = await fetchApi<unknown>('/party/list');
  return GetPartiesResponseSchema.parse(response);
}
```

### 3. Create React Query Hook (`queries/party.ts`)

```ts
export function useParties() {
  return useQuery({
    queryKey: ['parties'],
    queryFn: getParties,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
```

### 4. Export from Index Files

```ts
// services/index.ts
export * from './party';

// queries/index.ts
export * from './party';
```

## 🎨 Best Practices

### Query Keys
- Centralize query keys in each query file
- Use hierarchical structure for related data
- Example:
  ```ts
  export const partyKeys = {
    all: ['party'] as const,
    lists: () => [...partyKeys.all, 'list'] as const,
    list: (filters: string) => [...partyKeys.lists(), { filters }] as const,
    details: () => [...partyKeys.all, 'detail'] as const,
    detail: (id: string) => [...partyKeys.details(), id] as const,
  };
  ```

### Error Handling
- Let Zod throw parsing errors (React Query will catch them)
- Services should throw errors, not return them
- Handle errors in components with try-catch or React Query's error state

### Cache Management
- Use `invalidateQueries` for refetching stale data
- Use `setQueryData` for optimistic updates
- Configure `staleTime` and `gcTime` per query based on data freshness needs

### Mutations
- Always return the created/updated resource from the API
- Use `onSuccess` for cache invalidation
- Use `onError` for rollback in optimistic updates

## 🚫 Common Pitfalls

### ❌ Don't: Mix concerns
```ts
// Bad: React Query in service
export async function createParty(data: CreateParty) {
  const queryClient = useQueryClient(); // ❌ React hook in service
  // ...
}
```

### ✅ Do: Keep services pure
```ts
// Good: Pure function
export async function createParty(data: CreateParty): Promise<CreatePartyResponse> {
  const response = await fetchApi<unknown>('/party/create', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return CreatePartyResponseSchema.parse(response);
}
```

### ❌ Don't: Skip validation
```ts
// Bad: No runtime validation
export async function createParty(data: CreateParty) {
  return await fetchApi<CreatePartyResponse>('/party/create', {
    method: 'POST',
    body: JSON.stringify(data),
  }); // ❌ Trusting the API
}
```

### ✅ Do: Always validate with Zod
```ts
// Good: Runtime type safety
export async function createParty(data: CreateParty): Promise<CreatePartyResponse> {
  const response = await fetchApi<unknown>('/party/create', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return CreatePartyResponseSchema.parse(response); // ✅ Validated
}
```

## 📚 Resources

- [React Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [Zod Docs](https://zod.dev/)
- [Query Key Best Practices](https://tkdodo.eu/blog/effective-react-query-keys)
- [Testing React Query](https://tkdodo.eu/blog/testing-react-query)
