// ==UserScript==
// @name         Auto Battle - TB
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Auto Battle for Tailed Beast Event
// @author       PLAYERONE
// @match        https://pockieninja.online
// @grant        none
// ==/UserScript==

/*
  A script that's created for entertainment purposes, not for any serious or practical use
*/

(function() {
    'use strict';

  let autoBattleTB = false;
  let currentBeastIndex = 0;

  // Daftar koordinat Tailed Beast (Urutan: Shukaku → Kurama)
  const tailedBeastCoordinates = [
    { name: "Shukaku", x: 810, y: 475 },
    { name: "Matatabi", x: 286, y: 310 },
    { name: "Matatabi 2", x: 195, y: 275 },
    //{ name: "Kokuo", x: 986, y: 351 },
    { name: "Son Goku", x: 718, y: 308 },
    { name: "Son Goku 2", x: 670, y: 250 },
    //{ name: "Saiken", x: 512, y: 372 },
    { name: "Chomei", x: 559, y: 198 },
    { name: "Chomei 2", x: 522, y: 139 },
    { name: "Isobu", x: 892, y: 178 },
    //{ name: "Gyuki", x: 548, y: 439 },
    //{ name: "Kurama", x: 290, y: 514 },
  ];

      // === TAILED BEAST ===
  function clickNextBeast() {
    if (!autoBattleTB) return;

    const beast = tailedBeastCoordinates[currentBeastIndex];
    console.log(`🦊 Mencoba klik ${beast.name} di (${beast.x}, ${beast.y})`);
    clickCanvas(beast.x, beast.y);

    // Pindah ke beast berikutnya
    currentBeastIndex = (currentBeastIndex + 1) % tailedBeastCoordinates.length;
  }

  function clickCanvas(x, y) {
    if (!autoBattleTB) return;

    const canvas = document.querySelector("#tailed-beast-map-container canvas");
    if (!canvas) {
      console.log("❌ Canvas tidak ditemukan!");
      return;
    }

    console.log(`📌 Klik pada X=${x}, Y=${y}`);

    ["mousedown", "mouseup", "click"].forEach((eventType) => {
      const event = new MouseEvent(eventType, {
        bubbles: true,
        cancelable: true,
        composed: true,
        clientX: x,
        clientY: y,
      });

      canvas.dispatchEvent(event);
      document.dispatchEvent(event);
    });

    console.log(`✅ Klik berhasil di X: ${x}, Y: ${y}`);

    setTimeout(checkChooseDifficulty, 500); // Periksa elemen "Choose Difficulty Level" setelah klik canvas
  }

  function checkChooseDifficulty() {
    if (!autoBattleTB) return;

    // Periksa apakah elemen "Choose Difficulty Level" sudah muncul
    const difficultyLevelText = document.querySelector(
      "#game-container > div:nth-child(9) > div.panel__top_bar.moveable > div > b"
    );

    if (
      difficultyLevelText &&
      difficultyLevelText.textContent.trim() === "Choose Difficulty Level"
    ) {
      console.log(
        "✅ 'Choose Difficulty Level' muncul! Klik tombol 'Fight'..."
      );
      clickButtonAfterCanvas();
    } else {
      console.log(
        "⚠️ 'Choose Difficulty Level' belum muncul, mencoba koordinat lain..."
      );
      // Coba koordinat berikutnya jika elemen belum muncul
      clickNextBeast();
    }
  }

  let tbRetryCount = 0; // Global atau di atas fungsi

function clickButtonAfterCanvas() {
  if (!autoBattleTB) return;

  // Cek apakah user benar-benar sedang di panel Tailed Beast
  const isInTailedBeastPanel = [...document.querySelectorAll("button")]
    .find(btn => btn.textContent.trim() === "Back to hall");
  if (!isInTailedBeastPanel) {
    console.log("❌ Bukan di panel Tailed Beast. Stop pengecekan fightContainer.");
    return;
  }

  const selector =
    "#game-container > div:nth-child(9) > div.themed_panel.theme__transparent--original > div > div:nth-child(1) > div.grid > div:nth-child(4) > button";
  const button = document.querySelector(selector);

  if (button && button.textContent.trim() === "Fight") {
    console.log("✅ Tombol 'Fight' ditemukan! Menunggu tombol tidak disabled...");

    const waitUntilEnabled = setInterval(() => {
      if (!autoBattleTB) {
        clearInterval(waitUntilEnabled);
        return;
      }

      if (!button.disabled) {
        clearInterval(waitUntilEnabled);
        console.log("✅ Tombol 'Fight' sudah aktif! Menunggu 1 detik sebelum klik...");

        setTimeout(() => {
          button.click();
          console.log("🔥 Tombol 'Fight' diklik!");

          // Mulai timeout 7 detik untuk cek #fightContainer
          let timeout = setTimeout(() => {
            if (!document.querySelector("#fightContainer")) {
              tbRetryCount++;
              console.log(`❌ #fightContainer tidak muncul! Percobaan ke-${tbRetryCount}`);

              let closeBtn = [...document.querySelectorAll(".theme__button--original")]
                .find((btn) => btn.textContent.trim() === "Close");

              if (closeBtn) {
                console.log("🧹 Menekan tombol Close karena tidak ada respon...");
                closeBtn.click();
              }

              if (tbRetryCount >= 3) {
                console.log("🛑 Gagal 3x berturut-turut! Menghentikan autoBattleTB...");
                document.getElementById("toggleTB")?.click(); // Stop toggle
                tbRetryCount = 0;
              } else {
                setTimeout(clickNextBeast, 1000); // Ulangi dari awal
              }
            }
          }, 7000);

          const checkFightContainer = setInterval(() => {
            const fightContainer = document.querySelector("#fightContainer");
            if (fightContainer) {
              clearTimeout(timeout);
              clearInterval(checkFightContainer);
              tbRetryCount = 0;
              console.log("✅ #fightContainer ditemukan, battle dimulai!");
              cekBattleSelesai(() => {
                console.log("✅ Battle selesai, mulai dari awal...");
                currentBeastIndex = 0;
                setTimeout(clickNextBeast, 500);
              });
            }
          }, 500);
        }, 500);
      } else {
        console.log("⏳ Menunggu tombol 'Fight' aktif...");
      }
    }, 500);
  } else {
    console.log("⚠️ Tombol 'Fight' tidak ditemukan atau teksnya bukan 'Fight'!");
  }
}

  function startAutoBattleTB() {
    if (autoBattleTB) return;
    autoBattleTB = true;
    currentBeastIndex = 0;
    console.log("🚀 Auto Battle Tailed Beast DIMULAI!");
    clickNextBeast();
  }

  function stopAutoBattleTB() {
    autoBattleTB = false;
    console.log("🛑 Auto Battle Tailed Beast DIHENTIKAN!");
  }

  // === CEK BATTLE SELESAI ===
  function cekBattleSelesai(callback, delay = 500) {
    let cekInterval = setInterval(() => {
      let tombolCloseList = document.querySelectorAll(
        ".theme__button--original"
      );
      for (let tombol of tombolCloseList) {
        if (tombol.textContent.trim() === "Close") {
          console.log("🏁 Battle selesai! Menekan tombol 'Close'...");
          tombol.click();
          clearInterval(cekInterval);
          setTimeout(callback, delay);
          return;
        }
      }
    }, 500);
  }

    // === UI AUTO BATTLE ===
  function createUIButton() {
    let uiDiv = document.createElement("div");
    uiDiv.innerHTML = `
        <div id="autoBattleUI" style="position: fixed; top: 382px; right: 2px; background: rgba(0, 0, 0, 0.8); padding: 12px; z-index: 9999; border-radius: 8px; font-family: sans-serif; min-width: 100px;">
            <div>
                <button id="toggleTB" class="auto-btn">Start TB</button>
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
    setupToggle("toggleTB", startAutoBattleTB, stopAutoBattleTB, "TB");
  }

  createUIButton();
  console.log(
      "[AutoTB-2.2] by Salty\n\nSupport me with a donation:\nhttps://paypal.me/murbawisesa\nhttps://saweria.co/boyaghnia"
    );

})();