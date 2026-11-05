# Database Schema Overview

## Entity Relationship Diagram

```
┌──────────────┐
│     User     │
│──────────────│
│ id (PK)      │
│ username     │◄────────┐
│ displayname  │         │
│ createdAt    │         │
└──────────────┘         │
       │                 │
       │ organizes       │ participates as
       │                 │
       ▼                 │
┌──────────────┐         │
│    Party     │         │
│──────────────│         │
│ id (PK)      │         │
│ name         │         │
│ joinCode     │         │
│ status       │         │
│ organizerId  │─────────┘
│ createdAt    │
└──────────────┘
       │
       │ has many
       │
       ▼
┌──────────────────┐
│   Participant    │
│──────────────────│
│ id (PK)          │
│ partyId (FK)     │
│ userId (FK)?     │───┐
│ guestToken?      │   │ (one or the other)
│ role             │   │
│ joinedAt         │   │
└──────────────────┘   │
                       └─── Either userId OR guestToken (not both)
```

---

## Tables at a Glance

| Table | Purpose | Key Fields |
|-------|---------|------------|
| **User** | Authenticated users | `username` (unique), `displayname` |
| **Party** | Events/parties | `joinCode` (unique), `status` |
| **Participant** | Party membership | `userId` OR `guestToken`, `role` |

---

## Enums

```typescript
PartyStatus = SCHEDULED | LIVE | ENDED
ParticipantRole = OPERATOR | GUEST
```

---

## Relationships & Cascade Behavior

```
User ──[1:many]──> Party (as organizer)
User ──[1:many]──> Participant (as participant)
Party ──[1:many]──> Participant

CASCADE RULES:
• Delete Party → All Participants deleted
• Delete User → Participant.userId set to NULL (participant remains as guest)
```

---

## Business Rules

### ✅ Database-Enforced

1. **User uniqueness**: Each username is unique
2. **Party uniqueness**: Each party joinCode is unique
3. **No duplicate joins**: Same user cannot join same party twice
4. **No reused guest tokens**: Same guestToken cannot be used twice in same party

### ⚠️ Application-Enforced (Required)

1. **Participant identity**: Each participant must have EITHER `userId` OR `guestToken` (not both, not neither)
2. **Transaction safety**: Use transactions when creating participants to prevent race conditions

### 🚧 Future Constraints (Not Yet Implemented)

1. **One LIVE party per organizer**: Users hosting a LIVE party cannot host another LIVE party
2. **Organizer cannot participate**: Users hosting a LIVE party cannot join other parties as participants

> **Note:** These future constraints are temporary business rules under consideration and not yet enforced in the schema or application layer.

---

## Key Queries

```typescript
// Check if user has active LIVE party as organizer
await prisma.party.findFirst({
  where: { organizerId: userId, status: 'LIVE' }
});

// Check if user is participating in any party
await prisma.participant.findFirst({
  where: { userId: userId }
});

// Get user's organized parties
await prisma.user.findUnique({
  where: { id: userId },
  include: { organizedParties: true }
});

// Get user's participations
await prisma.user.findUnique({
  where: { id: userId },
  include: { 
    participations: { include: { party: true } }
  }
});
```
