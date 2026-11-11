import { useQuery } from '@tanstack/react-query';
import { getUserParties } from '../services/user';

/**
 * React Query hooks for User operations
 * 
 * These wrap the service functions with React Query for:
 * - Automatic caching
 * - Loading/error states
 * - Background refetching
 * - Cache invalidation
 */

// Query Keys - centralized for cache management
export const userKeys = {
  all: ['user'] as const,
  parties: (userId: string) => [...userKeys.all, userId, 'parties'] as const,
};

/**
 * Fetch all parties for a user
 * 
 * Returns parties with:
 * - Party details (name, status, joinCode)
 * - User's role (OPERATOR or GUEST)
 * - Organizer information
 * - Participant count
 * - Join timestamp
 * 
 * @param userId - The user ID to fetch parties for
 * @param options - Optional React Query configuration
 * 
 * @example
 * ```tsx
 * function HomeScreen() {
 *   const { data, isLoading, error } = useUserParties('user123');
 * 
 *   if (isLoading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage error={error} />;
 * 
 *   return (
 *     <FlatList
 *       data={data.parties}
 *       renderItem={({ item }) => <PartyCard party={item} />}
 *     />
 *   );
 * }
 * ```
 */
export function useUserParties(userId: string) {
  return useQuery({
    queryKey: userKeys.parties(userId),
    queryFn: () => getUserParties(userId),
    
    // Refetch strategy for near-real-time updates without server overload:
    staleTime: 1000 * 30, // 30 seconds - data is considered fresh
    refetchInterval: 1000 * 60, // 1 minute - background polling when app is active
    refetchOnWindowFocus: true, // Refetch when app comes to foreground
    refetchOnMount: true, // Always refetch on component mount
    refetchIntervalInBackground: false, // Don't poll when app is backgrounded
    
    // Only run query if userId is provided
    enabled: !!userId,
  });
}
