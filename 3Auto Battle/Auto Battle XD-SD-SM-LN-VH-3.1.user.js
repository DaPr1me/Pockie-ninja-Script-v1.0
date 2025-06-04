// ==UserScript==
// @name         Auto Battle Plus
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  SoulBlade Demon, Slot Machine, Las Noches, Valhalla Lv. 56
// @author       PLAYERONE
// @match        https://pockieninja.online
// @grant        none
// ==/UserScript==

/*
  A script that's created for entertainment purposes, not for any serious or practical use
*/

(function () {
  "use strict";

  let autoBattleSlot = false;
  let autoBattleLN = false;
  let slotSudahDibuka = false;

  // === SLOT MACHINE ===

  function klikChallengeSlot() {
    if (!autoBattleSlot) return;

    const observer = new MutationObserver(() => {
      let tombolChallenge = document.querySelector(".slot-machine__challenge-btn");
      if (tombolChallenge) {
        console.log("[AutoBattle] Challenge muncul, langsung klik");
        tombolChallenge.click();
        cekBattleSelesai(klikChallengeSlot);
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    let tombolChallenge = document.querySelector(".slot-machine__challenge-btn");
    if (tombolChallenge) {
      console.log("[AutoBattle] Tombol Challenge sudah ada, langsung klik");
      tombolChallenge.click();
      cekBattleSelesai(klikChallengeSlot);
      observer.disconnect();
      return;
    }

    if (!slotSudahDibuka) {
      let kotakSlot = document.querySelector("#game-container > div.slot-machine__icon > button > img");
      if (kotakSlot) {
        console.log("[AutoBattle] Clicked Slot Machine");
        kotakSlot.click();
        slotSudahDibuka = true;
      }
    }
  }

  function startAutoBattleSlot() {
    if (autoBattleSlot) return;
    autoBattleSlot = true;
    console.log("[AutoBattle] Slot Machine Start");
    klikChallengeSlot();
  }

  function stopAutoBattleSlot() {
    autoBattleSlot = false;
    console.log("[AutoBattle] Slot Machine Stop");
  }

  // === LAS NOCHES ===

  let targetFloorLN = 170;

  function klikContinueLN() {
  if (!autoBattleLN) return;

  let floorElement = [...document.querySelectorAll("pre")].find((pre) =>
    pre.textContent.trim().startsWith("Current Floor")
  );

  if (floorElement) {
    let currentFloor = parseInt(
      floorElement.textContent.replace("Current Floor", "").trim(),
      10
    );

    if (!isNaN(currentFloor) && currentFloor === targetFloorLN) {
      console.log(`[AutoBattle] Floor ${currentFloor} tercapai, Auto Battle dihentikan`);
      document.getElementById("toggleLN")?.click();
      autoBattleLN = false;
      return;
    }

    console.log(`[AutoBattle] Current Floor: ${currentFloor}`);
  }

  let button = [...document.querySelectorAll("button")].find(
    (btn) =>
      btn.textContent.trim() === "Continue" &&
      btn.classList.contains("theme__button--original")
  );

  if (button) {
    console.log("[AutoBattle] Menekan tombol Continue (LN)");
    button.click();
    cekBattleSelesai(klikContinueLN);
  }
}

  function startAutoBattleLN() {
    if (autoBattleLN) return;

    const userInput = prompt("Masukkan target floor (misalnya: 170):", "170");
    const parsedFloor = parseInt(userInput, 10);

    if (!isNaN(parsedFloor) && parsedFloor > 0) {
      targetFloorLN = parsedFloor;
      console.log(`[AutoBattle] Target Floor LN diset ke ${targetFloorLN}`);
    } else {
      alert("Input tidak valid. Gunakan angka positif.");
      document.getElementById("toggleLN")?.click();
      return;
    }

    autoBattleLN = true;
    console.log("[AutoBattle] Las Noches Start");
    klikContinueLN();
  }

  function stopAutoBattleLN() {
    autoBattleLN = false;
    console.log("[AutoBattle] Las Noches Stop");
  }

  // === CEK BATTLE SELESAI ===

  function cekBattleSelesai(callback, delay = 500) {
    let cekInterval = setInterval(() => {
      let tombolCloseList = document.querySelectorAll(".theme__button--original");
      for (let tombol of tombolCloseList) {
        if (tombol.textContent.trim() === "Close") {
          console.log("[AutoBattle] Battle selesai, menekan tombol Close");
          tombol.click();
          clearInterval(cekInterval);
          setTimeout(callback, delay);
          return;
        }
      }
    }, 500);
  }

  // === VALHALLA LV.56 ===

  let autoBattleRunning = false;
  let currentDungeonIndex = 0;

  const dungeons = [
    {
      completeSelector: '#game-container > div:nth-child(5) > div:nth-child(2) > img[src*="0_complete.png"]',
      buttonSelector: "#game-container > div:nth-child(5) > div:nth-child(2) > button > img",
      monsterContainer: "#game-container > div:nth-child(5) > div:nth-child(3)",
    },
    {
      completeSelector: '#game-container > div:nth-child(5) > div:nth-child(3) > img[src*="1_complete.png"]',
      buttonSelector: "#game-container > div:nth-child(5) > div:nth-child(3) > button > img",
      monsterContainer: "#game-container > div:nth-child(5) > div:nth-child(4)",
    },
    {
      completeSelector: '#game-container > div:nth-child(5) > div:nth-child(4) > img[src*="2_complete.png"]',
      buttonSelector: "#game-container > div:nth-child(5) > div:nth-child(4) > button > img",
      monsterContainer: "#game-container > div:nth-child(5) > div:nth-child(5)",
    },
    {
      completeSelector: '#game-container > div:nth-child(5) > div:nth-child(5) > img[src*="3_complete.png"]',
      buttonSelector: "#game-container > div:nth-child(5) > div:nth-child(5) > button > img",
      monsterContainer: "#game-container > div:nth-child(5) > div:nth-child(6)",
    },
  ];

  function waitForElement(selector, callback, checkInterval = 500) {
    const interval = setInterval(() => {
      if (!autoBattleRunning) return clearInterval(interval);
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(interval);
        callback(el);
      }
    }, checkInterval);
  }

  function bukaDungeon(index, callback) {
    console.log(`[AutoBattle] Buka Dungeon ke-${index + 1}`);
    waitForElement(dungeons[index].buttonSelector, (btn) => {
      btn.click();
      waitForElement('img[src*="dungeons/select.png"]', () => {
        console.log("[AutoBattle] Panel select muncul");
        callback();
      });
    });
  }

  function lawanSemuaMonster(index, callback) {
    const baseSelector = dungeons[index].monsterContainer;
    let currentMonster = 2;

    function lawanBerikutnya() {
      if (!autoBattleRunning) return;

      if (currentMonster > 6) {
        console.log("[AutoBattle] Semua monster di dungeon ini telah dilawan");
        callback();
        return;
      }

      const monsterBtn = document.querySelector(
        `${baseSelector} > button:nth-child(${currentMonster}) > img`
      );
      if (
        !monsterBtn ||
        monsterBtn.parentElement.classList.contains("--disabled")
      ) {
        console.log(`[AutoBattle] Monster ke-${currentMonster - 1} tidak bisa dilawan, lanjut`);
        currentMonster++;
        return lawanBerikutnya();
      }

      console.log(`[AutoBattle] Melawan monster ke-${currentMonster - 1}`);
      monsterBtn.click();

      cekBattleSelesai(() => {
        currentMonster++;
        lawanBerikutnya();
      }, 4000);
    }

    lawanBerikutnya();
  }

  function mulaiAutoBattleValhalla() {
    if (autoBattleRunning) return;
    autoBattleRunning = true;
    currentDungeonIndex = 0;
    console.log("[AutoBattle] Valhalla Start");

    function nextDungeon() {
      if (!autoBattleRunning) return;

      if (currentDungeonIndex >= dungeons.length) {
        console.log("[AutoBattle] Semua dungeon telah selesai");
        document.getElementById("toggleVH")?.click();
        autoBattleRunning = false;
        return;
      }

      const dungeon = dungeons[currentDungeonIndex];

      if (document.querySelector(dungeon.completeSelector)) {
        console.log(`[AutoBattle] Dungeon ${currentDungeonIndex + 1} sudah selesai, lanjut`);
        currentDungeonIndex++;
        return nextDungeon();
      }

      bukaDungeon(currentDungeonIndex, () => {
        lawanSemuaMonster(currentDungeonIndex, () => {
          console.log(`[AutoBattle] Selesai Dungeon ${currentDungeonIndex + 1}, lanjut`);
          currentDungeonIndex++;
          setTimeout(nextDungeon, 1000);
        });
      });
    }

    nextDungeon();
  }

  function startAutoBattleValhalla() {
    if (!autoBattleRunning) {
      console.log("[AutoBattle] Valhalla Start");
      mulaiAutoBattleValhalla();
    }
  }

  function stopAutoBattleValhalla() {
    autoBattleRunning = false;
    console.log("[AutoBattle] Valhalla Stop");
  }

  // SoulBlade Demon Lv. 46

  let autoBattleSD = false;
  let farmingLoop = null;

  const clickDelay = 400;
  const battleDuration = 5000;
  const loopInterval = 1000;

  function simulateBossClick() {
    const npcCanvas = document.querySelector("#npc-container-10031 canvas");
    if (!npcCanvas) {
      console.log("[AutoBattle] Soulblade Demon canvas not found.");
      return;
    }

    const rect = npcCanvas.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const events = [
      "pointerdown",
      "pointerup",
      "mousedown",
      "mouseup",
      "click",
    ];
    events.forEach((type) => {
      const evt = new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        clientX: centerX,
        clientY: centerY,
        view: window,
      });

      Object.defineProperty(evt, "offsetX", { get: () => rect.width / 2 });
      Object.defineProperty(evt, "offsetY", { get: () => rect.height / 2 });

      npcCanvas.dispatchEvent(evt);
    });

    console.log(
      `[AutoBattle] Clicked Soulblade Demon at (${centerX.toFixed(
        1
      )}, ${centerY.toFixed(1)})`
    );
  }

  function clickButtonByText(text) {
    const elements = Array.from(document.querySelectorAll("button, span, div"));
    const target = elements.find(
      (el) => el.textContent.trim().toLowerCase() === text.toLowerCase()
    );
    if (target) {
      target.click();
      console.log(`[AutoBattle] Clicked "${text}"`);
      return true;
    } else {
      console.log(`[AutoBattle] "${text}" not found`);
      return false;
    }
  }

  function checkForOutOfProofs() {
    const elements = Array.from(document.querySelectorAll("div, span, p"));
    return elements.some((el) =>
      el.textContent.toLowerCase().includes("not enough demon proof")
    );
  }

  function runLoop() {
    if (!autoBattleSD) return;

    simulateBossClick();

    setTimeout(() => {
      // Check if out of proofs
      if (checkForOutOfProofs()) {
        console.log("[AutoBattle] Out of Demon Proofs. Stopping.");
        autoBattleSD = false;
        return;
      }

      const accepted = clickButtonByText("Accept");

      if (!accepted) {
        console.log("[AutoBattle] Accept not found, retrying in next loop.");
        farmingLoop = setTimeout(runLoop, loopInterval);
        return;
      }

      setTimeout(() => {
        cekBattleSelesai(() => {
          if (autoBattleSD) {
            farmingLoop = setTimeout(runLoop, loopInterval);
          }
        });
      }, battleDuration);
    }, clickDelay);
  };

  window.addEventListener("load", () => {
    console.log(
      "[AutoBattle-5.0] by Salty\n\nSupport me with a donation:\nhttps://paypal.me/murbawisesa\nhttps://saweria.co/boyaghnia"
    );

    // Debug tool to show canvas click coordinates
    const npcCanvas = document.querySelector("#npc-container-10031 canvas");
    if (npcCanvas) {
      npcCanvas.addEventListener("click", (e) => {
        const rect = npcCanvas.getBoundingClientRect();
        const x = Math.floor(e.clientX - rect.left);
        const y = Math.floor(e.clientY - rect.top);
        console.log(`[DEBUG] Boss canvas click at (${x}, ${y})`);
      });
    }
  });

  function startAutoBattleDemon() {
    autoBattleSD = true;
    if (!farmingLoop) {
      farmingLoop = setTimeout(runLoop, loopInterval);
    }
    console.log("[AutoBattle] Battle started.");
  }

  function stopAutoBattleDemon() {
    autoBattleSD = false;
    if (farmingLoop) {
      clearTimeout(farmingLoop);
      farmingLoop = null;
    }
    console.log("[AutoBattle] Battle stopped.");
  }

  // === MAP EXPLORATION ===

    let isAutoBattle = false;
    let currentBattleCount = 0;
    const maxBattleCount = 10;
    let selectedMonsterIndex = null;

    const monsterSelectors = [
        "#game-container > div:nth-child(6) > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(2) > div.j-panel > div:nth-child(2) > img",
        "#game-container > div:nth-child(6) > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div.j-panel > div:nth-child(2) > img",
        "#game-container > div:nth-child(6) > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div:nth-child(2) > div.j-panel > div:nth-child(2) > img",
        "#game-container > div:nth-child(6) > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(4) > div > div:nth-child(2) > div.j-panel > div:nth-child(2) > img",
        "#game-container > div:nth-child(6) > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(5) > div > div:nth-child(2) > div.j-panel > div:nth-child(2) > img"
    ];

    function klikMonster(index) {
        const selector = monsterSelectors[index];
        const monster = document.querySelector(selector);
        if (monster && !monster.closest("button")?.classList.contains("--disabled")) {
            console.log(`[AutoBattle] Klik Monster ${index + 1}`);
            monster.click();
            return true;
        } else {
            console.warn(`[AutoBattle] Monster ${index + 1} tidak bisa diklik.`);
            return false;
        }
    }

    function startAutoBattleEX() {
        if (!isAutoBattle) {
            const userInput = prompt("Pilih nomor monster yang ingin diserang (1-5):");
            const index = parseInt(userInput, 10);

            if (isNaN(index) || index < 1 || index > 5) {
                alert("Input tidak valid. Harus angka 1 sampai 5.");
                return;
            }

            selectedMonsterIndex = index - 1; // sesuaikan ke index 0
            console.log(`[AutoBattle] Akan menyerang Monster ${index} secara berulang.`);
            isAutoBattle = true;
            currentBattleCount = 0;
        }

        if (!isAutoBattle || currentBattleCount >= maxBattleCount) {
            console.log("[AutoBattle] Semua pertarungan selesai atau dihentikan.");
            isAutoBattle = false;
            return;
        }

        if (klikMonster(selectedMonsterIndex)) {
            cekBattleSelesai(() => {
                currentBattleCount++;
                setTimeout(startAutoBattleEX, 1000);
            }, 500);
        } else {
            console.warn("[AutoBattle] Monster tidak bisa diklik. Coba lagi dalam 2 detik.");
            setTimeout(startAutoBattleEX, 2000);
        }
    }

    function stopAutoBattleEX() {
        isAutoBattle = false;
        console.log("[AutoBattle] Exploration Stop");
    }

  // === UI AUTO BATTLE ===
  function createUIButton() {
    let uiDiv = document.createElement("div");
    uiDiv.innerHTML = `
        <div id="autoBattleUI" style="position: fixed; top: 150px; right: 2px; background: rgba(0, 0, 0, 0.8); padding: 12px; z-index: 9999; border-radius: 8px; font-family: sans-serif; min-width: 100px;">
            <h4 style="color: #ffffff; text-align: center; margin-top: 0; margin-bottom: 10px;">Auto Battle</h4>
            <div style="margin-bottom: 10px;">
                <button id="toggleEX" class="auto-btn">Start EX</button>
            </div>
            <div style="margin-bottom: 10px;">
                <button id="toggleSD" class="auto-btn">Start SD</button>
            </div>
            <div style="margin-bottom: 10px;">
                <button id="toggleSlot" class="auto-btn">Start SM</button>
            </div>
            <div style="margin-bottom: 10px;">
                <button id="toggleLN" class="auto-btn">Start LN</button>
            </div>
            <div>
                <button id="toggleVH" class="auto-btn">Start VH</button>
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

    function setupToggle(buttonId, startFn, stopFn, label) {
      let isRunning = false;
      const button = document.getElementById(buttonId);
      button.addEventListener("click", () => {
        isRunning = !isRunning;
        button.textContent = isRunning ? `Stop ${label}` : `Start ${label}`;
        button.classList.toggle("active", isRunning);
        isRunning ? startFn() : stopFn();
      });
    }

    // Add the SD toggle
    setupToggle("toggleEX", startAutoBattleEX, stopAutoBattleEX, "EX");
    setupToggle("toggleSD", startAutoBattleDemon, stopAutoBattleDemon, "SD");
    setupToggle("toggleSlot", startAutoBattleSlot, stopAutoBattleSlot, "SM");
    setupToggle("toggleLN", startAutoBattleLN, stopAutoBattleLN, "LN");
    setupToggle("toggleVH", startAutoBattleValhalla, stopAutoBattleValhalla, "VH");
  }

  createUIButton();
})();
