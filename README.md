# portfolio-app

CV y portfolio de Jorge Herminio López Vázquez. Página única, estática, con
tema claro/oscuro y descarga del CV en PDF.

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

```
src/
  app/                 App Router: layout, página, sitemap, robots, OG image
  components/          Componentes propios (los de cliente marcados "use client")
    ui/                Componentes de shadcn
    icons/             SVG de marca (lucide 1.x ya no los trae)
  data/resume-data.ts  Todo el contenido del CV, tipado con `satisfies ResumeData`
  fonts/               Montserrat y Playfair Display servidas por next/font
  lib/                 Configuración del sitio y utilidades
public/                PDF del CV, retrato y vídeo del retrato
```

Para cambiar el contenido del CV basta con editar `src/data/resume-data.ts`:
el tipo `ResumeData` marca el error si falta un campo o sobra uno.

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
  fallo fuera del provider), los iconos de marca y los invariantes de
  `resume-data.ts`: URLs válidas, campos sin vaciar y unicidad de las claves
  que `page.tsx` usa como `key` de React.
- **Playwright** — el ciclo completo del retrato al cambiar de tema, la
  persistencia tras recargar, y accesibilidad con axe (WCAG 2.1 AA) en los dos
  temas, porque el contraste de la paleta clara y la oscura es distinto.

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

### `git blame` y el commit de formato

El reformateo inicial tocó casi todos los archivos. Para que no aparezca como
autor de cada línea, su hash está en `.git-blame-ignore-revs`. GitHub lo lee
solo; en local hay que decírselo a git una vez por clon:

```bash
git config blame.ignoreRevsFile .git-blame-ignore-revs
```

## Dominio

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

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript 5.9 · Tailwind CSS 4
· shadcn sobre Base UI · lucide-react

Las dependencias las mantiene Renovate. `renovate.json5` documenta por qué
`eslint`, `typescript` y `@types/node` tienen un techo de versión: cada uno se
probó y rompe el toolchain. No los subas sin leer ese archivo.
