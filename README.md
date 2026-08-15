# portfolio-app

CV y portfolio de Jorge Herminio López Vázquez. Página única, estática, con
tema claro/oscuro y descarga del CV en PDF.

## Requisitos

- **Node 22.23.2** (fijado en `.nvmrc` y en `engines`)
- **pnpm 11+** (fijado en `packageManager`)

```bash
nvm use          # toma la versión de .nvmrc
pnpm install
pnpm dev         # http://localhost:3000
```

## Scripts

| Script           | Qué hace                             |
| ---------------- | ------------------------------------ |
| `pnpm dev`       | Servidor de desarrollo con Turbopack |
| `pnpm build`     | Build de producción                  |
| `pnpm start`     | Sirve el build                       |
| `pnpm lint`      | ESLint                               |
| `pnpm typecheck` | `tsc --noEmit`                       |

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

## Dominio

Las URLs absolutas (canonical, sitemap, Open Graph) salen de `src/lib/site.ts`.
En Vercel se resuelven solas; con dominio propio hay que definir:

```bash
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript 5.9 · Tailwind CSS 4
· shadcn sobre Base UI · lucide-react

Las dependencias las mantiene Renovate. `renovate.json5` documenta por qué
`eslint`, `typescript` y `@types/node` tienen un techo de versión: cada uno se
probó y rompe el toolchain. No los subas sin leer ese archivo.
