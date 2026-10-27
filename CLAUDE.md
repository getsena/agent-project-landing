# CLAUDE.md

Guía para Claude Code en este repositorio.

## Qué es agent-project-landing

Landing

**Repo:** `getsena/agent-project-landing`
**Stack:** Next.js / React
**Puerto local:** N/A

## Stack y dependencias

Ver `package.json` / `pyproject.toml` / equivalente para la lista completa.

**Para levantar localmente** (Node 22, Yarn 4 fijado en `packageManager`):
```bash
corepack enable          # una vez por máquina: activa la versión de Yarn del repo
yarn install --immutable # nunca npm: el único lockfile es yarn.lock
yarn dev
```

**Gestor de paquetes:** Yarn 4 con `nodeLinker: node-modules` (`.yarnrc.yml`), igual que `recupera-landing` y `sena-landing`. Sin ese archivo Yarn 4 instala en modo PnP y `next build` falla. No agregar `package-lock.json`. Si `yarn install` cambia `yarn.lock` o `package.json`, ese cambio va en el commit de la dependencia que lo causó.

## Convenciones

### Commits

Formato conventional commits:

```
feat(scope): descripción #N
fix(scope): descripción #N
hotfix(scope): descripción #N
refactor(scope): descripción #N
docs(scope): descripción #N
chore(scope): descripción #N
```

Types válidos: `feat`, `fix`, `hotfix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`, `build`, `style`, `revert`. Header máximo 100 chars.

### Branching

Modelo **3 branches protegidas**:

| Branch | Rol |
|---|---|
| `main` | Producción. Solo recibe merges desde `staging` y hotfixes. |
| `staging` | Pre-producción / QA. Recibe merges desde `dev`. |
| `dev` | Integración. Default para features y fixes. |
| `feat/*`, `fix/*`, `hotfix/*` | Ramas de trabajo efímeras. |

**Flujo estándar:**
1. Crea branch desde `dev`: `git checkout -b feat/issue-{N}-descripcion`
2. Commits conventional referenciando issue: `feat(scope): descripción #N`
3. Abre PR contra `dev`. Body incluye `Closes #N`.
4. Squash merge → `dev`.

### Tests

- Cada feature requiere: happy path + validation errors + auth errors.
- No escribir tests vacíos sin asserts.
- Correr el test con el código roto para confirmar que falla primero.

## Context policy

Todo contexto de proyecto vive en GitHub.

| Contexto | Dónde |
|---|---|
| Estado de una feature | Issue de GitHub (comments) |
| Plan de un work-item | Body del issue padre + sub-issues (tasks) |
| Progreso de sesión | Comment en el issue activo |
| Push mode del work-item | Comment del issue padre con tag `<!-- push-mode: on-pr/per-task/manual -->` |
| Convenciones | Este `CLAUDE.md` + `.claude/rules/` |
| Preferencias personales | `CLAUDE.local.md` (no commitear) |

## Personalización del workspace

Modelo **"workspace files inviolables"**: skills/rules/scripts del template se sobrescriben en cada `update`. Para personalizar, **copia el archivo con otro nombre** en lugar de editar el original. Skills/rules/MCPs propios del proyecto (no del template) se preservan intactos.

## Flujo estándar de trabajo

```
Desarrollo:
  /init → /plan → /apply → /test → /build → /review

Deploy:
  /secure → /deploy

Soporte:
  /debug    — cuando /apply o /test fallan
  /audit    — revisión OWASP profunda antes de mergear cambios sensibles
  /pentest  — barrida completa de seguridad sobre todo el proyecto (periódico)
  /sync     — cuando hay drift entre código y GitHub
  /rollback — cuando un deploy rompe producción
  /design   — cuando hay trabajo de UI/UX
  /triage   — limpieza periódica de issues
```

**Reglas operativas para Claude:**

1. Al arrancar sesión: `/init`
2. Al cerrar sesión: `/build`
3. Antes de cada deploy: `/secure` es obligatorio.
4. Si el plan en GitHub no refleja el código: correr `/sync`.
5. Aprendizajes que deben persistir: commitear al `CLAUDE.md`.
6. **`no-edit-without-plan` (regla dura, enforced por hook).** Un hook `PreToolUse` (`.claude/scripts/no-edit-without-plan.sh`) bloquea Edit/Write/Bash-con-redirección cuando la rama actual es `dev`/`main`/`staging` o no tiene prefijo de work-item (`feature/*`, `fix/*`, `refactor/*`, `chore/*`, `hotfix/*`). El bloqueo es técnico, no convencional. Whitelist: `.claude/`, `CLAUDE.local.md`, `.gitignore`. Bypass de emergencia: `CLAUDE_ALLOW_DIRECT_EDIT=1`. Flujo correcto: `/plan` → `/apply` (crea rama) → editar.
7. **Granularidad invariante:** una invocación de `/apply` = una task (STOP al terminar). Una invocación de `/build` = una task = un commit (si el diff abarca varias tasks, `/build` lo detecta y obliga a partir).
8. **`/plan` crea N work-items de una vez** cuando el alcance abarca trabajos independientes. La rama la crea `/apply` al arrancar cada work-item, no `/plan`.
9. **Ownership multi-dev:** `/apply` valida `assignees` y label `in-progress` antes de tomar un work-item. Si otro dev ya lo tomó, no se toca.
