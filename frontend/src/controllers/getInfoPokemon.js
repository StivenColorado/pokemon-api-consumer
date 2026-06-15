import { getTypeHex, getStatHex } from "./getTypeColors.js";
import { getPokemon, getJson, artworkOf, animatedOf } from "./pokeApi.js";
import { isFavorite, toggleFavorite } from "./store.js";

const STAT_LABELS = {
    hp: "HP", attack: "Attack", defense: "Defense",
    "special-attack": "Sp. Atk", "special-defense": "Sp. Def", speed: "Speed",
};
const titleCase = (s) => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

document.addEventListener("DOMContentLoaded", async () => {
    const container = document.querySelector("#detail");
    const pokemonUrl = localStorage.getItem("pokemonUrl");

    if (!pokemonUrl) {
        location.href = "/";
        return;
    }

    let p;
    try {
        p = await getPokemon(pokemonUrl);
    } catch (_) {
        container.innerHTML = `<p class="detail-error">Could not load this Pokémon. <a href="/">Go back</a></p>`;
        return;
    }

    const primary = p.types[0].type.name;
    const accent = getTypeHex(primary);
    const total = p.stats.reduce((sum, s) => sum + s.base_stat, 0);
    const fav = isFavorite(p.id);
    const hasAnim = !!animatedOf(p);

    container.style.setProperty("--accent", accent);
    container.innerHTML = `
    <a href="/" class="back-btn">← Back to Pokédex</a>

    <div class="detail-card">
        <div class="detail-left">
            <div class="detail-img-wrap">
                <img id="detail-img" src="${artworkOf(p) || "/pokeball.png"}" alt="${p.name}" />
            </div>
            <div class="detail-img-actions">
                ${hasAnim ? `<button id="anim-toggle" class="pill-btn" title="Toggle animation">🎬 Animated</button>` : ""}
                <button id="shiny-toggle" class="pill-btn" title="Toggle shiny">✨ Shiny</button>
                ${
                    p.cries?.latest
                        ? `<button id="cry-btn" class="pill-btn cry-pill" title="Play this Pokémon's cry">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" width="17" height="17">
                                <path d="M11 5 6 9H2v6h4l5 4V5z"></path>
                                <path class="wave wave-1" d="M15.5 8.5a5 5 0 0 1 0 7"></path>
                                <path class="wave wave-2" d="M18.5 5.5a9 9 0 0 1 0 13"></path>
                            </svg>
                            Play cry
                        </button>`
                        : ""
                }
            </div>
            <span class="detail-num">#${String(p.id).padStart(3, "0")}</span>
            <h1 class="detail-name">${titleCase(p.name)}</h1>
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

            <div class="detail-meta">
                <div><span>${(p.height / 10).toFixed(1)} m</span><small>Height</small></div>
                <div><span>${(p.weight / 10).toFixed(1)} kg</span><small>Weight</small></div>
                <div><span>${p.base_experience ?? "—"}</span><small>Base XP</small></div>
            </div>

            <button id="fav-detail" class="fav-detail ${fav ? "active" : ""}">
                ${fav ? "♥ In favorites" : "♡ Add to favorites"}
            </button>
        </div>

        <div class="detail-right">
            <h2>Abilities</h2>
            <div class="ability-list">
                ${p.abilities
                    .map(
                        (a) =>
                            `<span class="ability ${a.is_hidden ? "hidden-ability" : ""}">
                                ${titleCase(a.ability.name)}${a.is_hidden ? " <em>(hidden)</em>" : ""}
                            </span>`,
                    )
                    .join("")}
            </div>

            <h2>Base stats</h2>
            <div class="stat-list">
                ${Object.keys(STAT_LABELS)
                    .map((key) => {
                        const v = p.stats.find((s) => s.stat.name === key)?.base_stat ?? 0;
                        return `
                        <div class="stat-row">
                            <span class="stat-name">${STAT_LABELS[key]}</span>
                            <span class="stat-val">${v}</span>
                            <div class="stat-track">
                                <div class="stat-fill" style="width:${(v / 255) * 100}%;background:${getStatHex(v)}"></div>
                            </div>
                        </div>`;
                    })
                    .join("")}
                <div class="stat-row total">
                    <span class="stat-name">Total</span>
                    <span class="stat-val">${total}</span>
                    <div class="stat-track">
                        <div class="stat-fill" style="width:${(total / 720) * 100}%;background:${accent}"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <section class="evolution">
        <h2>Evolution chain</h2>
        <div id="evo-row" class="evo-row"><span class="evo-loading">Loading…</span></div>
    </section>`;

    wireDetail(p);
    buildEvolution(p);
});

function wireDetail(p) {
    const img = document.querySelector("#detail-img");
    const shinyBtn = document.querySelector("#shiny-toggle");
    const animBtn = document.querySelector("#anim-toggle");
    let shiny = false;
    let animated = false;

    const updateImg = () => {
        const src =
            (animated ? animatedOf(p, shiny) : artworkOf(p, shiny)) ||
            artworkOf(p, shiny) ||
            "/pokeball.png";
        img.classList.add("flip");
        setTimeout(() => img.classList.remove("flip"), 400);
        img.src = src;
        img.classList.toggle("animated", animated);
    };

    shinyBtn.addEventListener("click", () => {
        shiny = !shiny;
        shinyBtn.classList.toggle("active", shiny);
        updateImg();
    });

    if (animBtn) {
        animBtn.addEventListener("click", () => {
            animated = !animated;
            animBtn.classList.toggle("active", animated);
            updateImg();
        });
    }

    const cryBtn = document.querySelector("#cry-btn");
    if (cryBtn && p.cries?.latest) {
        const TARGET_VOL = 0.15; // los cries son muy estridentes, lo mantenemos bajo
        const audio = new Audio(p.cries.latest);
        audio.volume = 0;
        audio.addEventListener("playing", () => cryBtn.classList.add("playing"));
        audio.addEventListener("ended", () => cryBtn.classList.remove("playing"));
        cryBtn.addEventListener("click", () => {
            audio.pause();
            audio.currentTime = 0;
            audio.volume = 0;
            audio
                .play()
                .then(() => {
                    // fade-in suave (~140ms) para suavizar el ataque del sonido
                    const steps = 8;
                    let i = 0;
                    const ramp = setInterval(() => {
                        i++;
                        audio.volume = Math.min(TARGET_VOL, (i / steps) * TARGET_VOL);
                        if (i >= steps) clearInterval(ramp);
                    }, 18);
                })
                .catch(() => {});
        });
    }

    const favBtn = document.querySelector("#fav-detail");
    favBtn.addEventListener("click", () => {
        const active = toggleFavorite(p.id);
        favBtn.classList.toggle("active", active);
        favBtn.textContent = active ? "♥ In favorites" : "♡ Add to favorites";
    });
}

async function buildEvolution(p) {
    const row = document.querySelector("#evo-row");
    try {
        const species = await getJson(p.species.url);
        const chain = await getJson(species.evolution_chain.url);

        // Niveles de evolución (BFS) para soportar ramas como Eevee.
        const stages = [];
        let level = [chain.chain];
        while (level.length) {
            stages.push(level.map((n) => n.species.name));
            level = level.flatMap((n) => n.evolves_to);
        }

        const stageEls = await Promise.all(
            stages.map(async (names) => {
                const mons = await Promise.all(
                    names.map((name) =>
                        getPokemon(`https://pokeapi.co/api/v2/pokemon/${name}`).catch(() => null),
                    ),
                );
                const cards = mons
                    .filter(Boolean)
                    .map(
                        (m) => `
                    <div class="evo-mon ${m.id === p.id ? "current" : ""}"
                        data-url="https://pokeapi.co/api/v2/pokemon/${m.id}">
                        <img src="${artworkOf(m) || "/pokeball.png"}" alt="${m.name}" />
                        <small>#${String(m.id).padStart(3, "0")}</small>
                        <span>${titleCase(m.name)}</span>
                    </div>`,
                    )
                    .join("");
                return `<div class="evo-stage">${cards}</div>`;
            }),
        );

        row.innerHTML = stageEls.join('<span class="evo-arrow">→</span>');

        row.querySelectorAll(".evo-mon").forEach((el) => {
            el.addEventListener("click", () => {
                if (el.classList.contains("current")) return;
                localStorage.setItem("pokemonUrl", el.dataset.url);
                location.href = "/infopokemon";
            });
        });
    } catch (_) {
        row.innerHTML = `<span class="evo-loading">No evolution data.</span>`;
    }
}
