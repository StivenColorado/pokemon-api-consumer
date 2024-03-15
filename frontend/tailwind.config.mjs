/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      backgroundImage: {
        pokemon: "url('./src/assets/bg_pokemon.png')",
        bola: "url('./src/assets/pokemon.png')",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
