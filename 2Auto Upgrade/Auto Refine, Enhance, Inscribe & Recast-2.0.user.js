// ==UserScript==
// @name         Auto Refine, Enhance, Inscribe & Recast
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Auto Reroll, Auto Enhance, and Auto Inscribe with UI Dropdown
// @author       PLAYERONE
// @match        https://pockieninja.online
// @grant        none
// ==/UserScript==

/*
  A script that's created for entertainment purposes, not for any serious or practical use
*/

(function() {
    'use strict';

    let isRunningRefine = false;
    let isRunningEnhance = false;
    let isRunningInscribe = false;
    let inscribeInterval;

    function checkStats() {
        return new Promise(resolve => {
            let allStats = [];
            let itemContainer = document.querySelector("div.item-container div.item img.img__image");



            if (itemContainer) {
                let event = new Event('mouseover', { bubbles: true });
                itemContainer.dispatchEvent(event);
            }

            setTimeout(() => {
                let statDivs = document.querySelectorAll("div#tooltip div[style*='color: rgb(56, 142, 233);']");
                statDivs.forEach(div => {
                    let text = div.innerText.split('\n')[0];
                    allStats.push(text);
                });

                console.log("📜 Item Stats:", allStats);
                resolve(allStats);
            }, 500);
        });
    }

    function reroll() {
        return new Promise(resolve => {
            let attemptButton = document.querySelector("#game-container > div.panel--original > div.themed_panel.theme__transparent--original > div > div:nth-child(2) > div > div.j-panel > div:nth-child(2) > div > div:nth-child(2) > button:nth-child(2)");

            if (attemptButton) {
                attemptButton.click();
                console.log("🔄 Clicked Attempt button!");

                setTimeout(() => {
                    let acceptButton = document.querySelector("#game-container > div:nth-child(6) > div.themed_panel.theme__transparent--original > div > div:nth-child(2) > button:nth-child(2)");
                    if (acceptButton) {
                        acceptButton.click();
                        console.log("✅ Clicked Accept button!");
                        resolve(true);
                    } else resolve(false);
                }, 500);
            } else resolve(false);
        });
    }

    async function autoReroll() {
    console.log("🔄 Auto Reroll Started...");
    isRunningRefine = true;

    const requiredStats = ['Stamina', 'Dodge'];
    const optionalStats = ['Max Health', 'Max Health %', 'Const', 'Hit', 'Defense'];

    while (isRunningRefine) {
        let stats = await checkStats();

        // Cek apakah stat wajib sudah ada semua
        let hasRequired = requiredStats.every(stat => stats.includes(stat));

        // Jika stat wajib ada, cek apakah ada minimal 1 dari stat opsional
        let hasOptional = optionalStats.some(stat => stats.includes(stat));

        if (hasRequired) {
            if (hasOptional) {
                console.log("✅ Stats ditemukan (Wajib & Opsional):", stats);
                alert("🎉 Stats yang diinginkan ditemukan! Auto reroll berhenti.");
                isRunningRefine = false;
                break;
            } else {
                console.log("⚠️ Stats wajib ada, tapi tidak ada stat opsional! Reroll lagi...");
            }
        } else {
            console.log("❌ Stats tidak cocok, reroll lagi...");
        }

        await reroll();
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}

    function stopReroll() {
        console.log("🛑 Stopped Auto Reroll.");
        isRunningRefine = false;
    }

    function autoClickEnhance() {
        if (!isRunningEnhance) return;

        let attemptButton = document.querySelector("#game-container > div.panel--original > div.themed_panel.theme__transparent--original > div > div:nth-child(2) > div > div.j-panel > div:nth-child(2) > div > div:nth-child(1) > button:nth-child(2)");
        let acceptButton = document.querySelector("#game-container > div:nth-child(6) > div.themed_panel.theme__transparent--original > div > div:nth-child(2) > button:nth-child(2)");

        if (attemptButton) attemptButton.click();
        setTimeout(() => { if (acceptButton) acceptButton.click(); }, 250);

        setTimeout(autoClickEnhance, 250);
    }

    function startEnhance() {
        isRunningEnhance = true;
        console.log("✨ Auto Enhance Started...");
        autoClickEnhance();
    }

    function stopEnhance() {
        isRunningEnhance = false;
        console.log("🛑 Stopped Auto Enhance.");
    }

    // Auto Inscribe ++

let failStreak = 0;
const maxFailStreak = 30;

// ✅ Fungsi bantu: set value input
function setInputValue(input, value) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
}

// ✅ Fungsi bantu: pilih talisman sesuai level
function setTalismanByLevel(currentLevel) {
    const lowRadio = document.querySelector("#game-container input[type=radio][name=bonus][value='0']");
    const highRadio = document.querySelector("#game-container input[type=radio][name=bonus][value='1']");
    const inputBox = document.querySelector("#game-container input[type=number]");

    if (!lowRadio || !highRadio || !inputBox) {
        console.log("⚠️ Tidak bisa menemukan elemen talisman.");
        return;
    }

    if (currentLevel >= 0 && currentLevel <= 5) {
        lowRadio.click();
        setInputValue(inputBox, 1);
        console.log(`🎯 Set 1 Low Talisman for Level ${currentLevel}`);
    } else if (currentLevel === 6) {
        lowRadio.click();
        setInputValue(inputBox, 3);
        console.log("🎯 Set 3 Low Talisman for Level 6");
    } else if (currentLevel === 7) {
        highRadio.click();
        setInputValue(inputBox, 3);
        console.log("🎯 Set 3 Low Talisman for Level 7");
    } else if (currentLevel === 8) {
        lowRadio.click();
        setInputValue(inputBox, 1);
        console.log("🎯 Set 1 Low Talisman for Level 8");
    } else if (currentLevel === 9 || currentLevel === 10) {
        lowRadio.click();
        setInputValue(inputBox, 3);
        console.log(`🎯 Set 3 Low Talisman for Level ${currentLevel}`);
    } else if (currentLevel === 11) {
        highRadio.click();
        setInputValue(inputBox, 3);
        console.log("🎯 Set 3 High Talisman for Level 11");
    } else if (currentLevel === 12) {
        lowRadio.click();
        setInputValue(inputBox, 1);
        console.log("🎯 Set 1 Low Talisman for Level 12");
    } else if (currentLevel === 13) {
        lowRadio.click();
        setInputValue(inputBox, 3);
        console.log("🎯 Set 3 Low Talisman for Level 13");
    } else if (currentLevel === 14 || currentLevel === 15) {
        highRadio.click();
        setInputValue(inputBox, 3);
        console.log(`🎯 Set 3 High Talisman for Level ${currentLevel}`);
    }
}

// ✅ Pattern recognition + logic utama inscribe
function autoInscribe() {
    if (!isRunningInscribe) return;

    const lvlElem = document.querySelector("#game-container > div:nth-child(4) > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(3) > div.themed_panel.theme__transparent--original > div > div:nth-child(2) > div > div.j-panel > div:nth-child(2) > div > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > pre:nth-child(1)");
    if (lvlElem) {
        const lvlText = lvlElem.innerText.trim();
        const levelMatch = lvlText.match(/Current Lvl:\s*(\d+)/);
        if (levelMatch) {
            const currentLevel = parseInt(levelMatch[1]);
            setTalismanByLevel(currentLevel);
        }
    }

    const inscribeButton = document.querySelector("#game-container > div:nth-child(4) > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(3) > div.themed_panel.theme__transparent--original > div > div:nth-child(2) > div > div.j-panel > div:nth-child(2) > div > div:nth-child(3) > button");
    if (inscribeButton && inscribeButton.innerText.trim() === "Attempt") {
        inscribeButton.click();
        console.log("✍️ Clicked 'Attempt' button...");

        // Tunggu hasil inscribe
        setTimeout(() => {
            const resultElem = document.querySelector("#game-container > div:nth-child(4) > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(3) > div.themed_panel.theme__transparent--original > div > div:nth-child(2) > div > div.j-panel > div:nth-child(2) > div > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > pre:nth-child(1)");
            if (resultElem) {
                const resultText = resultElem.innerText.trim().toLowerCase();

                // ✅ Pattern Recognition
                if (resultText.includes("success")) {
                    console.log("✅ Inscribe Success!");
                    failStreak = 0; // reset gagal
                } else if (resultText.includes("fail")) {
                    console.warn("❌ Inscribe Failed.");
                    failStreak++;
                } else {
                    console.log(`📜 Unknown result: ${resultText}`);
                }

                // ✅ Threshold Stop
                if (failStreak >= maxFailStreak) {
                    stopInscribe();
                    alert("⚠️ Auto Inscribe dihentikan karena gagal berturut-turut!");
                }
            }
        }, 1000);
    } else {
        console.log("❌ 'Attempt' button not found.");
    }

    // ✅ Delay Randomization (acak 0.5 - 1.5 detik)
    const randomDelay = 500 + Math.floor(Math.random() * 1500);
    clearInterval(inscribeInterval);
    inscribeInterval = setInterval(autoInscribe, randomDelay);
}

// ✅ Mulai auto inscribe
function startInscribe() {
    if (isRunningInscribe) return;
    isRunningInscribe = true;
    console.log("🖋️ Auto Inscribe Started...");
    failStreak = 0;
    autoInscribe(); // panggil pertama langsung
}

// ✅ Stop manual
function stopInscribe() {
    isRunningInscribe = false;
    clearInterval(inscribeInterval);
    console.log("🛑 Stopped Auto Inscribe.");
}

    // Recast ----------

let isRunningRecast = false;

function autoRecast() {
    if (!isRunningRecast) return;

    const attemptButton = document.querySelector("#game-container > div:nth-child(4) > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(3) > div.themed_panel.theme__transparent--original > div > div:nth-child(2) > div > div.j-panel > div:nth-child(2) > div > div:nth-child(2) > button");
    const acceptButton = document.querySelector("#game-container > div.panel--original > div.themed_panel.theme__transparent--original > div > div:nth-child(2) > button:nth-child(2)");

    if (attemptButton) {
        attemptButton.click();
        console.log("🔁 Clicked Recast 'Attempt'");

        setTimeout(() => {
            if (acceptButton) {
                acceptButton.click();
                console.log("✅ Clicked 'Accept' after Attempt");
            }
            setTimeout(autoRecast, 250); // lanjut loop setelah delay
        }, 250);
    } else {
        console.log("❌ Recast Attempt button not found.");
        setTimeout(autoRecast, 500); // coba ulangi jika tombol belum muncul
    }
}

function startRecast() {
    if (isRunningRecast) return;
    isRunningRecast = true;
    console.log("♻️ Auto Recast Started...");
    autoRecast();
}

function stopRecast() {
    isRunningRecast = false;
    console.log("🛑 Stopped Auto Recast.");
}

    function createUI() {
        let container = document.createElement("div");
        container.style.position = "fixed";
        container.style.bottom = "60px";
        container.style.right = "30px";
        container.style.background = "white";
        container.style.padding = "10px";
        container.style.border = "1px solid black";
        container.style.borderRadius = "8px";
        container.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.3)";
        container.style.fontFamily = "Arial, sans-serif";
        container.style.maxWidth = "250px";
        container.style.zIndex = "9999";

        let title = document.createElement("div");
        title.innerText = "Auto Refine, Enhance & Inscribe";
        title.style.fontWeight = "bold";
        title.style.marginBottom = "8px";
        container.appendChild(title);

        let dropdown = document.createElement("select");
        dropdown.style.width = "100%";
        dropdown.style.marginBottom = "8px";
        dropdown.style.padding = "5px";
        dropdown.innerHTML = `
            <option value="refine">Refine</option>
            <option value="Enhance">Enhance</option>
            <option value="inscribe">Inscribe</option>
            <option value="recast">Recast</option>
        `;
        container.appendChild(dropdown);

        let buttonContainer = document.createElement("div");
        container.appendChild(buttonContainer);

        function updateButtons() {
            buttonContainer.innerHTML = "";

            if (dropdown.value === "refine") {
                createButton("Check Stat", checkStats);
                createButton("Auto Reroll", autoReroll);
                createButton("Stop Reroll", stopReroll);
            } else if (dropdown.value === "Enhance") {
                createButton("Start Enhance", startEnhance);
                createButton("Stop Enhance", stopEnhance);
            } else if (dropdown.value === "inscribe") {
                createButton("Start Inscribe", startInscribe);
                createButton("Stop Inscribe", stopInscribe);
            } else if (dropdown.value === "recast") {
                createButton("Start Recast", startRecast);
                createButton("Stop Recast", stopRecast);
            }
        }

        function createButton(text, onClick) {
            let button = document.createElement("button");
            button.innerText = text;
            button.style.display = "block";
            button.style.width = "100%";
            button.style.margin = "5px 0";
            button.style.padding = "8px";
            button.style.cursor = "pointer";
            button.style.background = "#4CAF50";
            button.style.color = "white";
            button.style.border = "none";
            button.style.borderRadius = "4px";
            button.style.fontSize = "14px";
            button.addEventListener("click", onClick);
            buttonContainer.appendChild(button);
        }

        dropdown.addEventListener("change", updateButtons);
        updateButtons();
        document.body.appendChild(container);
    }

    createUI();

            console.log(
        "[AutoRefine-3.4] by Salty\n\nSupport me with a donation:\nhttps://paypal.me/murbawisesa\nhttps://saweria.co/boyaghnia"
    );

})();
