# How to Use `useUserParties` in a Screen

## Basic Usage

```tsx
import { useUserParties } from '@/api/queries';
import { View, FlatList, Text } from 'react-native';

export default function HomeScreen() {
  const userId = 'your-user-id'; // Get this from your auth context
  
  const { data, isLoading, error, refetch } = useUserParties(userId);

  if (isLoading) {
    return <LoadingIsland />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <FlatList
      data={data.parties}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View>
          <Text>{item.name}</Text>
          <Text>Status: {item.status}</Text>
          <Text>Role: {item.userRole}</Text>
          <Text>Participants: {item.participantCount}</Text>
          {item.isOrganizer && <Text>👑 You're the organizer</Text>}
        </View>
      )}
      onRefresh={refetch}
      refreshing={isLoading}
    />
  );
}
```

## With TypeScript

The hook returns fully typed data from the shared schema:

```tsx
import { useUserParties } from '@/api/queries';
import type { UserPartyItem } from '@AnAwesomeWave/shared';

function PartyCard({ party }: { party: UserPartyItem }) {
  return (
    <View>
      <Text>{party.name}</Text>
      {/* TypeScript knows all available fields */}
      <Text>Join Code: {party.joinCode}</Text>
      <Text>Organizer: {party.organizer.displayname ?? party.organizer.username}</Text>
      <Text>Joined: {party.joinedAt.toLocaleDateString()}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const userId = 'user123';
  const { data, isLoading } = useUserParties(userId);

  if (isLoading) return <LoadingIsland />;

  return (
    <FlatList
      data={data?.parties}
      renderItem={({ item }) => <PartyCard party={item} />}
    />
  );
}
```

## Available Fields on Each Party

```typescript
{
  id: string,              // Party ID
  name: string,            // Party name
  status: 'SCHEDULED' | 'LIVE' | 'ENDED',
  joinCode: string,        // e.g., "ABC123"
  createdAt: Date,         // When party was created
  organizer: {
    id: string,
    username: string,
    displayname: string | null
  },
  participantCount: number, // Total participants
  userRole: 'OPERATOR' | 'GUEST',
  joinedAt: Date,          // When this user joined
  isOrganizer: boolean     // True if user created the party
}
```

## React Query Features

```tsx
const {
  data,           // The response data
  isLoading,      // Initial loading state
  isFetching,     // Background refetch state
  error,          // Error object if fetch failed
  refetch,        // Manual refetch function
  isError,        // Boolean error state
} = useUserParties(userId);

// Cached automatically for 2 minutes
// Refetches in background when stale
// Can be invalidated from mutations
```
