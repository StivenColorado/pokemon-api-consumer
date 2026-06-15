// Capa de acceso a la PokéAPI con caché en memoria (+ sessionStorage para el índice).
const API = "https://pokeapi.co/api/v2";
const cache = new Map();

const idFromUrl = (url) => {
    const m = url.match(/\/(\d+)\/?$/);
    return m ? Number(m[1]) : null;
};

// Índice completo: ~1300 entradas {name, url, id}. Se descarga una sola vez.
export const getAllIndex = async () => {
    if (cache.has("index")) return cache.get("index");

    const stored = sessionStorage.getItem("pokedex:index");
    if (stored) {
        const list = JSON.parse(stored);
        cache.set("index", list);
        return list;
    }

    const res = await fetch(`${API}/pokemon?limit=100000&offset=0`);
    const data = await res.json();
    const list = data.results
        .map((r) => ({ name: r.name, url: r.url, id: idFromUrl(r.url) }))
        .filter((p) => p.id);

    cache.set("index", list);
    try {
        sessionStorage.setItem("pokedex:index", JSON.stringify(list));
    } catch (_) {
        /* sessionStorage lleno: seguimos solo con la caché en memoria */
    }
    return list;
};

// Detalle de un Pokémon. Acepta id (número) o url. Cachea la promesa.
export const getPokemon = (idOrUrl) => {
    const url = typeof idOrUrl === "number" ? `${API}/pokemon/${idOrUrl}` : idOrUrl;
    const key = `p:${url}`;
    if (!cache.has(key)) {
        cache.set(key, fetch(url).then((r) => r.json()));
    }
    return cache.get(key);
};

// Pokémon de un tipo concreto: [{name, url, id}].
export const getByType = (type) => {
    const key = `t:${type}`;
    if (!cache.has(key)) {
        cache.set(
            key,
            fetch(`${API}/type/${type}`)
                .then((r) => r.json())
                .then((d) =>
                    d.pokemon
                        .map((x) => ({
                            name: x.pokemon.name,
                            url: x.pokemon.url,
                            id: idFromUrl(x.pokemon.url),
                        }))
                        .filter((p) => p.id),
                ),
        );
    }
    return cache.get(key);
};

export const getJson = (url) => {
    const key = `j:${url}`;
    if (!cache.has(key)) cache.set(key, fetch(url).then((r) => r.json()));
    return cache.get(key);
};

// Sprite preferido (artwork oficial → sprite por defecto → null).
export const artworkOf = (p, shiny = false) => {
    const art = p?.sprites?.other?.["official-artwork"];
    if (art) return shiny ? art.front_shiny || art.front_default : art.front_default;
    return p?.sprites?.[shiny ? "front_shiny" : "front_default"] || null;
};

// Sprite animado (GIF). Showdown cubre casi todos los Pokémon; si no, se intenta
// con el animado de Gen V (Black/White, solo hasta ~#649). Devuelve null si no hay.
export const animatedOf = (p, shiny = false) => {
    const sd = p?.sprites?.other?.showdown;
    if (sd) {
        const url = shiny ? sd.front_shiny || sd.front_default : sd.front_default;
        if (url) return url;
    }
    const bw = p?.sprites?.versions?.["generation-v"]?.["black-white"]?.animated;
    if (bw) {
        const url = shiny ? bw.front_shiny || bw.front_default : bw.front_default;
        if (url) return url;
    }
    return null;
};
