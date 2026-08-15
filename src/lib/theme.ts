/**
 * Contrato del tema, compartido por el servidor y el cliente.
 *
 * Vive aquí y no en `theme-provider.tsx` a propósito: ese módulo lleva
 * `"use client"`, y un Server Component que importe un *valor* de un módulo
 * cliente no recibe el valor, recibe una referencia que en el servidor vale
 * `undefined`. El script antiparpadeo de `layout.tsx` se construye en el
 * servidor, así que necesita la constante desde un módulo sin directiva.
 */

/** Tema de la página. El oscuro es el estado por defecto. */
export type Theme = "dark" | "light";

/**
 * Clave de localStorage. La comparten el proveedor de tema y el script
 * antiparpadeo de `layout.tsx`.
 */
export const THEME_STORAGE_KEY = "theme";
