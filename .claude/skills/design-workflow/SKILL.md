---
name: design-workflow
description: Use before any UI, design, styling, Tailwind, component, layout, animation, theme, accessibility, metadata, React/Next performance or deploy work in this repo (portfolio-app, Next.js 16 on Vercel). Routes the task to the installed skills (impeccable, baseline-ui, fixing-accessibility, fixing-motion-performance, fixing-metadata, animate, review-animations, pick-ui-library, vercel-react-best-practices, vercel-composition-patterns, vercel-react-view-transitions, web-design-guidelines, deploy-to-vercel), states which one wins when two disagree, and lists the project rules (motion v13, Tailwind 4 CSS-first, shadcn on Base UI, next-intl, dark-first) that no third-party skill may override. Not for backend, data or content-only edits.
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
| Rendimiento visual (CWV, imágenes, fuentes, animación) | `/impeccable optimize` + `fixing-motion-performance` | Medir antes y después |
| Rendimiento React/Next: waterfalls, bundle, RSC, data fetching, re-renders, Suspense | `vercel-react-best-practices` (72 reglas de Vercel Engineering, por impacto) | Autoridad en código React/RSC; impeccable `optimize` se queda en la capa visual. Cargar solo las reglas de la categoría que toque (`rules/`). Dos reglas suyas no aplican tal cual en Next 16.3: `dynamic(..., { ssr: false })` no está permitido en Server Components (solo en `"use client"`), y `optimizePackageImports` para `lucide-react` ya viene por defecto. Para `use cache` / Cache Components manda la doc local de Next |
| Diseñar la API de un componente (props booleanas que se multiplican, compound components, context, `render`) | `vercel-composition-patterns` | Encaja con Base UI (composición por `render`) y con React 19 |
| Transición de ruta o de estado (CV ↔ `/proyectos`, entrar/salir, elemento compartido, reordenar listas) | `vercel-react-view-transitions` (`<ViewTransition>`, `addTransitionType`, `transitionTypes` en `next/link`) | La doc local de Next 16.3 (`node_modules/next/dist/docs/01-app/02-guides/view-transitions.md`) recomienda esta skill: funciona **sin configuración** y **sin** instalar `react@canary` (el App Router ya lo trae); si su referencia pide `experimental.viewTransition`, ignóralo (el flag ya no existe). Estructura de Vercel; curvas y duraciones de Emil (`animate`) —sus recetas usan `ease-in` y `blur` en salidas: no—; revisar con `/review-animations`; rendimiento con `fixing-motion-performance` |
| Segunda opinión de UI contra las Web Interface Guidelines de Vercel (93 reglas: a11y, foco, formularios, animación, tipografía, imágenes, i18n) | `web-design-guidelines <archivo o patrón>` | Descarga las reglas por red en cada uso (`raw.githubusercontent.com/vercel-labs/web-interface-guidelines`, sin plan B offline); salida terse `archivo:línea`. Úsala **después** de `/impeccable audit`, no en su lugar, y **omite su bloque de copy** (Title Case, comillas inglesas): el CV está en español |
| Desplegar o crear una preview en Vercel | `/deploy-to-vercel` **solo por invocación manual del dueño** (está en `skillOverrides` como `user-invocable-only`) | Aquí desplegar es hacer push: Vercel construye desde Git. La skill puede intentar `git add . && git commit && git push` y, como último recurso, subir el proyecto a un endpoint externo: **prohibido**; solo `vercel deploy` de preview con la sesión iniciada, nunca `--prod` sin que se pida |
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
   fuentes o paletas: taste-skill, UI/UX Pro Max, `frontend-design` de Anthropic
   y huashu-design se evaluaron y **no** se instalaron (ver
   `docs/skills-de-diseno.md`; las dos últimas quedan documentadas para usarlas
   bajo demanda en un proyecto nuevo, nunca autoactivadas aquí).
5. **Código React/Next (datos, RSC, bundle, re-renders)**: manda
   `vercel-react-best-practices`; `/impeccable optimize` y
   `fixing-motion-performance` se quedan en lo visual. Si una receta de
   `vercel-react-view-transitions` trae duraciones o curvas, se sustituyen por las
   de Emil; si `web-design-guidelines` y `/impeccable audit` repiten un hallazgo,
   cuenta una vez y lo arbitra `pnpm test:e2e` (axe).
6. **Datos**: no hay base de datos de paletas/fuentes; los tokens salen de
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
  Para `<ViewTransition>` no se instala `react@canary` ni se toca
  `next.config.ts` (Next 16.3 lo trae sin configuración).
- **Vercel**: el sitio se construye desde Git (integración de Vercel); no se
  hace push ni deploy sin permiso explícito del dueño. `deploy-to-vercel` es
  solo manual (`/deploy-to-vercel`), para previews, y nunca commitea, hace push
  ni sube el proyecto a terceros. `vercel-optimize` (auditoría de coste con
  métricas reales) no está instalada: exige proyecto enlazado, Observability
  Plus y tráfico; tiene sentido en la e-shop, no aquí. Las variables de entorno
  se validan en `src/env.ts` (ver README).
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
3. Implementar bajo `baseline-ui`; movimiento con `animate` (o
   `vercel-react-view-transitions` si es una transición de ruta); datos y RSC
   según `vercel-react-best-practices`; textos en los dos `messages/*.json`.
4. Revisar: `/review-animations` si hubo movimiento; `fixing-accessibility` /
   `fixing-metadata` si tocó formularios, controles o `<head>`;
   `web-design-guidelines <archivo>` como segunda opinión terse; leer los avisos
   del hook de impeccable del turno.
5. Verificar: `pnpm lint && pnpm typecheck && pnpm test`; abrir la página con el
   MCP de Playwright en claro y oscuro (y `/en`); `pnpm test:e2e` si tocó
   accesibilidad, tema, idioma o el formulario. Si el cambio toca `reveal.tsx`,
   `profile-video.tsx`, `theme-provider.tsx` o `theme-toggle.tsx`, la
   verificación en navegador **no es opcional**.
6. Si el cambio altera el sistema visual, actualizar `DESIGN.md` en el mismo
   commit y pasar `npx @google/design.md lint DESIGN.md`.
