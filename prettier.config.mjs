/** @type {import("prettier").Config} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  // Tailwind 4 es CSS-first: sin tailwind.config, el plugin necesita el punto
  // de entrada del CSS para conocer el tema y las utilidades propias.
  tailwindStylesheet: "./src/app/globals.css",
  // Ordena también las clases que viven dentro de cn() y cva().
  tailwindFunctions: ["cn", "cva"],
};

export default config;
