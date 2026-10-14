# CLAUDE.md — agent-project-landing

Guía para Claude Code en este repositorio. Debe funcionar sin el CLAUDE.md del workspace.

## Qué es

Landing de **Ópera** (opera.somossena.com). El nombre del repo y el `name` de `package.json` (`recupera-landing`) no reflejan el producto; la carpeta `src/ui/recupera` tampoco. Sitio de **opera.somossena.com** (Next.js). Captura leads en `POST /api/lead` y los crea en HubSpot (contacto + negocio) y en Meta CAPI.

- Hermanas: `sena-landing` (somossena.com), `recupera-landing` (recupera.somossena.com), `agent-project-landing` (opera.somossena.com).
- Fuente de verdad de marca, ICP, precios y términos permitidos: repo `sena-brain`. Si este repo y el vault se contradicen, manda el vault.
- No llama a `sena-api-core` ni a los satélites: solo a HubSpot y Meta.

## Build & Run

Next.js 16 + React 19 + Tailwind 4 + TypeScript. Gestor: **yarn**.

```bash
yarn install            # el lockfile es formato Berry; sin pin de yarn con corepack todavía
yarn dev              # http://localhost:3000
yarn build && yarn start
yarn lint
# (no hay script tsc: usa npx tsc --noEmit)
yarn test:e2e         # ver Gotchas: apunta a producción
```

Variables de entorno (en Vercel; no se commitean): `HUBSPOT_ACCESS_TOKEN`, `META_CAPI_TOKEN`, `META_PIXEL_ID`. Despliegue: Vercel, con preview en cada PR.

## Arquitectura

```
src/app/          rutas App Router (api/lead, privacy, term, thankyou, sitemap.xml, llms.txt, robots.txt)
src/ui/           componentes por página (layout, shared, recupera, privacy, term, thankyou)
src/lib/          data, hooks, lead (módulo HubSpot y atribución), services, store, types, utils
tests/e2e/        specs de Playwright
```

La lógica de leads vive en `src/lib/lead/`; el handler de `src/app/api/lead/` es delgado.

## Estilo de código

- TypeScript estricto. Nunca `any` (usa `unknown` y acota). No uses enums: `as const` o uniones.
- Imports absolutos con `@/*` → `src/*`; sin `require`.
- Colores con los tokens `--color-brand-*` de `src/app/globals.css`, no hex sueltos.
- Código y comentarios en español, identificadores en inglés. Copy del sitio: español neutro, tuteo.

## Testing

- Playwright en `tests/e2e/`. Simulan HubSpot y no usan red: `attribution-classify`, `client-attribution`, `hubspot-module`, `hubspot-upsert`, `lead-handlers`, `lead-validate`.
- **Sí usan red:** `opera.spec.ts` (navega producción) y `hubspot-contract.spec.ts` (requiere `HUBSPOT_CONTRACT_TOKEN`).
- Cambio en `src/lib/lead/` o `src/app/api/` → agrega o ajusta su spec: caso feliz + al menos un error.
- Confirma que un test nuevo FALLA sin tu cambio y PASA con él.

## Gotchas

- **`yarn test:e2e` apunta a producción** (`baseURL: https://opera.somossena.com`): `opera.spec.ts` navega el sitio real.
- **Subir `next` u otras dependencias es un PR aparte, decidido por un owner.** Prueba `yarn build` y el preview de Vercel antes de proponerlo (`next@16.3.1` rompió el build standalone de `sena-landing`, #92). Revisa los avisos de seguridad vigentes antes de elegir versión.
- Claims de marca: no publiques cifras de escala, antigüedad ni resultados (por ejemplo, % de reducción de DSO) sin fuente. Antes de escribir copy, revisa los términos permitidos y prohibidos en `sena-brain`.
- Tiene `yarn.lock` y `package-lock.json` a la vez (pendiente de unificar): usa yarn. No tiene husky; Commit Lint corre solo en CI.

## Flujo de trabajo (obligatorio)

Ramas: `main` es producción y `dev` es integración. No existe `staging`.

1. Antes de tocar nada: `git fetch && git branch --show-current`. Nunca trabajes en `main` ni en `dev`.
2. Crea la rama desde `dev`: `git checkout -b feat/issue-{N}-descripcion` (también `fix/`, `chore/`; `hotfix/` sale de `main`).
3. Un work-item = una rama = un PR. No mezcles temas en un PR (blog, copy, SEO y dependencias van por separado).
4. Commits conventional: `tipo(scope): descripción #N`. El subject va en minúscula (commitlint rechaza la mayúscula inicial); header ≤100 caracteres, líneas del cuerpo ≤100. Tipos: feat, fix, hotfix, refactor, docs, test, chore, perf, ci, build, style, revert.
5. Abre el PR contra `dev` con el template (`Closes #N`). El check **Commit Lint** debe quedar verde.
6. **Revisión y merge.** `dev` y `main` exigen 1 aprobación de un code owner (`@nicoariffo`, `@sagajardo`, `@RenildoChavezFlujolink`; CODEOWNERS los asigna solos). Solo ellos mergean: squash a `dev`, merge commit en `dev → main`. Quien no es owner abre el PR y espera; no mergees, aunque tengas permiso de escritura.
7. Confirma que el PR es visible: `gh pr view --json reviewRequests` debe listar a los owners. Si está vacío, avisa.
8. **Nunca `--no-verify`.** Si un hook se cuelga o falla, detente y repórtalo en el PR. El mismo chequeo corre en CI.
9. Contexto: sin memoria local ni archivos de progreso. El estado vive en el issue y el PR; un aprendizaje que debe persistir va a este `CLAUDE.md` en el mismo PR. Preferencias personales: `CLAUDE.local.md` (ignorado por git).

Skills: `/session-start` al empezar y `/progress-tracker` al cerrar (en `.claude/skills/`).
