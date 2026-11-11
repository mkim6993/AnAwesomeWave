import { fetchApi } from '../client';
import {
  GetUserPartiesResponseSchema,
  type GetUserPartiesResponse,
} from '@AnAwesomeWave/shared';

/**
 * User API Service
 * 
 * Pure fetch functions with Zod validation.
 * These are framework-agnostic and can be used anywhere.
 */

/**
 * Get all parties for a user
 * @param userId - The user ID to fetch parties for
 * @returns Promise with user's parties including role and participant info
 */
export async function getUserParties(
  userId: string
): Promise<GetUserPartiesResponse> {
  const response = await fetchApi<unknown>(`/user/${userId}/parties`);
  
  // Runtime validation with Zod
  return GetUserPartiesResponseSchema.parse(response);
}
