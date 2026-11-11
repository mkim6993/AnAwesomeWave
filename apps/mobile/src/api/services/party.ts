import { fetchApi } from '../client';
import {
  CreatePartyResponseSchema,
  JoinPartyResponseSchema,
  GetPartyResponseSchema,
  type CreateParty,
  type JoinParty,
  type CreatePartyResponse,
  type JoinPartyResponse,
  type GetPartyResponse,
} from '@AnAwesomeWave/shared';

/**
 * Party API Service
 * 
 * Pure fetch functions with Zod validation.
 * These are framework-agnostic and can be used anywhere.
 */

export async function createParty(
  data: CreateParty
): Promise<CreatePartyResponse> {
  const response = await fetchApi<unknown>('/party/create', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  // Runtime validation with Zod
  return CreatePartyResponseSchema.parse(response);
}

export async function joinParty(
  data: JoinParty
): Promise<JoinPartyResponse> {
  const response = await fetchApi<unknown>('/party/join', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  return JoinPartyResponseSchema.parse(response);
}

export async function getParty(id: string): Promise<GetPartyResponse> {
  const response = await fetchApi<unknown>(`/party/${id}`);
  return GetPartyResponseSchema.parse(response);
}
