# Pokédex (frontend)

Astro + Tailwind CSS app that consumes the public [PokéAPI](https://pokeapi.co/).
Managed with **pnpm**.

## 🧞 Commands

All commands are run from this `frontend/` folder:

| Command         | Action                                       |
| :-------------- | :------------------------------------------- |
| `pnpm install`  | Install dependencies                         |
| `pnpm dev`      | Start the local dev server                   |
| `pnpm build`    | Build the production site to `./dist/`       |
| `pnpm preview`  | Preview the production build locally         |
| `pnpm astro ...`| Run Astro CLI commands (`astro add`, etc.)   |

> The first `pnpm install` may ask to approve build scripts for `esbuild` and `sharp`.
> They are pre-approved in `pnpm-workspace.yaml` (`allowBuilds`).

## 🗂️ Structure

```text
src/
├── components/      # Astro UI pieces (Navbar, Metadata)
├── controllers/     # Vanilla JS that consumes the PokéAPI and drives the pages
│   ├── pokeApi.js       # cached API layer (index, detail, types, sprites)
│   ├── store.js         # favorites + compare selection (localStorage)
│   ├── getTypeColors.js # type colors / hex helpers
│   ├── getAllPokemon.js # Pokédex grid: search, filters, infinite scroll, compare
│   └── getInfoPokemon.js# detail view: abilities, stats, evolution, shiny, cry
└── pages/
    ├── index.astro      # Pokédex grid
    └── infopokemon.astro# Pokémon detail
```

## 📚 Learn more

See the [Astro docs](https://docs.astro.build).
