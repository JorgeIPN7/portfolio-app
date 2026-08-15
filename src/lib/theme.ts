/**
 * Clave de localStorage bajo la que se guarda el tema elegido.
 *
 * Vive en un módulo aparte, sin `"use client"`, para que la puedan importar
 * tanto el proveedor de tema como las pruebas sin arrastrar código de cliente.
 * Se la pasamos explícitamente a next-themes en vez de confiar en su valor por
 * defecto: así, si algún día lo cambia, la elección guardada no se pierde en
 * silencio.
 */
export const THEME_STORAGE_KEY = "theme";
