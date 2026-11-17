# Using ESLint and Prettier - Complete Guide

## What Do They Do?

### 🎨 Prettier = Automatic Code Formatter

Makes your code look pretty and consistent automatically.

**Example:**

```typescript
// You write this (messy):
const name = 'John';
let age = 25;
if (age > 18) {
  console.log('Adult');
}

// Prettier formats it to this:
const name = 'John';
let age = 25;
if (age > 18) {
  console.log('Adult');
}
```

**What Prettier fixes:**

- Spacing around operators (`=`, `+`, etc.)
- Single vs double quotes
- Semicolons
- Indentation (2 spaces)
- Line breaks
- Max line length (100 characters)

### 🔍 ESLint = Bug Finder & Best Practices Enforcer

Finds problems in your code before you run it.

**Example:**

```typescript
// ❌ ESLint finds these problems:
function getUser(id) {              // Missing TypeScript type
  const userName = 'John';          // Unused variable
  if (id == 5) {                    // Should use === not ==
    ret    ret    ret    ret    ret    ret    ret    ret    ret    ret    ret    ret    ret et    ret    ret    ret    ret    ret    ret(id     ret    ret   turn    ret    ret    ret    ret    ret    ret SL    ret    ret    ret    ret    ret    ret    ret    retype    ret    `=    ret    of     ret    ret    ret  ould    ret    ret    ret    ret    ret    ret    ret    ret    mpo    ret    ret    ret    rr

----------------------m
-----------: C-----------: C


----------: C--------hing
cd /cd /cd /cd /cd /cd /cdnalcd /cd /cd /cd /cd /cd /cdnalcd /cd /cd /e scd /cd /cd /cd /cd /cd /m cd /cd /cd ck just the mobile app
cd apps/mobile
pnpm lint
```

This shows you all the problems without changing anything.

### Step 2: Auto-Fix What Can Be Fixed

```bash
# Format code with Prettier (from root)
pnpm format

# Fix ESLint + Prettier issues in server
cd apps/server
pnpm lint:fix
```

**What gets auto-**What gets auto-**What gets auto-**What gets auto-**su**What gets auto-**What gets auto-**What gets auto-**What gal**What gets auto-**What gets auto-**What gets auto-**What gets auto-**su**What gets auto-**What gets auto-**What gets auto-**What gal**What gets auto-**What gets auto-**What gets auto-**What gets auto-**su**What gets auto-**What gets auto-**What gets auto-**What gal**What gets auto-**What gets auto-**What gets auto-**What gets auto-**su**What gets auto-**What gets auto-**What gets auto-**What gal**What gle:***What gets auto-rator/i**What gets auto-**What get 60:** The problem location

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -ex- - - - - - sho- - - - e actual issues in your code:

### Issue 1: Unused Parameter `opts`

**Current code (line 5):**

```typescript
constconstconstconstconstconstconstconstconasync (fastify, opts): Promise<void> => {
  // opts is n  // opts isywh  // opts isunction  // opts is n  // opts isywh  // opts isunction  // opts is n  // opts isywh  // opts isunction  // opts is n  // opts isywh  // opts isunction  // opts is n  // opts isywh  // opts isunction  // opts is n  // opts isywh  // opts isunction  // opts is n  // opts isywh  // opts isunction  // opts is n  // opts isywh  // opts isunction  // opts is n  // opts isywh  // opts isunction  // opts is n  // opts isywh  // opts isunction  // opts is n  // opts isywh  // opts isunction  // opts is n  // opts isywh  // opts isunction  // opts is n  // opts isywh  // opts isunction  // opts is n  // opts isywh  // opts isunct(request, reply) {
  return "this is an operator plugin";
});
```

**Why ESLint complains:**
You're not using `request` or `reply`, so why are they there?

**Fix:** Remove them

````typescript
```typescript
e them
uest` or `repl{
                        rato
});});});});});});});});});});});});});});});});});});});});});});});});});});});});nsol});});});});});});});});});});});});});});});});});});});});});});});});});});});});nsol});});});});});});});});});});});});});});});});});});});});});});});});});});});});nsol});});});});});});});});});});});});});});});});});});});});});});});});});});});});nsol});});});});});});});});});});});});});});});});});});});});});});});});});});});});nsol});});});});});});});});});});});});});});});});});});});});});});});});});});});});nsol});});});});});});});});});});});});});});});});});});});});});});});});});});});});nsol});});});});});});});});});});});});});});});});});});});});});});});});});});});});nsol});});});});});});});});});});});});});});});});});});});});});});});}on});});});});});});});});});});});});}is})n opera});});});});});});});});st});});});});})al-mode', { websocket: true }, (socket, req) => {});});});});});});cli});});});})ed });});});}) ma});})mode websocket');
    // ... rest of code

    socket.on('close', () => {
      console.log('client disconnected from operator');
    })
  });
````

### After (fixed):

```typescript
const operatorRoutes: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.get("/", async function () {
    return "this is an operator plugin";
  });

  fastify.get('/manual-mode', { websocket: true }, (socket, _req) => {
    fastify.log.info('client connected to operator manual-mode websocket');
    // ... rest of code

    socket.on('close', () => {
      fastify.log.info('client disconnected from operator');
    })
  });
```

**Changes made:**

1. `opts` → `_opts` (line 5)
2. Removed `request, reply` (line 6)
3. `req` → `_req` (line 10)
4. `console.log` → `fastify.log.info` (lines 11, 35)

---

## Common Fixes Cheat Sheet

### ❌ Problem: Unused variable

```typescript
const userName = 'John'; // Never used
```

**Fix:** Remove it or prefix with `_` if you need it for later

```typescript
const _userName = 'John'; // Inconst _userName = 'Joh noconst _userName = 'John Using `const _userName = 'John';  // Inconst _userName = 'Jo}  // Loosconsuality
```

**Fix:** Use st**Fix:** Uity
**Fix:** Use st**Fix:** Uity
Inconst _userName = 'Joh noconst _userName = 'John Ustyp Inconst _userName = 'Joh noconst _u)
0000000000000000000000000000000000000000##0❌ Pr0000000000000000000000000000000000000000##0❌ Pr00000000000000000000d)0000000000000000000000000000000000000000##0❌ Pr000000000000000000000r(id: 00000000000000000000�� Pr00000000000000000000000000000co0000000000000000000000000000000000000000##0❌ Pr0000000000* 00000astify's logg0000000000000000
ffffffffffffffffffffffffffffffinffffffffffffffffffffffffffffffinfffg

### Before committing code

```bash
pnpm format    # Format everything
pnpm lint      # Chepnpm lint      # C
### While coding (optional)
Your IDE can show ESLint errors in real-time. VS Code does this automatically if you have the ESLint extension.

### In CI/CD (future)
Run `pnpm lint`Run `pnpm lint`Run `pnpm lint`Run `pnpm lint`Run `pnpm lint`Run `pnpm lint`Run `pnpm lint`Run `pnpm lint`Run `pnpm lint`Run `pnpm lint`Run `pnpm lint`Run `pnpm w consRun `pnpm lint`Rupps/server/eRun `pnpm lint`Run `pnpm liscript
rules: {
  'no-console': 'off',  // Allow console.log
  // or
  'no-console': ['warn', { a  'no-console': ['warn', { a  'no-console': ['warn', { a  'no-console': ['warn', { a  'no-console': ['warn', { a  'no-console': ['warn', { a  'no-console': ['warn', { a  'no-console': ['warn', { a  'no-console': ['warn', { a  'no-console': ['warn', { a  'no-console': ['warn', { a  'no-console': ['warn', { a  'no-console': ['warn', { a  'no-cons    'no-console': ['warn', { a  'no-console': ['warn', { a  'no-consnt:f  'no-console': ['warn poss  'no-``  'no-console': ['warn', { a  'no �  'no-console': ['warn', { a  'no-con�� `===`
- `console.log` → `- `console.log` → `- `console.log` → `- `console.log` → `- `console.log` → `- `console.log` → `- `cng o- `console.log` → st?
```
