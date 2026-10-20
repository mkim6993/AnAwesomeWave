// Domain types for Party feature
export interface Party {
  id: string
  name: string
  hostId: string
  maxMembers: number
  currentMembers: number
  createdAt: Date
  status: 'waiting' | 'active' | 'finished'
}

export interface CreatePartyDto {
  name: string
  hostId: string
  maxMembers: number
}

export interface UpdatePartyDto {
  name?: string
  maxMembers?: number
  status?: 'waiting' | 'active' | 'finished'
}

export interface PartyMember {
  userId: string
  partyId: string
  role: 'host' | 'member'
  joinedAt: Date
}
