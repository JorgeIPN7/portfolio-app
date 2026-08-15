# portfolio-app

CV y portfolio de Jorge Herminio López Vázquez. Página única, estática, en
español e inglés, con tema claro/oscuro, formulario de contacto y descarga del
CV en PDF.

## Requisitos

- **Node 22.23.2** (fijado en `.nvmrc` y en `engines`)
- **pnpm 11+** (fijado en `packageManager`)

```bash
nvm use          # toma la versión de .nvmrc
pnpm install     # instala dependencias y engancha el hook de pre-commit
pnpm dev         # http://localhost:3000
```

## Scripts

| Script              | Qué hace                                   |
| ------------------- | ------------------------------------------ |
| `pnpm dev`          | Servidor de desarrollo con Turbopack       |
| `pnpm build`        | Build de producción                        |
| `pnpm start`        | Sirve el build                             |
| `pnpm lint`         | ESLint                                     |
| `pnpm typecheck`    | `tsc --noEmit`                             |
| `pnpm format`       | Prettier sobre todo el repo (escribe)      |
| `pnpm format:check` | Prettier en modo comprobación (no escribe) |
| `pnpm knip`         | Archivos, exports y dependencias sin usar  |
| `pnpm test`         | Pruebas unitarias con Vitest               |
| `pnpm test:watch`   | Vitest en modo observación                 |
| `pnpm test:e2e`     | Playwright (levanta el servidor él solo)   |

## Estructura

```text
messages/              Textos de interfaz por idioma (es.json, en.json)
src/
  actions/             Server Actions ("use server")
  app/
    [locale]/          Rutas traducidas: layout, CV, proyectos, OG image
    sitemap.ts         Fuera de [locale]: no llevan idioma
    robots.ts
  components/          Componentes propios (los de cliente marcados "use client")
    ui/                Componentes de shadcn
    icons/             SVG de marca (lucide 1.x ya no los trae)
  data/
    resume-data.ts     Tipos y acceso por idioma
    resume-data.es.ts  Contenido del CV en español
    resume-data.en.ts  … y en inglés
  fonts/               Montserrat y Playfair Display servidas por next/font
  i18n/                Enrutado, navegación y configuración por petición
  lib/                 Configuración del sitio y utilidades
  env.ts               Esquema de variables de entorno
  proxy.ts             Negociación de idioma (el antiguo middleware.ts)
public/                PDF del CV, retrato y vídeo del retrato
docs/                  Documentos de trabajo (comparativa de skills de diseño)
.claude/skills/        Skills de diseño para agentes (vendor) y design-workflow
.impeccable/           Configuración compartida de impeccable
DESIGN.md              Sistema visual documentado (lo leen las skills)
PRODUCT.md             Verdad de producto (la lee impeccable)
```

Para cambiar el contenido del CV se editan `src/data/resume-data.es.ts` y
`src/data/resume-data.en.ts`: el tipo `ResumeData` marca el error si falta un
campo o sobra uno, y hay pruebas que comprueban que las dos versiones no se
separen.

## Idiomas

El CV existe en español e inglés. El enrutado es asimétrico a propósito:

| Idioma  | URL   |
| ------- | ----- |
| Español | `/`   |
| Inglés  | `/en` |

El español no lleva prefijo porque el CV ya vivía en `/` y esa URL puede estar
enlazada o indexada; con el modo `always` de next-intl pasaría a redirigir a
`/es` y habría que ir a recoger los enlaces rotos.

Quien llega sin haber elegido nada aterriza en el idioma que pida su navegador
(`accept-language`). La elección manual se guarda en cookie y gana sobre eso.
Lo gestiona `src/proxy.ts`, que en Next 15 se habría llamado `middleware.ts`.

Dónde vive cada cosa:

- **`messages/*.json`** — textos de interfaz: encabezados de sección, botones,
  errores del formulario. Los tipa `global.d.ts` a partir del catálogo español,
  así que una clave inventada es un error de compilación.
- **`src/data/resume-data.*.ts`** — el contenido del CV. No va en `messages/`
  porque son estructuras anidadas y tipadas; en un JSON plano se perdería la
  garantía de que a la traducción no le falte un empleo.

Al añadir un idioma hay que tocar `src/i18n/routing.ts`, crear su JSON y su
`resume-data.<locale>.ts`, y traducir `src/data/projects.ts`. Las pruebas
señalan lo que falte. El conmutador de la esquina alterna entre dos idiomas;
con un tercero habría que convertirlo en desplegable.

**Limitación conocida:** el PDF descargable es único y está en español. Quien
lea el CV en inglés se descargará la versión española.

## Formulario de contacto

Al final del CV. Valida en el servidor con zod a través de next-safe-action y
envía por Resend.

Sin `RESEND_API_KEY` no manda nada: en desarrollo vuelca el mensaje por consola
—suficiente para probar el recorrido entero sin dar de alta ninguna cuenta— y
en producción responde con un error que invita a escribir al correo directo.
Fingir el envío perdería mensajes en silencio.

El remitente por defecto es `onboarding@resend.dev`, el buzón de pruebas de
Resend: funciona sin verificar ningún dominio, pero **solo entrega al correo de
la cuenta**, que es justo lo que hace falta aquí. Con dominio propio verificado,
`CONTACT_FROM_EMAIL`.

Contra robots hay dos cosas, ninguna infalible:

- Un campo señuelo oculto (`website`). Si viene relleno, la acción responde que
  todo fue bien y no envía nada: un error le enseñaría al robot qué evitar.
- Un límite de 3 mensajes por IP y hora, **en memoria**. En Vercel cada
  instancia tiene la suya, así que reparte cupo y se borra en cada despliegue.
  Frena a un robot torpe, no a uno serio. Para eso haría falta un almacén
  compartido (Vercel KV, Upstash) o un captcha.

En desarrollo el límite no se aplica: estorbaría a las pruebas E2E y no hay
nada que proteger. La función tiene sus propias pruebas unitarias.

## Proyectos

`/proyectos` es una sección en MDX: cada caso es un `page.mdx` bajo
`src/app/[locale]/proyectos/<slug>/`, y `src/data/projects.ts` guarda lo que se
ve en el listado. Los estilos del Markdown salen de `src/mdx-components.tsx`.

Para publicar un caso:

1. Copia `src/app/[locale]/proyectos/plantilla/` a
   `src/app/[locale]/proyectos/<tu-slug>/` y escribe el contenido. La plantilla
   trae la estructura de un caso: problema, decisiones y resultado.
2. Añade su entrada a `projects` en `src/data/projects.ts` con el mismo slug,
   con el título y el resumen en los dos idiomas.
3. Quita `draft: true` y borra el `robots` del `metadata` del MDX.

**Limitación conocida:** el listado sí está traducido, pero el MDX de cada caso
es un único archivo y se sirve igual en los dos idiomas. Traducirlo requiere
separar el contenido por idioma, y no compensa hacerlo antes de tener un caso
real que traducir.

Mientras no haya ningún caso publicado, el índice no se enlaza desde el CV ni
entra en el `sitemap.xml`: una página vacía indexada no ayuda a nadie.

## Calidad

| Herramienta    | Qué vigila                                           | Cuándo corre                        |
| -------------- | ---------------------------------------------------- | ----------------------------------- |
| Prettier       | Formato, incluido el orden de las clases de Tailwind | Al commitear y con `pnpm format`    |
| ESLint         | Reglas de Next y de TypeScript                       | Al commitear y con `pnpm lint`      |
| `tsc --noEmit` | Tipos del proyecto entero                            | Al commitear y con `pnpm typecheck` |
| knip           | Archivos, exports y dependencias sin usar            | A mano, con `pnpm knip`             |
| Vitest         | Lógica y componentes en aislamiento                  | A mano, con `pnpm test`             |
| Playwright     | Que la página siga funcionando de verdad             | A mano, con `pnpm test:e2e`         |

### Pruebas

Los tests unitarios viven junto al código que prueban (`src/**/*.test.ts?(x)`)
y los E2E en `e2e/`. Vitest excluye `e2e/` a propósito: esos los corre
Playwright.

Qué cubre cada uno:

- **Vitest** — `cn()`, el proveedor de tema (persistencia, clase del `<html>`,
  fallo fuera del provider), los iconos de marca, el limitador de peticiones,
  el esquema de variables de entorno y los invariantes de `resume-data`: URLs
  válidas, campos sin vaciar, unicidad de las claves que `page.tsx` usa como
  `key` de React, y que las dos traducciones no se separen. También la paridad
  de los catálogos de `messages/`: mismas claves, mismos `{marcadores}` y
  ningún texto vacío.
- **Playwright** — el ciclo completo del retrato al cambiar de tema, la
  persistencia tras recargar, el enrutado de idiomas (negociación, conmutador,
  `hreflang`, canonical, sitemap), el formulario de contacto en los dos idiomas
  y accesibilidad con axe (WCAG 2.1 AA) en ambos temas y ambos idiomas, porque
  el contraste de la paleta clara y la oscura es distinto y el marcado inglés
  también lo es.

Dos detalles del arranque de Playwright, ambos aprendidos rompiendo algo:

- El contexto va fijado a `es-MX`. Playwright arranca en `en-US` y el proxy
  negocia por `accept-language`, así que sin fijarlo cada `page.goto("/")`
  acabaría en la versión inglesa. La prueba que sí quiere negociación se crea
  su propio contexto.
- Las pruebas de accesibilidad esperan a que terminen las animaciones de
  `Reveal` antes de llamar a axe. Analizar a mitad de la aparición producía 50
  violaciones de `color-contrast` que se iban solas medio segundo después: un
  fallo que aparecía o no según lo cargada que estuviera la máquina.

Playwright usa el Chrome del sistema, no el Chromium que él descarga: ese viene
sin códecs propietarios y no decodifica el vídeo del retrato. Reutiliza el
servidor del puerto 3000 si ya lo tienes abierto.

Los async Server Components no se prueban con Vitest —React aún no lo
soporta—; para eso está el E2E, tal y como recomienda la guía de Next.

El hook de pre-commit lo engancha husky en cada `pnpm install`, vía el script
`prepare`: en un clon recién hecho no hay hooks hasta que instalas. Corre, en
este orden, formato y lint sobre lo indexado, el typecheck del proyecto
completo y las pruebas unitarias: unos 11 segundos. Los E2E se quedan fuera
porque levantan un servidor y tardan demasiado para cada commit. Para
saltárselo en un caso puntual, `git commit --no-verify`.

No se usa `eslint-config-prettier` a propósito: la configuración de ESLint de
este repo activa 87 reglas y ninguna es de formato, así que no habría nada que
desactivar.

El orden de las clases de Tailwind lo pone `prettier-plugin-tailwindcss`. Como
en Tailwind 4 no hay `tailwind.config`, `prettier.config.mjs` le señala el CSS
de entrada con `tailwindStylesheet`.

### Servidor MCP de Playwright

`.mcp.json` declara el [servidor MCP de Playwright](https://github.com/microsoft/playwright-mcp),
que permite a un agente abrir la página en un navegador real y mirarla: navegar,
hacer capturas y evaluar JavaScript. Aquí no es un lujo — dos regresiones del
retrato pasaron el build, el lint y el typecheck sin que nadie se enterara, y
solo se vieron abriendo el navegador.

Al estar en el repo, va por proyecto y no por ruta absoluta: la configuración
anterior estaba atada a una carpeta concreta del equipo y dejaba de valer al
mover el clon.

Dos decisiones que conviene no deshacer sin querer:

- **`--browser chrome`**, por lo mismo que `playwright.config.ts`: el Chromium
  que descarga Playwright no trae códecs propietarios y no decodifica el H.264
  del retrato (`DEMUXER_ERROR_NO_SUPPORTED_STREAMS`). Sin esta opción, un
  agente vería el póster y concluiría que el vídeo no funciona.
- **Se ejecuta con `npx` y no como `devDependency`**, aunque el resto del repo
  fije versiones. `@playwright/mcp` depende de `playwright` en versión alpha, y
  meterlo en el árbol pondría una alpha junto al `@playwright/test` estable y
  fijado que corre las pruebas. Es una herramienta de desarrollo, fuera del
  build y del sitio publicado; el precio de `@latest` es que no lo vigila
  Renovate.

### Skills de diseño para agentes

Nada del toolchain opina sobre diseño: un componente puede pasar formato, lint,
tipos y pruebas y aun así tener la jerarquía rota, una animación de 800 ms con
`ease-in` o un contraste que axe no mide porque cambia con el tema. Las skills
de `.claude/skills/` le dan al agente (Claude Code) criterio y un contrato
compartido para eso. Se eligieron tras comparar cinco colecciones —el detalle,
con números y descartes, está en [`docs/skills-de-diseno.md`](docs/skills-de-diseno.md)—
y se reparten así:

| Skill                                                                                 | Origen                                                        | Para qué                                                                                                                                                     |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `impeccable`                                                                          | [pbakaus/impeccable](https://github.com/pbakaus/impeccable)   | El flujo principal: `/impeccable critique`, `audit`, `polish`, `harden`, `typeset`, `layout`, `clarify`, `document`… y un detector determinista de 59 reglas |
| `baseline-ui`, `fixing-accessibility`, `fixing-motion-performance`, `fixing-metadata` | [ibelick/ui-skills](https://github.com/ibelick/ui-skills)     | Reglas baratas MUST/NEVER al editar UI y revisores puntuales de accesibilidad, rendimiento de animación y SEO/Open Graph/JSON-LD                             |
| `animate`, `review-animations`, `pick-ui-library`                                     | [emilkowalski/skills](https://github.com/emilkowalski/skills) | La autoridad en animación (curvas y duraciones exactas, recetas para Base UI), el revisor de movimiento y la lista de librerías                              |
| `design-workflow`                                                                     | Propia                                                        | La orquestadora: enruta la tarea, fija quién manda si dos se contradicen y recoge las reglas de Next 16 / Tailwind 4 / Base UI / `motion` v13                |

El pegamento entre ellas son tres archivos versionados: **`DESIGN.md`** (el
sistema visual tal como está implementado, en el
[formato design.md](https://github.com/google-labs-code/design.md); impeccable
lo carga y su detector compara fuentes, colores y radios con él),
**`PRODUCT.md`** (usuarios, propósito y restricciones; impeccable lo pide antes
de criticar o pulir; los datos inferidos están marcados para confirmarlos) y
**`.impeccable/config.json`** (ignores compartidos, hook silencioso). Si un
cambio de diseño se acepta, `DESIGN.md` se actualiza en el mismo commit y se
valida con `npx @google/design.md lint DESIGN.md`.

**Cuándo y cómo.** La skill `design-workflow` se carga sola ante cualquier
tarea de UI y decide; estos son los casos típicos, con lo que se puede pedir:

| Situación                                                        | Qué pedir o invocar                                                            | Qué pasa                                                                                                 |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| «Revisa el diseño de la sección de experiencia»                  | `/impeccable critique src/app/[locale]/page.tsx`                               | Informe de solo lectura (heurísticas, jerarquía, carga cognitiva) con memoria en `.impeccable/critique/` |
| «Pule la columna lateral sin cambiar su identidad»               | `/baseline-ui src/app/[locale]/page.tsx` y después `/impeccable polish`        | Primero el suelo de reglas (espaciado, jerarquía, tipografía), luego el afinado                          |
| «Añade una animación de entrada al formulario»                   | Pedirlo tal cual; `animate` se activa                                          | Decide si animar, con qué (CSS o `motion`), qué propiedades, curva y duración, y lo implementa           |
| Antes de commitear una animación                                 | `/review-animations`                                                           | Bloquea o aprueba con `archivo:línea` contra los estándares de Emil Kowalski                             |
| «El formulario no se entiende con lector de pantalla»            | `/fixing-accessibility src/components/contact-form.tsx`, luego `pnpm test:e2e` | Arreglos mínimos de ARIA, foco y errores; las pruebas con axe son el árbitro                             |
| «Revisa el Open Graph, el canonical y el JSON-LD»                | `/fixing-metadata src/app/[locale]/layout.tsx`                                 | Audita y corrige vía la Metadata API de Next, con `hreflang` por idioma                                  |
| «En inglés los textos largos rompen el layout»                   | `/impeccable harden`                                                           | Estados vacíos, textos extremos, overflow, i18n                                                          |
| Pasada rápida sin agente (o en CI)                               | `npx impeccable detect src`                                                    | El detector determinista, sin LLM; hoy devuelve 0 hallazgos                                              |
| «¿Qué librería uso para un menú de comandos, toasts o gráficos?» | `/pick-ui-library`                                                             | Recomendación curada (aquí ya están Base UI, `motion`, next-themes, lucide)                              |

Cuándo **no**: para trabajo de backend, datos o solo textos no hacen falta (y
`design-workflow` lo dice), y un rediseño de la identidad (`/impeccable init`,
new-work, `bolder`) requiere al dueño presente porque pregunta antes de decidir.

Tres reglas del reparto que conviene conocer porque resuelven contradicciones
reales entre las colecciones: en movimiento mandan los **valores de Emil**
(impeccable aporta el «por qué», no otros números); las curvas propias se
definen como tokens en `@theme inline` con un nombre que no pise los
`--ease-out`/`--ease-in-out` que Tailwind 4 ya trae; y `prefers-reduced-motion`
reduce el movimiento ambiental pero **no anula el vídeo del retrato**, que
responde a un clic. Se descartaron taste-skill (hace lo mismo que impeccable a
22k tokens por activación y prohíbe la serif, lucide y la raya) y UI/UX Pro Max
(su buscador exige Python, que no hay en la máquina); `docs/skills-de-diseno.md`
explica cómo usarlas bajo demanda si algún día hacen falta.

Detalles operativos:

- Las carpetas de terceros en `.claude/skills/` son código vendor: se actualizan
  con `npx impeccable update` y `npx skills update` (`skills-lock.json` guarda
  origen y hash) y **no se editan**. Prettier, ESLint y knip las ignoran a
  propósito; `design-workflow` sí se formatea.
- El hook de impeccable vive en `.claude/settings.local.json`, donde lo escribe
  su instalador: pasa el detector tras cada edición de un archivo de UI y una
  pasada profunda al terminar el turno (≈0,2–0,6 s, nunca bloquea). Está en modo
  silencioso (`.impeccable/config.json`); `/impeccable hooks off` lo apaga y
  `npx impeccable ignores add-value <regla> <valor> --reason "…"` registra un
  falso positivo en la configuración compartida.
- `npx impeccable` instala Puppeteer como dependencia opcional y descarga Chrome
  (≈700 MB) en `~/.cache/puppeteer`; solo lo usa `detect <url>`. Se puede borrar.

### `git blame` y el commit de formato

El reformateo inicial tocó casi todos los archivos. Para que no aparezca como
autor de cada línea, su hash está en `.git-blame-ignore-revs`. GitHub lo lee
solo; en local hay que decírselo a git una vez por clon:

```bash
git config blame.ignoreRevsFile .git-blame-ignore-revs
```

## Variables de entorno

Las valida `src/env.ts` con zod, vía `@t3-oss/env-nextjs`. `next.config.ts`
importa ese módulo, así que **una variable mal puesta rompe el build** en vez
de aparecer como error en la primera visita. La separación servidor/cliente es
la otra mitad del asunto: leer `RESEND_API_KEY` desde un componente de cliente
lanza una excepción en desarrollo en lugar de colar la clave en el bundle.

Ninguna es obligatoria en local: `pnpm dev` y `pnpm build` funcionan sin `.env`.
`.env.example` documenta todas; cópialo a `.env.local`.

| Variable                        | Ámbito   | Cuándo hace falta                          |
| ------------------------------- | -------- | ------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`          | Cliente  | Fuera de Vercel, siempre                   |
| `VERCEL_PROJECT_PRODUCTION_URL` | Servidor | La inyecta Vercel sola                     |
| `RESEND_API_KEY`                | Servidor | Para que el formulario envíe de verdad     |
| `CONTACT_TO_EMAIL`              | Servidor | Opcional; por defecto, el correo del CV    |
| `CONTACT_FROM_EMAIL`            | Servidor | Opcional; por defecto, el buzón de pruebas |

### Dominio

Las URLs absolutas (canonical, sitemap, Open Graph) salen de `src/lib/site.ts`.

**En Vercel no hay que configurar nada, ni siquiera con dominio propio.**
`VERCEL_PROJECT_PRODUCTION_URL` devuelve el dominio de producción más corto del
proyecto, y pasa a ser el tuyo en cuanto lo asignas.

En cualquier otro host hay que definirlo a mano:

```bash
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

Si un despliegue de Vercel no logra resolver la URL, **el build falla** en vez
de publicar el sitemap y el canonical apuntando a `localhost`. La causa
habitual es tener desactivado «Enable access to System Environment Variables»
en los ajustes del proyecto.

Dentro de un despliegue, `RESEND_API_KEY` también pasa a ser obligatoria: el
build falla sin ella en vez de publicar un formulario cuyo botón no hace nada.
En local no se exige, porque nadie debería necesitar una cuenta de Resend para
compilar un CV en su portátil.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript 5.9 · Tailwind CSS 4
· shadcn sobre Base UI · lucide-react · next-themes · motion · next-intl · zod
· @t3-oss/env-nextjs · next-safe-action · Resend

### Tema y animación

El tema lo gestiona **next-themes** con `defaultTheme="dark"` y
`enableSystem={false}`: la página abre siempre en oscuro y solo una elección
guardada la saca de ahí. Es deliberadamente distinto de su comportamiento
habitual, que sigue al esquema del sistema.

**motion** hace dos cosas:

- Rebobina el vídeo del retrato al volver al tema claro, interpolando
  `currentTime` con una curva propia. Antes era un bucle de
  `requestAnimationFrame` que restaba un paso fijo y se notaba a saltos.
- Anima la aparición de las secciones al entrar en pantalla, vía
  `src/components/reveal.tsx`.

`Reveal` lleva dos salvaguardas, porque aquí un fallo no degrada la animación
sino que **esconde el contenido**: un plazo de seguridad que muestra la sección
aunque nunca cruce el viewport (Ctrl+F, teclas de inicio y fin, scroll
programático), y una regla `@media print` que fuerza la opacidad, porque al
imprimir no hay scroll que dispare nada y un CV se imprime.

Las dependencias las mantiene Renovate. `renovate.json5` documenta por qué
`eslint`, `typescript` y `@types/node` tienen un techo de versión: cada uno se
probó y rompe el toolchain. No los subas sin leer ese archivo.
