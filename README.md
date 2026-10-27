# agent-project-landing

Landing de Sena Ópera (agente.somossena.com). Next.js (App Router) desplegado en Vercel.

## Requisitos

- Node 22
- Yarn 4: la versión exacta está en `packageManager` de `package.json`. No instales Yarn a mano; actívalo con corepack.

```bash
corepack enable
```

## Desarrollo

```bash
yarn install --immutable
yarn dev
```

Usa solo Yarn. El único lockfile es `yarn.lock`. Si `yarn install` lo modifica, ese cambio va en el mismo commit que la dependencia que lo provocó.

## Tests

Los tests viven en `tests/e2e/` y corren con Playwright. Los specs que abren la página necesitan el build local:

```bash
yarn build
yarn start -p 39847
E2E_BASE_URL=http://localhost:39847 yarn test:e2e
```

La primera vez, instala el navegador con `yarn playwright install chromium`.
