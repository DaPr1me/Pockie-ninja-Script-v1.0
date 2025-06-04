// ==UserScript==
// @name         Auto Synthesize Outfit
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Drag and drop outfit otomatis
// @author       PLAYERONE
// @match        https://pockieninja.online
// @grant        none
// ==/UserScript==

/*
  A script that's created for entertainment purposes, not for any serious or practical use
*/

(function () {
    'use strict';

    let intervalId = null;
    let synthesisInProgress = false;

    // === UI Button ===
    function createUIButton() {
        const uiDiv = document.createElement("div");
        uiDiv.innerHTML = `
            <div id="autoCatalystUI" style="position: fixed; top: 540px; left: 2px; background: rgba(0, 0, 0, 0.8); padding: 12px; z-index: 9999; border-radius: 8px; font-family: sans-serif; min-width: 125px;">
                <div>
                    <button id="toggleCatalyst" class="auto-btn">Synthesize Outfit</button>
                </div>
            </div>
            <style>
                .auto-btn {
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
                .auto-btn:hover {
                    background-color: #339cff;
                }
                .auto-btn.active {
                    background-color: #dc3545;
                }
            </style>
        `;
        document.body.appendChild(uiDiv);

        const button = document.getElementById("toggleCatalyst");
        button.addEventListener("click", () => {
            const isRunning = button.classList.toggle("active");
            button.textContent = isRunning ? "Stop Synthesize" : "Synthesize Outfit";

            if (isRunning) {
                intervalId = setInterval(mainLoop, 1500);
                console.log("✅ Auto Synthesize started.");
            } else {
                clearInterval(intervalId);
                intervalId = null;
                console.log("⛔ Auto Synthesize stopped.");
            }
        });
    }

    createUIButton();

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function getItemWithTooltipMatchingMainItem() {
        const mainItemImg = document.querySelector("#game-container > div:nth-child(4) > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(3) > div.themed_panel.theme__transparent--original > div > div:nth-child(2) > div > div.j-panel > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div.single-container.j-panel > div:nth-child(2) > div.item-container > div > img");

        if (!mainItemImg) {
            console.log('❌ Tidak ditemukan gambar item utama.');
            return null;
        }

        const mainItemSrc = mainItemImg.src;

        // Hover untuk dapatkan nama item dari tooltip
        mainItemImg.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window }));
        await delay(300);

        let mainItemBaseName = null;
        const displays = document.querySelectorAll('#tooltip > #display');
        for (const display of displays) {
            const nameDivs = display.querySelectorAll('div div');
            for (const div of nameDivs) {
                const text = div.textContent.trim();
                if (/\+\s*\d+$/.test(text)) {
                    const match = text.match(/^(.*?)\s+\+\s*\d+$/);
                    if (match) {
                        mainItemBaseName = match[1].trim();
                        console.log('✅ Nama item utama ditemukan:', mainItemBaseName);
                        break;
                    }
                }
            }
            if (mainItemBaseName) break;
        }

        if (!mainItemBaseName) {
            console.log('❌ Tidak bisa mengambil nama dari item utama.');
            return null;
        }

        const inventoryPanel = document.querySelector("#game-container > div:nth-child(4) > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(2) > div.themed_panel.theme__transparent--original > div:nth-child(3) > div:nth-child(2) > div:nth-child(4) > div:nth-child(2) > div:nth-child(1)");
        if (!inventoryPanel) {
            console.log('❌ Inventory tidak ditemukan.');
            return null;
        }

        const inventoryImages = inventoryPanel.querySelectorAll('div.item-container img.img__image');
        for (const img of inventoryImages) {
            if (img.src !== mainItemSrc) continue;

            img.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window }));
            await delay(250);

            const tooltipDisplays = document.querySelectorAll('#tooltip > #display');
            for (const display of tooltipDisplays) {
                const nameDivs = display.querySelectorAll('div div');
                for (const div of nameDivs) {
                    const text = div.textContent.trim();
                    const match = text.match(/^(.+?)\s+\+\s*0$/);
                    if (match && match[1].trim() === mainItemBaseName) {
                        console.log('✅ Item +0 yang cocok ditemukan:', text);
                        return img;
                    }
                }
            }
        }

        console.log('❌ Tidak ada item +0 yang cocok ditemukan di inventory.');
        return null;
    }

    async function findCatalystGreenDiv(slotIndex) {
        const allDivs = document.querySelectorAll('div');
        for (const div of allDivs) {
            const childDivs = div.querySelectorAll(':scope > div');
            if (childDivs.length < 3) continue;

            const preTags = childDivs[0].querySelectorAll('pre');
            if (!Array.from(preTags).some(pre => pre.textContent.trim() === 'Catalyst')) continue;

            if (
                childDivs[1].classList.contains('single-container') &&
                childDivs[2].classList.contains('single-container')
            ) {
                const greenDiv = childDivs[slotIndex].querySelector('div[style="position: absolute; width: 100%; height: 100%; background: green; filter: opacity(50%);"]');
                if (greenDiv) {
                    greenDiv.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
                    greenDiv.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
                    return;
                }
            }
        }
        console.log("❌ Tidak ada div hijau yang sesuai ditemukan.");
    }

    async function moveResultToMain() {
        console.log('🔄 Mencoba memindahkan item dari Result ke Main...');

        const resultImg = document.querySelector("#game-container > div:nth-child(4) > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(3) > div.themed_panel.theme__transparent--original > div > div:nth-child(2) > div > div.j-panel > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div.single-container.j-panel > div:nth-child(2) > div.item-container > div > img");

        if (!resultImg) {
            console.log('❌ Tidak ada item di kolom Result.');
            return;
        }

        resultImg.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
        console.log('🖱️ Mouse down pada item Result.');

        let greenDiv = null;
        for (let i = 0; i < 10; i++) {
            const allDivs = document.querySelectorAll('div');
            for (let div of allDivs) {
                const childDivs = div.querySelectorAll(':scope > div');
                if (childDivs.length < 2) continue;

                const preTags = childDivs[0].querySelectorAll('pre');
                if (preTags.length < 1) continue;

                const isMainItem = Array.from(preTags).some(pre => pre.textContent.trim() === 'Main Item');
                if (!isMainItem) continue;

                if (
                    childDivs[1].classList.contains('single-container') &&
                    childDivs[1].classList.contains('j-panel')
                ) {
                    greenDiv = childDivs[1].querySelector('div[style="position: absolute; width: 100%; height: 100%; background: green; filter: opacity(50%);"]');
                    if (greenDiv) break;
                }
            }

            if (greenDiv) break;
            await delay(200);
        }

        if (!greenDiv) {
            console.log('❌ Green div tidak muncul di slot Main.');
            return;
        }

        greenDiv.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
        console.log('✅ Item berhasil dipindahkan ke slot Main.');
    }

    async function mainLoop() {
        if (synthesisInProgress) return;

        try {
            console.log('🔍 Mengecek item main dan inventory...');

            const catalyst1 = document.querySelector("#game-container > div:nth-child(4) > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(3) > div.themed_panel.theme__transparent--original > div > div:nth-child(2) > div > div.j-panel > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2)");
            const catalyst2 = document.querySelector("#game-container > div:nth-child(4) > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(3) > div.themed_panel.theme__transparent--original > div > div:nth-child(2) > div > div.j-panel > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(3)");

            if (!catalyst1 || !catalyst2) {
                console.log('❌ Catalyst Slots tidak ditemukan.');
                return;
            }

            if (catalyst1.querySelector('img') && catalyst2.querySelector('img')) {
                console.log('🔴 Catalyst penuh semua, klik tombol Create.');
                synthesisInProgress = true;

                const createButton = document.querySelector("#game-container > div:nth-child(4) > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(3) > div.themed_panel.theme__transparent--original > div > div:nth-child(2) > div > div.j-panel > div:nth-child(2) > div > div:nth-child(1) > button");
                if (createButton) {
                    createButton.click();
                    console.log('✅ Tombol Create diklik.');
                    await delay(1000);

                    const acceptButton = document.querySelector("#game-container > div.panel--original > div.themed_panel.theme__transparent--original > div > div:nth-child(2) > button:nth-child(2)");
                    if (acceptButton) {
                        acceptButton.click();
                        console.log('✅ Tombol Accept diklik.');
                        await delay(500);
                        await moveResultToMain();
                    } else {
                        console.log('❌ Tombol Accept tidak ditemukan.');
                    }
                }

                synthesisInProgress = false;
                return;
            }

            let mainItemImage = document.querySelector("#game-container > div:nth-child(4) > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(3) > div.themed_panel.theme__transparent--original > div > div:nth-child(2) > div > div.j-panel > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div.single-container.j-panel > div:nth-child(2) > div.item-container > div > img");

            if (!mainItemImage) {
                console.log('❌ Tidak ada gambar di slot Main, mencoba cek slot Result...');
                await moveResultToMain();
                await delay(500);

                mainItemImage = document.querySelector("#game-container > div:nth-child(4) > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(3) > div.themed_panel.theme__transparent--original > div > div:nth-child(2) > div > div.j-panel > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div.single-container.j-panel > div:nth-child(2) > div.item-container > div > img");

                if (!mainItemImage) {
                    console.log('❌ Slot Main tetap kosong.');
                    return;
                }

                console.log('✅ Berhasil pindahkan item dari Result ke Main.');
            }

            const matchedItem = await getItemWithTooltipMatchingMainItem();
            if (!matchedItem) return;

            matchedItem.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
            matchedItem.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
            await delay(500);

            if (!catalyst1.querySelector('img')) {
                console.log('✅ Catalyst 1 kosong, drop di sana.');
                await findCatalystGreenDiv(1);
            } else if (!catalyst2.querySelector('img')) {
                console.log('✅ Catalyst 2 kosong, drop di sana.');
                await findCatalystGreenDiv(2);
            }

        } catch (error) {
            console.error('❌ Error di mainLoop:', error);
            synthesisInProgress = false;
        }
    }

        console.log(
        "[AutoSynthesizeOutfit-2.5] by Salty\n\nSupport me with a donation:\nhttps://paypal.me/murbawisesa\nhttps://saweria.co/boyaghnia"
    );

})();