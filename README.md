# pokemon-api-consumer

A frontend Pokédex that consumes the public [PokéAPI](https://pokeapi.co/), built with
[Astro](https://astro.build/) + Tailwind CSS.

![pokeUI](https://github.com/StivenColorado/pokemon-api-consumer/assets/90488682/6c3cf2b5-75c9-49b8-bb06-ac5b8fd172c2)

## Description / Descripción

Browse every Pokémon, search and filter them, save favorites, compare stats side by side
and open a rich detail view (abilities, base stats, evolution chain, shiny artwork,
animated sprites and the Pokémon cry). Everything runs in the browser against the public
PokéAPI — there is no backend or authentication.

Explora todos los Pokémon, búscalos y fíltralos, guarda favoritos, compara estadísticas
lado a lado y abre una vista de detalle enriquecida (habilidades, stats base, cadena de
evolución, arte shiny, sprites animados y el sonido del Pokémon). Todo corre en el
navegador contra la PokéAPI pública — no hay backend ni autenticación.

## Features / Funcionalidades

- 🔎 **Live search** by name or number.
- 🏷️ **Type filters** in a single scrollable row of chips.
- ❤️ **Favorites** persisted in `localStorage`, with a dedicated view.
- ⇄ **Compare** up to 4 Pokémon with a side-by-side stat chart.
- ♾️ **Infinite scroll** with skeleton loaders and a back-to-top button.
- 🎬 **Animated sprites** (Showdown / Gen V) on card hover and via a toggle in the detail view.
- 🔊 **Pokémon cry** playback with a soft fade-in.
- 📄 **Rich detail page**: abilities, base stats, evolution chain and shiny toggle.

## Tech / Tecnología

- [Astro](https://astro.build/) (static output)
- Tailwind CSS + Flowbite
- Vanilla JS controllers that consume the PokéAPI
- **pnpm** as the package manager

## Getting started / Empezar

> Requires Node.js >= 18 and [pnpm](https://pnpm.io/). The app lives in the `frontend/` folder.

```sh
cd frontend
pnpm install
pnpm dev      # start the dev server
```

Then open the URL printed in the terminal. To build for production:

```sh
pnpm build    # output in frontend/dist/
pnpm preview  # preview the production build
```

## License / Licencia

This project is licensed under the MIT License. See the `License.txt` file for more details.
Este proyecto está bajo la Licencia MIT. Consulta el archivo `License.txt` para más detalles.
