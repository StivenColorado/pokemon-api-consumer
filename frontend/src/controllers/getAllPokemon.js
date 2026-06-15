import { TYPES, getTypeHex, getStatHex } from "./getTypeColors.js";
import { getAllIndex, getByType, getPokemon, artworkOf, animatedOf } from "./pokeApi.js";
import {
    getFavorites, isFavorite, toggleFavorite,
    getCompare, inCompare, toggleCompare, clearCompare, COMPARE_LIMIT,
} from "./store.js";

const PAGE = 24;
const STAT_LABELS = {
    hp: "HP", attack: "Attack", defense: "Defense",
    "special-attack": "Sp. Atk", "special-defense": "Sp. Def", speed: "Speed",
};

const state = {
    full: [],
    filtered: [],
    rendered: 0,
    selectedTypes: new Set(),
    search: "",
    favOnly: false,
    loading: false,
};

const $ = (sel) => document.querySelector(sel);
const titleCase = (s) => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

let els = {};

document.addEventListener("DOMContentLoaded", async () => {
    els = {
        grid: $("#grid"),
        search: $("#search"),
        typeFilters: $("#type-filters"),
        favToggle: $("#fav-toggle"),
        sentinel: $("#sentinel"),
        loader: $("#infinite-loader"),
        empty: $("#empty"),
        count: $("#result-count"),
        scrollTop: $("#scroll-top"),
        tray: $("#compare-tray"),
        trayItems: $("#compare-items"),
        compareOpen: $("#compare-open"),
        compareClear: $("#compare-clear"),
        modal: $("#compare-modal"),
        modalBody: $("#compare-body"),
        modalClose: $("#compare-close"),
    };

    buildTypeChips();
    wireControls();

    if (new URLSearchParams(location.search).get("view") === "favorites") {
        state.favOnly = true;
        els.favToggle.dataset.active = "true";
    }

    showInitialSkeletons(); // skeletons visibles mientras llega el índice
    state.full = await getAllIndex();
    await refresh();
    updateCompareTray();
});

// Rellena el grid con tarjetas skeleton antes de tener datos reales.
function showInitialSkeletons() {
    els.grid.innerHTML = Array.from({ length: PAGE }, () => {
        const slot = document.createElement("div");
        slot.className = "card-slot";
        slot.innerHTML = skeletonCard();
        return slot.outerHTML;
    }).join("");
}

/* ----------------------------- Controles ----------------------------- */
function buildTypeChips() {
    els.typeFilters.innerHTML = TYPES.map(
        (t) => `
        <button type="button" class="type-chip-filter" data-type="${t}"
            style="--c:${getTypeHex(t)}">${titleCase(t)}</button>`,
    ).join("");

    els.typeFilters.querySelectorAll(".type-chip-filter").forEach((btn) => {
        btn.addEventListener("click", () => {
            const t = btn.dataset.type;
            if (state.selectedTypes.has(t)) state.selectedTypes.delete(t);
            else state.selectedTypes.add(t);
            btn.classList.toggle("active", state.selectedTypes.has(t));
            refresh();
        });
    });
}

function wireControls() {
    let debounce;
    els.search.addEventListener("input", (e) => {
        clearTimeout(debounce);
        const value = e.target.value.trim().toLowerCase();
        debounce = setTimeout(() => {
            state.search = value;
            refresh();
        }, 200);
    });

    els.favToggle.addEventListener("click", () => {
        state.favOnly = !state.favOnly;
        els.favToggle.dataset.active = String(state.favOnly);
        refresh();
    });

    // Scroll infinito
    new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) renderNext();
        },
        { rootMargin: "250px" },
    ).observe(els.sentinel);

    // Botón "volver arriba"
    window.addEventListener("scroll", () => {
        els.scrollTop.classList.toggle("show", window.scrollY > 600);
    });
    els.scrollTop.addEventListener("click", () =>
        window.scrollTo({ top: 0, behavior: "smooth" }),
    );

    // Comparador
    els.compareClear.addEventListener("click", () => {
        clearCompare();
        syncCardCompareButtons();
        updateCompareTray();
    });
    els.compareOpen.addEventListener("click", openCompare);
    els.modalClose.addEventListener("click", closeCompare);
    els.modal.addEventListener("click", (e) => {
        if (e.target === els.modal) closeCompare();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeCompare();
    });
}

/* ----------------------------- Filtrado ----------------------------- */
async function refresh() {
    setBusy(true);
    await applyFilters();
    state.rendered = 0;
    els.grid.innerHTML = "";
    updateResultCount();
    els.empty.classList.toggle("is-hidden", state.filtered.length > 0);
    renderNext();
    setBusy(false);
}

async function applyFilters() {
    let base;
    if (state.selectedTypes.size) {
        const lists = await Promise.all([...state.selectedTypes].map(getByType));
        const byId = new Map();
        lists.flat().forEach((p) => byId.set(p.id, p)); // unión de tipos
        base = [...byId.values()];
    } else {
        base = state.full;
    }

    if (state.favOnly) {
        const favs = new Set(getFavorites());
        base = base.filter((p) => favs.has(p.id));
    }

    if (state.search) {
        const s = state.search;
        base = base.filter(
            (p) => p.name.includes(s) || String(p.id) === s,
        );
    }

    base = [...base].sort((a, b) => a.id - b.id);
    state.filtered = base;
}

function setBusy(busy) {
    document.body.style.cursor = busy ? "progress" : "";
}

function updateResultCount() {
    const n = state.filtered.length;
    els.count.textContent = `${n} ${n === 1 ? "Pokémon" : "Pokémon"}`;
}

/* ----------------------------- Render ----------------------------- */
function renderNext() {
    if (state.loading || state.rendered >= state.filtered.length) return;
    state.loading = true;
    els.loader.classList.remove("is-hidden");

    const slice = state.filtered.slice(state.rendered, state.rendered + PAGE);
    state.rendered += slice.length;

    const slots = slice.map((item) => {
        const slot = document.createElement("div");
        slot.className = "card-slot";
        slot.innerHTML = skeletonCard();
        els.grid.appendChild(slot);
        return { slot, item };
    });

    Promise.all(
        slots.map(({ slot, item }) =>
            getPokemon(item.url)
                .then((p) => renderCard(slot, p))
                .catch(() => slot.remove()),
        ),
    ).then(() => {
        state.loading = false;
        // Se oculta siempre; si aún queda contenido visible, maybeLoadMore vuelve
        // a mostrarlo al disparar el siguiente lote.
        els.loader.classList.add("is-hidden");
        maybeLoadMore();
    });
}

// Si tras pintar el lote el centinela sigue visible, carga el siguiente.
function maybeLoadMore() {
    const rect = els.sentinel.getBoundingClientRect();
    if (rect.top < window.innerHeight + 200) renderNext();
}

// Mismo esqueleto que una tarjeta real: imagen 130×130, número, nombre y 2 chips.
function skeletonCard() {
    return `
    <div class="poke-card skeleton">
        <div class="poke-img-wrap"><div class="sk sk-img"></div></div>
        <div class="sk sk-num"></div>
        <div class="sk sk-name"></div>
        <div class="sk-types">
            <div class="sk sk-chip"></div>
            <div class="sk sk-chip"></div>
        </div>
    </div>`;
}

function renderCard(slot, p) {
    const img = artworkOf(p) || "/pokeball.png";
    const anim = animatedOf(p);
    const primary = p.types[0].type.name;
    const fav = isFavorite(p.id);
    const cmp = inCompare(p.id);

    slot.innerHTML = `
    <article class="poke-card fade-in" data-id="${p.id}" data-url="https://pokeapi.co/api/v2/pokemon/${p.id}"
        style="--accent:${getTypeHex(primary)}">
        <img src="/pokeball.png" class="poke-deco" alt="" aria-hidden="true" />
        <button class="icon-btn fav-btn ${fav ? "active" : ""}" title="Favorite" aria-label="Favorite">
            ${heartSvg()}
        </button>
        <button class="icon-btn cmp-btn ${cmp ? "active" : ""}" title="Add to compare" aria-label="Compare">
            ${compareSvg()}
        </button>
        <div class="poke-img-wrap">
            <img class="poke-img" loading="lazy" src="${img}" alt="${p.name}"
                data-static="${img}" data-anim="${anim || ""}" />
        </div>
        <small class="poke-num">#${String(p.id).padStart(3, "0")}</small>
        <h3 class="poke-name">${titleCase(p.name)}</h3>
        <div class="poke-types">
            ${p.types
                .map(
                    (t) =>
                        `<span class="type-chip" style="background:${getTypeHex(
                            t.type.name,
                        )}">${titleCase(t.type.name)}</span>`,
                )
                .join("")}
        </div>
    </article>`;

    const card = slot.firstElementChild;

    // Anima el sprite al pasar el cursor (carga diferida del GIF en el primer hover).
    const imgEl = card.querySelector(".poke-img");
    if (imgEl.dataset.anim) {
        card.addEventListener("mouseenter", () => {
            imgEl.src = imgEl.dataset.anim;
            imgEl.classList.add("animated");
        });
        card.addEventListener("mouseleave", () => {
            imgEl.src = imgEl.dataset.static;
            imgEl.classList.remove("animated");
        });
    }

    card.addEventListener("click", () => {
        localStorage.setItem("pokemonUrl", card.dataset.url);
        location.href = "/infopokemon";
    });

    card.querySelector(".fav-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        const active = toggleFavorite(p.id);
        e.currentTarget.classList.toggle("active", active);
        if (state.favOnly && !active) {
            card.classList.add("fade-out");
            setTimeout(() => card.parentElement?.remove(), 250);
        }
    });

    card.querySelector(".cmp-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        const list = getCompare();
        if (!inCompare(p.id) && list.length >= COMPARE_LIMIT) {
            flashTray();
            return;
        }
        toggleCompare(p.id);
        e.currentTarget.classList.toggle("active", inCompare(p.id));
        updateCompareTray();
    });
}

/* ----------------------------- Comparador ----------------------------- */
function syncCardCompareButtons() {
    els.grid.querySelectorAll(".poke-card").forEach((card) => {
        const id = Number(card.dataset.id);
        card.querySelector(".cmp-btn")?.classList.toggle("active", inCompare(id));
    });
}

async function updateCompareTray() {
    const ids = getCompare();
    els.tray.classList.toggle("show", ids.length > 0);
    els.compareOpen.disabled = ids.length < 2;
    els.compareOpen.textContent =
        ids.length < 2 ? "Pick 2+ to compare" : `Compare (${ids.length})`;

    const mons = await Promise.all(ids.map((id) => getPokemon(id)));
    els.trayItems.innerHTML = mons
        .map(
            (p) => `
        <div class="tray-item" data-id="${p.id}" title="Remove ${titleCase(p.name)}">
            <img src="${artworkOf(p) || "/pokeball.png"}" alt="${p.name}" />
            <span class="tray-x">×</span>
        </div>`,
        )
        .join("");

    els.trayItems.querySelectorAll(".tray-item").forEach((item) => {
        item.addEventListener("click", () => {
            toggleCompare(Number(item.dataset.id));
            syncCardCompareButtons();
            updateCompareTray();
        });
    });
}

function flashTray() {
    els.tray.classList.add("shake");
    setTimeout(() => els.tray.classList.remove("shake"), 500);
}

async function openCompare() {
    const ids = getCompare();
    if (ids.length < 2) return;
    const mons = await Promise.all(ids.map((id) => getPokemon(id)));

    const statKeys = Object.keys(STAT_LABELS);
    const totals = mons.map((p) =>
        p.stats.reduce((sum, s) => sum + s.base_stat, 0),
    );
    const maxTotal = Math.max(...totals);

    const header = `
    <div class="cmp-grid cmp-head" style="--cols:${mons.length}">
        <div></div>
        ${mons
            .map(
                (p) => `
            <div class="cmp-mon">
                <img src="${artworkOf(p) || "/pokeball.png"}" alt="${p.name}" />
                <strong>${titleCase(p.name)}</strong>
                <small>#${String(p.id).padStart(3, "0")}</small>
                <div class="poke-types">
                    ${p.types
                        .map(
                            (t) =>
                                `<span class="type-chip" style="background:${getTypeHex(
                                    t.type.name,
                                )}">${titleCase(t.type.name)}</span>`,
                        )
                        .join("")}
                </div>
            </div>`,
            )
            .join("")}
    </div>`;

    const rows = statKeys
        .map((key) => {
            const values = mons.map(
                (p) => p.stats.find((s) => s.stat.name === key)?.base_stat ?? 0,
            );
            const best = Math.max(...values);
            return `
        <div class="cmp-grid" style="--cols:${mons.length}">
            <div class="cmp-stat-label">${STAT_LABELS[key]}</div>
            ${values
                .map(
                    (v) => `
                <div class="cmp-bar-cell">
                    <div class="cmp-bar-track">
                        <div class="cmp-bar-fill" style="width:${(v / 255) * 100}%;background:${getStatHex(
                            v,
                        )}"></div>
                    </div>
                    <span class="cmp-val ${v === best && values.length > 1 ? "best" : ""}">${v}</span>
                </div>`,
                )
                .join("")}
        </div>`;
        })
        .join("");

    const totalRow = `
    <div class="cmp-grid cmp-total" style="--cols:${mons.length}">
        <div class="cmp-stat-label">Total</div>
        ${totals
            .map(
                (t) =>
                    `<div class="cmp-bar-cell"><span class="cmp-val ${
                        t === maxTotal ? "best" : ""
                    }">${t}</span></div>`,
            )
            .join("")}
    </div>`;

    els.modalBody.innerHTML = header + rows + totalRow;
    els.modal.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeCompare() {
    els.modal.classList.remove("show");
    document.body.style.overflow = "";
}

/* ----------------------------- Iconos ----------------------------- */
function heartSvg() {
    return `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>`;
}
function compareSvg() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
        <path d="M7 16V4M7 4L3 8M7 4l4 4M17 8v12M17 20l4-4M17 20l-4-4"/>
    </svg>`;
}
