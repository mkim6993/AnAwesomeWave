import { fetchApi } from '../client';
import {
  CreatePartyResponseSchema,
  JoinPartyResponseSchema,
  GetPartyResponseSchema,
  GetPartyByJoinCodeResponseSchema,
  EndPartyResponseSchema,
  type CreateParty,
  type JoinParty,
  type EndParty,
  type CreatePartyResponse,
  type JoinPartyResponse,
  type GetPartyResponse,
  type GetPartyByJoinCodeResponse,
  type EndPartyResponse,
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

export async function getPartyByJoinCode(
  code: string
): Promise<GetPartyByJoinCodeResponse> {
  const response = await fetchApi<unknown>(`/party/by-join-code/${code}`);
  return GetPartyByJoinCodeResponseSchema.parse(response);
}

export async function endParty(
  data: EndParty
): Promise<EndPartyResponse> {
  const response = await fetchApi<unknown>('/party/end', {
    method: 'DELETE',
    body: JSON.stringify(data),
  });

  return EndPartyResponseSchema.parse(response);
}
