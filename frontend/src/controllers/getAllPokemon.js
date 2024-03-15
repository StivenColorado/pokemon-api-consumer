
import { getBgColorBg, getBgColorBtn } from './getTypeColors';

let previousUrl = null;
let nextUrl = null;
let offset = 0;
const limit = 20;
let actualPage
let count_page = document.querySelector('#count_page')

//cargar los datos almacenados en localStorage
const loadLocalStorageData = () => {
    const storedOffset = localStorage.getItem('offset');
    if (storedOffset !== null) {
        offset = parseInt(storedOffset);
        actualPage = offset / 20
        count_page.innerHTML = actualPage + 1
    }
};

document.addEventListener('DOMContentLoaded', function () {
    loadLocalStorageData(); //datos almacenados en localStorage

    const loadData = (url) => {
        const loading = document.querySelector("#loading-overlay")
        loading.classList.remove("hidden")
        fetch(url)
            .then(response => response.json())
            .then(data => {
                // console.log(data);
                createCards(data.results);
                previousUrl = data.previous;
                nextUrl = data.next;
                updatePaginator();
                setTimeout(() => {
                    loading.classList.add("hidden")
                }, 1500);
            })
            .catch(error => {
                console.error(`error al traer los datos: ${error}`);
            });
    };

    const createCards = (data) => {
        let container_pokemon = document.querySelector('#container-cards-pokemon');
        container_pokemon.innerHTML = ''; // Limpiar el contenedor 
        data.forEach(pokemon => {
            let image_url;
            fetch(pokemon.url)
                .then(response => response.json())
                .then(pokemonData => {
                    // console.log(pokemonData)
                    image_url = pokemonData.sprites.other["official-artwork"].front_default;
                    const cardHTML = `
                    <div class="max-w-80 p-4 relative flex flex-col justify-center items-center bg-white border border-gray-200 rounded-lg shadow dark:${getBgColorBg('default')} hover:${getBgColorBg(pokemonData.types[0].type.name)} dark:border-gray-700 pokemon-card group" data-url="${pokemon.url}">
                    <img src="../src/assets/pokemon.png" alt="" class="absolute -top-6 -right-6 m-2 w-10 h-10 z-50 bg-pokebola group-hover:rotate-180 duration-100" />
                    <div class="flex w-4/5 h-4/5 bg-pokemon group rounded-lg">
                            <img class="w-full h-full object-contain group-hover:-translate-y-4" src="${image_url}" alt="${image_url}"/>
                        </div>
                        <small class="text-white mt-4 text-2">#${pokemonData.id}</small>
                        <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                            ${pokemonData.name}
                        </h5>
                        <div class="flex w-full flex-row justify-center items-center">
                        ${pokemonData.types.map(type => `
                        <button type="button" class="font-bold text-white dark:${getBgColorBtn(type.type.name)} hover:bg-white focus:ring-4 focus:ring-blue-300 rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-white-600 dark:hover:text-black dark:hover:bg-white-700 focus:outline-none dark:focus:ring-blue-800">
                            ${type.type.name}
                        </button>
                    `).join('')}
                        <p class="flex text-base justify-end font-medium items-end text-white hover:underline  w-full h-10">
                            <svg
                                class="w-3 h-3 ms-2.5 rtl:rotate-[270deg]"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 18 18"
                            >
                                <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"
                                ></path>
                            </svg>
                        </p>
                    </div>
                `;

                    container_pokemon.innerHTML += cardHTML;
                    // Seleccionar todas las cartas
                    const pokemonCards = document.querySelectorAll('.pokemon-card');
                    pokemonCards.forEach(card => {
                        card.addEventListener('click', function (event) {
                            event.preventDefault(); // Prevenir el comportamiento predeterminado del enlace
                            const url = this.getAttribute('data-url'); // Obtener la URL del atributo de datos
                            localStorage.setItem('pokemonUrl', url);
                            console.log('URL del Pokémon establecida en el localStorage:', url);
                            location.href = '/infopokemon'
                        });
                    });
                })
                .catch(error => console.error(`Error fetching pokemon data: ${error}`));
        });
    };

    const updatePaginator = () => {
        const previousBtn = document.getElementById('pag-atras');
        const nextBtn = document.getElementById('pag-adelante');

        if (previousUrl) {
            previousBtn.href = '#';
            previousBtn.classList.remove('pointer-events-none', 'opacity-50');
        } else {
            previousBtn.href = '#';
            previousBtn.classList.add('pointer-events-none', 'opacity-50');
        }

        if (nextUrl) {
            nextBtn.href = '#';
            nextBtn.classList.remove('pointer-events-none', 'opacity-50');
        } else {
            nextBtn.href = '#';
            nextBtn.classList.add('pointer-events-none', 'opacity-50');
        }
    };

    const updateUrl = (direction) => {
        if (direction === 'next' && nextUrl) {
            offset += limit;
            localStorage.setItem('offset', offset); // Guardar el nuevo valor de offset en localStorage
            loadData(`${nextUrl}&offset=${offset}`);
            actualPage = offset / 20
            count_page.innerHTML = actualPage + 1
        } else if (direction === 'previous' && previousUrl) {
            offset -= limit;
            localStorage.setItem('offset', offset); // Guardar el nuevo valor de offset en localStorage
            loadData(`${previousUrl}&offset=${offset}`);
            actualPage = offset / 20
            count_page.innerHTML = actualPage + 1
        }
    };

    // Agregar eventos de clic a los botones de paginación
    const previousBtn = document.getElementById('pag-atras');
    const nextBtn = document.getElementById('pag-adelante');

    previousBtn.addEventListener('click', function (event) {
        event.preventDefault();
        updateUrl('previous');
    });

    nextBtn.addEventListener('click', function (event) {
        event.preventDefault();
        updateUrl('next');
    });

    // Cargar los datos de la primera página al cargar la página
    loadData(`https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`);
});