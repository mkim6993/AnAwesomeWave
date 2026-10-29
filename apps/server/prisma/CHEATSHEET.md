# Developer Cheatsheet: Prisma + PostgreSQL + Fastify + pnpm

## 📖 Table of Contents

- [🚀 Most Common Daily Commands](#-most-common-daily-commands)
- [📦 pnpm Workspace Commands](#-pnpm-workspace-commands)
- [🐘 PostgreSQL & Docker Commands](#-postgresql--docker-commands)
- [🔷 Prisma Workflow](#-prisma-workflow)
- [🔄 Complete Schema Change Workflow](#-complete-schema-change-workflow)
- [📝 Prisma Usage Patterns](#-prisma-usage-patterns)
- [⚡ Fastify + Prisma Integration](#-fastify--prisma-integration)
- [🔍 Debugging & Troubleshooting](#-debugging--troubleshooting)
- [📚 Quick Reference Links](#-quick-reference-links)
- [🎯 Environment Variables](#-environment-variables)

---

## 🚀 Most Common Daily Commands

```bash
# Start PostgreSQL database
docker compose up -d

# Generate Prisma Client after schema changes
npx prisma generate

# Create and apply a migration
npx prisma migrate dev --name description-of-change

# Start the development server
pnpm dev

# Check database status
docker ps
```

---

## 📦 pnpm Workspace Commands

```bash
# Install dependencies for entire workspace
pnpm install

# Install a package in this workspace
pnpm add <package>

# Install a dev dependency
pnpm add -D <package>

# Run script from workspace root
pnpm --filter server dev

# Update dependencies
pnpm update
```

---

## 🐘 PostgreSQL & Docker Commands

### Start/Stop Database
```bash
# Start database (detached mode)
docker compose up -d

# Stop database
docker compose down

# Stop and remove volumes (⚠️ deletes all data)
docker compose down -v

# View logs
docker compose logs postgres
docker compose logs -f postgres  # follow logs

# Check if running
docker ps
```

### Connect to Database
```bash
# PostgreSQL CLI (from inside container)
docker exec -it awesome_wave_db psql -U awesome_user -d awesome_wave

# Or use Prisma Studio (GUI)
npx prisma studio
```

### Useful psql Commands
```sql
-- List all databases
\l

-- Connect to database
\c awesome_wave

-- List all tables
\dt

-- Describe table structure
\d table_name

-- View all data in a table
SELECT * FROM "Operator";

-- Exit psql
\q
```

---

## 🔷 Prisma Workflow

### When You Change Schema
```bash
# 1. Edit prisma/schema.prisma
# 2. Create migration and update database
npx prisma migrate dev --name add-user-table

# This automatically:
# - Creates migration files
# - Applies migration to database
# - Regenerates Prisma Client

# OR for quick prototyping (no migration files)
npx prisma db push
```

### Viewing Data
```bash
# Open Prisma Studio (database GUI)
npx prisma studio
```

### Reset Database
```bash
# ⚠️ Deletes all data and re-runs migrations
npx prisma migrate reset
```

### Check Migration Status
```bash
# View migration history
npx prisma migrate status

# Apply pending migrations (production)
npx prisma migrate deploy
```

### Pull Schema from Existing Database
```bash
# Generate Prisma schema from database
npx prisma db pull
```

---

## 🔄 Complete Schema Change Workflow

```bash
# 1. Make sure database is running
docker compose up -d

# 2. Edit prisma/schema.prisma
# Add your models, fields, relations

# 3. Create and apply migration
npx prisma migrate dev --name your-change-description

# 4. Restart dev server to use new types
pnpm dev

# 5. (Optional) View data
npx prisma studio
```

**What happens during migration:**
1. Prisma analyzes schema changes
2. Creates SQL migration file in `prisma/migrations/`
3. Applies migration to database
4. Regenerates TypeScript client in `prisma/generated/`
5. Your code now has new types

---

## 📝 Prisma Usage Patterns

### Basic CRUD Operations

```typescript
import { db } from './db'; // Your Prisma client instance

// CREATE
const operator = await db.operator.create({
  data: {
    name: 'John Doe',
    status: 'ACTIVE',
  },
});

// READ (find one)
const operator = await db.operator.findUnique({
  where: { id: 1 },
});

// READ (find many)
const operators = await db.operator.findMany({
  where: { status: 'ACTIVE' },
  orderBy: { createdAt: 'desc' },
  take: 10, // limit
});

// UPDATE
const updated = await db.operator.update({
  where: { id: 1 },
  data: { status: 'INACTIVE' },
});

// DELETE
await db.operator.delete({
  where: { id: 1 },
});

// UPSERT (update or create)
const operator = await db.operator.upsert({
  where: { id: 1 },
  update: { status: 'ACTIVE' },
  create: { name: 'John Doe', status: 'ACTIVE' },
});
```

### Relations
```typescript
// Create with nested relations
const party = await db.party.create({
  data: {
    name: 'Epic Party',
    operators: {
      connect: [{ id: 1 }, { id: 2 }], // Link existing
    },
  },
  include: {
    operators: true, // Include relations in response
  },
});

// Query with relations
const party = await db.party.findUnique({
  where: { id: 1 },
  include: {
    operators: true,
  },
});
```

### Filtering & Pagination
```typescript
// Complex filtering
const results = await db.operator.findMany({
  where: {
    AND: [
      { status: 'ACTIVE' },
      { createdAt: { gte: new Date('2024-01-01') } },
    ],
    OR: [
      { name: { contains: 'John' } },
      { name: { contains: 'Jane' } },
    ],
  },
  skip: 0,     // offset
  take: 20,    // limit
  orderBy: {
    createdAt: 'desc',
  },
});

// Count
const count = await db.operator.count({
  where: { status: 'ACTIVE' },
});
```

---

## ⚡ Fastify + Prisma Integration

### Setting Up Prisma Client

```typescript
// src/plugins/database.ts
import fp from 'fastify-plugin';
import { PrismaClient } from '../../prisma/generated/client';

declare module 'fastify' {
  interface FastifyInstance {
    db: PrismaClient;
  }
}

export default fp(async (fastify) => {
  const db = new PrismaClient();

  fastify.decorate('db', db);

  fastify.addHook('onClose', async (instance) => {
    await instance.db.$disconnect();
  });
});
```

### Route Examples

```typescript
// src/routes/operator/index.ts
import { FastifyPluginAsync } from 'fastify';

const operatorRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /operator
  fastify.get('/', async (request, reply) => {
    const operators = await fastify.db.operator.findMany();
    return operators;
  });

  // GET /operator/:id
  fastify.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const operator = await fastify.db.operator.findUnique({
      where: { id: parseInt(request.params.id) },
    });

    if (!operator) {
      return reply.code(404).send({ error: 'Operator not found' });
    }

    return operator;
  });

  // POST /operator
  fastify.post<{ Body: { name: string; status: string } }>(
    '/',
    async (request, reply) => {
      const operator = await fastify.db.operator.create({
        data: request.body,
      });
      return reply.code(201).send(operator);
    }
  );

  // PATCH /operator/:id
  fastify.patch<{
    Params: { id: string };
    Body: { status?: string };
  }>('/:id', async (request, reply) => {
    const operator = await fastify.db.operator.update({
      where: { id: parseInt(request.params.id) },
      data: request.body,
    });
    return operator;
  });

  // DELETE /operator/:id
  fastify.delete<{ Params: { id: string } }>(
    '/:id',
    async (request, reply) => {
      await fastify.db.operator.delete({
        where: { id: parseInt(request.params.id) },
      });
      return reply.code(204).send();
    }
  );
};

export default operatorRoutes;
```

### Error Handling with Prisma

```typescript
import { Prisma } from '../../prisma/generated/client';

fastify.post('/', async (request, reply) => {
  try {
    const operator = await fastify.db.operator.create({
      data: request.body,
    });
    return reply.code(201).send(operator);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Unique constraint violation
      if (error.code === 'P2002') {
        return reply.code(409).send({
          error: 'Operator already exists',
        });
      }
      // Record not found
      if (error.code === 'P2025') {
        return reply.code(404).send({
          error: 'Operator not found',
        });
      }
    }
    throw error; // Let Fastify handle other errors
  }
});
```

---

## 🔍 Debugging & Troubleshooting

```bash
# Check Prisma version
npx prisma --version

# Validate schema
npx prisma validate

# Format schema file
npx prisma format

# View generated SQL for next migration (without applying)
npx prisma migrate dev --create-only

# Check database connection
docker exec awesome_wave_db pg_isready

# View database size
docker exec awesome_wave_db psql -U awesome_user -d awesome_wave -c "SELECT pg_size_pretty(pg_database_size('awesome_wave'));"
```

### Common Issues

**"Can't connect to database"**
```bash
# Check if Docker is running
docker ps

# Check if PostgreSQL is running
docker compose ps

# Restart database
docker compose restart postgres
```

**"Client is not generated"**
```bash
# Regenerate client
npx prisma generate
```

**"Migration conflicts"**
```bash
# Reset and start fresh (⚠️ loses data)
npx prisma migrate reset

# Or resolve manually
npx prisma migrate resolve --applied <migration-name>
```

---

## 📚 Quick Reference Links

- [Prisma Docs](https://www.prisma.io/docs)
- [Fastify Docs](https://fastify.dev/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [pnpm Docs](https://pnpm.io/)

---

## 🎯 Environment Variables

Your `.env` file should contain:
```env
DATABASE_URL="postgresql://awesome_user:awesome_pass@localhost:5432/awesome_wave"
```

**Connection string format:**
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```
