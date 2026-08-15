@AGENTS.md

# portfolio-app: notas para agentes

## Skills de diseño (`.claude/skills/`)

Antes de cualquier trabajo de UI, diseño, animación, CSS o metadata, carga la
skill **`design-workflow`**: enruta la tarea a la skill correcta, fija quién manda
cuando dos se contradicen y recoge las reglas de Next.js 16 / Tailwind 4 /
shadcn sobre Base UI / `motion` v13 que ninguna skill de terceros puede pisar.
Fuentes de verdad: `DESIGN.md` (sistema visual, formato design.md),
`PRODUCT.md` (producto), `src/app/globals.css` (tokens). Comparativa y
decisiones de instalación: `docs/skills-de-diseno.md`; uso en el `README.md`.

| Skill                                                                  | Para qué                                                             | Cómo                                                  |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------- |
| `impeccable`                                                           | Dirección, `critique`/`audit`/`polish`/`harden`, detector y hook     | `/impeccable <comando> [objetivo]` o auto             |
| `baseline-ui`                                                          | Suelo de reglas MUST/NEVER al editar UI                              | auto o `/baseline-ui <archivo>`                       |
| `fixing-accessibility`, `fixing-motion-performance`, `fixing-metadata` | Revisores puntuales (a11y, rendimiento de animación, SEO/OG/JSON-LD) | auto o `/fixing-<x> <archivo>`                        |
| `animate`                                                              | Construir animaciones: sus valores (curvas, duraciones) mandan       | auto                                                  |
| `review-animations`, `pick-ui-library`                                 | Revisar movimiento antes de commitear; elegir librería               | solo manual: `/review-animations`, `/pick-ui-library` |

Reglas duras (detalle en `design-workflow`): paquete `motion`, nunca
`framer-motion` ni GSAP; Base UI compone con `render`, no `asChild`; Tailwind 4
CSS-first, sin `tailwind.config.*`; todo texto en `messages/es.json` **y**
`messages/en.json`; oscuro por defecto; el vídeo del retrato ignora
`prefers-reduced-motion` a propósito; las carpetas de `.claude/skills/` de
terceros son vendor (`npx impeccable update`, `npx skills update`), no se editan.
