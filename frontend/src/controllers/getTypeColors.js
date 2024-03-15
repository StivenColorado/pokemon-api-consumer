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