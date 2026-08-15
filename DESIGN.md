---
version: alpha
name: portfolio-app
description: CV y portfolio de Jorge H. López. Página única, sobria, oscura por defecto, en español e inglés.
colors:
  # Tema claro (`:root` en src/app/globals.css). Los valores son los canónicos del proyecto (OKLCH).
  background: "oklch(1 0 0)"
  foreground: "oklch(0.145 0 0)"
  card: "oklch(1 0 0)"
  primary: "oklch(0.205 0 0)"
  primary-foreground: "oklch(0.985 0 0)"
  secondary: "oklch(0.97 0 0)"
  secondary-foreground: "oklch(0.205 0 0)"
  muted: "oklch(0.97 0 0)"
  muted-foreground: "oklch(0.556 0 0)"
  accent: "oklch(0.97 0 0)"
  accent-foreground: "oklch(0.205 0 0)"
  destructive: "oklch(0.577 0.245 27.325)"
  border: "oklch(0.922 0 0)"
  input: "oklch(0.922 0 0)"
  ring: "oklch(0.708 0 0)"
  # Tema oscuro (`.dark`), el que abre la página. Paleta azul-pizarra en hex, tal cual está en el CSS.
  background-dark: "#0b1120"
  foreground-dark: "#e2e8f0"
  card-dark: "#0f1729"
  primary-dark: "#e2e8f0"
  primary-foreground-dark: "#0b1120"
  secondary-dark: "#1a2332"
  secondary-foreground-dark: "#cbd5e1"
  muted-dark: "#1a2332"
  muted-foreground-dark: "#94a3b8"
  accent-dark: "#1e293b"
  accent-foreground-dark: "#e2e8f0"
  destructive-dark: "oklch(0.704 0.191 22.216)"
  border-dark: "rgba(148, 163, 184, 0.15)"
  input-dark: "rgba(148, 163, 184, 0.2)"
  ring-dark: "#475569"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.025em"
  display-light:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "3rem"
    fontWeight: 300
    lineHeight: 1
    letterSpacing: "0.025em"
  headline:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: "1.75rem"
    letterSpacing: "0.1em"
  title:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: "1.5rem"
  subtitle:
    fontFamily: "Montserrat, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: "1.75rem"
  body:
    fontFamily: "Montserrat, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  body-sm:
    fontFamily: "Montserrat, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.25rem"
  label:
    fontFamily: "Montserrat, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: "1.25rem"
  caption:
    fontFamily: "Montserrat, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: "1rem"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "20px"
  lg: "32px"
  xl: "40px"
  2xl: "56px"
components:
  icon-button:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.muted-foreground}"
    rounded: "{rounded.full}"
    size: "40px"
  icon-button-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.muted-foreground}"
    rounded: "{rounded.full}"
    size: "40px"
  button-outline:
    textColor: "{colors.foreground}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
  button-outline-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
  badge-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    typography: "{typography.caption}"
    rounded: "{rounded.md}"
    padding: "2px 8px"
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
  card-quiet:
    backgroundColor: "{colors.background}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.caption}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
  link-contact:
    textColor: "{colors.muted-foreground}"
    typography: "{typography.body-sm}"
  link-contact-hover:
    textColor: "{colors.foreground}"
    typography: "{typography.body-sm}"
  sidebar:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    padding: "36px 32px"
    width: "350px"
  section-separator:
    backgroundColor: "{colors.border}"
    height: "1px"
  field-error:
    textColor: "{colors.destructive}"
    typography: "{typography.caption}"
---

# Design System: portfolio-app

> Documenta el sistema visual **tal como está implementado** (`src/app/globals.css`,
> `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx` y `src/components/`).
> Lo leen las skills de diseño instaladas en `.claude/skills/`: impeccable lo carga
> con `context.mjs` y su detector compara fuentes, colores y radios con el
> frontmatter. Si un cambio de diseño se acepta, se actualiza aquí en el mismo
> commit; si no está aquí ni en el código, no es una decisión del proyecto.
> Los encabezados van en inglés porque son los canónicos del formato
> ([spec](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md));
> la prosa, en español como el resto del repo.

## Overview

**Creative North Star: "The Printed Résumé, Lit From Behind"**

Un currículum impreso que se lee en pantalla: dos columnas —una lateral fija con el
retrato y el contacto, y una principal con el recorrido—, tipografía editorial y
ningún adorno que compita con el contenido. La página abre en oscuro (azul pizarra
profundo, texto claro) y el tema claro es una elección explícita del visitante; el
retrato es un vídeo que responde a ese cambio de tema y es la única pieza con
movimiento propio. Todo lo demás aparece con una entrada discreta al hacer scroll
y se queda quieto.

La densidad es media-baja: mucho aire entre secciones (40 px), texto secundario
en gris para jerarquizar y una sola voz tipográfica de acento (Playfair Display)
reservada a nombre y títulos. No hay tarjetas anidadas, sombras, degradados,
iconos decorativos de gran tamaño ni color de marca: el "color" lo ponen la foto y
la propia estructura. La metáfora del norte creativo es una propuesta del agente
que documentó el sistema; el resto de este archivo describe decisiones ya
presentes en el código.

**Key Characteristics:**

- Página única, estática, en español (`/`) e inglés (`/en`); el contenido vive en
  `messages/*.json` y `src/data/resume-data.*.ts`, nunca en los componentes.
- Oscuro por defecto (`next-themes`, `enableSystem={false}`); paleta neutra
  OKLCH en claro y azul-pizarra hex en oscuro; ambas deben pasar WCAG 2.1 AA (hay
  pruebas E2E con axe en los dos temas y los dos idiomas).
- Dos familias tipográficas servidas con `next/font/local`: Playfair Display
  (encabezados) y Montserrat (todo lo demás).
- Superficies planas: profundidad por bordes finos y translucidez, sin sombras.
- Movimiento mínimo y con propósito: `motion` v13 (`motion/react`), entradas de
  400 ms, vídeo del retrato ligado al tema, respeto a `prefers-reduced-motion`
  solo para el movimiento ambiental.
- Se imprime bien: `@media print` fuerza la visibilidad de las secciones.

## Colors

Paleta neutra: grises OKLCH en claro y azules pizarra en oscuro; el único color
saturado es el destructivo, reservado a errores de formulario.

### Primary

- **Ink** (`oklch(0.205 0 0)` claro / `#e2e8f0` oscuro): color "primario" de
  shadcn, aquí solo texto de máximo contraste y fondos de elementos primarios si
  algún día los hay. La página no tiene botón primario relleno.

### Neutral

- **Paper / Night** (`oklch(1 0 0)` / `#0b1120`): fondo de página (`bg-background`).
- **Card** (`oklch(1 0 0)` / `#0f1729`): la columna lateral (`bg-card`), un
  paso más profunda en oscuro y plana en claro.
- **Foreground** (`oklch(0.145 0 0)` / `#e2e8f0`): texto principal.
- **Muted foreground** (`oklch(0.556 0 0)` / `#94a3b8`): texto secundario:
  empresas, fechas, contacto, pie. Es el gris de trabajo de la página.
- **Muted / Secondary / Accent** (`oklch(0.97 0 0)` / `#1a2332`, `#1e293b`):
  fondos de badges y de los botones redondos; `accent` es el fondo de hover.
- **Border / Input** (`oklch(0.922 0 0)` / `rgba(148,163,184,0.15|0.2)`):
  separadores de sección, borde de la columna lateral, tarjetas e inputs.
- **Ring** (`oklch(0.708 0 0)` / `#475569`): anillo de foco (`outline-ring/50`).

### Error

- **Destructive** (`oklch(0.577 0.245 27.325)` / `oklch(0.704 0.191 22.216)`):
  borde de campo inválido y mensajes de validación. Nada más.

### Named Rules

**The Two Palettes Rule.** Todo color se escribe como token semántico de shadcn
(`bg-background`, `text-muted-foreground`, `border-border`…), nunca como literal:
así el tema oscuro y el claro se mantienen solos y las pruebas de contraste
siguen valiendo.

**The No Brand Color Rule.** No hay color de marca ni acento saturado; el
contraste lo dan el peso tipográfico y el gris secundario. Un acento nuevo es
una decisión de diseño que se documenta aquí antes de usarse.

## Typography

**Display Font:** Playfair Display (variable 400–900, con Georgia y `serif` de
respaldo).
**Body Font:** Montserrat (variable 100–900, con `system-ui` y `sans-serif` de
respaldo).

**Character:** editorial y clásica en los títulos, neutra y legible en el cuerpo.
La serif es deliberada —un CV impreso, no una landing— y no se sustituye por una
sans "moderna" aunque una skill lo sugiera.

### Hierarchy

- **Display** (Playfair, mayúsculas, `tracking-wide`; nombre `font-light`
  3rem → 3.75rem en `lg`, apellido `font-bold` 3rem → 4.5rem en `lg`, `leading-none`):
  solo el nombre en el `<h1>`.
- **Subtitle** (Montserrat 400, 1.25rem, minúsculas, `text-muted-foreground`):
  el puesto, justo bajo el nombre.
- **Headline** (Playfair 700, 1.25rem, mayúsculas, `tracking-widest`): los `<h2>`
  de sección, siempre seguidos de un `<Separator>` a 8 px.
- **Title** (Playfair 700, 1rem): puestos, títulos académicos, idiomas (`<h3>`).
- **Body** (Montserrat 400, 1rem, `leading-relaxed`): perfil y formación continua.
- **Body small** (Montserrat 400, 0.875rem): viñetas de experiencia, contacto,
  fechas (`italic` para empresa y lugar).
- **Label** (Montserrat 600, 0.875rem, `text-muted-foreground`): categorías de
  habilidades.
- **Caption** (Montserrat 400, 0.75rem): badges, principios, pie de página.

### Named Rules

**The Two Voices Rule.** Playfair Display solo en `h1`, `h2`, `h3` y el nombre de
cada idioma; Montserrat en todo lo demás. No se añaden familias (el detector de
impeccable marca cualquier fuente fuera de este archivo).

**The Copy Lives Elsewhere Rule.** Ningún texto visible se escribe en un
componente: interfaz en `messages/{es,en}.json`, contenido del CV en
`src/data/resume-data.{es,en}.ts`. Añadir texto es añadirlo en los dos idiomas.
La raya (—) y las comillas angulares («») son correctas en español; una skill que
las prohíba por "tell de IA" no aplica aquí.

## Layout

Contenedor centrado de `max-w-6xl` (72rem). En `lg` y superior, dos columnas: la
lateral (`aside`) mide 350 px (`lg:w-87.5`), es `sticky` a la parte superior,
ocupa toda la altura (`lg:h-screen`) con su propio scroll, lleva `border-r` y
fondo `bg-card`, y contiene retrato, contacto, principios y el enlace a proyectos
cuando existe; la principal (`main`) es fluida con `px-8 py-10 lg:px-14`. Por
debajo de `lg` las columnas se apilan (`flex-col`), primero la lateral.

Ritmo vertical: cada sección `mb-10` (40 px); dentro de una sección, `gap-8`
entre empleos, `gap-5` entre estudios, `mb-5` bajo el encabezado, `mt-2` para las
listas. Las acciones globales (idioma, tema, PDF) son tres botones redondos de
40 px fijos en `top-4 right-4` con `backdrop-blur`, encima de todo (`z-50`).
Idiomas en rejilla de dos columnas; habilidades como `flex-wrap` de badges con
`gap-2`. Todo el layout es utilidades de Tailwind 4 (sin CSS a medida salvo la
regla de impresión) y no hay breakpoints propios: se usan los de Tailwind.

## Elevation & Depth

Sistema plano. No hay `box-shadow` en ningún componente. La profundidad se
consigue con: (1) bordes de 1 px en `border-border` (que en oscuro es un gris
translúcido al 15 %), (2) superficies un paso más oscuras/claras (`bg-card` en
la lateral), y (3) translucidez con desenfoque en los botones flotantes
(`bg-muted/60 backdrop-blur`) y en la tarjeta de principios (`bg-background/50`).

### Named Rules

**The Quiet Surface Rule.** Sin sombras, sin degradados, sin brillos ni bordes
de color. Si algo necesita destacar, se le da borde, fondo un paso distinto o
peso tipográfico.

## Shapes

Radio base `--radius: 0.625rem` (10 px) con la escala de shadcn (`sm` 6 px, `md`
8 px, `lg` 10 px, `xl` 14 px). En uso: `rounded-lg` para tarjetas, inputs y
botones de texto; `rounded-md` para badges; `rounded-full` para los tres botones
de icono. Bordes siempre de 1 px. El retrato lo define `ProfileVideo`. Nada
recortado en diagonal, sin blobs ni formas orgánicas.

## Components

Los primitivos son de shadcn sobre **Base UI** (`components.json`, estilo
`base-nova`; hoy solo `Badge` y `Separator` en `src/components/ui/`); el resto son
elementos HTML con utilidades. Iconos: `lucide-react` 1.x a 16–18 px con
`aria-hidden`; los SVG de marca (GitHub, LinkedIn) están en
`src/components/icons/`.

### Icon buttons (tema, idioma, PDF)

- **Shape:** círculo de 40 px (`h-10 w-10 rounded-full`).
- **Default:** `bg-muted/60 text-muted-foreground backdrop-blur`; icono de 18 px.
- **Hover:** `hover:bg-accent` con `transition-colors`; el conmutador de idioma
  también pasa a `text-foreground`.
- **Accesibilidad:** siempre `aria-label` traducido; el de tema renderiza sol y
  luna y deja que CSS (`dark:`) decida cuál se ve, sin esperar a la hidratación.

### Text buttons (enviar formulario, ver proyectos)

- **Shape:** `rounded-lg`, borde 1 px `border-border`, `px-4 py-2` (el enlace a
  proyectos, `px-3 py-2` a ancho completo).
- **Default:** fondo transparente, `text-sm text-foreground` (o
  `text-muted-foreground` en el enlace).
- **Hover / Disabled:** `hover:bg-accent` (`hover:text-foreground` en el enlace);
  `disabled:opacity-60 disabled:cursor-not-allowed`.

### Badges (habilidades)

- **Style:** `variant="secondary"` de shadcn, `rounded-md text-xs font-normal`,
  `bg-secondary text-secondary-foreground`, `px-2 py-0.5`.
- **State:** solo informativos; no hay badges seleccionables ni de estado.

### Cards / Containers

- **Corner Style:** `rounded-lg`.
- **Background:** `bg-background/50` (principios) o transparente.
- **Shadow Strategy:** ninguna (ver Elevation & Depth).
- **Border:** 1 px `border-border`.
- **Internal Padding:** `px-3 py-2`.

### Inputs / Fields (formulario de contacto)

- **Style:** `rounded-lg border border-border bg-background px-3 py-2 text-sm
text-foreground`, placeholder en `text-muted-foreground`.
- **Focus:** `focus:border-foreground focus:outline-none` (el borde cambia; sin
  brillo).
- **Error / Disabled:** `aria-[invalid=true]:border-destructive`; mensajes de
  error debajo del campo, en el idioma de la página; campo señuelo `website`
  oculto contra robots.

### Section heading

Encabezado `<h2>` en Headline seguido de `<Separator className="mt-2" />` y
`mb-5`. Es el patrón que da ritmo a toda la columna principal.

### Reveal (entrada de secciones)

Envoltorio de cliente (`src/components/reveal.tsx`) sobre contenido renderizado
en servidor: `opacity 0 → 1` y `y 12 → 0` en 400 ms `easeOut`, una sola vez, al
entrar en el viewport. Tres salvaguardas para que nunca esconda contenido:
plazo de seguridad de 2 s, `@media print` que fuerza la opacidad y `<noscript>`.
Con `prefers-reduced-motion` la transición dura 0 pero el contenido se muestra
igual.

### Profile video (retrato)

`src/components/profile-video.tsx`: el retrato es un vídeo que avanza al pasar al
tema oscuro y se rebobina al volver al claro interpolando `currentTime` con
`animate` de `motion` (curva lineal). Responde a un clic del visitante, así que
**no** consulta `prefers-reduced-motion`; el póster garantiza imagen aunque el
vídeo no cargue. Cualquier cambio aquí se comprueba en un navegador real.

## Do's and Don'ts

### Do:

- **Do** usar los tokens semánticos de shadcn para todo color y `rounded-lg` /
  `rounded-md` / `rounded-full` para toda esquina.
- **Do** escribir cualquier texto nuevo en `messages/es.json` y `messages/en.json`
  (o en los dos `resume-data`) y dejar que las pruebas comprueben la paridad.
- **Do** importar animación desde `motion/react` (o `motion`), preferir
  transiciones CSS para hover/foco y reservar JS para lo que CSS no puede
  (el vídeo, la entrada por viewport).
- **Do** poner `aria-label` a todo botón de solo icono y `aria-hidden` a todo
  icono decorativo; mantener el foco visible con `outline-ring/50`.
- **Do** comprobar los dos temas y los dos idiomas (contraste AA con axe) y, si
  se toca `reveal.tsx`, `profile-video.tsx`, `theme-provider.tsx` o
  `theme-toggle.tsx`, mirar la página en un navegador real antes de darlo por
  hecho: dos regresiones del retrato pasaron build, lint y typecheck.
- **Do** componer primitivos de Base UI con la prop `render`, no con `asChild`.

### Don't:

- **Don't** añadir sombras, degradados, brillos, texto con degradado, bordes de
  color, ni un acento saturado o morado: el sistema es plano y neutro.
- **Don't** introducir fuentes nuevas ni sustituir Playfair Display por una sans
  "más moderna": la serif es la identidad del CV.
- **Don't** escribir colores, radios o tamaños literales en los componentes ni
  crear `tailwind.config.*`: los tokens viven en `@theme inline` de
  `globals.css` (Tailwind 4, CSS-first).
- **Don't** animar lo que se pulsa decenas de veces (cambio de tema, idioma) más
  allá de `transition-colors`; ni usar `transition: all`, `scale(0)`, `ease-in`,
  GSAP o `framer-motion` (el paquete es `motion`).
- **Don't** anular por `prefers-reduced-motion` una respuesta a un clic del
  visitante (el vídeo del retrato); sí reducir el movimiento ambiental.
- **Don't** anidar tarjetas, centrar toda la página ni añadir secciones "hero"
  de marketing: es un currículum, no una landing.
- **Don't** enlazar recursos externos (CDN de iconos, imágenes de relleno): todo
  se sirve desde `public/` o `src/`.
