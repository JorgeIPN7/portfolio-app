# Skills de diseño para agentes: comparativa y decisiones

Rama `feat/add-ia-skills`, agosto de 2026. Compara nueve colecciones de skills de
diseño/UI para agentes de código —**UI Skills**, **UI/UX Pro Max**, las skills de
**Emil Kowalski**, **taste-skill**, **impeccable**, **`frontend-design` de
Anthropic**, **huashu-design**, **awesome-design-md** y **`vercel-labs/agent-skills`**—,
explica cuáles se instalan en este repo (`.claude/skills/`) y por qué, cómo se
reparten el trabajo, si merece la pena instalar Python para UI/UX Pro Max y qué
conviene para una futura **e-shop «a nivel de Amazon»** con Vercel + Next.js 16 +
Claude Code. Los datos salen de leer los repositorios (clonados y medidos con
`wc -c`), de probar instalaciones y scripts en esta máquina (Windows 11, Node 22,
sin Python ni ffmpeg) y de las APIs de GitHub y npm el 15 de agosto de 2026. Lo
que no se pudo verificar está marcado como tal.

Cómo se usan en el día a día está en el `README.md` (sección «Skills de diseño
para agentes») y el enrutado entre ellas en `.claude/skills/design-workflow`.

## Resumen ejecutivo

| Colección                               | Decisión                                                                                                                                                                          | Por qué, en una línea                                                                                                                                                                                                                                                                                     |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **impeccable** (Paul Bakaus)            | **Instalada entera** (`npx impeccable install`), con su hook de diseño                                                                                                            | Flujo principal: 23 comandos, detector determinista de 59 reglas ejecutable sin LLM, hooks nativos de Claude Code y contexto persistente (`PRODUCT.md`, `DESIGN.md`).                                                                                                                                     |
| **UI Skills** (ibelick)                 | **Parcial**: `baseline-ui`, `fixing-accessibility`, `fixing-motion-performance`, `fixing-metadata`                                                                                | Restricciones baratas (≈4,5k tokens en total) que encajan 1:1 con Base UI, `motion/react`, `tw-animate-css` y Tailwind 4; `fixing-metadata` es la única que cubre SEO/OG/JSON-LD/hreflang.                                                                                                                |
| **Emil Kowalski / skills**              | **Parcial**: `animate`, `review-animations`, `pick-ui-library`                                                                                                                    | La autoridad en animación: valores numéricos exactos, recetas ya escritas para Base UI, revisor de solo lectura. Se descartan las que se autoactivan en todo o importan `framer-motion`.                                                                                                                  |
| **`vercel-labs/agent-skills`** (Vercel) | **Parcial**: `vercel-react-best-practices`, `vercel-composition-patterns`, `vercel-react-view-transitions`, `web-design-guidelines`; `deploy-to-vercel` instalada **solo manual** | Oficiales de Vercel para Next/React: 72 reglas de rendimiento por impacto, composición, View Transitions (la doc de Next 16.3 recomienda esa skill), auditoría terse. Fuera: `vercel-optimize` (exige métricas de un proyecto con tráfico), `writing-guidelines`, `vercel-cli-with-tokens`, React Native. |
| **taste-skill** (Leonxlnx)              | **No instalada** (uso bajo demanda documentado)                                                                                                                                   | Hace lo mismo que impeccable (anti-«slop», inferencia de brief, rediseño) a 22k tokens por activación, y sus reglas pelean con la identidad del CV: prohíbe la serif, desaconseja lucide, veta la raya.                                                                                                   |
| **UI/UX Pro Max** (nextlevelbuilder)    | **No instalada; no merece la pena instalar Python por ella**                                                                                                                      | Su valor es una base de datos consultable con scripts **Python**; para e-commerce trae dos filas de reglas, tres paletas y cero guías de checkout/PDP/confianza; lo demás lo cubren impeccable, ui-skills y las skills de Vercel.                                                                         |
| **`frontend-design`** (Anthropic)       | **No instalada** aquí; para la e-shop, instalar en modo solo-manual                                                                                                               | Impeccable «started from there» y ya contiene sus reglas; se autoactivaría junto a impeccable en cada tarea de UI. No sabe nada de comercio.                                                                                                                                                              |
| **huashu-design** (花叔)                | **No instalada** aquí; para la e-shop, global y solo-manual (prototipos y vídeo)                                                                                                  | Produce prototipos HTML, decks y vídeos, no código Next (lo excluye expresamente); prompts en chino (≈16k tokens el SKILL.md, 50–60k por flujo), sin regla de idioma, locución solo chino/inglés, exige ffmpeg/Python para vídeo.                                                                         |
| **awesome-design-md** (VoltAgent)       | **Nada que instalar**; referencia bajo demanda para la e-shop                                                                                                                     | 74 `DESIGN.md` de marcas (sin Amazon); tokens mayoritariamente reales pero incompletos; sustituir el `DESIGN.md` propio rompería la vigilancia de impeccable y copia una identidad ajena. Útiles Nike y Meta como modelo de cómo documentar componentes de comercio.                                      |

Además, `create-design-md` e `improve-ui` (UI Skills) se descartan porque hacen lo
mismo que `/impeccable document` y `/impeccable critique` + `/impeccable audit`
sobre el mismo archivo `DESIGN.md`.

## Las nueve colecciones, en una tabla

| Colección                                                                                  | Autor                     | Licencia                             | Estrellas (ago-2026) | Último push |               Skills | Tamaño de los `SKILL.md`                                                                         |
| ------------------------------------------------------------------------------------------ | ------------------------- | ------------------------------------ | -------------------: | ----------- | -------------------: | ------------------------------------------------------------------------------------------------ |
| [UI Skills](https://github.com/ibelick/ui-skills)                                          | Julien Thibeaut (ibelick) | MIT                                  |                 7,2k | 2026-08-13  |                    7 | 44 KB en total (≈11k tokens; ninguna pasa de 4k)                                                 |
| [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)                   | nextlevelbuilder          | MIT                                  |                 117k | 2026-08-14  |                    7 | 58 KB + 1,9 MB de CSV + 5,4 MB de fuentes TTF + 35 scripts Python                                |
| [Emil Kowalski / skills](https://github.com/emilkowalski/skills)                           | Emil Kowalski             | MIT                                  |                29,5k | 2026-08-13  |                   10 | 119 KB (≈30k tokens en total; solo Markdown, sin scripts)                                        |
| [taste-skill](https://github.com/Leonxlnx/taste-skill)                                     | Leon Lin (Leonxlnx)       | MIT                                  |                76,8k | 2026-07-23  |                   13 | 302 KB (≈76k tokens; la principal sola pesa 87 KB, ≈22k tokens)                                  |
| [impeccable](https://github.com/pbakaus/impeccable)                                        | Paul Bakaus               | Apache-2.0                           |                59,4k | 2026-08-15  | 1 skill, 23 comandos | 11 KB el `SKILL.md` + 374 KB de referencias bajo demanda + 3 MB de scripts                       |
| [`vercel-labs/agent-skills`](https://github.com/vercel-labs/agent-skills)                  | Vercel                    | MIT por skill (sin LICENSE raíz)     |                30,1k | 2026-08-15  |                    9 | 1,2–17 KB cada `SKILL.md`; `react-best-practices` 230 KB con 72 reglas; `vercel-optimize` 827 KB |
| [`frontend-design`](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | Anthropic                 | Apache-2.0 (LICENSE.txt sin titular) |     169,5k (el repo) | 2026-08-13  |                    1 | 8,3 KB (≈2,4k tokens; sin scripts)                                                               |
| [huashu-design](https://github.com/alchaincyf/huashu-design)                               | 花叔 (alchaincyf)         | MIT desde 2026-05-14                 |                23,1k | 2026-08-14  |        1 (+ 34 refs) | 61,6 KB en chino (≈16k tokens) + 621 KB de referencias; 33 MB con mp3                            |
| [awesome-design-md](https://github.com/VoltAgent/awesome-design-md)                        | VoltAgent                 | MIT (los archivos; las marcas no)    |               108,6k | 2026-07-31  |   0 (74 `DESIGN.md`) | 4–44 KB por marca (≈5–11k tokens)                                                                |

Las estrellas miden popularidad, no calidad ni encaje: las dos más populares
(UI/UX Pro Max y awesome-design-md) son de las que menos sirven aquí.

## Qué es cada una

### UI Skills (ibelick)

Dos cosas a la vez: (a) un conjunto de **checklists MUST / SHOULD / NEVER**
(`baseline-ui`, `fixing-accessibility`, `fixing-motion-performance`,
`fixing-metadata`) y dos flujos de solo lectura que producen documentos
(`improve-ui` → planes en `design-plans/`; `create-design-md` → `DESIGN.md`);
(b) un directorio de 209 skills ajenas con un enrutador (`ui-skills-root`, `npx
ui-skills`) y un servidor MCP. Filosofía sobria y anti-«slop» con contexto mínimo:
«Prefer 1 skill… never use more than 3».

- **Encaje**: el mejor de todas. `baseline-ui` exige `motion/react`
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

- **Encaje**: mixto. Sus datos de stack están al día (`stacks/nextjs.csv` habla
  de Next 16.2, `use cache`, `cacheComponents` y de que `middleware` pasó a
  `proxy`; `stacks/shadcn.csv` sabe que Base UI es el default y que se compone
  con `render`, no `asChild`; Tailwind 4.3), pero `motion.csv` es 100 % GSAP,
  `typography.csv` da `tailwind.config` v3, `ui-styling` dice «shadcn (built on
  Radix UI)» y su script `tailwind_config_gen.py` crearía un `tailwind.config.js`
  que aquí no existe ni debe existir.
- **El problema**: **todo el flujo de búsqueda requiere Python** (`python3
search.py …`); en esta máquina `python` es el alias de la Microsoft Store y no
  hay alternativa en Node. La decisión detallada de si merece la pena instalarlo
  está más abajo («UI/UX Pro Max y Python»).
- **Coste**: ≈675 tokens permanentes por las siete descripciones si se instala
  como plugin; la versión CLI de la skill principal pesa ≈13,5k al activarse.
  Huella: ≈4,6 MB / 170 archivos en `.claude/` (23 MB con fuentes vía plugin).
- **Producción**: 153 tests, releases semanales, sin telemetría; issues abiertos
  sobre rutas `.claude/` fijas y calidad de resultados; `design`/`banner-design`
  invocan skills y claves (Gemini) que no existen fuera de ClaudeKit.

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

### `vercel-labs/agent-skills` (Vercel)

La colección oficial de Vercel (2 M de instalaciones en skills.sh): nueve skills
de calidad desigual, mantenidas por gente de Vercel pero con muchos issues sin
respuesta y **sin archivo LICENSE** en la raíz (issues #230/#249; cuatro skills
declaran `license: MIT` en su frontmatter, cinco no declaran nada).

| Carpeta → `name:` real                                         | Qué hace                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Aquí                                                                                                                                        |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `react-best-practices` → **`vercel-react-best-practices`**     | 72 reglas de rendimiento React/Next «de Vercel Engineering», por impacto (waterfalls, bundle, servidor, fetching en cliente, re-renders, rendering, micro-optimizaciones); índice de ≈1,8k tokens con progressive disclosure (`rules/*.md`, ≈27k si se cargan todas). Usa APIs de React 19.2 (`Activity`, `useEffectEvent`, `after()`, `use()`) sin nombrar Next 16: **no habla de `use cache` ni Cache Components**; dos reglas chocan con Next 16.3 (`dynamic(..., { ssr: false })` en Server Components no está permitido; `optimizePackageImports` para `lucide-react` ya viene por defecto). | **Instalada**                                                                                                                               |
| `composition-patterns` → **`vercel-composition-patterns`**     | 8 reglas de composición (compound components, `use(Context)`, `ref` como prop, sin proliferación de props booleanas); ≈0,7k + 5,5k bajo demanda. Ejemplos con sabor React Native e issues abiertos sobre RSC y un `Composer.Context` inexistente; encaja con «componer con `render`» de Base UI.                                                                                                                                                                                                                                                                                                  | **Instalada**                                                                                                                               |
| `react-view-transitions` → **`vercel-react-view-transitions`** | `<ViewTransition>`, `addTransitionType`, `transitionTypes` en `next/link` (Next 16.2+), recetas CSS, elemento compartido, Suspense; ≈3,6k + 11k de referencias. **La doc local de Next 16.3.1 (`view-transitions.md`) recomienda literalmente esta skill** y confirma que funciona «with no configuration» y sin `react@canary` (el App Router empaqueta React canary). Su referencia aún pide `experimental.viewTransition`, flag que ya no existe (inocuo). Sus recetas usan `ease-in` y `blur` en salidas: aquí mandan las curvas de Emil y `fixing-motion-performance`.                       | **Instalada**                                                                                                                               |
| `web-design-guidelines` → **`web-design-guidelines`**          | 1,2 KB locales: en cada uso descarga por red `raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md` (93 reglas, ≈1,7k tokens) y devuelve `archivo:línea` sin arreglar nada. Misma familia que `fixing-accessibility` y `/impeccable audit`, con salida más tersa; su bloque «Content & Copy» es inglés (Title Case, comillas inglesas) y no aplica al CV en español. Sin plan B offline; instrucciones cargadas de `main` mutable (issues #30/#91).                                                                                                                     | **Instalada** (segunda opinión)                                                                                                             |
| `deploy-to-vercel` → **`deploy-to-vercel`** (v3.0.0)           | Instala la CLI `vercel`, `vercel login/link`, y despliega; su árbol de decisión puede hacer `git add . && git commit && git push` por su cuenta y, como último recurso, sube el proyecto entero a `https://claude-skills-deploy.vercel.com/api/deploy` sin autenticación. Aquí desplegar es hacer push (Vercel construye desde Git).                                                                                                                                                                                                                                                              | Instalada **solo manual** (`skillOverrides: user-invocable-only`) con reglas en `design-workflow`: solo previews, nunca commit/push/tarball |
| `vercel-optimize` → **`vercel-optimize`** (v1.2.0)             | 827 KB, 156 archivos: pipeline de 15 scripts Node que recoge métricas de Vercel (CLI v53+, proyecto enlazado, **Observability Plus**), investiga solo candidatos con métricas y genera `report.md` (coste, funciones, caché, imágenes, bots). Su propio AGENTS.md excluye «greenfield projects with no traffic»; su playbook `ecommerce.md` ya habla de PLP con ISR agresivo e imágenes y checkout dinámico con llamadas paralelas.                                                                                                                                                               | **No ahora**; sí en la e-shop con tráfico                                                                                                   |
| `writing-guidelines`                                           | Manual de estilo inglés de Vercel para docs («Never em dashes», sentence case, `meta.contentType`), descargado por red.                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | No (docs en español)                                                                                                                        |
| `vercel-cli-with-tokens`                                       | Despliegues por token (`VERCEL_TOKEN`; hace `grep -i vercel .env`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | No (solo CI)                                                                                                                                |
| `react-native-skills`                                          | 36 reglas de React Native/Expo.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | No                                                                                                                                          |

### `frontend-design` (Anthropic)

Un único `SKILL.md` de 8,3 KB (≈2,4k tokens; 83 tokens permanentes de
descripción), byte-idéntico en `anthropics/skills`, en el plugin del marketplace
oficial y en la caché local. Es un _role prompt_ de dirección estética: «the
design lead at a small studio known for giving every client a visual identity
that could not be mistaken for anyone else's», con un flujo de dos pasadas
(plan compacto de tokens —4–6 hex, dos roles tipográficos, wireframe ASCII,
«signature»— → autocrítica «if any part of it reads like the generic default…
revise» → código), tres «looks IA» que evita (crema + serif + terracota;
negro + acento ácido; broadsheet de hairlines) y un suelo de calidad
(responsive, foco visible, reduced-motion). Más de 1,1 M de instalaciones.

- **Encaje**: agnóstica de framework, sin scripts. No lee `DESIGN.md` ni
  `PRODUCT.md`: «pin it yourself» si el brief no fija el sujeto, y «not the same
  families you would reach for» choca con Montserrat + Playfair salvo que alguien
  le pase el brief.
- **Solapamiento**: total con impeccable, cuyo README dice «Anthropic's
  frontend-design was the first widely-used design skill for Claude. Impeccable
  started from there»; `new-work.md` y `craft-floor.md` repiten casi textualmente
  sus calibraciones. Su descripción («when building new UI or reshaping an
  existing one… typography») se autoactivaría a la vez que impeccable y
  `design-workflow` en cualquier «nueva sección».
- **Producción**: sin versionado ni changelog; la reescritura de junio de 2026
  cambió la filosofía (de «bold maximalism» a «restraint») y el README del
  plugin aún describe la versión vieja; el repo avisa «for demonstration and
  educational purposes only».
- **E-commerce**: nada de catálogo, PDP, carrito, checkout, densidad ni
  confianza; sesgada a landing/marca. Una tienda «nivel Amazon» es 90 % modo
  _Operate_ de impeccable, que esta skill contradice en parte.
- **Veredicto**: portfolio, no. E-shop: instalar desde el día 0 **en modo
  solo-manual** (`npx skills add anthropics/skills --skill frontend-design` +
  `"skillOverrides": { "frontend-design": "user-invocable-only" }` en settings) y
  usarla una sesión para el brief de marca; el plugin del marketplace no sirve
  para esto porque `skillOverrides` no afecta a plugins.

### huashu-design (花叔)

Skill «HTML-nativa» de 花叔 (Huashu; X `@AlchainHust`): «你是一位用HTML工作的设计师，不是程序员»
(_eres un diseñador que trabaja en HTML, no un programador_). Produce artefactos
autocontenidos: prototipos HTML de un archivo (React 18 UMD + Babel inline,
marcos iOS/Android/macOS/navegador, clic verificado con Playwright), decks
1920×1080 → PDF/PPTX editable, animaciones (motor propio o HyperFrames + GSAP)
exportadas a MP4/GIF **con BGM y SFX por defecto**, vídeos con locución TTS,
infografías (60 estilos con «% de fidelidad en CSS puro») y una revisión de seis
dimensiones. Flujo obligatorio: verificación de hechos, activos de marca reales
y **tres direcciones con subagentes antes de ejecutar** («任何新设计100%先出三个方向初稿给用户选»,
_cualquier diseño nuevo saca primero tres direcciones para que el usuario elija_).

- **Lo que dice de sí misma**: «不适用场景：生产级Web App、SEO网站、需要后端的动态系统»
  (_no aplica a web apps de producción, sitios SEO ni sistemas dinámicos con
  backend_); el autor la llama «an 80-point skill, not a 100-point product».
- **Encaje con Next 16**: ninguno. Genera HTML suelto con `react@18.3.1/umd` y
  `@babel/standalone` desde unpkg, estilos inline, carpetas aparte con
  HTML/MP4/PDF/PPTX; nada de Tailwind, TS, App Router, Base UI ni `motion`. Lo
  transferible son decisiones y capturas como brief para impeccable.
- **¿Afecta escribir en español?** Sí, en cinco frentes: (a) coste: el
  `SKILL.md` son 61,6 KB en chino, ≈16k tokens (con corrección CJK), y un flujo
  típico carga 50–60k; (b) no existe ninguna regla «responde en el idioma del
  usuario» (grep sin resultados; «español» no aparece en el repo): plantillas
  con `lang="zh-CN"`, `PingFang SC` de respaldo, comillas 「」 obligatorias,
  nombres de archivo y gates de ejemplo en chino; el modelo traduce lo visible
  si se lo pides, pero comentarios, `lang` y gates salen mezclados sin una regla
  explícita; (c) `typography.md` dedica «el capítulo más pesado» a la tipografía
  china y nada a ¿¡, «», raya o palabras largas (sus diez parejas latinas sí
  valen); (d) sesgo cultural periférico (portadas de WeChat/Xiaohongshu, marca de
  agua «Created by Huashu-Design»); (e) locución con TTS Doubao (ByteDance)
  «solo chino e inglés», subtítulos de ≤12 caracteres pensados para CJK, revisión
  de vídeo con Volcengine Ark: en México/España no aplican.
- **En esta máquina**: prototipos, decks, PDF/PPTX y crítica funcionan (Node +
  Playwright); vídeo, BGM/SFX y locución **no** (falta ffmpeg; `sfx-cues.sh` y
  `verify.py` piden Python).
- **Producción**: cuatro meses, un mantenedor, sin tests automatizados
  (`test-prompts.json` son seis prompts en chino), README inglés desfasado («20
  philosophies» cuando ya son 60 estilos), 33 MB con 28 MB de mp3 (no
  versionar en el repo: global). Sin telemetría; claves solo en su `.env`.
- **Veredicto**: portfolio, no. E-shop: **global y solo-manual**
  (`npx skills add alchaincyf/huashu-design -g` + `skillOverrides:
user-invocable-only`, y `winget install Gyan.FFmpeg` si se quiere vídeo) para
  la fase de exploración y marketing (tres direcciones clicables de PDP/checkout,
  vídeo de lanzamiento, decks), nunca para `src/`; añadir a la orquestadora
  «todo texto, comentarios, nombres y gates en español; `lang="es"`; comillas «»».

### awesome-design-md (VoltAgent)

No es una skill: 74 archivos `design-md/<marca>/DESIGN.md` (41 SaaS/dev tools,
12 medios/consumo, 7 fintech, 7 automoción, 5 «e-commerce/retail» —Airbnb, Meta,
Nike, Shopify, Starbucks— y 2 retro; **no hay Amazon**, pese a dos issues
pidiéndolo), generados con un pipeline LLM + captura + CSS público a partir de la
web de marketing de cada marca («extracted from real websites», sin nombrar la
herramienta). 64 siguen la spec de Google Labs (frontmatter YAML de tokens +
ocho secciones canónicas, la misma que el `DESIGN.md` de este repo); 10 son
prosa v1. VoltAgent (framework de agentes TS) usa el repo como embudo de
marketing (getdesign.md, DESIGN.md privados de pago, plantilla de issue que pide
email); 315 issues abiertos casi todos «DESIGN.md request».

- **Calidad, comprobada contra el CSS real**: hex mayoritariamente reales
  (Stripe 16/20; Nike y Vercel muy fieles), pero con aproximaciones (`#010102`
  en Linear), afirmaciones falsas («Linear no tiene modo claro»),
  contradicciones (Notion), sin hovers, seis nombres deformados («Stripi»,
  «Shopifi»…), YAML roto en tres archivos y, pasados por `npx @google/design.md
lint`, 0 errores y 1.357 avisos.
- **Con impeccable**: `context.mjs` y el detector resuelven `DESIGN.md` en la
  raíz y, si falta, en `.agents/context/` y `docs/`. Sustituir el propio por el
  de Nike marcaría Playfair, la paleta pizarra y los radios actuales como deriva
  en cada hook y `/impeccable document` volvería a sobrescribirlo. Un archivo
  llamado exactamente `DESIGN.md` en `docs/` sería fallback silencioso: las
  referencias van con otro nombre.
- **Riesgos**: legal (MIT no cubre trade dress ni marcas; las tipografías son
  propietarias, y los archivos lo admiten), deriva entre dos sistemas de tokens,
  calidad generada por IA. Alternativa más limpia como referencia:
  `VoltAgent/official-design-md` (7 `DESIGN.md` publicados por las propias
  empresas), sin retail.
- **Para la e-shop**: no hay retail masivo; **Nike** (PLP+PDP: `product-card`,
  `filter-chip`, precio tachado, acordeones de envío/reseñas) y **Meta** (buy box
  sticky, selector de SKU, specs, «Free 2-day delivery») son los más útiles, y
  Airbnb por las tarjetas de reseñas. Ninguno documenta carrito, checkout
  multipaso, resultados densos ni stock; Amazon es lo contrario de todos ellos.
- **Veredicto**: nada que instalar; no sustituir el `DESIGN.md` propio. En la
  e-shop, copiar `nike` y `meta` a `docs/referencias/design-md/*.md` (nombre
  distinto de `DESIGN.md`), citarlos en `/impeccable shape` «como referencia de
  estructura y componentes de comercio, no de paleta ni tipografía», generar el
  propio con `document` y archivarlos.

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

Segunda tanda, con las mismas filas donde aplican y las que aportan de nuevo:

| Capacidad                                        | `vercel-labs/agent-skills`                                               | `frontend-design`        | huashu-design                            | awesome-design-md                     |
| ------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------ | ---------------------------------------- | ------------------------------------- |
| Restricciones base al editar UI                  | ◐ `web-design-guidelines` (93 reglas, red)                               | ◐ suelo de calidad       | ✗ (HTML suelto)                          | ✗                                     |
| Auditoría UX/diseño de solo lectura              | ✅ `web-design-guidelines` (`archivo:línea`)                             | ✗                        | ◐ revisión 6D de capturas                | ✗                                     |
| Rendimiento React/Next (waterfalls, bundle, RSC) | ✅ `vercel-react-best-practices` (72 reglas; sin `use cache`)            | ✗                        | ✗                                        | ✗                                     |
| Composición de componentes                       | ✅ `vercel-composition-patterns`                                         | ✗                        | ✗                                        | ✗                                     |
| Transiciones de ruta / elemento compartido       | ✅ `vercel-react-view-transitions` (recomendada por la doc de Next 16.3) | ✗                        | ◐ animación de marketing (GSAP)          | ✗                                     |
| Animación: valores, curvas                       | ◐ recetas (con `ease-in` y blur: no aquí)                                | ◐ «una sola apuesta»     | ◐ pitfalls destilados                    | ✗                                     |
| Accesibilidad                                    | ✅ dentro de las 93 reglas                                               | ◐ foco, reduced-motion   | ✗                                        | ✗                                     |
| Sistema de diseño persistente (`DESIGN.md`)      | ✗                                                                        | ◐ plan de tokens efímero | ◐ `brand-spec.md` propio                 | ✅ 74 ajenos (no generan el propio)   |
| Dirección estética / anti-«slop»                 | ✗                                                                        | ✅ (2,4k tokens)         | ✅ tres direcciones obligatorias         | ◐ como referencia                     |
| Prototipos / decks / vídeo / infografías         | ✗                                                                        | ✗                        | ✅ único (MP4+BGM+SFX, PPTX, marcos)     | ✗                                     |
| Despliegue y coste en Vercel                     | ✅ `deploy-to-vercel` (manual), `vercel-optimize` (métricas)             | ✗                        | ✗                                        | ✗                                     |
| Conoce Base UI / `motion` v13 / Tailwind 4       | ◐ / ✗ (transiciones nativas) / ◐                                         | agnóstica                | ✗ / ✗ (GSAP) / ✗                         | ◐ (los de Vercel/Nike citan Tailwind) |
| Idioma                                           | inglés (copy en inglés en WIG)                                           | inglés                   | **chino** (sin regla de idioma)          | inglés                                |
| Sin dependencias                                 | ◐ red (WIG), CLI `vercel` (deploy/optimize)                              | ✅                       | ✗ ffmpeg, Python, Playwright, TTS Doubao | ✅ (son archivos)                     |

## Solapamientos y quién gana

| Solapan en…                      | Candidatas                                                                                                                           | Elegida y por qué                                                                                                                                                                                |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Anti-«slop», dirección, rediseño | impeccable, taste-skill, `frontend-design`, huashu (tres direcciones), (UI/UX Pro Max)                                               | **impeccable**: nativo de Claude Code (comandos, hooks, detector), no impone fuentes ni paletas, progressive disclosure, y ya contiene las calibraciones de `frontend-design`.                   |
| Sistema visual persistente       | `create-design-md` (UI Skills), `/impeccable document`, stitch (taste), awesome-design-md (ajenos)                                   | **`/impeccable document`** (mismo archivo y misma spec; añade el sidecar). El lint oficial se pasa a mano: `npx @google/design.md lint DESIGN.md`. Los de otras marcas, solo como referencia.    |
| Auditoría de solo lectura        | `improve-ui`, `/impeccable critique` + `audit`, `web-design-guidelines`, `redesign` (taste), revisión 6D (huashu)                    | **impeccable** primero (memoria y puntuación); `web-design-guidelines` como segunda opinión tersa; `improve-ui` duplicaba el flujo.                                                              |
| Animación (valores)              | `animate`/`review-animations` (Emil), `/impeccable animate`, recetas de `vercel-react-view-transitions`, `--motion` (Pro Max), taste | **Emil**: numérico, recetas Base UI, revisor manual. impeccable aporta la «tesis»; Vercel la **estructura** de las transiciones de ruta (Emil no las cubre); sus recetas con `ease-in`/blur, no. |
| Rendimiento                      | `vercel-react-best-practices`, `/impeccable optimize`, `fixing-motion-performance`, `vercel-optimize`                                | Capas distintas: **Vercel** manda en código React/RSC/datos, impeccable en lo visual, `fixing-motion-performance` en animación, `vercel-optimize` (cuando haya tráfico) en coste de plataforma.  |
| Accesibilidad                    | `fixing-accessibility`, `/impeccable audit`, `harden`, `web-design-guidelines`                                                       | `fixing-accessibility` para arreglos mínimos, `audit` para el pase completo, WIG como segunda opinión; el árbitro son las E2E con axe.                                                           |
| Limpieza rápida de UI            | `baseline-ui`, `/impeccable polish`                                                                                                  | Las dos, en orden: `baseline-ui` (0,9k tokens) primero, `polish` para afinar.                                                                                                                    |
| Composición de componentes       | `vercel-composition-patterns`, `pick-ui-library`                                                                                     | No compiten: uno estructura componentes propios, otro elige librería; la regla «`render`, no `asChild`» de Base UI prevalece.                                                                    |

Tres contradicciones concretas que se resolvieron por escrito en `design-workflow`:

- **Curvas y duraciones**: `baseline-ui` dice «NEVER introduce custom easing
  curves unless explicitly requested» y «NEVER exceed 200ms for interaction
  feedback»; Emil exige tres curvas exactas y da 200–500 ms a modales; impeccable
  propone `cubic-bezier(0.16, 1, 0.3, 1)` y hasta 800 ms para una entrada focal;
  las recetas de View Transitions usan `ease-in` en salidas. Regla: mandan los
  valores de Emil; los 200 ms de `baseline-ui` son para hover/press; las curvas
  se definen una vez como tokens propios en `@theme inline` (`--ease-out-quart`,
  `--ease-in-out-quart`) para no pisar los `--ease-out`/`--ease-in-out` que
  Tailwind 4 ya trae con otros valores.
- **`prefers-reduced-motion`**: UI/UX Pro Max y taste-skill lo tratan como
  «cero movimiento»; Emil e impeccable como «menos y más suave». Regla del
  proyecto: se reduce el movimiento ambiental y no se anula la respuesta a un
  clic (el vídeo del retrato), porque el dueño navega con `reduce` activo y ya
  se rompió una vez.
- **Reglas de Vercel que Next 16.3 contradice**: `dynamic(..., { ssr: false })`
  en un Server Component (la doc local lo prohíbe; solo en `"use client"`) y
  `optimizePackageImports` para `lucide-react` (ya viene por defecto). Para
  `use cache` y Cache Components manda la doc de `node_modules/next/dist/docs/`.

## Encaje con este stack, en concreto

| Tema                                | Fricción encontrada                                                                                                                                                            | Cómo se resolvió                                                                                                                     |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Next.js 16 (App Router, `proxy.ts`) | Ninguna skill sabe de `proxy.ts`; impeccable live busca `app/layout.tsx` y aquí el `<body>` está en `src/app/[locale]/layout.tsx`; `vercel-optimize` solo mira `middleware.ts` | `.impeccable/live/config.json` apunta al layout de `[locale]`; `fixing-metadata` usa la Metadata API; `vercel-optimize` no instalada |
| View Transitions en Next 16.3       | La referencia de Vercel aún pide `experimental.viewTransition`                                                                                                                 | La doc local confirma «no configuration» y sin `react@canary`; anotado en `design-workflow`                                          |
| Tailwind 4 CSS-first                | UI/UX Pro Max genera `tailwind.config`; Emil pisa `--ease-out`                                                                                                                 | No instalada; tokens de easing con nombre propio; `DESIGN.md` documenta `@theme inline`                                              |
| shadcn sobre Base UI                | taste-skill y `ui-styling` piensan en Radix                                                                                                                                    | No instaladas; regla «`render`, no `asChild`» en `design-workflow`; recetas de Emil ya son Base UI                                   |
| `motion` v13                        | `emil-design-eng` importa `framer-motion`; Pro Max, taste y huashu empujan GSAP                                                                                                | No instaladas; regla «paquete `motion`, nunca framer-motion ni GSAP»; las transiciones de ruta van con `<ViewTransition>` nativo     |
| next-intl (es/en) y español         | taste-skill veta la raya; el bloque de copy de las Web Interface Guidelines es inglés; huashu no tiene regla de idioma                                                         | Regla «todo texto en `messages/es.json` y `en.json`»; la raya y las «» son correctas; WIG sin su bloque de copy; huashu no instalada |
| next-themes (oscuro por defecto)    | Presets de taste-skill son de un solo tema claro                                                                                                                               | No instalados; `DESIGN.md` lleva las dos paletas                                                                                     |
| Fuentes por `next/font/local`       | Detector de impeccable considera Montserrat «sobreusada»; `frontend-design` pide «not the same families you would reach for»                                                   | `npx impeccable ignores add-value overused-font Montserrat`; `frontend-design` no instalada                                          |
| Despliegue en Vercel                | `deploy-to-vercel` puede commitear/pushear y subir el proyecto a un endpoint externo                                                                                           | Solo manual (`skillOverrides`), con reglas: previews, nunca commit/push/tarball                                                      |
| Windows sin Python ni ffmpeg        | UI/UX Pro Max inservible; huashu sin vídeo; `skill.sh` de taste usa `declare -A`                                                                                               | No instaladas; el resto es Node o Markdown puro                                                                                      |
| Toolchain del repo                  | Prettier/ESLint/knip tocarían más de 250 archivos vendor; lint-staged formatearía los `.mjs` de impeccable                                                                     | `.claude/skills/` ignorado en `.prettierignore`, `eslint.config.mjs` y `knip.json` (la skill propia sí se formatea)                  |

## Uso en producción: coste, dependencias y riesgos

| Colección         | Tokens fijos (descripciones) | Tokens al activarse                             | Dependencias                                                   | Ejecuta código                                  | Red / claves                                                                               | Huella en el repo        |
| ----------------- | ---------------------------: | ----------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------ |
| UI Skills (4)     |                         ≈250 | 0,9–1,4k cada una                               | Ninguna                                                        | No                                              | No                                                                                         | 18 KB                    |
| Emil (3)          |                         ≈250 | 1,1–2,9k (+2–2,5k de referencia bajo demanda)   | Ninguna                                                        | No                                              | No                                                                                         | 40 KB                    |
| impeccable        |                         ≈150 | 2,75k + contexto (≈6–7k) + comando (1–11k)      | Node ≥ 22.18; Chrome opcional (`detect <url>`, `live`)         | Sí: `context.mjs`, detector, hooks (~0,2–0,6 s) | Versión diaria y ping de dirección (desactivables); imágenes con `OPENAI_API_KEY` opcional | 3,4 MB / 148 archivos    |
| Vercel (5)        |                         ≈450 | 0,3–3,6k + reglas bajo demanda (hasta 27k)      | `web-design-guidelines`: red; `deploy-to-vercel`: CLI `vercel` | `deploy-to-vercel` sí (manual)                  | WIG descarga reglas de `main`; deploy usa tu sesión de Vercel                              | 680 KB / 100 archivos    |
| taste-skill       |                      ≈1.100* | ≈22k la principal                               | Ninguna                                                        | No                                              | Sugiere CDN externos                                                                       | 302 KB*                  |
| UI/UX Pro Max     |                        ≈675* | 4–13,5k                                         | **Python 3**, Gemini para imágenes                             | Sí: `search.py`, generadores                    | Gemini, Pexels/Unsplash                                                                    | 4,6–23 MB*               |
| `frontend-design` |                         ≈83* | ≈2,4k                                           | Ninguna                                                        | No                                              | No                                                                                         | 8 KB*                    |
| huashu-design     |                        ≈110* | ≈16k + 20–45k de referencias (50–60k por flujo) | Playwright, **ffmpeg**, Python, `pptxgenjs`, HyperFrames       | Sí: render, export, hook opcional               | TTS Doubao y Ark (opcionales), Wikimedia, logos por curl                                   | 33 MB* (global)          |
| awesome-design-md |                            0 | 5–11k por archivo leído                         | Ninguna                                                        | No                                              | No                                                                                         | 0 (referencias en docs/) |

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
  rendimiento > valores de Emil para movimiento > dirección de impeccable; en
  código React/RSC manda `vercel-react-best-practices`) y lista las reglas de
  Next 16 / Tailwind 4 / Base UI / motion v13 / Vercel.
- **`CLAUDE.md`**: tabla de skills y reglas duras, siempre en contexto.
- **`.claude/settings.local.json` → `skillOverrides`**: `deploy-to-vercel` en
  `user-invocable-only` (Claude no la ve; el dueño la invoca con
  `/deploy-to-vercel`). Es el mecanismo recomendado (doc oficial de Claude Code)
  para tener una skill instalada sin que se autoactive, y el que se propone para
  `frontend-design` y huashu-design en la e-shop.

Flujo típico: leer `DESIGN.md` → diagnóstico (`/impeccable critique` o `audit`)
→ construir bajo `baseline-ui` (+ `animate` si hay movimiento; transiciones de
ruta con `vercel-react-view-transitions`; datos y RSC según
`vercel-react-best-practices`) → revisar (`/review-animations`, `fixing-*`,
`web-design-guidelines`, avisos del hook) → verificar (`pnpm lint && pnpm
typecheck && pnpm test`, MCP de Playwright en los dos temas, `pnpm test:e2e`) →
si cambió el sistema, actualizar `DESIGN.md` en el mismo commit.

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
# Vercel (los nombres son los `name:` del frontmatter, no las carpetas)
npx skills@latest add vercel-labs/agent-skills -a claude-code -s vercel-react-best-practices -s vercel-composition-patterns -s web-design-guidelines -s vercel-react-view-transitions -s deploy-to-vercel --copy -y
```

- **Actualizar**: `npx impeccable update` (compara hashes con el bundle remoto)
  y `npx skills update` (usa `skills-lock.json`). Después, revisar el diff:
  son código vendor y Prettier/ESLint/knip los ignoran a propósito.
- **Hook de impeccable**: vive en `.claude/settings.local.json` (donde lo escribe
  su instalador; en este repo ese archivo está versionado). `/impeccable hooks
off|on|status`; falsos positivos con `npx impeccable ignores add-value <regla>
<valor> --reason "…"`.
- **Modo solo-manual**: `"skillOverrides": { "<skill>": "user-invocable-only" }`
  en `.claude/settings.local.json` (el menú `/skills` lo escribe con `Espacio`);
  no vale para skills de plugins.
- **Desinstalar**: borrar la carpeta en `.claude/skills/`, su entrada en
  `skills-lock.json` y, para impeccable, las entradas `hooks` de
  `settings.local.json`, `.impeccable/` y el bloque de `.gitignore`.
- **Puppeteer**: `npx impeccable` instala Puppeteer como dependencia opcional y
  descarga Chrome (≈700 MB) en `~/.cache/puppeteer`; solo lo usa `detect <url>`.
  Se puede borrar esa caché sin romper nada más.

## UI/UX Pro Max y Python: ¿merece la pena?

**No, no por esta skill.** Evidencia, medida sobre el clon (v2.15.0) y ejecutando
su buscador con el `C:\Python310` suelto de la máquina:

- **Cobertura de e-commerce en sus datos**: `ui-reasoning.csv` tiene 192 filas
  y 12 tocan comercio; la fila «E-commerce» entera es «Feature-Rich Showcase»,
  estilo «Vibrant & Block-based», «Brand primary + Success green», «Card hover
  lift (200ms)» y la regla `if_conversion_focused → add-urgency-colors`, con la
  columna `Reasoning` vacía. `colors.csv`: tres paletas (E-commerce, E-commerce
  Luxury, Marketplace P2P); no existen «Retail» ni «Checkout».
  `ux-guidelines.csv` (119 guías): **ninguna** de e-commerce (lo más cercano:
  autocompletado, «no results», reutilizar la dirección de envío, un badge «3
  items in cart»). Los dos estilos «de conversión» están marcados `deprecated`.
- **El buscador**: rápido (0,3–0,8 s) pero se desvía: «e-commerce marketplace
  product catalog checkout» devuelve la paleta «Pharmacy green + trust blue»;
  `"checkout" --domain ux` → 0 resultados; `"cart"` → 0; `"reviews ratings"` → 0.
  Lo único diferencial es `--stack nextjs/shadcn` (filas al día sobre `use
cache`, `cacheComponents`, `proxy.ts`, Base UI), y eso ya está en
  `node_modules/next/dist/docs/` y en las skills de Vercel.
- **Coste real de habilitar Python** (si algún día hace falta por otro motivo):
  `uv self update && uv python install 3.13 --default` (instala `python.exe` en
  `~/.local/bin`, ya en PATH) **y** desactivar los alias de la Store en
  Configuración → Aplicaciones → Alias de ejecución (WindowsApps va antes en el
  PATH); o `winget install --id Python.Python.3.13 -e`. Reutilizar `C:\Python310`
  (2021, EOL en octubre de 2026) solo vale para pruebas. Sin Python, `npx
ui-ux-pro-max-cli init --ai claude` deja una skill que obliga al agente a
  parar y pedir que lo instales.

| Opción                                                                    | Valor portfolio | Valor e-shop | Coste                                                             | Riesgo                                                                  | Tokens                                      |
| ------------------------------------------------------------------------- | --------------- | ------------ | ----------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------- |
| Instalar Python + UI/UX Pro Max en el proyecto                            | Bajo            | Bajo-medio   | uv/winget + alias de la Store + `uipro update`; 3,7 MB en el repo | Mis-routes, otra «autoridad» que compite con impeccable/design-workflow | +4k por activación, +6k con quick-reference |
| No instalarla; impeccable + ui-skills + Emil + Vercel (+ MCP de comercio) | Alto            | Alto         | Cero adicional                                                    | Bajo                                                                    | Solo lo ya cargado                          |
| Python global (uv) para pruebas puntuales, skill fuera del repo           | Nulo            | Bajo         | `uv python install 3.13 --default` + alias off                    | Bajo                                                                    | Cero en sesiones normales                   |

## Para una e-shop «a nivel de Amazon» con Vercel + Next.js 16 + Claude Code

Lo que decide una tienda así no es una skill de diseño sino el motor de comercio
y la caché; las skills de diseño ya instaladas se reutilizan tal cual (impeccable
en modo _Operate_ para PLP/PDP/carrito/checkout, `baseline-ui`, `fixing-*`, Emil,
Vercel). Verificado el 15 de agosto de 2026:

| Capa                 | Opción                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Notas                                                                                                                                                                                                                                                                                                                               |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Motor de comercio    | **Shopify headless** con [Next.js Commerce](https://github.com/vercel/commerce) como referencia (Next 15.6 canary con `ppr`/`useCache`, solo Shopify mantenido por Vercel; forks para Medusa/Saleor/BigCommerce), **Medusa v2** ([`nextjs-starter-medusa`](https://github.com/medusajs/nextjs-starter-medusa), lo más «Amazon-like» por control total y multi-vendor) o **Saleor** (su [storefront](https://github.com/saleor/storefront) ya va en Next 16.2 / React 19.2) | Tooling oficial: `claude mcp add --transport stdio shopify-dev-mcp -- npx -y @shopify/dev-mcp@latest` + [`Shopify/agent-skills`](https://github.com/Shopify/agent-skills) (15 skills); [`medusa-agent-skills`](https://github.com/medusajs/medusa-agent-skills) + MCP de docs; [`saleor-mcp`](https://github.com/saleor/saleor-mcp) |
| Pagos                | Stripe MCP remoto (`claude mcp add --transport http stripe https://mcp.stripe.com/`) y plugin `stripe@claude-plugins-official`                                                                                                                                                                                                                                                                                                                                             | Skills `stripe-best-practices`, `stripe-docs`, `upgrade-stripe`; no existen «stripe-checkout» ni «stripe-payments» oficiales                                                                                                                                                                                                        |
| Búsqueda             | Algolia ([`algolia/mcp-servers`](https://github.com/algolia/mcp-servers)) o Meilisearch ([`meilisearch-mcp`](https://github.com/meilisearch/meilisearch-mcp))                                                                                                                                                                                                                                                                                                              | Typesense sin MCP oficial                                                                                                                                                                                                                                                                                                           |
| Next 16 y caché      | Skills oficiales de [`vercel/next.js`](https://github.com/vercel/next.js/tree/canary/skills): `next-cache-components-adoption`, `next-cache-components-optimizer`, `next-partial-prefetching-adoption`, `next-dev-loop`; MCP `next-devtools-mcp` (`/_next/mcp`)                                                                                                                                                                                                            | La doc local de 16.3.1 (`incremental-static-regeneration-cache-components.md`) describe justo el caso PLP/PDP: `cacheComponents: true` + `partialPrefetching: true` + `use cache: remote`; `vercel-react-best-practices` para waterfalls y bundle                                                                                   |
| Plataforma y coste   | `vercel-optimize` (cuando el proyecto esté enlazado y tenga tráfico; su playbook `ecommerce.md` ya nombra ISR agresivo en catálogo e imágenes, y checkout dinámico con llamadas paralelas), `chrome-devtools-mcp` para trazas LCP/INP/CLS                                                                                                                                                                                                                                  | No instalar `vercel-optimize` antes: exige Observability Plus y datos                                                                                                                                                                                                                                                               |
| Diseño y conversión  | impeccable (`init` → `PRODUCT.md`; `shape` con modo _Operate_; `critique` trae personas de checkout; `harden`), `web-design-guidelines`, skill [`cro`](https://github.com/coreyhaines31/marketingskills/blob/main/skills/cro/SKILL.md) de marketingskills (propuesta de valor, CTA, trust signals; landing/pricing, no checkout), [Baymard](https://baymard.com/research/checkout-usability) como criterio de checkout/PDP                                                 | skills.sh no tiene categoría «ecommerce»; los packs específicos (`finsilabs/awesome-ecommerce-skills`, `mardab96/ecommerce-claude-skills`) tienen poca adopción y calidad desigual                                                                                                                                                  |
| Referencias visuales | `awesome-design-md/nike` y `/meta` en `docs/referencias/` (estructura de componentes de comercio, no paleta), `frontend-design` en modo solo-manual para el brief de marca, huashu-design global y solo-manual para prototipos clicables de PDP/checkout y vídeo de lanzamiento (con ffmpeg)                                                                                                                                                                               | shadcn no tiene bloques oficiales de e-commerce; comunitarios: `stackzero-labs/ui`, CommerCN, ShadcnStore                                                                                                                                                                                                                           |

## Skills que no se pidieron y conviene considerar

Verificadas el 15 de agosto de 2026 (existen, están activas, comando de
instalación probado en la doc). Ordenadas por impacto para este proyecto:

| #   | Qué                                                                                                                                                                                         | Origen                                                           | Aporta                                                                                                                                                  | Instalación                                                                                                                                                |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | [`next-devtools-mcp`](https://github.com/vercel/next-devtools-mcp) + skills de [`vercel/next.js`](https://github.com/vercel/next.js/tree/canary/skills) (`next-dev-loop`, cache components) | Oficial (Next.js)                                                | Errores, rutas, logs y compilación del dev server en vivo vía `/_next/mcp` (Next 16+); docs empaquetadas; bucle editar→verificar                        | `claude mcp add --transport stdio next-devtools --scope project -- npx -y next-devtools-mcp@latest`; `npx skills add vercel/next.js --skill next-dev-loop` |
| 2   | [`vercel-labs/agent-skills`](https://github.com/vercel-labs/agent-skills)                                                                                                                   | Oficial (Vercel)                                                 | **Ya instaladas** las cinco útiles (ver arriba); `vercel-optimize` queda para la e-shop                                                                 | Hecho                                                                                                                                                      |
| 3   | [Skill y MCP de shadcn](https://ui.shadcn.com/docs/skills)                                                                                                                                  | Oficial (shadcn)                                                 | Detecta `base-nova` con `shadcn info --json`; reglas Base UI vs Radix (`render`/`asChild`), Field/InputGroup, registries                                | `npx skills add shadcn/ui`; `pnpm dlx shadcn@latest mcp init --client claude`                                                                              |
| 4   | [Motion AI Kit](https://motion.dev/docs/ai-kit) (`npx motion-ai`)                                                                                                                           | Oficial (Motion)                                                 | Docs exactas de `motion` 13, consejos para Base UI, springs CSS `linear()`; complementa a Emil (él decide _si/qué_, esto dice _cómo_ con la API actual) | `npx motion-ai` (elige Claude Code + proyecto)                                                                                                             |
| 5   | [`chrome-devtools-mcp`](https://github.com/ChromeDevTools/chrome-devtools-mcp)                                                                                                              | Oficial (Google Chrome)                                          | Trazas LCP/INP/CLS con insights, red, consola con source maps, árbol de accesibilidad; mediciones reales, no reglas                                     | `/plugin install chrome-devtools-mcp@claude-plugins-official`                                                                                              |
| 6   | [`modern-web-guidance`](https://github.com/GoogleChrome/modern-web-guidance)                                                                                                                | Oficial (Chrome + Edge)                                          | Guías Baseline por caso de uso (View Transitions, `@starting-style`, popover, scroll-driven, `text-wrap: balance`, INP), ≈1k tokens por consulta        | `/plugin install modern-web-guidance@claude-plugins-official`                                                                                              |
| 7   | [`context7`](https://github.com/upstash/context7)                                                                                                                                           | Plugin oficial (Anthropic/Upstash)                               | Docs al día de lo que no tiene skill oficial: next-intl 4, Tailwind 4, Base UI 1.x, motion                                                              | `/plugin install context7@claude-plugins-official`                                                                                                         |
| 8   | [`web-quality-skills`](https://github.com/addyosmani/web-quality-skills) (`seo`, `core-web-vitals`)                                                                                         | Comunidad (Addy Osmani)                                          | SEO técnico con JSON-LD/hreflang (complementa `fixing-metadata`), umbrales de CWV                                                                       | `npx skills add addyosmani/web-quality-skills --skill core-web-vitals --skill seo -g`                                                                      |
| 9   | [`react-doctor`](https://github.com/millionco/react-doctor)                                                                                                                                 | Comunidad (Million)                                              | Escáner determinista de React 19/Next; comenta en PRs                                                                                                   | `npx react-doctor@latest` → `npx react-doctor@latest install`                                                                                              |
| 10  | [`next-safe-action/skills`](https://github.com/next-safe-action/skills)                                                                                                                     | Mantenedores de la librería (repo joven, sin licencia declarada) | Server actions v8 + Zod 4: el formulario de contacto                                                                                                    | `npx skills add next-safe-action/skills --skill safe-action-client --skill safe-action-forms --skill safe-action-validation-errors`                        |
| 11  | [`typescript-lsp`](https://github.com/anthropics/claude-plugins-official), [`superpowers`](https://github.com/obra/superpowers)                                                             | Oficial / comunidad                                              | Diagnósticos de tipos tras cada edición; metodología brainstorm→plan→TDD                                                                                | `/plugin install typescript-lsp@claude-plugins-official`; `/plugin install superpowers@claude-plugins-official`                                            |

Comprobado que **no existen** (para no buscarlos): skill oficial de Tailwind
(sin `skills/` ni `llms.txt`; discusión tailwindlabs/tailwindcss#19594 sin
respuesta), skill oficial de next-intl, y `next-best-practices`/`next-upgrade`
como skills (Vercel las retiró: desde Next 16.2 la documentación va en
`node_modules/next/dist/docs/` y `next dev` escribe el bloque de `AGENTS.md`).
