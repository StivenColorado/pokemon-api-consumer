// Estado persistente en localStorage: favoritos y selección para comparar.
const FAV_KEY = "pokedex:favorites";
const CMP_KEY = "pokedex:compare";
export const COMPARE_LIMIT = 4;

const read = (key) => {
    try {
        const v = JSON.parse(localStorage.getItem(key));
        return Array.isArray(v) ? v : [];
    } catch (_) {
        return [];
    }
};
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

/* ---------- Favoritos ---------- */
export const getFavorites = () => read(FAV_KEY);
export const isFavorite = (id) => getFavorites().includes(id);
export const toggleFavorite = (id) => {
    const favs = getFavorites();
    const i = favs.indexOf(id);
    if (i >= 0) favs.splice(i, 1);
    else favs.push(id);
    write(FAV_KEY, favs);
    return favs.includes(id);
};

/* ---------- Comparador ---------- */
export const getCompare = () => read(CMP_KEY);
export const inCompare = (id) => getCompare().includes(id);
export const isCompareFull = () => getCompare().length >= COMPARE_LIMIT;
export const toggleCompare = (id) => {
    const cmp = getCompare();
    const i = cmp.indexOf(id);
    if (i >= 0) cmp.splice(i, 1);
    else if (cmp.length < COMPARE_LIMIT) cmp.push(id);
    write(CMP_KEY, cmp);
    return getCompare();
};
export const clearCompare = () => write(CMP_KEY, []);
