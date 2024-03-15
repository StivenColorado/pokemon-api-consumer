import { getBgColorBtn, getBgProgress } from '../controllers/getTypeColors';

document.addEventListener('DOMContentLoaded', function () {
    let container = document.querySelector('#container-info-pokemon')
    // URL del Pokémon en localStorage
    const pokemonUrl = localStorage.getItem('pokemonUrl');

    // Verificar si la URL está presente en el localStorage
    if (pokemonUrl) {
        // peticion
        fetch(pokemonUrl)
            .then(response => response.json())
            .then(pokemonData => {
                // console.log(pokemonData);
                // console.log(pokemonData.stats);

                function getMaxBaseStat() {//mayor valor del stat
                    return Math.max(...pokemonData.stats.map(stat => stat.base_stat));
                }
                container.innerHTML += `
                <div class="w-full min-h-4/5  bg-gradient-to-b from-gray-900 via-gray-800 to-teal-950 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-center items-center">

                <div class="flex flex-col items-center pb-10 2xl:flex-col md:flex-row w-full overflow-hidden">
                    <div class="w-1/2 md:w-1/2 flex flex-col justify-center items-center sm:w-full gap-3">
                        <img class="w-60 min-h-70 p-2 rounded-full shadow-lg object-contain" src="${pokemonData.sprites.other["official-artwork"].front_default}" alt="Bonnie image" />
                        <p class="text-white mt-4 text-2">#${pokemonData.id}</p>
                        <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                            ${pokemonData.name}
                        </h5>
                        <div class="flex flex-row gap-4">
                        ${pokemonData.types.map(type => `
                            <button type="button" class="font-bold text-white dark:${getBgColorBtn(type.type.name)} hover:bg-white focus:ring-4 focus:ring-blue-300 rounded-lg text-sm px-5 py-2.5 dark:bg-white-600 dark:hover:text-black dark:hover:bg-white-700 focus:outline-none dark:focus:ring-blue-800 p-2">
                                ${type.type.name}
                            </button>
                        `).join('')}
                        </div>
                    </div>
                    <div class="w-full px-4 sm:px-8 md:w-1/2 p-2">
                        <div class="grid grid-cols-2 gap-2 md:grid-cols-1">
                            ${pokemonData.stats.map(stat => `
                                <div class="p-1 text-base font-medium dark:text-white">${stat.stat.name}</div>
                                <div class="text-sm relative">
                                    <div class="w-full bg-gray-200 rounded-full h-6 sm:h-6 md:h-8 lg:h-10 dark:bg-gray-700">
                                        <div class="absolute inset-0 flex items-center pl-4 dark:text-black text-xs sm:text-sm md:text-base">
                                            ${stat.base_stat}
                                        </div>
                                        <div class="bg-gray-600 h-full rounded-full dark:${getBgProgress(stat.stat.name)} bg-pokemon" style="width: ${(Math.min(stat.base_stat, getMaxBaseStat()) / getMaxBaseStat()) * 100}%"></div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
            
                `;
            })
            .catch(error => {
                console.error('Error al obtener los datos del Pokémon:', error);
            });
    } else {
        console.log('No hay URL de Pokémon en el localStorage');
        this.location.href = '/'
    }
});
