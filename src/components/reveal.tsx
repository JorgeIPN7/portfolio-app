"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/** Tras este tiempo el contenido se muestra aunque nunca haya entrado en vista. */
const FAILSAFE_MS = 2000;

/**
 * Aparición al entrar en pantalla.
 *
 * Es un envoltorio de cliente sobre contenido que sigue renderizándose en el
 * servidor: los `children` llegan ya resueltos, así que el texto del CV no
 * viaja al navegador por usar esto.
 *
 * La preferencia de movimiento reducido solo afecta a `transition`, nunca a
 * `initial`. Es deliberado: `useReducedMotion()` devuelve `false` en el
 * servidor y el valor real en el cliente, así que condicionar con él lo que se
 * renderiza produce un desajuste de hidratación. `transition` solo describe
 * cómo se anima, no lo que se pinta, y por eso puede diferir sin romper nada.
 *
 * Tres salvaguardas, porque aquí un fallo no degrada la animación sino que
 * esconde el contenido:
 *
 *  - Un plazo de seguridad, para lo que nunca cruza el viewport (Ctrl+F,
 *    teclas de inicio y fin, scroll programático).
 *  - `@media print` en `globals.css`: al imprimir no hay scroll que dispare
 *    nada, y un CV se imprime.
 *  - Un `<noscript>` en el layout, para cuando no hay JavaScript que anime.
 */
export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setExpired(true), FAILSAFE_MS);
    return () => window.clearTimeout(id);
  }, []);

  const visible = { opacity: 1, y: 0 };

  return (
    <motion.div
      data-reveal
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={expired ? visible : undefined}
      whileInView={visible}
      viewport={{ once: true, amount: 0 }}
      transition={
        reduceMotion ? { duration: 0 } : { duration: 0.4, ease: "easeOut" }
      }
    >
      {children}
    </motion.div>
  );
}
