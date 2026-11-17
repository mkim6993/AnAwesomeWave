# Quick Start: ESLint & Prettier

## ✅ What's Done

ESLint and Prettier are now configured for your monorepo:

- **Root**: Prettier config shared across all packages
- **Server**: ESLint with TypeScript strict rules
- **Mobile**: Expo's ESLint with React hooks rules
- **Shared**: ESLint with TypeScript strict rules

## 🚀 Usage

### Check everything

```bash
pnpm lint           # Run ESLint + Prettier on all packages
pnpm format         # Auto-fix formatting
```

### Check one package

```bash
cd apps/server && pnpm lint        # Check server
cd apps/mobile && pnpm lint        # Check mobile
cd packages/shared && pnpm lint    # Check shared
```

### Fix issues automatically

```bash
cd apps/server && pnpm lint:fix    # Auto-fix server
cd apps/mobile && pnpm lint:fix    # Auto-fix mobile
```

## 📋 Current Status

All packages are linting successfully! There are some warnings/errors to fix:

### Server

- ~20 unused variables (params like `opts`, `request`, `reply`)
- 6 console.log statements
- 1 `any` type - 1 `any` type - 1 `any` type -unused imports
- 1 setState-in-effect issue (performance problem)
- 1 component-in- 1 component-in- 1 component-in- 1 component-in- 1 cua- 1 component-in- 1 component-in- 1 component-in- - 1 component-in- 1 component-in- 1 component-in
  1.1.1Fix lint issues** (optional but recommended): # Auto-fix what can be fixed
  cd apps/server && pnpm lint:fix
  cd apps/mobile && pnpm lint:fix
  cd packages/shared && pnpm lint:fix
  y fix remaining y fix remaining (e.g., y fix remaining rem y fix remaining y. Add pre-commit hooks** (highly recommend y fix remaining aged
  npx husky init

  ````

  Add to `.husky/pre-commit`:
  ```bash
  #!/usr/bin/env sh
  pnpm lint-staged
  ````

  Add to root `package.json`:

  ```json
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yml,yaml}": ["prettier --write"]
  }
  ```

3. **Review the full guide**: See `LINTING_GUIDE.md` for detaile3. **Review the full guide**: See `LINTING_GUIDE.md` for detaile3. **Review the full guide**: See `LINTING_GUIDE.md` for detaile3. **Review the full guide**: See `LINTIit3. **Review the full guide**: See `LINTING_GUIDE.**3. **Review the full guide**: See `LINT **R3. **Review the full guide**: Seenc3. **Review the full guide**: Seurc3. **Review the full guide**: See `LIIDE.md) — Full documentation

- [ESLint Docs](https://eslint.org/)
- [Prettier Docs](https://prettier.io/)
- [Expo ESLint](https://docs.expo.dev/guides/using-eslint/)
