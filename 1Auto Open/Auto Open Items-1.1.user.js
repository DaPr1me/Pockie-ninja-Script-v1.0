// ==UserScript==
// @name         Auto Synthesize Outfit
// @namespace    http://tampermonkey.net/
// @version      2.2
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

    // === CONFIG ===
    const targetOutfitName = "Espada#1 Coyote Starrk"; // Change this to the exact outfit name you want

    // === Utility: Wait for Element ===
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const intervalTime = 100;
            let timeElapsed = 0;

            const interval = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(interval);
                    resolve(el);
                } else if (timeElapsed >= timeout) {
                    clearInterval(interval);
                    reject(new Error(`Element not found: ${selector}`));
                }
                timeElapsed += intervalTime;
            }, intervalTime);
        });
    }

    // === Core: Auto Pick + Sell ===
    async function autoPickOutfitAndSell() {
        try {
            // Open the Wishing Pot panel
            const openBtn = document.querySelector("#openWishingPotBtn");
            if (openBtn) openBtn.click();

            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for animation

            const resultText = document.querySelector("#wishResultText");
            if (!resultText) return;

            const outfitName = resultText.textContent.trim();
            if (outfitName.includes(targetOutfitName)) {
                console.log("🎯 Target outfit obtained:", outfitName);

                // Click "Claim" or equivalent
                const claimBtn = document.querySelector("#claimOutfitBtn");
                if (claimBtn) {
                    claimBtn.click();
                    console.log("🎁 Outfit claimed!");

                    // Delay and sell it
                    setTimeout(() => {
                        autoSellOutfit(outfitName);
                    }, 1500);
                }
            } else {
                console.log("❌ Not the desired outfit:", outfitName);
            }
        } catch (err) {
            console.error("⚠️ Error in autoPickOutfitAndSell:", err);
        }
    }

    // === Sell Outfit From Inventory ===
    function autoSellOutfit(outfitName) {
        try {
            // Open inventory if needed
            const inventoryBtn = document.querySelector("#openInventoryBtn");
            if (inventoryBtn) inventoryBtn.click();

            // Find all outfits in the bag
            const outfitItems = document.querySelectorAll(".bag-item.outfit");

            for (const item of outfitItems) {
                const name = item.getAttribute("data-name") || item.title || "";
                if (name.includes(outfitName)) {
                    console.log("💰 Selling outfit:", name);
                    item.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true }));

                    setTimeout(() => {
                        const sellBtn = document.querySelector(".context-menu .sell-btn");
                        if (sellBtn) sellBtn.click();
                    }, 500);

                    break;
                }
            }
        } catch (e) {
            console.error("⚠️ Error in autoSellOutfit:", e);
        }
    }

    // === Run every 5 seconds (or trigger manually if you prefer) ===
    setInterval(autoPickOutfitAndSell, 5000);
})();
