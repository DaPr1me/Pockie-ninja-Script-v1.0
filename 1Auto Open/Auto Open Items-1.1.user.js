// ==UserScript==
// @name         Auto Open Items
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto right click and "Use" item.
// @author       PLAYERONE
// @match        https://pockieninja.online
// @grant        none
// ==/UserScript==

/*
  A script that's created for entertainment purposes, not for any serious or practical use
*/

(function () {
    'use strict';

    const items = [
        { id: "scroll", label: "S-Scroll", src: "https://pockie-ninja.sfo3.cdn.digitaloceanspaces.com/assets/public/icons/items/tasks/master/38.png", withAccept: true },
        { id: "ascroll", label: "A-Scroll", src: "https://pockie-ninja.sfo3.cdn.digitaloceanspaces.com/assets/public/icons/items/tasks/master/37.png", withAccept: true },
        { id: "stonebag", label: "Stone Bag", src: ["https://pockie-ninja.sfo3.cdn.digitaloceanspaces.com/assets/public/icons/items/etc/226.png", "https://pockie-ninja.sfo3.cdn.digitaloceanspaces.com/assets/public/icons/items/etc/88.png"], withAccept: false },
        { id: "sealbreaker", label: "Seal Breaker", src: "https://pockie-ninja.sfo3.cdn.digitaloceanspaces.com/assets/public/icons/items/etc/treasure.png", withAccept: false },
        { id: "bigsoul", label: "Big Soul", src: "https://pockie-ninja.sfo3.cdn.digitaloceanspaces.com/assets/public/icons/items/etc/15.png", withAccept: false },
        { id: "specialJar", label: "Special Jar", src: "https://pockie-ninja.sfo3.cdn.digitaloceanspaces.com/assets/public/icons/items/etc/293.png", withAccept: false },
        { id: "gemJar", label: "Gem Jar", src: "https://pockie-ninja.sfo3.cdn.digitaloceanspaces.com/assets/public/icons/items/etc/294.png", withAccept: false },
        { id: "midbeans", label: "Midsized Beans", src: "https://pockie-ninja.sfo3.cdn.digitaloceanspaces.com/assets/public/icons/items/crops/14.png", withAccept: false },
    ];

    const intervalIds = {};
    const state = {};

    function createAutoOpenUI() {
        const uiDiv = document.createElement("div");
        uiDiv.innerHTML = `
            <div id="autoItemUI" style="position: fixed; top: 263px; left: 2px; background: rgba(0, 0, 0, 0.8); padding: 12px; z-index: 9999; border-radius: 8px; font-family: sans-serif; width: 125px;">
                <h4 style="color: #ffffff; text-align: center; margin-top: 0; margin-bottom: 10px;">Open Items</h4>
                <select id="itemSelect" style="width: 100%; padding: 5px; margin-bottom: 10px; border-radius: 5px;">
                    ${items.map(item => `
                        <option value="${item.id}">${item.label}</option>
                    `).join('')}
                </select>
                <button id="toggleBtn" class="auto-btn">Start</button>
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

        const toggleBtn = document.getElementById("toggleBtn");
        const select = document.getElementById("itemSelect");

        toggleBtn.addEventListener('click', () => {
            const selectedId = select.value;
            const selectedItem = items.find(i => i.id === selectedId);

            if (!selectedItem) return;

            if (!state[selectedId]) {
                state[selectedId] = true;
                toggleBtn.textContent = "Stop";
                toggleBtn.classList.add('active');

                intervalIds[selectedId] = startAuto(selectedItem.src, selectedItem.label, selectedItem.withAccept, () => {
                    state[selectedId] = false;
                    toggleBtn.textContent = "Start";
                    toggleBtn.classList.remove('active');
                });

            } else {
                state[selectedId] = false;
                clearInterval(intervalIds[selectedId]);
                toggleBtn.textContent = "Start";
                toggleBtn.classList.remove('active');
            }
        });

        setTimeout(() => {
            const options = document.querySelectorAll('#itemSelect option');
            options.forEach(option => {
                const item = items.find(i => i.id === option.value);
                if (item) {
                    const icon = Array.isArray(item.src) ? item.src[0] : item.src;
                    option.style.backgroundImage = `url(${icon})`;
                }
            });
        }, 100);
    }

    function isMatchingSrc(imgSrc, targetSrc) {
        if (Array.isArray(targetSrc)) {
            return targetSrc.some(src => imgSrc.includes(src));
        }
        return imgSrc.includes(targetSrc);
    }

    function startAuto(src, label, withAccept, onStop) {
        const interval = setInterval(() => {
            const items = document.querySelectorAll('.item-container .item');
            let found = false;

            for (let item of items) {
                const img = item.querySelector('img.img__image');
                if (img && isMatchingSrc(img.src, src)) {
                    found = true;
                    console.log(`${label} ditemukan → klik kanan`);
                    const rightClick = new MouseEvent("contextmenu", {
                        bubbles: true,
                        cancelable: true,
                        view: item.ownerDocument.defaultView || window,
                        button: 2
                    });
                    item.dispatchEvent(rightClick);

                    setTimeout(() => {
                        const useBtn = [...document.querySelectorAll('.context-menu__item')]
                            .find(el => el.textContent.trim() === "Use");
                        if (useBtn) {
                            console.log(`Klik Use pada ${label}`);
                            useBtn.click();

                            if (withAccept) {
                                setTimeout(() => {
                                    const acceptBtn = [...document.querySelectorAll('button')]
                                        .find(el => el.textContent.trim() === "Accept");
                                    if (acceptBtn) {
                                        console.log("Klik Accept");
                                        acceptBtn.click();
                                    }
                                }, 500);
                            }
                        }
                    }, 500);
                    break;
                }
            }

            if (!found) {
                clearInterval(interval);
                console.log(`${label} tidak ditemukan. Auto ${label} dihentikan.`);
                onStop();
            }
        }, 500);

        return interval;
    }

    window.addEventListener('load', () => {
        setTimeout(createAutoOpenUI);
        console.log(
            "[AutoOpenItems-2.0] by Salty\n\nSupport me with a donation:\nhttps://paypal.me/murbawisesa\nhttps://saweria.co/boyaghnia"
        );
    });
})();