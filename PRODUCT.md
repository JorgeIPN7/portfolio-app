# Product

<!-- impeccable:product-schema 1 -->

> Registro de "verdad de producto" que leen las skills de diseño (impeccable lo
> carga con `context.mjs` antes de criticar, pulir o proponer superficies). Lo
> escribió el agente a partir del repositorio (README, `src/data/resume-data.*`,
> `messages/*.json`) sin entrevista, porque el dueño estaba ausente: cada dato
> marcado **(inferido)** es una hipótesis razonable que conviene confirmar o
> corregir; el resto está en el código. La dirección visual no va aquí sino en
> `DESIGN.md`.

## Platform

web

## Users

- **Principal (inferido):** reclutadores, responsables técnicos y fundadores que
  evalúan a Jorge para un puesto senior/lead o una colaboración; llegan desde
  LinkedIn, GitHub, un correo o una búsqueda, con poco tiempo, a menudo desde el
  móvil, y quieren decidir en un par de minutos si escriben o descargan el CV.
- **Secundario (inferido):** clientes potenciales de proyectos fintech/proptech
  y personas que ya conocen a Jorge y buscan su contacto o su CV en PDF.
- Idiomas: español (México) e inglés; el español es la versión de referencia.

## Product Purpose

Presentar el perfil profesional de Jorge Herminio López Vázquez —Senior
Full-Stack Engineer y Tech Lead con más de ocho años en fintech, proptech y
blockchain, en Ciudad de México— de forma completa y verificable, y convertir
la lectura en un contacto: correo, WhatsApp, LinkedIn, GitHub, formulario o
descarga del CV. El éxito es que quien lee entienda en el primer viewport quién
es y qué hace, encuentre las pruebas (experiencia, resultados con cifras,
formación) y tenga siempre a un clic la forma de escribirle.

## Positioning

Un CV vivo, no una landing: el contenido es el mismo del PDF, tipado y probado
(las dos traducciones no pueden separarse), servido como página estática rápida,
accesible (WCAG 2.1 AA en los dos temas) y bilingüe. La diferencia frente a un
PDF o un perfil de LinkedIn es que se lee bien en cualquier pantalla, se imprime
igual de bien y demuestra con su propia factura (Next.js 16, calidad de código,
pruebas) parte de lo que el CV afirma.

## Operating Context

- Se consulta desde móvil y escritorio, con frecuencia en un solo vistazo; se
  comparte por enlace (`/` español, `/en` inglés) y se imprime o se descarga en
  PDF (`public/cv_fullstack_jorge_herminio_lopez_vazquez.pdf`, solo en español).
- Se despliega en Vercel como sitio estático; el formulario de contacto envía
  por Resend y sin clave vuelca a consola en desarrollo.
- El contenido se mantiene editando `src/data/resume-data.es.ts` y
  `resume-data.en.ts` (CV) y `messages/es.json` / `en.json` (interfaz); las
  pruebas unitarias comprueban la paridad entre idiomas.
- Existe una sección de casos (`/proyectos`, MDX) todavía sin casos publicados:
  no se enlaza ni se indexa hasta que haya uno.

## Capabilities and Constraints

- Página única con columna lateral (retrato en vídeo, contacto, principios) y
  columna principal (perfil, experiencia, formación, formación continua,
  habilidades técnicas y blandas, idiomas, intereses, formulario).
- Tema oscuro por defecto y claro a elección; el retrato reacciona al cambio de
  tema. Conmutador de idioma con la elección guardada en cookie.
- Formulario con validación en servidor, campo señuelo y límite de envíos por IP.
- Restricciones técnicas: Next.js 16 App Router (estático, `proxy.ts` para el
  idioma), React 19, Tailwind CSS 4 CSS-first, shadcn sobre Base UI,
  `motion` v13, next-intl, sin CMS ni backend propio; sin recursos externos en
  tiempo de ejecución (todo en `public/` y `src/`).
- Sin decidir: si el PDF tendrá versión en inglés y si los casos de `/proyectos`
  se traducirán por idioma.

## Brand Commitments

- Nombre y voz: el CV habla en primera persona sobre hechos comprobables (cifras,
  tecnologías, resultados); tono sobrio y directo, sin superlativos vacíos.
- Identidad visual vigente (documentada en `DESIGN.md`): retrato en vídeo,
  Playfair Display para títulos, Montserrat para el resto, superficies planas,
  oscuro por defecto. Es la identidad actual, no una imposición para siempre,
  pero cambiarla es una decisión del dueño, no de una skill.
- Cinco principios personales listados bajo el retrato (`messages/*.json`,
  clave `principles`) forman parte del mensaje.

## Evidence on Hand

- Experiencia, formación, habilidades e idiomas reales en
  `src/data/resume-data.{es,en}.ts`; PDF del CV en `public/`; retrato en imagen
  (`public/profile.jpeg`, `profile-dark.jpeg`) y vídeo (`public/`).
- Enlaces reales a LinkedIn y GitHub; datos estructurados JSON-LD `Person`.
- **No hay** testimonios, logotipos de clientes ni casos publicados: no
  inventarlos.

## Product Principles

1. El contenido manda: el diseño no compite con el texto ni lo esconde (ni
   siquiera durante una animación).
2. Un solo origen de verdad por dato: CV en `resume-data`, textos en `messages`,
   tokens en `globals.css`, sistema visual en `DESIGN.md`.
3. Accesible y bilingüe por defecto: cada cambio se comprueba en los dos temas y
   los dos idiomas.
4. Rápido y estático: nada que no haga falta se envía al navegador.
5. Se imprime y se descarga: el CV sigue siendo un documento.

## Accessibility & Inclusion

WCAG 2.1 AA verificado con axe (Playwright) en claro/oscuro y es/en; foco visible;
botones de solo icono con `aria-label` traducido; el movimiento ambiental respeta
`prefers-reduced-motion`, la respuesta a un clic (vídeo del retrato) no se anula.
