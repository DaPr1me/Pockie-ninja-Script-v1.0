// ==UserScript==
// @name         Auto Open Wishing Pots
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description Open Wishing Pots based on selected outfits.
// @author       PLAYERONE
// @match        https://pockieninja.online
// @grant        none
// ==/UserScript==

/*
  A script that's created for entertainment purposes, not for any serious or practical use
*/

(function () {
    'use strict';

    // ======================= DATA ==========================
        const outfitPositionMap = {
        espada: {
            "Espada #1": { row: 0, col: 0 },
            "Espada #2": { row: 0, col: 1 },
            "Espada #3": { row: 0, col: 2 },
            "Espada #4": { row: 0, col: 3 },
            "Espada #5": { row: 0, col: 4 },
            "Espada #6": { row: 1, col: 0 },
            "Espada #7": { row: 1, col: 1 },
            "Espada #8": { row: 1, col: 2 },
            "Espada #9": { row: 1, col: 3 },
            "Espada #10": { row: 1, col: 4 }
        },
        bankai: {
            "Ichigo": { row: 0, col: 0 },
            "Halibel": { row: 0, col: 1 },
            "Rukia": { row: 0, col: 2 },
            "Nelliel": { row: 0, col: 3 },
            "Ulquiorra": { row: 0, col: 4 },
            "Orihime": { row: 1, col: 0 }
        },
        akatsuki: {
            "Hidan": { row: 0, col: 0 },
            "Sasori": { row: 0, col: 1 },
            "Pain": { row: 0, col: 2 },
            "Konan": { row: 0, col: 3 },
            "Kisame": { row: 0, col: 4 },
            "Kakuzu": { row: 1, col: 0 },
            "Deidara": { row: 1, col: 1 },
            "Itachi": { row: 1, col: 2 }
        },
        ltpot: {
            "Momo": { row: 0, col: 0 },
            "Rangiku": { row: 0, col: 1 },
            "Masiro Kuna": { row: 0, col: 2 },
            "Hiyori": { row: 0, col: 3 },
            "Lisa Yadomaru": { row: 0, col: 4 },
            "Renji": { row: 1, col: 0 },
            "Nanao Ise": { row: 1, col: 1 },
            "Gin Ichimaru": { row: 1, col: 2 },
            "Yachiru": { row: 1, col: 3 },
            "Isane Kotetsu": { row: 1, col: 4 },
            "Nemu Kurotsuchi": { row: 2, col: 0 }
        },
        captpot: {
            "Yamamoto": { row: 0, col: 0 },
            "Ukitake": { row: 0, col: 1 },
            "Shunsui": { row: 0, col: 2 },
            "Toshiro": { row: 0, col: 3 },
            "Byakuya": { row: 0, col: 4 },
            "Shinji": { row: 1, col: 0 },
            "Kenpachi": { row: 1, col: 1 },
            "Soifon": { row: 1, col: 2 },
            "Aizen": { row: 1, col: 3 },
            "Retsu": { row: 1, col: 4 }
        },
        resurected: {
            "Gaara": { row: 0, col: 0 },
            "Kakashi": { row: 0, col: 1 },
            "4th Hokage": { row: 0, col: 2 },
            "Yoruichi": { row: 0, col: 3 },
            "Little Meng": { row: 0, col: 4 },
            "Little Jun": { row: 1, col: 0 },
            "Itachi": { row: 1, col: 1 }
        },
        tailedbeast: {
            "Shukaku": { row: 0, col: 0 },
            "Isobu": { row: 0, col: 1 },
            "Son Goku": { row: 0, col: 2 },
            "Kokuo": { row: 0, col: 3 },
            "Saiken": { row: 0, col: 4 },
            "Chomei": { row: 1, col: 0 }
        },
        srtailedbeast: {
            "Matatabi": { row: 0, col: 0 },
            "Gyuki": { row: 0, col: 1 },
            "Kurama": { row: 0, col: 2 }
        },
        tailedbeast2: {
            "Shukaku": { row: 0, col: 0 },
            "Isobu": { row: 0, col: 1 },
            "Son Goku": { row: 0, col: 2 },
            "Kokuo": { row: 0, col: 3 },
            "Saiken": { row: 0, col: 4 },
            "Chomei": { row: 1, col: 0 }
        },
        srtailedbeast2: {
            "Matatabi": { row: 0, col: 0 },
            "Gyuki": { row: 0, col: 1 },
            "Kurama": { row: 0, col: 2 }
        },
        shippuden: {
            "Kakuzu": { page: 1, row: 0, col: 0 },
            "Hidan": { page: 1, row: 0, col: 1 },
            "Deidara": { page: 1, row: 0, col: 2 },
            "Kisame": { page: 1, row: 0, col: 3 },
            "Suigetsu": { page: 1, row: 0, col: 4 },
            "Karin": { page: 2, row: 0, col: 0 },
            "Isane": { page: 2, row: 0, col: 1 },
            "Kukaku": { page: 2, row: 0, col: 2 },
            "Tatsuki": { page: 2, row: 0, col: 3 }
        }
    };

    const potVariants = [
        { id: "espada", label: "Espadas Wishing Pot", src: "https://pockie-ninja.sfo3.cdn.digitaloceanspaces.com/assets/public/icons/items/etc/269.png", outfits: Object.keys(outfitPositionMap.espada) },
        { id: "bankai", label: "Bankai Wishing Pot", src: "https://pockie-ninja.sfo3.cdn.digitaloceanspaces.com/assets/public/icons/items/etc/269.png", outfits: Object.keys(outfitPositionMap.bankai) },
        { id: "akatsuki", label: "Akatsuki Wishing Pot", src: "https://pockie-ninja.sfo3.cdn.digitaloceanspaces.com/assets/public/icons/items/etc/269.png", outfits: Object.keys(outfitPositionMap.akatsuki) },
        { id: "ltpot", label: "Lieutenants of The Gotei 13 Pot", src: "https://pockie-ninja.sfo3.cdn.digitaloceanspaces.com/assets/public/icons/items/etc/269.png", outfits: Object.keys(outfitPositionMap.ltpot) },
        { id: "captpot", label: "Captains of The Gotei 13 Wishing Pot", src: "https://pockie-ninja.sfo3.cdn.digitaloceanspaces.com/assets/public/icons/items/etc/269.png", outfits: Object.keys(outfitPositionMap.captpot) },
        { id: "resurected", label: "Resurected Wishing Pot", src: "https://pockie-ninja.sfo3.cdn.digitaloceanspaces.com/assets/public/icons/items/etc/269.png", outfits: Object.keys(outfitPositionMap.resurected) },
        { id: "shippuden", label: "Shippuden Outfit Wishing Pot (Not Bound)", src: "https://pockie-ninja.sfo3.cdn.digitaloceanspaces.com/assets/public/icons/items/etc/269.png", outfits: Object.keys(outfitPositionMap.shippuden) },
        { id: "tailedbeast2", label: "Tailed Beast Wishing Pot", src: "https://pockie-ninja.sfo3.cdn.digitaloceanspaces.com/assets/public/icons/items/etc/269.png", outfits: Object.keys(outfitPositionMap.tailedbeast2) },
        { id: "tailedbeast", label: "Tailed Beast Wishing Pot (Not Bound)", src: "https://pockie-ninja.sfo3.cdn.digitaloceanspaces.com/assets/public/icons/items/etc/269.png", outfits: Object.keys(outfitPositionMap.tailedbeast) },
        { id: "srtailedbeast2", label: "S-Rank Tailed Beast Wishing Pot", src: "https://pockie-ninja.sfo3.cdn.digitaloceanspaces.com/assets/public/icons/items/etc/269.png", outfits: Object.keys(outfitPositionMap.srtailedbeast2) },
        { id: "srtailedbeast", label: "S-Rank Tailed Beast Wishing Pot (Not Bound)", src: "https://pockie-ninja.sfo3.cdn.digitaloceanspaces.com/assets/public/icons/items/etc/269.png", outfits: Object.keys(outfitPositionMap.srtailedbeast) },
    ];

    // ======================= STATE ==========================
    const state = {};
    const intervalIds = {};
    let selectedOutfit = "";
    let selectedPotId = "";
    const isRunningTask = {};
    const potDivCache = {}; // { potId: potDiv }

    // ======================= UTILS ==========================
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getTooltipNama() {
        const nameElement = document.querySelector("#display > div > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)");
        return nameElement ? nameElement.textContent.trim().toLowerCase() : "";
    }

    // ======================= UI ==========================
    function createPotUI() {
        const uiDiv = document.createElement("div");
        uiDiv.innerHTML = `
            <div id="potItemUI" style="position: fixed; top: 385px; left: 2px; background: rgba(0, 0, 0, 0.8); padding: 12px; z-index: 9999; border-radius: 8px; font-family: sans-serif; width: 125px;">
                <h4 style="color: #ffffff; text-align: center; margin: 0 0 10px;">Open Pots</h4>
                <select id="potSelect" style="width: 100%; margin-bottom: 8px; padding: 4px; border-radius: 4px;">
                    ${potVariants.map(p => `<option value="${p.id}">${p.label}</option>`).join('')}
                </select>
                <select id="outfitSelect" style="width: 100%; margin-bottom: 10px; padding: 4px; border-radius: 4px;"></select>
                <button id="potToggleBtn" class="pot-btn">Start</button>
            </div>
            <style>
                .pot-btn {
                    width: 100%;
                    padding: 6px 10px;
                    border: none;
                    border-radius: 5px;
                    background-color: #007bff;
                    color: white;
                    font-size: 13px;
                    cursor: pointer;
                    transition: 0.2s ease-in-out;
                }
                .pot-btn:hover { background-color: #339cff; }
                .pot-btn.active { background-color: #dc3545; }
            </style>
        `;
        document.body.appendChild(uiDiv);

        const potSelect = document.getElementById("potSelect");
        const outfitSelect = document.getElementById("outfitSelect");
        const toggleBtn = document.getElementById("potToggleBtn");

        function updateOutfitOptions(potId) {
            const pot = potVariants.find(p => p.id === potId);
            outfitSelect.innerHTML = pot.outfits.map(o => `<option value="${o}">${o}</option>`).join('');
            outfitSelect.style.display = pot.outfits.length > 0 ? "block" : "none";
            selectedOutfit = outfitSelect.value;
            selectedPotId = potId;
        }

        potSelect.addEventListener("change", () => updateOutfitOptions(potSelect.value));
        outfitSelect.addEventListener("change", () => selectedOutfit = outfitSelect.value);
        potSelect.dispatchEvent(new Event("change"));

        toggleBtn.addEventListener('click', () => togglePot());
    }

    function updateToggleUI(isRunning) {
        const toggleBtn = document.getElementById("potToggleBtn");
        if (isRunning) {
            toggleBtn.textContent = "Stop";
            toggleBtn.classList.add('active');
        } else {
            toggleBtn.textContent = "Start";
            toggleBtn.classList.remove('active');
        }
    }

    // ======================= MAIN LOGIC ==========================
    function togglePot() {
        const potSelect = document.getElementById("potSelect");
        const potId = potSelect.value;
        const pot = potVariants.find(p => p.id === potId);
        if (!pot) return;

        if (!state[potId]) {
            for (const id in state) {
                if (state[id]) {
                    clearInterval(intervalIds[id]);
                    state[id] = false;
                    isRunningTask[id] = false;
                }
            }

            state[potId] = true;
            isRunningTask[potId] = true;
            intervalIds[potId] = startAutoUsePot(pot, () => {
                state[potId] = false;
                isRunningTask[potId] = false;
                updateToggleUI(false);
            });

            updateToggleUI(true);
        } else {
            state[potId] = false;
            isRunningTask[potId] = false;
            clearInterval(intervalIds[potId]);
            updateToggleUI(false);
        }
    }

    function startAutoUsePot(pot, onDone) {
        return setInterval(() => {
            cariDanUsePot(pot, onDone);
        }, 2000);
    }

    async function cariDanUsePot(pot, onDone) {
        if (!state[pot.id]) return;

        if (potDivCache[pot.id] && document.body.contains(potDivCache[pot.id])) {
            console.log("Menggunakan pot cached!");
            await usePotDiv(potDivCache[pot.id], pot, onDone);
            return;
        }

        const gamePanel = document.querySelector("#game-container > div.panel--original");
        if (gamePanel) {
            console.log("Game panel aktif, stop cari pot.");
            onDone();
            return;
        }

        const allMatchingImages = Array.from(document.querySelectorAll("img.img__image"))
            .filter(img => img.src === pot.src);

        console.log(`Ditemukan ${allMatchingImages.length} pot.`);

        for (const img of allMatchingImages) {
            if (!isRunningTask[pot.id]) return;

            const potDiv = img.closest(".item") || img.closest("div");
            if (!potDiv) continue;

            potDiv.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
            await delay(800);

            if (!isRunningTask[pot.id]) return;

            const namaTooltip = getTooltipNama();
            console.log(`Tooltip: "${namaTooltip}"`);

            if (namaTooltip === pot.label.toLowerCase()) {
                console.log("Nama cocok, klik kanan dan use");
                potDivCache[pot.id] = potDiv; // <-- Tambahkan cache disini
                potDiv.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, button: 2 }));
                await delay(700);

                if (!isRunningTask[pot.id]) return;

                const useButton = Array.from(document.querySelectorAll(".context-menu__item"))
                    .find(el => el.textContent.trim().toLowerCase() === "use");

                if (useButton) {
                    useButton.click();
                    console.log("Klik 'Use' berhasil");
                    await delay(1200);

                    if (!isRunningTask[pot.id]) return;
                    await autoPickOutfitAndClaim(pot.id, selectedOutfit);
                    return;
                }
            } else {
                console.log("Nama tidak cocok, lepas hover.");
                potDiv.dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
                await delay(300);
            }
        }
    }

    async function usePotDiv(potDiv, pot, onDone) {
        if (!isRunningTask[pot.id]) return;

        potDiv.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, button: 2 }));
        await delay(700);

        if (!isRunningTask[pot.id]) return;

        const useButton = Array.from(document.querySelectorAll(".context-menu__item"))
            .find(el => el.textContent.trim().toLowerCase() === "use");

        if (useButton) {
            useButton.click();
            console.log("Klik 'Use' dari cache berhasil");
            await delay(1200);

            if (!isRunningTask[pot.id]) return;
            await autoPickOutfitAndClaim(pot.id, selectedOutfit);
        } else {
            console.warn("Use button tidak ditemukan, cache mungkin invalid.");
            potDivCache[pot.id] = null; // Kosongkan cache
        }
    }

async function autoPickOutfitAndClaim(potId, outfitName) {
    const outfitPos = outfitPositionMap[potId] && outfitPositionMap[potId][outfitName];
    if (!outfitPos) {
        console.log("Outfit tidak ditemukan");
        return;
    }

    const page = outfitPos.page || 1; // default page 1
    console.log(`Mau pilih outfit "${outfitName}" di page ${outfitPos.page}, row ${outfitPos.row}, col ${outfitPos.col}`);


    if (outfitPos.page === 2) {
        // klik tombol ke halaman 2
        const page2Button = document.querySelector("#game-container > div.panel--original > div.themed_panel.theme__transparent--original > div > div:nth-child(2) > div > div.tabbed_pane__tabs > div:nth-child(2) > button");
        if (page2Button) {
            page2Button.click();
            console.log("Klik tombol ke halaman 2");
            await delay(600); // tunggu animasi page ganti
        } else {
            console.warn("Tombol halaman 2 tidak ditemukan!");
        }
    }

    clickOutfitGrid(outfitPos.row, outfitPos.col);

    let maxWait = 5000;
    let start = Date.now();
    while (Date.now() - start < maxWait) {
        const selectedOverlay = document.querySelector('.grid-overlay.selected');
        if (selectedOverlay) {
            console.log("Outfit selected, lanjut klik Claim");

            const claimButton = document.querySelector("#game-container > div.panel--original > div.themed_panel.theme__transparent--original > div > div:nth-child(2) > button");
            if (claimButton) {
                claimButton.click();
                console.log("Klik tombol Claim berhasil");
            } else {
                console.warn("Tombol Claim tidak ditemukan!");
            }
            break;
        }
        await delay(300);
    }
}

    function clickOutfitGrid(row, col) {
        const panel = document.querySelector('.item-container');
        if (!panel) return console.warn('Panel outfit tidak ditemukan');

        const rect = panel.getBoundingClientRect();
        const itemWidth = 54;
        const itemHeight = 54;

        const x = rect.left + (col * itemWidth) + itemWidth/2;
        const y = rect.top + (row * itemHeight) + itemHeight/2;

        const target = document.elementFromPoint(x, y);
        if (target) {
            ['mousedown', 'mouseup', 'click'].forEach(eventType => {
                target.dispatchEvent(new MouseEvent(eventType, { bubbles: true }));
            });
            console.log(`Klik item di row: ${row}, col: ${col}`);
        } else {
            console.warn('Tidak ada elemen di posisi:', x, y);
        }
    }

    // ======================= START ==========================
    createPotUI();
    console.log(
        "[AutoOpenPots-1.4] by Salty\n\nSupport me with a donation:\nhttps://paypal.me/murbawisesa\nhttps://saweria.co/boyaghnia"
    );

})();
