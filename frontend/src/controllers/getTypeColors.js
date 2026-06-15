export const getBgColorBg = (type) => {
    const typeColors = {
        normal: "bg-yellow-200",
        fire: "bg-orange-500",
        water: "bg-cyan-700",
        grass: "bg-lime-500",
        electric: "bg-yellow-400",
        ice: "bg-cyan-200",
        fighting: "bg-red-600",
        poison: "bg-purple-500",
        ground: "bg-orange-300",
        flying: "bg-violet-600",
        psychic: "bg-rose-500",
        bug: "bg-yellow-300",
        rock: "bg-amber-400",
        ghost: "bg-purple-500",
        dark: "bg-orange-400",
        dragon: "bg-purple-800",
        steel: "bg-violet-300",
        fairy: "bg-red-500",
        default: "bg-gray-800",
    };
    return typeColors[type] || typeColors['default']
}

export const getBgColorBtn = (type) => {
    const typeColors = {
        normal: "bg-yellow-800",
        fire: "bg-orange-800",
        water: "bg-cyan-800",
        grass: "bg-lime-800",
        electric: "bg-yellow-800",
        ice: "bg-cyan-800",
        fighting: "bg-red-800",
        poison: "bg-purple-800",
        ground: "bg-orange-800",
        flying: "bg-violet-800",
        psychic: "bg-rose-800",
        bug: "bg-yellow-800",
        rock: "bg-amber-800",
        ghost: "bg-purple-800",
        dark: "bg-orange-800",
        dragon: "bg-purple-800",
        steel: "bg-violet-800",
        fairy: "bg-red-800",
        default: "bg-gray-800",
    };
    return typeColors[type] || typeColors['default']
}
export const getBgProgress = (type) => {
    const typeColors = {
        'hp': "bg-lime-500",
        'attack': "bg-red-500",
        'defense': "bg-violet-500",
        'special-attack': "bg-cyan-500",
        'special-defense': "bg-purple-500",
        'speed': "bg-cyan-500",
    };
    return typeColors[type] || typeColors['default']
}

// Lista completa de tipos (orden de la Pokédex)
export const TYPES = [
    "normal", "fire", "water", "grass", "electric", "ice", "fighting",
    "poison", "ground", "flying", "psychic", "bug", "rock", "ghost",
    "dark", "dragon", "steel", "fairy",
];

// Colores hex canónicos por tipo: se usan como estilos inline en chips y barras,
// así no dependen del purgado de Tailwind ni del CDN.
export const getTypeHex = (type) => ({
    normal: "#9099a1", fire: "#ff9d55", water: "#4d90d5", grass: "#63bc5a",
    electric: "#f4d23c", ice: "#73cec0", fighting: "#ce4069", poison: "#ab6ac8",
    ground: "#d97746", flying: "#8fa8dd", psychic: "#f97176", bug: "#90c12c",
    rock: "#c7b78b", ghost: "#5269ad", dark: "#5a5366", dragon: "#0b6dc3",
    steel: "#5a8ea1", fairy: "#ec8fe6", default: "#68a090",
}[type] || "#68a090");

// Color de la barra de un stat según su valor (rojo bajo → verde alto)
export const getStatHex = (value) => {
    if (value < 50) return "#ef5350";
    if (value < 80) return "#ffb74d";
    if (value < 110) return "#ffd54f";
    if (value < 140) return "#9ccc65";
    return "#4caf50";
};