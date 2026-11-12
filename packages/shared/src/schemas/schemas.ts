import { z } from 'zod/v4';

// ============================================================================
// Enums
// ============================================================================

export const PartyStatusSchema = z.enum(['SCHEDULED', 'LIVE', 'ENDED']);
export type PartyStatus = z.infer<typeof PartyStatusSchema>;

export const ParticipantRoleSchema = z.enum(['OPERATOR', 'GUEST']);
export type ParticipantRole = z.infer<typeof ParticipantRoleSchema>;

// ============================================================================
// Base Model Schemas
// ============================================================================

/**
 * User schema - represents a registered user
 */
export const UserSchema = z.object({
  id: z.string().cuid(),
  username: z.string(),
  displayname: z.string().nullable(),
  createdAt: z.coerce.date(),
});
export type User = z.infer<typeof UserSchema>;

/**
 * Party schema - represents a party/event
 */
export const PartySchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  joinCode: z.string(),
  status: PartyStatusSchema,
  organizerId: z.string().cuid(),
  createdAt: z.coerce.date(),
});
export type Party = z.infer<typeof PartySchema>;

/**
 * Participant schema - represents a user's participation in a party
 */
export const ParticipantSchema = z.object({
  id: z.string().cuid(),
  partyId: z.string().cuid(),
  userId: z.string().cuid().nullable(),
  guestToken: z.string().nullable(),
  role: ParticipantRoleSchema,
  joinedAt: z.coerce.date(),
});
export type Participant = z.infer<typeof ParticipantSchema>;

// ============================================================================
// Extended Schemas with Relations
// ============================================================================

export const UserWithRelationsSchema = UserSchema.extend({
  organizedParties: z.array(PartySchema).optional(),
  participations: z.array(ParticipantSchema).optional(),
});
export type UserWithRelations = z.infer<typeof UserWithRelationsSchema>;

export const PartyWithRelationsSchema = PartySchema.extend({
  organizer: UserSchema.optional(),
  participants: z.array(ParticipantSchema).optional(),
});
export type PartyWithRelations = z.infer<typeof PartyWithRelationsSchema>;

export const ParticipantWithRelationsSchema = ParticipantSchema.extend({
  party: PartySchema.optional(),
  user: UserSchema.nullable().optional(),
});
export type ParticipantWithRelations = z.infer<typeof ParticipantWithRelationsSchema>;

// ============================================================================
// Create Schemas (for POST requests)
// ============================================================================

export const CreateUserSchema = z.object({
  username: z.string().min(1).max(50),
  displayname: z.string().max(100).optional(),
});
export type CreateUser = z.infer<typeof CreateUserSchema>;

export const CreatePartySchema = z.object({
  name: z.string().min(1).max(200),
  organizerId: z.string().cuid(),
  status: PartyStatusSchema.optional(),
});
export type CreateParty = z.infer<typeof CreatePartySchema>;

export const CreateParticipantSchema = z.object({
  partyId: z.string().cuid(),
  userId: z.string().cuid().optional(),
  guestToken: z.string().optional(),
  role: ParticipantRoleSchema.optional(),
});
export type CreateParticipant = z.infer<typeof CreateParticipantSchema>;

// ============================================================================
// Update Schemas (for PATCH/PUT requests)
// ============================================================================

export const UpdateUserSchema = z.object({
  username: z.string().min(1).max(50).optional(),
  displayname: z.string().max(100).nullable().optional(),
});
export type UpdateUser = z.infer<typeof UpdateUserSchema>;

export const UpdatePartySchema = z.object({
  name: z.string().min(1).max(200).optional(),
  status: PartyStatusSchema.optional(),
});
export type UpdateParty = z.infer<typeof UpdatePartySchema>;

export const UpdateParticipantSchema = z.object({
  role: ParticipantRoleSchema.optional(),
});
export type UpdateParticipant = z.infer<typeof UpdateParticipantSchema>;

// ============================================================================
// Common Request/Response Schemas
// ============================================================================

export const JoinPartySchema = z.object({
  partyId:
  z.string().cuid(),
  userId: z.string().cuid().optional(),
  guestToken: z.string().optional(),
});
export type JoinParty = z.infer<typeof JoinPartySchema>;

export const EndPartySchema = z.object({
  partyId: z.string().cuid(),
  userId: z.string().cuid(),
});
export type EndParty = z.infer<typeof EndPartySchema>;

export const PartyQuerySchema = z.object({
  status: PartyStatusSchema.optional(),
  organizerId: z.string().cuid().optional(),
});
export type PartyQuery = z.infer<typeof PartyQuerySchema>;

// ============================================================================
// API Response Schemas
// ============================================================================

export const ApiErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
  statusCode: z.number().optional(),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;

export const PaginationSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive().max(100),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});
export type Pagination = z.infer<typeof PaginationSchema>;

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: z.array(dataSchema),
    pagination: PaginationSchema,
  });

/**
 * Party API Response Schemas
 * These match what the server actually returns from /party endpoints
 */
export const GetPartyResponseSchema = z.object({
  success: z.boolean(),
  party: PartySchema.nullable(),
});
export type GetPartyResponse = z.infer<typeof GetPartyResponseSchema>;

export const CreatePartyResponseSchema = z.object({
  success: z.boolean(),
  party: PartySchema,
  participant: ParticipantSchema,
});
export type CreatePartyResponse = z.infer<typeof CreatePartyResponseSchema>;

export const JoinPartyResponseSchema = z.object({
  success: z.boolean(),
  party: PartySchema,
  participant: ParticipantSchema,
});
export type JoinPartyResponse = z.infer<typeof JoinPartyResponseSchema>;

export const GetPartyByJoinCodeResponseSchema = z.object({
  success: z.boolean(),
  party: PartySchema.nullable(),
});
export type GetPartyByJoinCodeResponse = z.infer<typeof GetPartyByJoinCodeResponseSchema>;

export const EndPartyResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type EndPartyResponse = z.infer<typeof EndPartyResponseSchema>;

/**
 * User Parties Response Schema
 * Returns all parties a user is part of with role and organizer info
 */
export const UserPartyItemSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  status: PartyStatusSchema,
  joinCode: z.string(),
  createdAt: z.coerce.date(),
  organizer: z.object({
    id: z.string().cuid(),
    username: z.string(),
    displayname: z.string().nullable(),
  }),
  participantCount: z.number().int().nonnegative(),
  userRole: ParticipantRoleSchema,
  joinedAt: z.coerce.date(),
  isOrganizer: z.boolean(),
});
export type UserPartyItem = z.infer<typeof UserPartyItemSchema>;

export const GetUserPartiesResponseSchema = z.object({
  success: z.boolean(),
  parties: z.array(UserPartyItemSchema),
});
export type GetUserPartiesResponse = z.infer<typeof GetUserPartiesResponseSchema>;

// ============================================================================
// Backward Compatibility Exports
// ============================================================================

export const CreateUserBodySchema = CreateUserSchema;
export type CreateUserBody = CreateUser;
