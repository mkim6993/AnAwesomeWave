# Adding New API Query Tools - Step-by-Step Guide

This guide walks through the complete process of creating React Query hooks for new API endpoints. Follow these steps in order for every new endpoint.

## 📋 Prerequisites

Before starting, you should have:
- A working backend endpoint (Fastify route in `apps/server/src/routes/`)
- The endpoint URL path and HTTP method (GET, POST, etc.)
- Understanding of the request parameters and response structure

## 🔄 The Complete Flow

```
Backend Endpoint
    ↓
1. Add Response Schema (shared package)
    ↓
2. Create Service Function (services/)
    ↓
3. Create React Query Hook (queries/)
    ↓
4. Use in Components
```

---

## Step 1: Add Response Schema to Shared Package

**Location:** `/packages/shared/src/schemas/schemas.ts`

### Why?
The shared package provides type-safe, validated schemas that both the server and client use. This ensures runtime type safety with Zod validation.

### What to do:

1. **Identify the endpoint's response structure** by looking at the backend route handler
2. **Create a Zod schema** that matches the response
3. **Export both the schema and its TypeScript type**

### Example:

For endpoint: `GET /party/get-by-join-code/:code`

Backend returns:
```typescript
// Success case
{ success: true, party: { id, name, joinCode, ... } }

// Error case
{ success: false, error: 'Party not found' }
```

Schema:
```typescript
export const GetPartyByJoinCodeResponseSchema = z.object({
  success: z.boolean(),
  party: PartySchema.nullable(), // nullable to handle 404 case
});
export type GetPartyByJoinCodeResponse = z.infer<typeof GetPartyByJoinCodeResponseSchema>;
```

### Schema Naming Convention:
- Response schemas: `Get<Resource><Action>ResponseSchema`
- Request schemas: `<Action><Resource>Schema`

### Common Patterns:

**Single resource GET:**
```typescript
export const GetResourceResponseSchema = z.object({
  success: z.boolean(),
  resource: ResourceSchema.nullable(),
});
```

**List/collection GET:**
```typescript
export const GetResourcesResponseSchema = z.object({
  success: z.boolean(),
  resources: z.array(ResourceSchema),
});
```

**POST/PUT with created/updated resource:**
```typescript
export const CreateResourceResponseSchema = z.object({
  success: z.boolean(),
  resource: ResourceSchema,
});
```

**Action with side effects:**
```typescript
export const ActionResourceResponseSchema = z.object({
  success: z.boolean(),
  resource: ResourceSchema,
  additionalData: OtherSchema.optional(),
});
```

---

## Step 2: Create Service Function

**Location:** `/apps/mobile/src/api/services/<domain>.ts` (e.g., `party.ts`, `user.ts`)

### Why?
Service functions are pure, framework-agnostic API calls. They can be used anywhere (components, tests, scripts) without React dependencies.

### What to do:

1. **Import the schema and type** from `@AnAwesomeWave/shared`
2. **Import `fetchApi`** from `../client`
3. **Create an async function** that calls the endpoint
4. **Validate the response** with Zod's `.parse()` method

### Example:

```typescript
import { fetchApi } from '../client';
import {
  GetPartyByJoinCodeResponseSchema,
  type GetPartyByJoinCodeResponse,
} from '@AnAwesomeWave/shared';

export async function getPartyByJoinCode(
  code: string
): Promise<GetPartyByJoinCodeResponse> {
  const response = await fetchApi<unknown>(`/party/get-by-join-code/${code}`);
  return GetPartyByJoinCodeResponseSchema.parse(response);
}
```

### Function Patterns by HTTP Method:

**GET with path parameter:**
```typescript
export async function getResource(id: string): Promise<GetResourceResponse> {
  const response = await fetchApi<unknown>(`/resource/${id}`);
  return GetResourceResponseSchema.parse(response);
}
```

**GET with query parameters:**
```typescript
export async function getResources(
  filters?: { status?: string; page?: number }
): Promise<GetResourcesResponse> {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.page) params.append('page', String(filters.page));
  
  const query = params.toString();
  const response = await fetchApi<unknown>(
    `/resources${query ? `?${query}` : ''}`
  );
  return GetResourcesResponseSchema.parse(response);
}
```

**POST with body:**
```typescript
export async function createResource(
  data: CreateResource
): Promise<CreateResourceResponse> {
  const response = await fetchApi<unknown>('/resource/create', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return CreateResourceResponseSchema.parse(response);
}
```

**PATCH/PUT:**
```typescript
export async function updateResource(
  id: string,
  data: UpdateResource
): Promise<UpdateResourceResponse> {
  const response = await fetchApi<unknown>(`/resource/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return UpdateResourceResponseSchema.parse(response);
}
```

**DELETE:**
```typescript
export async function deleteResource(
  id: string
): Promise<DeleteResourceResponse> {
  const response = await fetchApi<unknown>(`/resource/${id}`, {
    method: 'DELETE',
  });
  return DeleteResourceResponseSchema.parse(response);
}
```

### Key Principles:
- ✅ Always type `fetchApi<unknown>` - never trust the API
- ✅ Always validate with `.parse()` - runtime type safety
- ✅ Keep functions pure - no side effects or React hooks
- ✅ Return the parsed, validated response type
- ❌ Don't catch errors - let React Query handle them
- ❌ Don't use React hooks (`useState`, `useQuery`, etc.)

---

## Step 3: Create React Query Hook

**Location:** `/apps/mobile/src/api/queries/<domain>.ts`

### Why?
React Query hooks provide automatic caching, loading states, error handling, and cache invalidation for React components.

### What to do:

1. **Import the service function** from `../services/<domain>`
2. **Add query key** to the centralized `<domain>Keys` object
3. **Create a `useQuery` or `useMutation` hook**
4. **Configure cache behavior** (staleTime, enabled, etc.)
5. **Handle cache invalidation** for mutations

### Part A: Add Query Key

Query keys are used by React Query to cache and invalidate data. Keep them in a centralized object.

```typescript
export const partyKeys = {
  all: ['party'] as const,
  detail: (id: string) => [...partyKeys.all, id] as const,
  byJoinCode: (code: string) => [...partyKeys.all, 'join-code', code] as const,
};
```

**Key Structure Pattern:**
- Base: `['resource']`
- Collections: `['resource', 'list']` or `['resource', 'list', { filters }]`
- Detail: `['resource', id]`
- Nested/filtered: `['resource', 'type', identifier]`

### Part B: Create the Hook

#### For GET requests (useQuery):

```typescript
import { useQuery } from '@tanstack/react-query';
import { getPartyByJoinCode } from '../services/party';

/**
 * Fetch a single party by join code
 */
export function usePartyByJoinCode(code: string, enabled = true) {
  return useQuery({
    queryKey: partyKeys.byJoinCode(code),
    queryFn: () => getPartyByJoinCode(code),
    enabled: enabled && code.length > 0, // Only query if code is provided
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
```

#### For POST/PUT/DELETE (useMutation):

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createResource } from '../services/resource';

/**
 * Create a new resource
 */
export function useCreateResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateResource) => createResource(data),
    onSuccess: (response) => {
      // Invalidate list queries to refetch
      queryClient.invalidateQueries({ queryKey: resourceKeys.all });
      
      // Optionally set the cache for the new resource
      queryClient.setQueryData(
        resourceKeys.detail(response.resource.id),
        response
      );
    },
  });
}
```

### Common useQuery Configurations:

**Basic query:**
```typescript
export function useResource(id: string) {
  return useQuery({
    queryKey: resourceKeys.detail(id),
    queryFn: () => getResource(id),
  });
}
```

**Query with conditional fetching:**
```typescript
export function useResource(id: string | undefined) {
  return useQuery({
    queryKey: resourceKeys.detail(id ?? 'none'),
    queryFn: () => getResource(id!),
    enabled: !!id, // Only fetch if ID exists
  });
}
```

**Query with custom stale time:**
```typescript
export function useResources() {
  return useQuery({
    queryKey: resourceKeys.all,
    queryFn: getResources,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30,    // 30 minutes (formerly cacheTime)
  });
}
```

**Query with polling:**
```typescript
export function useLiveResource(id: string) {
  return useQuery({
    queryKey: resourceKeys.detail(id),
    queryFn: () => getResource(id),
    refetchInterval: 5000, // Poll every 5 seconds
  });
}
```

**Query with smart retry logic:**
```typescript
import { ApiError } from '../client';

export function useResource(id: string) {
  return useQuery({
    queryKey: resourceKeys.detail(id),
    queryFn: () => getResource(id),
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx) - these are permanent failures
      if (error instanceof ApiError && error.statusCode >= 400 && error.statusCode < 500) {
        return false; // 404, 400, 401, 403, etc - won't succeed on retry
      }
      // Retry network errors and 5xx server errors up to 2 times
      return failureCount < 2;
    },
  });
}
```

### Common useMutation Patterns:

**Mutation with optimistic updates:**
```typescript
export function useUpdateResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateResource }) =>
      updateResource(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: resourceKeys.detail(id) });

      // Snapshot previous value
      const previous = queryClient.getQueryData(resourceKeys.detail(id));

      // Optimistically update
      queryClient.setQueryData(resourceKeys.detail(id), (old: any) => ({
        ...old,
        resource: { ...old.resource, ...data },
      }));

      return { previous };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(
          resourceKeys.detail(variables.id),
          context.previous
        );
      }
    },
    onSettled: (data, error, variables) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ 
        queryKey: resourceKeys.detail(variables.id) 
      });
    },
  });
}
```

**Mutation with multiple cache updates:**
```typescript
export function useDeleteResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteResource(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: resourceKeys.detail(id) });
      
      // Refetch lists
      queryClient.invalidateQueries({ queryKey: resourceKeys.all });
    },
  });
}
```

### Cache Invalidation Strategy:

Use `invalidateQueries` when:
- You want React Query to refetch the data
- The exact new state is unknown
- Multiple queries might be affected

Use `setQueryData` when:
- You have the new data from the mutation response
- You want immediate UI updates without refetching
- You know the exact cache structure

---

## Step 4: Use in Components

### Basic Usage Examples:

#### useQuery in a component:

```typescript
import { usePartyByJoinCode } from '@/api/queries/party';
import { Text, ActivityIndicator } from 'react-native';

function JoinPartyScreen() {
  const [code, setCode] = useState('');
  const { data, isLoading, error } = usePartyByJoinCode(
    code, 
    code.length === 6 // Only fetch when code is complete
  );

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;
  if (!data?.party) return <Text>No party found</Text>;

  return <Text>{data.party.name}</Text>;
}
```

#### useMutation in a component:

```typescript
import { useCreateParty } from '@/api/queries/party';
import { useState } from 'react';
import { Button, TextInput } from 'react-native';

function CreatePartyScreen() {
  const [name, setName] = useState('');
  const createPartyMutation = useCreateParty();

  const handleCreate = async () => {
    try {
      const result = await createPartyMutation.mutateAsync({
        name,
        organizerId: 'user-id',
      });
      console.log('Created party:', result.party);
      // Navigate to party or show success
    } catch (error) {
      console.error('Failed to create party:', error);
      // Show error toast/alert
    }
  };

  return (
    <>
      <TextInput value={name} onChangeText={setName} />
      <Button
        title="Create Party"
        onPress={handleCreate}
        disabled={createPartyMutation.isPending}
      />
    </>
  );
}
```

#### Multiple queries:

```typescript
function PartyDetailsScreen({ partyId }: { partyId: string }) {
  const partyQuery = useParty(partyId);
  const organizerQuery = useUser(partyQuery.data?.party?.organizerId);

  // Show loading until both queries complete
  if (partyQuery.isLoading || organizerQuery.isLoading) {
    return <ActivityIndicator />;
  }

  // Handle errors
  if (partyQuery.error) return <Text>Error loading party</Text>;
  if (organizerQuery.error) return <Text>Error loading organizer</Text>;

  return (
    <View>
      <Text>{partyQuery.data?.party?.name}</Text>
      <Text>by {organizerQuery.data?.user?.username}</Text>
    </View>
  );
}
```

#### Dependent queries:

```typescript
function ProfileScreen() {
  const { data: user } = useCurrentUser();
  
  // Only fetch parties when we have the user ID
  const { data: parties } = useUserParties(user?.id, {
    enabled: !!user?.id,
  });

  // ...
}
```

---

## 📝 Complete Checklist

When adding a new endpoint query tool, verify each step:

### 1. Shared Package Schema (`packages/shared/src/schemas/schemas.ts`)
- [ ] Response schema created with Zod
- [ ] Type exported using `z.infer<>`
- [ ] Schema name follows convention (`Get<Resource><Action>ResponseSchema`)
- [ ] Handles nullable/optional fields correctly
- [ ] Reuses existing schemas (e.g., `PartySchema`, `UserSchema`)

### 2. Service Function (`apps/mobile/src/api/services/<domain>.ts`)
- [ ] Function is async and returns `Promise<ResponseType>`
- [ ] Uses `fetchApi<unknown>()` (never trust API types)
- [ ] Validates response with `.parse()`
- [ ] Follows naming convention: `get<Resource>`, `create<Resource>`, etc.
- [ ] No React hooks or side effects
- [ ] Correct HTTP method and endpoint path
- [ ] Request body stringified for POST/PUT/PATCH

### 3. React Query Hook (`apps/mobile/src/api/queries/<domain>.ts`)
- [ ] Query key added to `<domain>Keys` object
- [ ] Uses `useQuery` for GET or `useMutation` for POST/PUT/DELETE
- [ ] Has JSDoc comment explaining what it does
- [ ] Appropriate cache configuration (staleTime, enabled, etc.)
- [ ] Mutations invalidate affected queries
- [ ] Hook name follows convention: `use<Action><Resource>`

### 4. Exports (`services/index.ts` and `queries/index.ts`)
- [ ] New service function exported from `services/index.ts`
- [ ] New hook exported from `queries/index.ts`

### 5. Testing
- [ ] Import works in a component without errors
- [ ] Query fetches data correctly
- [ ] Loading state displays appropriately
- [ ] Error handling works
- [ ] Cache updates after mutations

---

## 🚨 Common Pitfalls & How to Avoid Them

### ❌ Pitfall 1: Forgetting Runtime Validation
```typescript
// BAD - No validation
export async function getParty(id: string): Promise<GetPartyResponse> {
  return await fetchApi<GetPartyResponse>(`/party/${id}`);
}
```

```typescript
// GOOD - Always validate
export async function getParty(id: string): Promise<GetPartyResponse> {
  const response = await fetchApi<unknown>(`/party/${id}`);
  return GetPartyResponseSchema.parse(response);
}
```

### ❌ Pitfall 2: Using React Hooks in Services
```typescript
// BAD - Service has React dependency
export async function createParty(data: CreateParty) {
  const queryClient = useQueryClient(); // ❌ Can't use hooks here
  const result = await fetchApi(/*...*/);
  queryClient.invalidateQueries(/*...*/);
  return result;
}
```

```typescript
// GOOD - Service is pure, hook handles side effects
// In services/party.ts
export async function createParty(data: CreateParty) {
  const response = await fetchApi(/*...*/);
  return CreatePartyResponseSchema.parse(response);
}

// In queries/party.ts
export function useCreateParty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createParty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partyKeys.all });
    },
  });
}
```

### ❌ Pitfall 3: Not Adding Query Keys Properly
```typescript
// BAD - Hardcoded keys, hard to manage
export function useParty(id: string) {
  return useQuery({
    queryKey: ['party', id], // ❌ Not centralized
    queryFn: () => getParty(id),
  });
}
```

```typescript
// GOOD - Centralized query keys
export const partyKeys = {
  all: ['party'] as const,
  detail: (id: string) => [...partyKeys.all, id] as const,
};

export function useParty(id: string) {
  return useQuery({
    queryKey: partyKeys.detail(id), // ✅ Reusable
    queryFn: () => getParty(id),
  });
}
```

### ❌ Pitfall 4: Not Handling Conditional Queries
```typescript
// BAD - Queries even when ID is undefined
export function useParty(id?: string) {
  return useQuery({
    queryKey: ['party', id],
    queryFn: () => getParty(id!), // ❌ Will error if id is undefined
  });
}
```

```typescript
// GOOD - Only queries when ID exists
export function useParty(id?: string) {
  return useQuery({
    queryKey: ['party', id ?? 'none'],
    queryFn: () => getParty(id!),
    enabled: !!id, // ✅ Only fetches if ID exists
  });
}
```

### ❌ Pitfall 5: Missing Cache Invalidation
```typescript
// BAD - Cache never updates after mutation
export function useCreateParty() {
  return useMutation({
    mutationFn: createParty,
    // ❌ No onSuccess, list queries stay stale
  });
}
```

```typescript
// GOOD - Invalidates affected queries
export function useCreateParty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createParty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partyKeys.all });
    },
  });
}
```

---

## 🎯 Real-World Example: Complete Implementation

Let's walk through adding support for `GET /party/get-by-join-code/:code`:

### Step 1: Backend Analysis
```typescript
// Backend endpoint in apps/server/src/routes/party/index.ts
server.get('/get-by-join-code/:code', async (request, reply) => {
  const { code } = request.params as { code: string }
  const party = await fastify.prisma.party.findUnique({
    where: { joinCode: code }
  })

  if (!party) {
    return reply.code(404).send({
      success: false,
      error: 'Party not found'
    })
  }
  return { success: true, party };
})
```

Response shape:
- Success: `{ success: true, party: Party }`
- Error: `{ success: false, error: string }`

### Step 2: Shared Schema
```typescript
// In packages/shared/src/schemas/schemas.ts

export const GetPartyByJoinCodeResponseSchema = z.object({
  success: z.boolean(),
  party: PartySchema.nullable(), // nullable to handle 404
});
export type GetPartyByJoinCodeResponse = z.infer<
  typeof GetPartyByJoinCodeResponseSchema
>;
```

### Step 3: Service Function
```typescript
// In apps/mobile/src/api/services/party.ts

import {
  GetPartyByJoinCodeResponseSchema,
  type GetPartyByJoinCodeResponse,
} from '@AnAwesomeWave/shared';

export async function getPartyByJoinCode(
  code: string
): Promise<GetPartyByJoinCodeResponse> {
  const response = await fetchApi<unknown>(`/party/get-by-join-code/${code}`);
  return GetPartyByJoinCodeResponseSchema.parse(response);
}
```

### Step 4: Query Hook
```typescript
// In apps/mobile/src/api/queries/party.ts

// 1. Add query key
export const partyKeys = {
  all: ['party'] as const,
  detail: (id: string) => [...partyKeys.all, id] as const,
  byJoinCode: (code: string) => [...partyKeys.all, 'join-code', code] as const,
};

// 2. Create hook
import { getPartyByJoinCode } from '../services/party';

/**
 * Fetch a single party by join code
 */
export function usePartyByJoinCode(code: string, enabled = true) {
  return useQuery({
    queryKey: partyKeys.byJoinCode(code),
    queryFn: () => getPartyByJoinCode(code),
    enabled: enabled && code.length > 0,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
```

### Step 5: Use in Component
```typescript
// In a component
import { usePartyByJoinCode } from '@/api/queries/party';

function JoinWithCodeScreen() {
  const [joinCode, setJoinCode] = useState('');
  
  const { data, isLoading, error } = usePartyByJoinCode(
    joinCode,
    joinCode.length === 6 // Only query when code is complete
  );

  return (
    <View>
      <TextInput
        value={joinCode}
        onChangeText={setJoinCode}
        placeholder="Enter 6-character code"
        maxLength={6}
      />
      
      {isLoading && <ActivityIndicator />}
      
      {error && <Text>Party not found</Text>}
      
      {data?.party && (
        <View>
          <Text>Found: {data.party.name}</Text>
          <Button title="Join" onPress={() => {/* join logic */}} />
        </View>
      )}
    </View>
  );
}
```

---

## 📚 Additional Resources

- [React Query Documentation](https://tanstack.com/query/latest/docs/react/overview)
- [Zod Documentation](https://zod.dev/)
- [React Query Query Keys](https://tkdodo.eu/blog/effective-react-query-keys)
- [Testing React Query](https://tkdodo.eu/blog/testing-react-query)
- [Project API README](/apps/mobile/src/api/README.md)

---

## 🤖 AI Agent Quick Reference

If you are an AI agent implementing a new query tool:

1. **Read the backend endpoint** to understand request/response
2. **Check if schema exists** in `packages/shared/src/schemas/schemas.ts`
   - If not, create it following the patterns
3. **Add service function** in `apps/mobile/src/api/services/<domain>.ts`
4. **Add query hook** in `apps/mobile/src/api/queries/<domain>.ts`
   - Don't forget the query key!
5. **Update imports** in the service file to include new schema/types
6. **Update imports** in the query file to include new service function
7. **Test the changes** by using the hook in a component

**Common mistakes to avoid:**
- Not validating with Zod in the service
- Using React hooks in services
- Forgetting to add query keys
- Not handling the `enabled` flag for conditional queries
- Missing cache invalidation in mutations

**When in doubt:**
- Look at existing implementations in the same file
- Follow the patterns consistently
- Refer to this guide for step-by-step instructions
