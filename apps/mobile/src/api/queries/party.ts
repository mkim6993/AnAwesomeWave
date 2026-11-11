import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createParty, joinParty, getParty } from '../services/party';
import type { CreateParty, JoinParty } from '@AnAwesomeWave/shared';

/**
 * React Query hooks for Party operations
 * 
 * These wrap the service functions with React Query for:
 * - Automatic caching
 * - Loading/error states
 * - Optimistic updates
 * - Cache invalidation
 */

// Query Keys - centralized for cache management
export const partyKeys = {
  all: ['party'] as const,
  detail: (id: string) => [...partyKeys.all, id] as const,
};

/**
 * Fetch a single party by ID
 */
export function useParty(id: string) {
  return useQuery({
    queryKey: partyKeys.detail(id),
    queryFn: () => getParty(id),
    // Optional: configure stale time, cache time, etc.
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Create a new party
 */
export function useCreateParty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateParty) => createParty(data),
    onSuccess: (response) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: partyKeys.all });
      
      // Optionally set the cache for the new party
      queryClient.setQueryData(
        partyKeys.detail(response.party.id),
        response
      );
    },
  });
}

/**
 * Join an existing party
 */
export function useJoinParty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: JoinParty) => joinParty(data),
    onSuccess: (response) => {
      // Update cache with the joined party
      queryClient.setQueryData(
        partyKeys.detail(response.party.id),
        response
      );
    },
  });
}
