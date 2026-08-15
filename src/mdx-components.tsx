import type { MDXComponents } from "mdx/types";

/**
 * Estilos de los elementos que genera el Markdown. Sin esto, el contenido MDX
 * saldría sin formato: Tailwind 4 no aplica estilos base a las etiquetas.
 *
 * Se usan los mismos tokens que el resto del sitio, para que un caso de
 * /proyectos se lea igual que el CV de la portada.
 */
const components: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="mb-3 font-heading text-4xl font-bold tracking-wide text-foreground uppercase lg:text-5xl">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-10 mb-4 font-heading text-xl font-bold tracking-widest text-foreground uppercase">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-6 mb-2 font-heading text-base font-bold text-foreground">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mb-4 text-base leading-relaxed text-foreground">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
      {children}
    </ol>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-sm">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="mb-4 overflow-x-auto rounded-lg border border-border bg-muted p-4 text-sm">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-4 border-l-2 border-border pl-4 text-muted-foreground italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-border" />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
