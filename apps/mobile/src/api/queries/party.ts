import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createParty, joinParty, getParty, getPartyByJoinCode } from '../services/party';
import { ApiError } from '../client';
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
  byJoinCode: (code: string) => [...partyKeys.all, 'join-code', code] as const,
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
 * Fetch a single party by join code
 */
export function usePartyByJoinCode(code: string, enabled = true) {
  return useQuery({
    queryKey: partyKeys.byJoinCode(code),
    queryFn: () => getPartyByJoinCode(code),
    enabled: enabled && code.length > 0, // Only query if code is provided
    staleTime: 1000 * 60 * 2, // 2 minutes (shorter than ID query since codes are temporary)
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx) - these are permanent failures
      if (error instanceof ApiError && error.statusCode >= 400 && error.statusCode < 500) {
        return false; // 404 Not Found, 400 Bad Request, etc - don't retry
      }
      // Retry network errors and 5xx server errors up to 2 times
      return failureCount < 2;
    },
  });
}

/**
 * Lazy version - fetch party by join code only on manual trigger
 * Useful for user-triggered searches (e.g., "Search" button click)
 */
export function useLazyPartyByJoinCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => getPartyByJoinCode(code),
    onSuccess: (data, code) => {
      // Cache the result so usePartyByJoinCode can access it
      queryClient.setQueryData(partyKeys.byJoinCode(code), data);
    },
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
