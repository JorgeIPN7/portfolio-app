# Skills de diseño para agentes: comparativa y decisiones

Rama `feat/add-ia-skills`, agosto de 2026. Compara cinco colecciones de skills de
diseño/UI para agentes de código —**UI Skills**, **UI/UX Pro Max**, las skills de
**Emil Kowalski**, **taste-skill** e **impeccable**—, explica cuáles se instalan
en este repo (`.claude/skills/`) y por qué, y cómo se reparten el trabajo. Los
datos salen de leer los repositorios (clonados y medidos con `wc -c`), de probar
las instalaciones y scripts en esta máquina (Windows 11, Node 22, sin Python) y
de las APIs de GitHub y npm el 15 de agosto de 2026. Lo que no se pudo verificar
está marcado como tal.

Cómo se usan en el día a día está en el `README.md` (sección «Skills de diseño
para agentes») y el enrutado entre ellas en `.claude/skills/design-workflow`.

## Resumen ejecutivo

| Colección                            | Decisión                                                                                           | Por qué, en una línea                                                                                                                                                                                   |
| ------------------------------------ | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **impeccable** (Paul Bakaus)         | **Instalada entera** (`npx impeccable install`), con su hook de diseño                             | Flujo principal: 23 comandos, detector determinista de 59 reglas ejecutable sin LLM, hooks nativos de Claude Code y contexto persistente (`PRODUCT.md`, `DESIGN.md`).                                   |
| **UI Skills** (ibelick)              | **Parcial**: `baseline-ui`, `fixing-accessibility`, `fixing-motion-performance`, `fixing-metadata` | Restricciones baratas (≈4,5k tokens en total) que encajan 1:1 con Base UI, `motion/react`, `tw-animate-css` y Tailwind 4; `fixing-metadata` es la única que cubre SEO/OG/JSON-LD/hreflang.              |
| **Emil Kowalski / skills**           | **Parcial**: `animate`, `review-animations`, `pick-ui-library`                                     | La autoridad en animación: valores numéricos exactos, recetas ya escritas para Base UI, revisor de solo lectura. Se descartan las que se autoactivan en todo o importan `framer-motion`.                |
| **taste-skill** (Leonxlnx)           | **No instalada** (uso bajo demanda documentado)                                                    | Hace lo mismo que impeccable (anti-«slop», inferencia de brief, rediseño) a 22k tokens por activación, y sus reglas pelean con la identidad del CV: prohíbe la serif, desaconseja lucide, veta la raya. |
| **UI/UX Pro Max** (nextlevelbuilder) | **No instalada** (ruta de instalación documentada)                                                 | Su valor es una base de datos consultable con scripts **Python**, que esta máquina no tiene; sin ellos queda un checklist de 13,5k tokens que ui-skills e impeccable cubren mejor y sin dependencias.   |

Además, `create-design-md` e `improve-ui` (UI Skills) se descartan porque hacen lo
mismo que `/impeccable document` y `/impeccable critique` + `/impeccable audit`
sobre el mismo archivo `DESIGN.md`.

## Las cinco colecciones, en una tabla

| Colección                                                                | Autor                     | Licencia   | Estrellas (ago-2026) | Último push |               Skills | Tamaño de los `SKILL.md`                                                   |
| ------------------------------------------------------------------------ | ------------------------- | ---------- | -------------------: | ----------- | -------------------: | -------------------------------------------------------------------------- |
| [UI Skills](https://github.com/ibelick/ui-skills)                        | Julien Thibeaut (ibelick) | MIT        |                 7,2k | 2026-08-13  |                    7 | 44 KB en total (≈11k tokens; ninguna pasa de 4k)                           |
| [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | nextlevelbuilder          | MIT        |                 117k | 2026-08-14  |                    7 | 58 KB + 1,9 MB de CSV + 5,4 MB de fuentes TTF + 35 scripts Python          |
| [Emil Kowalski / skills](https://github.com/emilkowalski/skills)         | Emil Kowalski             | MIT        |                29,5k | 2026-08-13  |                   10 | 119 KB (≈30k tokens en total; solo Markdown, sin scripts)                  |
| [taste-skill](https://github.com/Leonxlnx/taste-skill)                   | Leon Lin (Leonxlnx)       | MIT        |                76,8k | 2026-07-23  |                   13 | 302 KB (≈76k tokens; la principal sola pesa 87 KB, ≈22k tokens)            |
| [impeccable](https://github.com/pbakaus/impeccable)                      | Paul Bakaus               | Apache-2.0 |                59,4k | 2026-08-15  | 1 skill, 23 comandos | 11 KB el `SKILL.md` + 374 KB de referencias bajo demanda + 3 MB de scripts |

Las estrellas miden popularidad, no calidad ni encaje: la más popular (UI/UX Pro
Max) es la que menos sirve aquí.

## Qué es cada una

### UI Skills (ibelick)

Dos cosas a la vez: (a) un conjunto de **checklists MUST / SHOULD / NEVER**
(`baseline-ui`, `fixing-accessibility`, `fixing-motion-performance`,
`fixing-metadata`) y dos flujos de solo lectura que producen documentos
(`improve-ui` → planes en `design-plans/`; `create-design-md` → `DESIGN.md`);
(b) un directorio de 209 skills ajenas con un enrutador (`ui-skills-root`, `npx
ui-skills`) y un servidor MCP. Filosofía sobria y anti-«slop» con contexto mínimo:
«Prefer 1 skill… never use more than 3».

- **Encaje**: el mejor de las cinco. `baseline-ui` exige `motion/react`
  («formerly framer-motion»), `tw-animate-css`, `cn()`, «prefer Base UI»,
  `h-dvh`, `text-balance`, `size-*`: exactamente lo que ya usa el proyecto.
  `fixing-metadata` sabe de `hreflang`, `og:locale` y canonical por idioma
  (next-intl) y remite a la Metadata API de Next.
- **Coste**: ≈0,9k tokens `baseline-ui`, ≈1,2k `fixing-accessibility`, ≈1,4k
  `fixing-motion-performance`, ≈1,1k `fixing-metadata`. Sin scripts, sin red.
- **Producción**: tests (`node --test`), release por tag, un solo mantenedor
  activo. Riesgo solo en `ui-skills-root`: ejecuta `npx ui-skills`, que instala
  562 paquetes con red, y este repo permite `Bash(npx:*)` sin preguntar.
- **Descartes**: `ui-skills-root` (red y peso), `create-design-md` e
  `improve-ui` (los cubre impeccable sobre el mismo `DESIGN.md`).

### UI/UX Pro Max (nextlevelbuilder)

Una **base de datos local** (35 CSV: 79 estilos, 192 paletas, 74 parejas
tipográficas, 1.934 Google Fonts, 25 gráficos, 22 stacks versionados, 119 guías
UX) con un buscador BM25 en Python (`scripts/search.py`) y un generador de
«design system» por reglas, más seis sub-skills de la oferta ClaudeKit (`design`,
`brand`, `design-system`, `slides`, `banner-design`, `ui-styling`).

- **Encaje**: mixto. Sus datos de stack están sorprendentemente al día
  (`stacks/nextjs.csv` habla de Next 16.2 y de que `middleware` pasó a `proxy`;
  `stacks/shadcn.csv` sabe que Base UI es el default y que se compone con
  `render`, no `asChild`; Tailwind 4.3), pero `motion.csv` es 100 % GSAP,
  `typography.csv` da `tailwind.config` v3, `ui-styling` dice «shadcn (built on
  Radix UI)» y su script `tailwind_config_gen.py` crearía un `tailwind.config.js`
  que aquí no existe ni debe existir.
- **El problema**: **todo el flujo de búsqueda requiere Python** (`python3
search.py …`); en esta máquina `python` es el alias de la Microsoft Store y no
  hay alternativa en Node. Existe un `C:\Python310` suelto fuera del PATH y `uv`
  0.8.8, así que se podría habilitar, pero es una decisión del dueño (cambia el
  sistema) y el propio SKILL.md ordena no instalar nada por su cuenta.
- **Coste**: ≈675 tokens permanentes por las siete descripciones si se instala
  como plugin; la versión CLI de la skill principal pesa ≈13,5k al activarse.
  Huella: ≈4,6 MB / 170 archivos en `.claude/` (23 MB con fuentes vía plugin).
- **Producción**: 153 tests, releases semanales, sin telemetría; issues abiertos
  sobre rutas `.claude/` fijas y calidad de resultados; `design`/`banner-design`
  invocan skills y claves (Gemini) que no existen fuera de ClaudeKit.
- **Si algún día se quiere**: `uv python install 3.12` y `npx ui-ux-pro-max-cli
init --ai claude --global` (solo la skill `ui-ux-pro-max`, borrando las seis
  hermanas), sin commitearla.

### Emil Kowalski / skills

Diez skills **solo Markdown** que codifican el criterio de Emil (Vercel/Linear;
autor de Sonner, Vaul y animations.dev) sobre animación y algo de diseño:
constructor (`animate` + RECIPES), revisor de diff (`review-animations` +
STANDARDS), auditor de repo (`improve-animations`), buscador de oportunidades,
glosario, tabla de librerías (`pick-ui-library`), prototipos con selector,
guía de Sonner, y `emil-design-eng` / `apple-design` como documentos de reglas.

- **Reglas comunes**: puerta de frecuencia («100+ veces al día o acción de
  teclado → no animation. Ever»), propósito nombrable, `ease-out` para entrar y
  salir, `ease-in-out` para mover, nunca `ease-in`, curvas exactas
  (`cubic-bezier(0.23, 1, 0.32, 1)`, `cubic-bezier(0.77, 0, 0.175, 1)`,
  `cubic-bezier(0.32, 0.72, 0, 1)`), duraciones por tipo (press 100–160 ms,
  tooltip 125–200, dropdown 150–250, modal/drawer 200–500; «UI animations stay
  under 300ms»), solo `transform`/`opacity`, nunca `scale(0)`, `transform-origin:
var(--transform-origin)` de Base UI, springs `{ type: "spring", duration: 0.5,
bounce: 0.2 }` solo en gestos, `transition: all` prohibido.
- **Encaje**: excelente con Base UI (las recetas usan `[data-starting-style]` y
  `var(--transform-origin)`; hay un commit «replace radix ui mentions with base
  ui») y con `motion` v13. Dos roces: `emil-design-eng` aún hace `import {
useSpring } from 'framer-motion'` (y ese snippet está roto, issue #26), y sus
  tokens `--ease-out`/`--ease-in-out` **pisan los que Tailwind 4 ya define** con
  otros valores; por eso `design-workflow` manda definir `--ease-out-quart` y
  `--ease-in-out-quart` en `@theme inline` cuando hagan falta.
- **`prefers-reduced-motion`**: postura matizada («fewer and gentler, not zero;
  keep opacity and color») pero ninguna skill exime explícitamente las respuestas
  a un clic; el proyecto ya aprendió que respetarla a ciegas anula el vídeo del
  retrato, así que la excepción está escrita en `design-workflow` y `DESIGN.md`.
- **Coste**: `animate` ≈2,9k (+2k RECIPES bajo demanda), `review-animations` ≈2k
  (+2,5k STANDARDS), `pick-ui-library` ≈1,1k. `emil-design-eng` costaría 6,8k y
  se autoactiva con una descripción vaga; `apple-design` 5,7k y trata gestos,
  sheets y materiales que un CV estático no tiene.
- **Producción**: sin tests ni versionado, un mantenedor muy activo, dos issues
  abiertos (uno con cuatro errores verificables). Solo Markdown: cero riesgo de
  ejecución.

### taste-skill (Leonxlnx)

Trece **prompts de restricción** contra el «slop» de landings, portfolios y
rediseños: la principal (`design-taste-frontend`, 87 KB, 1.206 líneas) lee el
brief, fija tres «diales» (`DESIGN_VARIANCE`, `MOTION_INTENSITY`,
`VISUAL_DENSITY`), mapea a un design system, impone tipografía/color/layout, da
esqueletos GSAP y termina con un pre-flight de ≈60 casillas. Le acompañan
presets estéticos (soft, minimalist, brutalist), un protocolo de rediseño y
varias skills de generación de imágenes (inertes en Claude Code) y para Codex.

- **Encaje**: acierta en Tailwind 4, RSC y `motion/react`, pero choca de frente
  con este proyecto: trata «portfolio → serif» como «el tell de IA más probado»
  (Playfair Display solo entra «if a serif is justified (rare)»), «desaconseja»
  `lucide-react` (y tres de sus skills lo prohíben sin excepción), empuja GSAP y
  ScrollTrigger, obliga a `picsum.photos` y `cdn.simpleicons.org` si no hay
  imágenes (recursos externos en un CV estático), prohíbe la raya en toda la
  página (correcta en español) y razona en clave Radix. Su descripción dice
  literalmente «portfolios» y «redesigns»: se dispararía en casi cualquier tarea
  de UI de este repo y competiría con impeccable y `baseline-ui`.
- **Coste**: ≈21,8k tokens por activación de la principal, sin progressive
  disclosure (issue #67 pide partirla; sin respuesta).
- **Producción**: sin tests, sin CI, versionado incoherente (plugin 1.0.0 vs «v2
  experimental»), sin cambios de fondo desde mayo; el §12 remite a una carpeta
  `blocks/` que no existe; mucho peso de patrocinios en el README.
- **Bajo demanda**, sin instalar ni commitear nada:
  `npx skills use Leonxlnx/taste-skill@design-taste-frontend` genera el prompt
  para una revisión puntual con su catálogo de «tells».

### impeccable (Paul Bakaus)

Un «lenguaje de diseño» para agentes: **una skill** (`SKILL.md`, ≈2,75k tokens)
con **23 comandos** resueltos por progressive disclosure (`reference/*.md`, de
0,5 a 43 KB, cargados solo al usarse), un **detector determinista** de 59 reglas
(32 de «slop», 27 de calidad) que corre en Node sin LLM (`npx impeccable
detect`), **hooks** de Claude Code (PostToolUse sobre archivos de UI y pasada
profunda en Stop) que devuelven hallazgos como `additionalContext`, un modo
**live** (variantes en el navegador) y dos archivos de contexto persistente:
`PRODUCT.md` (verdad de producto, lo escribe `init`) y `DESIGN.md` (sistema
visual en el formato oficial design.md de Google Labs, lo escribe `document`).

- **Comandos útiles aquí**: `critique` (heurísticas Nielsen, carga cognitiva,
  memoria de revisiones en `.impeccable/critique/`), `audit` (a11y, rendimiento,
  theming, responsive; puntuación /20), `polish`, `harden` (i18n, overflow,
  estados), `typeset`, `layout`, `optimize`, `clarify`, `document`, `doctor`,
  `hooks`. Ruido para un CV: `onboard`, `overdrive`, `extract`, `operate`,
  `ios`/`android`, y el taller `new-work` con comps generados por OpenAI.
- **Encaje**: neutro-bueno. Adaptador de live para Next.js App Router con
  Turbopack (fixture E2E «Next.js 16»); el detector entiende utilidades Tailwind
  v3/v4; `document` busca primero variables CSS (`--color-*`, `--font-*`), así
  que `@theme inline` de `globals.css` se captura. Roces: su regla de fuentes
  sobreusadas incluye Montserrat (resuelto con un ignore compartido), la ruta de
  contraste en navegador no entiende `oklch` (issue #592; la estática sí),
  `detect-csp` mira `middleware.ts` y no `proxy.ts` (irrelevante: no hay CSP), y
  `context.mjs` inyecta directivas de prompt (`AUTONOMY_DIRECTIVE_CHECK`,
  `SUBAGENT_AUTHORIZATION`) que conviene conocer.
- **Coste**: SKILL.md ≈2,75k + salida de `context.mjs` (incluye `PRODUCT.md` y
  `DESIGN.md` íntegros: ≈6–7k aquí) + la referencia del comando (1–11k). Un
  `polish` ≈6–8k, un `critique` ≈14k más subagentes.
- **Producción**: la más madura: 95 archivos de test, releases frecuentes (10
  en tres semanas), changelog, CI (solo Linux). Riesgos: 3,4 MB / 148 archivos
  en el repo; hooks en cada edición (≈0,2–0,6 s en esta máquina, siempre `exit
0`, nunca bloquean); `npx impeccable` arrastra Puppeteer, que descargó ≈700 MB
  de Chrome a `~/.cache/puppeteer`; comprobación de versión diaria contra
  `impeccable.style` y ping en rondas de dirección (`IMPECCABLE_NO_TELEMETRY`);
  el CLI de npm va por 3.6.0 mientras la skill descargada es 4.1.1.
- **Su descripción es amplísima** («design, redesign, shape, critique, audit,
  polish… Not for backend-only or non-UI tasks»): se activa en cualquier tarea
  de frontend. Por eso existe la skill orquestadora.

## Comparativa funcional

✅ lo hace bien · ◐ parcial o con matices · ✗ no lo cubre

| Capacidad                                           | UI Skills                      | UI/UX Pro Max               | Emil Kowalski          | taste-skill            | impeccable                       |
| --------------------------------------------------- | ------------------------------ | --------------------------- | ---------------------- | ---------------------- | -------------------------------- |
| Restricciones base al editar UI (MUST/NEVER)        | ✅ `baseline-ui`               | ◐ checklist estático        | ✗                      | ◐ (87 KB, estética)    | ◐ `craft-floor` al editar        |
| Auditoría UX/diseño de solo lectura                 | ✅ `improve-ui` (planes)       | ✗                           | ◐ `improve-animations` | ◐ `redesign` (edita)   | ✅ `critique` (memoria), `audit` |
| Detector determinista sin LLM / CI                  | ✗                              | ✗                           | ✗                      | ✗                      | ✅ 59 reglas, `detect`, hooks    |
| Animación: valores, curvas, recetas                 | ◐ rendimiento                  | ◐ presets GSAP              | ✅ autoridad           | ◐ diales, GSAP         | ◐ `animate` (tesis)              |
| Rendimiento de animación (compositor, scroll, blur) | ✅ `fixing-motion-performance` | ✗                           | ◐                      | ✗                      | ◐ `optimize`                     |
| Accesibilidad                                       | ✅ `fixing-accessibility`      | ◐ guías                     | ✗                      | ◐ AA en botones/forms  | ✅ `audit`, `harden`, detector   |
| SEO / Open Graph / JSON-LD / hreflang               | ✅ `fixing-metadata` (única)   | ✗                           | ✗                      | ✗                      | ✗                                |
| Sistema de diseño persistente (`DESIGN.md`)         | ✅ `create-design-md` (+lint)  | ◐ MASTER.md                 | ✗                      | ◐ para Google Stitch   | ✅ `document` (+ sidecar)        |
| Verdad de producto (`PRODUCT.md`)                   | ✗                              | ✗                           | ✗                      | ✗                      | ✅ `init`                        |
| Dirección estética / anti-«slop»                    | ◐ sobria                       | ◐ estilos/paletas           | ✗                      | ✅ (con imposiciones)  | ✅ modos, `bolder`/`quieter`     |
| Base de datos de paletas, fuentes, stacks           | ✗                              | ✅ (requiere Python)        | ✗                      | ◐ listas fijas         | ✗                                |
| Elección de librerías                               | ✗                              | ◐ por stack                 | ✅ `pick-ui-library`   | ◐ paquetes oficiales   | ✗                                |
| Iteración en navegador                              | ✗                              | ✗                           | ◐ `prototype`          | ✗                      | ✅ `live`                        |
| Generación de imágenes / logos / slides             | ✗                              | ✅ (Gemini, Python)         | ✗                      | ✅ prompts (sin motor) | ◐ comps (OpenAI, opcional)       |
| Conoce Base UI (no Radix)                           | ✅                             | ◐ datos sí, `ui-styling` no | ✅                     | ✗                      | ◐ neutro                         |
| Conoce `motion` v13 (no framer-motion)              | ✅                             | ✗ (GSAP/framer-motion)      | ◐ (un import legado)   | ✅                     | ◐ neutro                         |
| Tailwind 4 CSS-first (`@theme`, sin config)         | ✅                             | ✗ (`tailwind.config`)       | ✅                     | ✅                     | ✅                               |
| Sin dependencias (Node/Python/red/claves)           | ✅ (salvo root)                | ✗ Python, Gemini            | ✅                     | ✅ (CDN sugeridos)     | ◐ Node; Chrome opcional          |

## Solapamientos y quién gana

| Solapan en…                      | Candidatas                                                                                            | Elegida y por qué                                                                                                                                                                |
| -------------------------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Anti-«slop», dirección, rediseño | impeccable, taste-skill, (UI/UX Pro Max)                                                              | **impeccable**: nativo de Claude Code (comandos, hooks, detector), no impone fuentes ni paletas, progressive disclosure. taste-skill cuesta 22k tokens y pelea con la identidad. |
| Sistema visual persistente       | `create-design-md` (UI Skills), `/impeccable document`, stitch (taste)                                | **`/impeccable document`** (mismo archivo y misma spec; añade el sidecar). El lint oficial se pasa a mano: `npx @google/design.md lint DESIGN.md`.                               |
| Auditoría de solo lectura        | `improve-ui`, `/impeccable critique` + `audit`, `redesign` (taste)                                    | **impeccable**: memoria de revisiones y puntuación; `improve-ui` duplicaba el flujo.                                                                                             |
| Animación (valores)              | `animate`/`review-animations` (Emil), `/impeccable animate`, `--motion` (Pro Max, GSAP), taste (GSAP) | **Emil**: numérico, recetas Base UI, revisor manual. impeccable aporta la «tesis» (dónde merece moverse), no otros números.                                                      |
| Rendimiento de animación         | `fixing-motion-performance`, `/impeccable optimize`                                                   | Las dos: no compiten (rendimiento vs. CWV general).                                                                                                                              |
| Accesibilidad                    | `fixing-accessibility`, `/impeccable audit`, `harden`                                                 | Las dos: `fixing-accessibility` para arreglos mínimos, `audit` para el pase completo; el árbitro son las E2E con axe.                                                            |
| Limpieza rápida de UI            | `baseline-ui`, `/impeccable polish`                                                                   | Las dos, en orden: `baseline-ui` (0,9k tokens) primero, `polish` para afinar.                                                                                                    |

Dos contradicciones concretas que se resolvieron por escrito en `design-workflow`:

- **Curvas y duraciones**: `baseline-ui` dice «NEVER introduce custom easing
  curves unless explicitly requested» y «NEVER exceed 200ms for interaction
  feedback»; Emil exige tres curvas exactas y da 200–500 ms a modales; impeccable
  propone `cubic-bezier(0.16, 1, 0.3, 1)` y hasta 800 ms para una entrada focal.
  Regla: mandan los valores de Emil; los 200 ms de `baseline-ui` son para
  hover/press; las curvas se definen una vez como tokens propios en `@theme
inline` (`--ease-out-quart`, `--ease-in-out-quart`) para no pisar los
  `--ease-out`/`--ease-in-out` que Tailwind 4 ya trae con otros valores.
- **`prefers-reduced-motion`**: UI/UX Pro Max y taste-skill lo tratan como
  «cero movimiento»; Emil e impeccable como «menos y más suave». Regla del
  proyecto: se reduce el movimiento ambiental y no se anula la respuesta a un
  clic (el vídeo del retrato), porque el dueño navega con `reduce` activo y ya
  se rompió una vez.

## Encaje con este stack, en concreto

| Tema                                | Fricción encontrada                                                                                                               | Cómo se resolvió                                                                                                    |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Next.js 16 (App Router, `proxy.ts`) | Ninguna skill sabe de `proxy.ts`; impeccable live busca `app/layout.tsx` y aquí el `<body>` está en `src/app/[locale]/layout.tsx` | `.impeccable/live/config.json` apunta al layout de `[locale]`; `fixing-metadata` usa la Metadata API                |
| Tailwind 4 CSS-first                | UI/UX Pro Max genera `tailwind.config`; Emil pisa `--ease-out`                                                                    | No instalada; tokens de easing con nombre propio; `DESIGN.md` documenta `@theme inline`                             |
| shadcn sobre Base UI                | taste-skill y `ui-styling` piensan en Radix                                                                                       | No instaladas; regla «`render`, no `asChild`» en `design-workflow`; recetas de Emil ya son Base UI                  |
| `motion` v13                        | `emil-design-eng` importa `framer-motion`; Pro Max y taste empujan GSAP                                                           | `emil-design-eng` no instalada; regla «paquete `motion`, nunca framer-motion ni GSAP»                               |
| next-intl (es/en)                   | taste-skill veta la raya; nadie contempla dos catálogos de textos                                                                 | Regla «todo texto en `messages/es.json` y `en.json`»; la raya y las «» son correctas en español                     |
| next-themes (oscuro por defecto)    | Presets de taste-skill son de un solo tema claro                                                                                  | No instalados; `DESIGN.md` lleva las dos paletas                                                                    |
| Fuentes por `next/font/local`       | Detector de impeccable considera Montserrat «sobreusada»                                                                          | `npx impeccable ignores add-value overused-font Montserrat` (config compartida)                                     |
| Windows sin Python                  | UI/UX Pro Max inservible; `skill.sh` de taste usa `declare -A`                                                                    | No instalada; el resto es Node o Markdown puro                                                                      |
| Toolchain del repo                  | Prettier/ESLint/knip tocarían 150 archivos vendor; lint-staged formatearía los `.mjs` de impeccable                               | `.claude/skills/` ignorado en `.prettierignore`, `eslint.config.mjs` y `knip.json` (la skill propia sí se formatea) |

## Uso en producción: coste, dependencias y riesgos

| Colección     | Tokens fijos (descripciones) | Tokens al activarse                           | Dependencias                                           | Ejecuta código                                  | Red / claves                                                                               | Huella en el repo     |
| ------------- | ---------------------------: | --------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------- | ------------------------------------------------------------------------------------------ | --------------------- |
| UI Skills (4) |                         ≈250 | 0,9–1,4k cada una                             | Ninguna                                                | No                                              | No                                                                                         | 18 KB                 |
| Emil (3)      |                         ≈250 | 1,1–2,9k (+2–2,5k de referencia bajo demanda) | Ninguna                                                | No                                              | No                                                                                         | 40 KB                 |
| impeccable    |                         ≈150 | 2,75k + contexto (≈6–7k) + comando (1–11k)    | Node ≥ 22.18; Chrome opcional (`detect <url>`, `live`) | Sí: `context.mjs`, detector, hooks (~0,2–0,6 s) | Versión diaria y ping de dirección (desactivables); imágenes con `OPENAI_API_KEY` opcional | 3,4 MB / 148 archivos |
| taste-skill   |                      ≈1.100* | ≈22k la principal                             | Ninguna                                                | No                                              | Sugiere CDN externos                                                                       | 302 KB*               |
| UI/UX Pro Max |                        ≈675* | 4–13,5k                                       | **Python 3**, Gemini para imágenes                     | Sí: `search.py`, generadores                    | Gemini, Pexels/Unsplash                                                                    | 4,6–23 MB*            |

\* Si se instalaran; no se instalaron.

## Cómo cooperan

Las piezas que las conectan viven en el repo:

- **`DESIGN.md`** (raíz): el sistema visual tal como está implementado, en el
  formato design.md. Lo carga impeccable en cada activación (`context.mjs`) y su
  detector compara fuentes, colores y radios con el frontmatter; cualquier otra
  skill lo lee como fuente de verdad. Se valida con `npx @google/design.md lint
DESIGN.md` (0 errores; los avisos «orphaned tokens» son los del tema oscuro,
  que la spec no sabe agrupar).
- **`PRODUCT.md`** (raíz): usuarios, propósito, restricciones y evidencia. Lo
  pide impeccable antes de `critique`, `polish` o `shape`. Los datos inferidos
  están marcados para que el dueño los confirme.
- **`.impeccable/config.json`**: config compartida (`buildPath: code`, hook
  silencioso, ignore de Montserrat). **`.impeccable/live/config.json`**: el
  layout donde inyectar el modo live.
- **`.claude/skills/design-workflow`**: la skill orquestadora. Enruta tarea →
  skill, fija la precedencia (decisiones documentadas > accesibilidad y
  rendimiento > valores de Emil para movimiento > dirección de impeccable) y
  lista las reglas de Next 16 / Tailwind 4 / Base UI / motion v13.
- **`CLAUDE.md`**: tabla de skills y reglas duras, siempre en contexto.

Flujo típico: leer `DESIGN.md` → diagnóstico (`/impeccable critique` o `audit`)
→ construir bajo `baseline-ui` (+ `animate` si hay movimiento) → revisar
(`/review-animations`, `fixing-*`, avisos del hook) → verificar (`pnpm lint &&
pnpm typecheck && pnpm test`, MCP de Playwright en los dos temas, `pnpm
test:e2e`) → si cambió el sistema, actualizar `DESIGN.md` en el mismo commit.

## Instalación, actualización y desinstalación

Todo está en `.claude/skills/` (ámbito de proyecto, versionado); un clon nuevo
lo tiene sin hacer nada. Los comandos que se usaron:

```bash
# impeccable: solo Claude Code, ámbito proyecto, sin preguntas
npx impeccable@latest install --providers=claude --project --yes
# Emil Kowalski (copia, no symlink: en Windows y para versionarlo)
npx skills@latest add emilkowalski/skills -a claude-code -s animate -s review-animations -s pick-ui-library --copy -y
# UI Skills
npx skills@latest add ibelick/ui-skills -a claude-code -s baseline-ui -s fixing-accessibility -s fixing-motion-performance -s fixing-metadata --copy -y
```

- **Actualizar**: `npx impeccable update` (compara hashes con el bundle remoto)
  y `npx skills update` (usa `skills-lock.json`). Después, revisar el diff:
  son código vendor y Prettier/ESLint/knip los ignoran a propósito.
- **Hook de impeccable**: vive en `.claude/settings.local.json` (donde lo escribe
  su instalador; en este repo ese archivo está versionado). `/impeccable hooks
off|on|status`; falsos positivos con `npx impeccable ignores add-value <regla>
<valor> --reason "…"`.
- **Desinstalar**: borrar la carpeta en `.claude/skills/`, su entrada en
  `skills-lock.json` y, para impeccable, las entradas `hooks` de
  `settings.local.json`, `.impeccable/` y el bloque de `.gitignore`.
- **Puppeteer**: `npx impeccable` instala Puppeteer como dependencia opcional y
  descarga Chrome (≈700 MB) en `~/.cache/puppeteer`; solo lo usa `detect <url>`.
  Se puede borrar esa caché sin romper nada más.

## Skills que no se pidieron y conviene considerar

Verificadas el 15 de agosto de 2026 (existen, están activas, comando de
instalación probado en la doc). Ordenadas por impacto para este proyecto:

| #   | Qué                                                                                                                                                                                         | Origen                                                           | Aporta                                                                                                                                                  | Instalación                                                                                                                                                                     |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | [`next-devtools-mcp`](https://github.com/vercel/next-devtools-mcp) + skills de [`vercel/next.js`](https://github.com/vercel/next.js/tree/canary/skills) (`next-dev-loop`, cache components) | Oficial (Next.js)                                                | Errores, rutas, logs y compilación del dev server en vivo vía `/_next/mcp` (Next 16+); docs empaquetadas; bucle editar→verificar                        | `claude mcp add --transport stdio next-devtools --scope project -- npx -y next-devtools-mcp@latest`; `npx skills add vercel/next.js --skill next-dev-loop`                      |
| 2   | [`vercel-labs/agent-skills`](https://github.com/vercel-labs/agent-skills): `react-best-practices`, `composition-patterns`, `web-design-guidelines`, `react-view-transitions`                | Oficial (Vercel)                                                 | Rendimiento React/RSC (waterfalls, bundle), composición, auditoría contra las Web Interface Guidelines, View Transitions                                | `npx skills add vercel-labs/agent-skills --skill react-best-practices --skill composition-patterns --skill web-design-guidelines --skill react-view-transitions -a claude-code` |
| 3   | [Skill y MCP de shadcn](https://ui.shadcn.com/docs/skills)                                                                                                                                  | Oficial (shadcn)                                                 | Detecta `base-nova` con `shadcn info --json`; reglas Base UI vs Radix (`render`/`asChild`), Field/InputGroup, registries                                | `npx skills add shadcn/ui`; `pnpm dlx shadcn@latest mcp init --client claude`                                                                                                   |
| 4   | [Motion AI Kit](https://motion.dev/docs/ai-kit) (`npx motion-ai`)                                                                                                                           | Oficial (Motion)                                                 | Docs exactas de `motion` 13, consejos para Base UI, springs CSS `linear()`; complementa a Emil (él decide _si/qué_, esto dice _cómo_ con la API actual) | `npx motion-ai` (elige Claude Code + proyecto)                                                                                                                                  |
| 5   | [`chrome-devtools-mcp`](https://github.com/ChromeDevTools/chrome-devtools-mcp)                                                                                                              | Oficial (Google Chrome)                                          | Trazas LCP/INP/CLS con insights, red, consola con source maps, árbol de accesibilidad; mediciones reales, no reglas                                     | `/plugin install chrome-devtools-mcp@claude-plugins-official`                                                                                                                   |
| 6   | [`modern-web-guidance`](https://github.com/GoogleChrome/modern-web-guidance)                                                                                                                | Oficial (Chrome + Edge)                                          | Guías Baseline por caso de uso (View Transitions, `@starting-style`, popover, scroll-driven, `text-wrap: balance`, INP), ≈1k tokens por consulta        | `/plugin install modern-web-guidance@claude-plugins-official`                                                                                                                   |
| 7   | [`context7`](https://github.com/upstash/context7)                                                                                                                                           | Plugin oficial (Anthropic/Upstash)                               | Docs al día de lo que no tiene skill oficial: next-intl 4, Tailwind 4, Base UI 1.x, motion                                                              | `/plugin install context7@claude-plugins-official`                                                                                                                              |
| 8   | [`frontend-design`](https://github.com/anthropics/skills/tree/main/skills/frontend-design)                                                                                                  | Oficial (Anthropic)                                              | Brief de dirección estética anti-genérica; solapa con impeccable, útil como arranque                                                                    | `/plugin install frontend-design@claude-plugins-official`                                                                                                                       |
| 9   | [`web-quality-skills`](https://github.com/addyosmani/web-quality-skills) (`seo`, `core-web-vitals`)                                                                                         | Comunidad (Addy Osmani)                                          | SEO técnico con JSON-LD/hreflang (complementa `fixing-metadata`), umbrales de CWV                                                                       | `npx skills add addyosmani/web-quality-skills --skill core-web-vitals --skill seo -g`                                                                                           |
| 10  | [`react-doctor`](https://github.com/millionco/react-doctor)                                                                                                                                 | Comunidad (Million)                                              | Escáner determinista de React 19/Next; comenta en PRs                                                                                                   | `npx react-doctor@latest` → `npx react-doctor@latest install`                                                                                                                   |
| 11  | [`next-safe-action/skills`](https://github.com/next-safe-action/skills)                                                                                                                     | Mantenedores de la librería (repo joven, sin licencia declarada) | Server actions v8 + Zod 4: el formulario de contacto                                                                                                    | `npx skills add next-safe-action/skills --skill safe-action-client --skill safe-action-forms --skill safe-action-validation-errors`                                             |
| 12  | [`typescript-lsp`](https://github.com/anthropics/claude-plugins-official), [`superpowers`](https://github.com/obra/superpowers)                                                             | Oficial / comunidad                                              | Diagnósticos de tipos tras cada edición; metodología brainstorm→plan→TDD                                                                                | `/plugin install typescript-lsp@claude-plugins-official`; `/plugin install superpowers@claude-plugins-official`                                                                 |

Comprobado que **no existen** (para no buscarlos): skill oficial de Tailwind
(sin `skills/` ni `llms.txt`; discusión tailwindlabs/tailwindcss#19594 sin
respuesta), skill oficial de next-intl, y `next-best-practices`/`next-upgrade`
como skills (Vercel las retiró: desde Next 16.2 la documentación va en
`node_modules/next/dist/docs/` y `next dev` escribe el bloque de `AGENTS.md`).
