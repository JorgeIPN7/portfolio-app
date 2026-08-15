---
name: design-workflow
description: Use before any UI, design, styling, Tailwind, component, layout, animation, theme, accessibility or metadata work in this repo (portfolio-app, Next.js 16). Routes the task to the installed design skills (impeccable, baseline-ui, fixing-accessibility, fixing-motion-performance, fixing-metadata, animate, review-animations, pick-ui-library), states which one wins when two disagree, and lists the project rules (motion v13, Tailwind 4 CSS-first, shadcn on Base UI, next-intl, dark-first) that no third-party skill may override. Not for backend, data or content-only edits.
argument-hint: "[tarea de UI a enrutar]"
---

# Flujo de diseño de portfolio-app

Skill orquestadora del proyecto. No diseña nada por sí misma: dice **qué skill usar
para qué**, **quién manda si dos se contradicen** y **qué reglas del proyecto son
innegociables**. Las skills de terceros viven en `.claude/skills/` como código
vendor (se actualizan desde su origen); las reglas locales viven aquí, en
`CLAUDE.md`, en `DESIGN.md` y en `PRODUCT.md`.

## 1. Fuentes de verdad (léelas antes de opinar)

| Qué | Dónde | Quién lo consume |
| --- | --- | --- |
| Sistema visual vigente (tokens, tipografía, componentes, do/don't) | `DESIGN.md` (raíz; formato oficial design.md) | impeccable (`context.mjs` lo carga; su detector compara fuentes/colores/radios), cualquier skill |
| Verdad de producto (usuarios, propósito, restricciones) | `PRODUCT.md` (raíz) | impeccable (`critique`, `polish`, `shape`, new-work) |
| Tokens reales | `src/app/globals.css` (`@theme inline`, `:root`, `.dark`) | todo el mundo; DESIGN.md los documenta, no los sustituye |
| Textos | `messages/{es,en}.json` (interfaz) y `src/data/resume-data.{es,en}.ts` (CV) | ningún componente lleva texto propio |
| Decisiones y por qués | `README.md` (secciones Calidad, Tema y animación, Idiomas) | tú |
| Configuración de impeccable | `.impeccable/config.json` (ignores compartidos, `buildPath: code`, hook silencioso), `.impeccable/live/config.json` | impeccable |
| Verificación real | MCP de Playwright (`.mcp.json`, Chrome del sistema), `pnpm test:e2e` (axe en 2 temas × 2 idiomas) | tú, antes de dar por hecho un cambio visual |

## 2. Enrutado: tarea → skill

| Tarea | Usa | Notas |
| --- | --- | --- |
| Limpiar/pulir una superficie existente sin cambiar su identidad | `baseline-ui` (rápido, reglas MUST/NEVER) → `/impeccable polish <archivo>` (fino) | `baseline-ui` es el suelo de toda edición de UI; impeccable afina jerarquía, ritmo y detalles |
| Revisar UX/diseño sin tocar código | `/impeccable critique` (heurísticas, memoria en `.impeccable/critique/`) y `/impeccable audit` (a11y, rendimiento, theming, responsive; puntuación) | Salida: informe; después decide qué aplicar |
| Nueva sección o componente | Leer `DESIGN.md` → construir bajo `baseline-ui` → si necesita brief, `/impeccable shape` → al terminar `/impeccable polish` sobre lo tocado | Una sección nueva de un CV se parece a las que ya hay; no inventar un "hero" |
| Rediseño o cambio de identidad visual | `/impeccable init` (si PRODUCT.md quedó desfasado) y new-work **con el dueño presente** | Requiere respuestas humanas; no lanzarlo en modo desatendido |
| Animación nueva | `animate` (Emil Kowalski) decide si animar, propósito, herramienta, propiedades, curva y duración, y la implementa | `/impeccable animate` solo para el "por qué/dónde" (tesis de movimiento); los **valores** los pone `animate` |
| Revisar una animación antes de commitear | `/review-animations` (manual) | Bloquea o aprueba con `file:line`; sus valores vienen de STANDARDS.md |
| Animaciones que tartamudean, layout thrash, blur, scroll | `fixing-motion-performance` | Rendimiento, no sensación; complementa a `animate` |
| Accesibilidad (ARIA, teclado, foco, contraste, formularios) | `fixing-accessibility` → `/impeccable audit` para el pase completo → `pnpm test:e2e` (axe) | Las pruebas E2E son el árbitro final |
| SEO, Open Graph, Twitter card, canonical, hreflang, JSON-LD, robots | `fixing-metadata` | Única skill que lo cubre; siempre vía Metadata API de Next (`generateMetadata`, `alternatesFor`) |
| Elegir librería (toasts, command menu, charts, dnd, estado…) | `/pick-ui-library` (manual) | Ya elegido aquí: Base UI, `motion`, next-themes, lucide, `cn` |
| Textos de interfaz (microcopy, errores, vacíos) | `/impeccable clarify` | El texto resultante va a `messages/*.json` en **los dos idiomas** |
| Robustez: textos largos (inglés/español), overflow, estados de error | `/impeccable harden` | Probar con el idioma más largo |
| Rendimiento (CWV, imágenes, fuentes, JS) | `/impeccable optimize` + `fixing-motion-performance` | Medir antes y después |
| Documentar el sistema visual tras un cambio aceptado | Actualizar `DESIGN.md` a mano en el mismo commit, o `/impeccable document` para regenerarlo (+ sidecar `.impeccable/design.json`) | Validar con `npx @google/design.md lint DESIGN.md` (0 errores; los avisos de tokens "huérfanos" del tema oscuro son esperables) |
| Iterar en el navegador con variantes | `/impeccable live` (`.impeccable/live/config.json` ya apunta a `src/app/[locale]/layout.tsx`) | Necesita `pnpm dev` levantado; opcional |
| `bolder` / `quieter` / `overdrive` / `delight` | Solo si el dueño lo pide explícitamente | Este es un CV sobrio (ver PRODUCT.md); "más atrevido" no es una mejora por defecto |

Cuando varias encajen a la vez: **una** para diagnosticar (critique/audit/improve),
**una** para construir (baseline-ui + animate) y **una** para revisar
(review-animations / fixing-* / audit). Nunca cargar más de tres a la vez.

## 3. Precedencia cuando dos skills se contradicen

1. **Lo que pidió el dueño y lo ya decidido** en `README.md`, `DESIGN.md` y
   `PRODUCT.md`. Ninguna skill "mejora" una decisión documentada sin que se lo
   pidan (ejemplos: la serif Playfair Display, `lucide-react`, oscuro por defecto,
   la raya española, el vídeo que ignora reduced-motion).
2. **Accesibilidad y rendimiento**: los NEVER de `baseline-ui`, los hallazgos de
   `fixing-accessibility`/`fixing-motion-performance`, los del detector de
   impeccable (hook y `npx impeccable detect`) y las pruebas E2E con axe. Un
   hallazgo del hook es aviso, no orden: si es un falso positivo documentado,
   se registra con `npx impeccable ignores add-value <regla> <valor> --reason "…"`
   en la config compartida en vez de ignorarlo en silencio.
3. **Movimiento: mandan los valores de Emil Kowalski** (`animate` /
   `review-animations`): curvas exactas, duraciones por tipo (feedback 100–160 ms,
   tooltip 125–200, dropdown 150–250, modal/drawer 200–500; UI < 300 ms), solo
   `transform`/`opacity`, nunca `ease-in`, nunca `scale(0)`, nunca
   `transition: all`. `/impeccable animate` aporta la tesis (qué momento merece
   moverse), no otros números. La regla de `baseline-ui` "NEVER exceed 200ms for
   interaction feedback" se refiere a hover/press y no contradice los rangos de
   Emil para transiciones de componente; su "NEVER add animation unless
   explicitly requested" prevalece salvo petición explícita.
4. **Dirección estética**: impeccable (modo *Experience/Read* para un
   portfolio), siempre dentro de `DESIGN.md`. No hay skill de "gusto" que imponga
   fuentes o paletas: taste-skill y UI/UX Pro Max se evaluaron y **no** se
   instalaron (ver `docs/skills-de-diseno.md`).
5. **Datos**: no hay base de datos de paletas/fuentes; los tokens salen de
   `globals.css` y se documentan en `DESIGN.md`.

## 4. Reglas del proyecto que ninguna skill puede pisar (Next.js 16)

- **Animación**: paquete `motion` v13 (`import { motion } from "motion/react"`,
  `import { animate } from "motion"`); nunca `framer-motion` ni GSAP. Si hace
  falta una curva propia, se define **una vez** como token en `@theme inline` de
  `globals.css` con un nombre que no pise los de Tailwind (que ya trae
  `--ease-out`/`--ease-in-out` con otros valores): p. ej.
  `--ease-out-quart: cubic-bezier(0.23, 1, 0.32, 1)` y
  `--ease-in-out-quart: cubic-bezier(0.77, 0, 0.175, 1)`, usados como
  `ease-out-quart` / `ease-in-out-quart` o `var(--ease-out-quart)`. Así
  `baseline-ui` ve "valores propios existentes" y `animate` ve sus curvas.
- **`prefers-reduced-motion`**: reduce el movimiento ambiental (entradas,
  parallax) pero **no anula respuestas a un clic** (el vídeo del retrato). El
  dueño tiene las animaciones de Windows desactivadas: su navegador reporta
  `reduce`, y respetarlo a ciegas ya rompió una vez la función central. Con
  `useReducedMotion()` condicionar solo `transition`, nunca lo que se renderiza
  (evita desajustes de hidratación; ver `src/components/reveal.tsx`).
- **shadcn sobre Base UI** (`components.json`, `base-nova`): componer con la prop
  `render`, no con `asChild`; nada de Radix. Iconos: `lucide-react` 1.x (los de
  marca en `src/components/icons/`); una skill que "desaconseje" lucide no aplica.
- **Tailwind CSS 4, CSS-first**: no existe ni se crea `tailwind.config.*`; los
  tokens van en `@theme inline` y las variables en `:root`/`.dark`. Utilidades
  modernas (`size-*`, `text-balance`, `text-pretty`, `h-dvh`, `gap-*` en vez de
  `space-*`), clases ordenadas por Prettier. Colores solo semánticos
  (`bg-background`, `text-muted-foreground`, `border-border`).
- **Next.js 16 App Router**: Server Components por defecto y `"use client"` solo
  para interacción; el sitio se genera estático (`generateStaticParams`);
  el idioma lo negocia `src/proxy.ts` (no hay `middleware.ts`); SEO por Metadata
  API (`generateMetadata`, `alternatesFor`, `sitemap.ts`, `robots.ts`,
  `opengraph-image.tsx`); fuentes por `next/font/local` (nunca `<link>` a Google
  Fonts). Documentación de la versión instalada en `node_modules/next/dist/docs/`.
- **Idiomas**: todo texto nuevo en `messages/es.json` **y** `messages/en.json` (o
  en ambos `resume-data`); las pruebas unitarias comprueban la paridad. La raya
  (—) y las comillas «» son correctas en español.
- **Tema**: oscuro por defecto y claro por elección (`next-themes`,
  `enableSystem={false}`); cada cambio se mira en los dos temas.
- **Recursos**: nada externo en tiempo de ejecución (CDN de iconos, imágenes de
  relleno); todo en `public/` y `src/`.
- **Vendor intocable**: no editar `.claude/skills/{impeccable,animate,…}/`; se
  actualizan con `npx impeccable update` y `npx skills update`. Prettier, ESLint
  y knip los ignoran a propósito.

## 5. Flujo recomendado para un cambio visual

1. Leer `DESIGN.md` (y `PRODUCT.md` si el cambio toca contenido o estructura) y
   el componente afectado.
2. Diagnóstico si hace falta: `/impeccable critique` o `/impeccable audit` sobre
   la superficie; anotar qué se va a cambiar y qué no.
3. Implementar bajo `baseline-ui`; movimiento con `animate`; textos en los dos
   `messages/*.json`.
4. Revisar: `/review-animations` si hubo movimiento; `fixing-accessibility` /
   `fixing-metadata` si tocó formularios, controles o `<head>`; leer los avisos
   del hook de impeccable del turno.
5. Verificar: `pnpm lint && pnpm typecheck && pnpm test`; abrir la página con el
   MCP de Playwright en claro y oscuro (y `/en`); `pnpm test:e2e` si tocó
   accesibilidad, tema, idioma o el formulario. Si el cambio toca `reveal.tsx`,
   `profile-video.tsx`, `theme-provider.tsx` o `theme-toggle.tsx`, la
   verificación en navegador **no es opcional**.
6. Si el cambio altera el sistema visual, actualizar `DESIGN.md` en el mismo
   commit y pasar `npx @google/design.md lint DESIGN.md`.
