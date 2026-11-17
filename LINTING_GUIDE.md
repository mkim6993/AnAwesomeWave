# ESLint & Prettier Setup Guide

This monorepo uses ESLint and Prettier to enforce code quality and consistent formatting.

## What's Configured

### Root Level

- **Prettier** (`.prettierrc.json`) — Shared formatting rules across all packages
- Scripts to run checks across the entire monorepo

### Server (`apps/server/`)

- **ESLint** with TypeScript recommended rules
- Catches: `any` types, unused variables, non-strict equality, console.log usage
- **Prettier** for formatting

### Mobile (`apps/mobile/`)

- **Expo's built-in ESLint** (includes React hooks rules)
- **Prettier** for formatting

### Shared (`packages/shared/`)

- **ESLint** with TypeScript recommended rules
- **Prettier** for formatting

## Commands

### Run checks across all packages

```bash
pnpm lint           # Run ESLint + Prettier check on all packages
pnpm format:check   # Check formatting only
pnpm format         # Auto-fix formatting
```

### Run checks in a specific package

```bash
# Server
cd apps/server
pnpm lint           # ESLint + Prettier check
pnpm lint:fix       # Auto-fix issues

# Mobile
cd apps/mobile
pnpm lint           # Expo lint + Prettier check
pnpm lint:fix       # Auto-fix issues

# Shared
cd packages/shared
pnpm lint           # ESLint + Prettier check
pnpm lint:fix       # Auto-fix issues
```

### Before committing

```bash
pnpm format         # Format all files
pnpm lint           # Check for lint errors
```

## Current Issues

After setting up, there are some lint errors to fix:

### Server issues found:

- Unused variables (params like `opts`, `request`, `reply`)
- `console.log` statements (should use `console.warn` or `console.error`, or proper logging)
- One `any` type in PartyConnectionService
- Empty interface in support.ts

### To fix these:

```bash
cd apps/server
pnpm lint:fix       # Auto-fixes some issues
# Manually fix remaining:
# - Replace unused params with _paramName
# - Remove or replace console.log with fastify.log
# - Type the `any` properly
```

## ESLint Rules Explained

### TypeScript Rules

- `@typescript-eslint/no-explicit-any`: Prevents unsafe `any` types
- `@typescript-eslint/no-unused-vars`: Catches unused variables (prefix with `_` to allow)

### General Rules

- `eqeqeq`: Enforces `===` and `!==` (strict equality)
- `no-console`: Warns about console.log (allows warn/error)

## Prettier Rules

```json
{
  "semi": true, // Semicolons required
  "singleQuote": true, // Use single quotes
  "trailingComma": "es5", // Trailing commas where valid in ES5
  "printWidth": 100, // Max line length
  "tabWidth": 2, // 2 spaces for indentation
  "useTabs": false // Spaces, not tabs
}
```

## Next Steps (Recommended)

### 1. Fix current lint errors

```bash
cd apps/server
pnpm lint:fix
# Then manually fix remaining issues
```

### 2. Add pre-commit hooks (optional but highly recommended)

```bash
pnpm add -D -w husky lint-staged
npx husky init
```

Add to `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
pnpm lint-staged
```

Add to root `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yml,yaml}": ["prettier --write"]
  }
}
```

This will automatically run ESLint and Prettier on staged files before each commit.

### 3. Add import ordering plugin (when eslint-plugin-import supports ESLint v10)

Currently `eslint-plugin-import` has compatibility issues with ESLint v10. When it's updated:

```bash
cd apps/server
pnpm add -D eslint-plugin-import
```

Then add to `eslint.config.js` to enforce import order automatically.

## Troubleshooting

### ESLint shows "Parsing error"

- Check that the file is in your `tsconfig.json` `include` paths
- Check that the file isn't in ESLint's ignore patterns

### Prettier and ESLint conflict

- Prettier handles formatting (semicolons, quotes, line length)
- ESLint handles code quality (unused vars, type safety)
- They shouldn't conflict with this setup

### "Issues with peer dependencies" warning

This is normal in monorepos. Run `pnpm peers check` to see details, but it's usually safe to ignore.

## Resources

- [ESLint Docs](https://eslint.org/docs/latest/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [Prettier Docs](https://prettier.io/docs/en/)
- [Expo ESLint Guide](https://docs.expo.dev/guides/using-eslint/)
