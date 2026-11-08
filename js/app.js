import {
  startingState,
  updateState,
  switched, 
  signal, 
  emergencyBrake,
  serializeState,
  deserializeState
} from "./state.js";

import {
  hud,
  canvas,
  signalPosition,
  timeFormat
} from "./render.js";

const SAVE_KEY = "rail_sim_save_v1";
const LEADERBOARD_KEY = "rail_sim_leaderboard_v1";

let state = null;
let animFrameId = null;
let lastFrameTime = 0;
let pulseTimer = 0;
let activeLeaderboardLevel = 1;

const screenStart = document.querySelector("#start-screen");
const screenGame = document.querySelector("#game-screen");
const inputPlayerName = document.querySelector("#player-name");
const msgNameError = document.querySelector("#name-error-msg");
const selectDifficulty = document.querySelector("#difficulty");
const btnStart = document.querySelector("#btn-start-game");
const btnLoad = document.querySelector("#btn-load-game");
const tabBtns = document.querySelectorAll(".tab-btn");
const leaderboardBody = document.querySelector("#leaderboard-body");

const hudElements = {
  playerName: document.querySelector("#hud-player-name"),
  levelName: document.querySelector("#hud-level-name"),
  timer: document.querySelector("#hud-timer"),
  trainCounter: document.querySelector("#hud-train-counter"),
  errorCounter: document.querySelector("#hud-error-counter"),
  pauseBtn: document.querySelector("#btn-pause-resume")
};

const btnReset = document.querySelector("#btn-reset-game");
const btnSave = document.querySelector("#btn-save-game");
const btnExit = document.querySelector("#btn-exit-to-menu");

const canvasElem = document.querySelector("#game-canvas");
const modalOverlay = document.querySelector("#modal-overlay");
const modalTitle = document.querySelector("#modal-title");
const modalMessage = document.querySelector("#modal-message");
const modalStats = document.querySelector("#modal-stats-container");
const btnModalRestart = document.querySelector("#modal-btn-restart");
const btnModalMenu = document.querySelector("#modal-btn-menu");

const ctx = canvasElem.getContext("2d");

function init()
{
  events();
  leaderBoard(activeLeaderboardLevel);
}

function events()
{
  btnStart.addEventListener("click", newGame);
  btnLoad.addEventListener("click", loadGame);

  inputPlayerName.addEventListener("input", () => {
    msgNameError.classList.add("hidden");
  });

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeLeaderboardLevel = Number(btn.dataset.level);
      leaderBoard(activeLeaderboardLevel);
    });
  });

  hudElements.pauseBtn.addEventListener("click", pauseGame);
  btnReset.addEventListener("click", resetGame);
  btnSave.addEventListener("click", saveGame);
  btnExit.addEventListener("click", exitGame);

  btnModalRestart.addEventListener("click", () => {
    hideModal();
    resetGame();
  });

  btnModalMenu.addEventListener("click", () => {
    hideModal();
    exitGame();
  });

  canvasElem.addEventListener("click", leftClick);
  canvasElem.addEventListener("contextmenu", rightClick);
}

function mousePosition(e)
{
  const rect = canvasElem.getBoundingClientRect();
  return{
    x: (e.clientX - rect.left) * (canvasElem.width / rect.width),
    y: (e.clientY - rect.top) * (canvasElem.height / rect.height)
  };
}

function leftClick(e) {
  if (!state || state.isGameOver || state.isVictory) return;

  const pos = mousePosition(e);

  for (const id in state.nodes)
  {
    const node = state.nodes[id];
    if (node.type === "switch" && Math.hypot(pos.x - node.x, pos.y - node.y) <= 24)
      {
      switched(state, node.id);
      canvas(ctx, canvasElem, state, pulseTimer);
      return;
    }
  }

  for (const id in state.edges) {
    const edge = state.edges[id];
    if (edge.signal) {
      const sigPos = signalPosition(edge, state.nodes);
      if (sigPos && Math.hypot(pos.x - sigPos.x, pos.y - sigPos.y) <= 22) {
        signal(state, sigPos.id);
        canvas(ctx, canvasElem, state, pulseTimer);
        return;
      }
    }
  }
}

function rightClick(e)
{
  e.preventDefault();
  if (!state || state.isGameOver || state.isVictory) return;
  const pos = mousePosition(e);
  for (const t of state.train) {
    if (["moving", "stopped_signal"].includes(train.status)) {
      if (Math.hypot(pos.x - t.x, pos.y - t.y) <= 22) {
        emergencyBrake(state, t.id);
        canvas(ctx, canvasElem, state, pulseTimer);
        return;
      }
    }
  }
}

function newGame()
{
  const name = inputPlayerName.value.trim();
  if (!name) {
    msgNameError.classList.remove("hidden");
    inputPlayerName.focus();
    return;
  }

  state = startingState(Number(selectDifficulty.value), name);
  switchScreen();
  startGame();
}

function loadGame()
{
  try {
    const data = localStorage.getItem(SAVE_KEY);
    if (!data) {
      showModal("Nincs mentett játék", "Nem található elmentett játék", [], false);
      return;
    }
    state = deserializeState(data);
    inputPlayerName.value = state.playerName || "";
    selectDifficulty.value = String(state.levelId);
    switchScreen();
    startGame();
  } catch (err) {
    showModal("Betöltési hiba", err.message, [], false);
  }
}

function saveGame()
{
  if (!state || state.isGameOver || state.isVictory) return;
  try
  {
    localStorage.setItem(SAVE_KEY, serializeState(state));
    const wasPaused = state.isPaused;
    state.isPaused = true;
    updateHud();
    showModal(
      "Mentés Sikeres",
      "Játék elmentve",
      [
        { label: "Diszpécser", value: state.playerName },
        { label: "Mentett idő", value: timeFormat(state.elapsedTime) }
      ],
      true,
      () => {
        state.isPaused = wasPaused;
        lastFrameTime = performance.now();
        updateHud();
      }
    );
  } 
  catch (err)
  {
    showModal("Mentési hiba", err.message, [], false);
  }
}

function pauseGame()
{
  if (!state || state.isGameOver || state.isVictory) return;
  state.isPaused = !state.isPaused;
  lastFrameTime = performance.now();
  updateHud();
}

function resetGame()
{
  if (!state) return;
  stopGame();
  state = startingState(state.levelId, state.playerName);
  startGame();
}

function exitGame()
{
  stopGame();
  state = null;
  screenGame.classList.add("hidden");
  screenStart.classList.remove("hidden");
  leaderBoard(activeLeaderboardLevel);
}

function switchScreen()
{
  screenStart.classList.add("hidden");
  screenGame.classList.remove("hidden");
  updateHud();
}

function updateHud()
{
  hud(state, hudElements);
}

function startGame()
{
  stopGame();
  lastFrameTime = performance.now();
  animFrameId = requestAnimationFrame(gameLoop);
}

function stopGame()
{
  if (animFrameId !== null)
  {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
}

function gameLoop(timestamp)
{
  const dt = Math.min((timestamp - lastFrameTime) / 1000, 0.1);
  lastFrameTime = timestamp;
  pulseTimer += dt;
  if (state && !state.isPaused && !state.isGameOver && !state.isVictory)
  {
    updateState(state, dt);
    updateHud();
    if (state.isGameOver)
    {
      canvas(ctx, canvasElem, state, pulseTimer);
      GameOver();
      return;
    }
    if (state.isVictory)
    {
      canvas(ctx, canvasElem, state, pulseTimer);
      victory();
      return;
    }
  }

  if (state)
  {
    canvas(ctx, canvasElem, state, pulseTimer);
  }
  animFrameId = requestAnimationFrame(gameLoop);
}

function GameOver()
{
  stopGame();
  showModal(
    "Game Over",
    "Ütközés történt!",
    [
      { label: "Diszpécser", value: state.playerName },
      { label: "Idő", value: timeFormat(state.elapsedTime) },
      { label: "Beért vonatok", value: `${state.successCount} / ${state.totalTrainsCount}` }
    ],
    true
  );
}

function victory()
{
  stopGame();
  saveLeaderboard(state);
  showModal(
    "Győzelem!",
    "Az összes vonat sikeresen beért",
    [
      { label: "Diszpécser", value: state.playerName },
      { label: "Idő", value: timeFormat(state.elapsedTime) },
      { label: "Beért vonatok", value: `${state.successCount} / ${state.totalTrainsCount}` },
      { label: "Hibák", value: String(state.errorCount) }
    ],
    true
  );
}

function showModal(title, text, stats = [], showRestartBtn = true, onClose = null)
{
  modalTitle.textContent = title;
  modalMessage.textContent = text;
  modalStats.innerHTML = "";
  if (stats.length > 0)
  {
    modalStats.classList.remove("hidden");
    stats.forEach(row => {
      const div = document.createElement("div");
      div.className = "modal-stats-row";
      div.innerHTML = `<span>${row.label}:</span><strong>${row.value}</strong>`;
      modalStats.appendChild(div);
    });
  } 
  else
  {
    modalStats.classList.add("hidden");
  }
  if (onClose)
  {
    btnModalRestart.textContent = "Folytatás";
    btnModalMenu.classList.add("hidden");
    btnModalRestart.onclick = () => {
      btnModalRestart.onclick = null;
      btnModalRestart.textContent = "Újra";
      btnModalMenu.classList.remove("hidden");
      hideModal();
      onClose();
    };
  } 
  else
  {
    btnModalRestart.onclick = null;
    btnModalRestart.textContent = "Újra";
    btnModalMenu.classList.remove("hidden");
    btnModalRestart.classList.toggle("hidden", !showRestartBtn);
  }
  modalOverlay.classList.remove("hidden");
}

function hideModal()
{
  modalOverlay.classList.add("hidden");
}

function loadLeaderboard()
{
  try
  {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) return { 1: [], 2: [], 3: [] };
    const data = JSON.parse(raw);
    return {
      1: Array.isArray(data[1]) ? data[1] : [],
      2: Array.isArray(data[2]) ? data[2] : [],
      3: Array.isArray(data[3]) ? data[3] : []
    };
  }
  catch (err)
  {
    return { 1: [], 2: [], 3: [] };
  }
}

function saveLeaderboard(currState)
{
  try
  {
    const leaderboards = loadLeaderboard();
    const list = leaderboards[currState.levelId] || [];

    list.push({
      playerName: currState.playerName,
      timeSeconds: Math.floor(currState.elapsedTime),
      formattedTime: timeFormat(currState.elapsedTime),
      errors: currState.errorCount,
      date: new Date().toLocaleDateString("hu-HU")
    });

    list.sort((a, b) => a.errors !== b.errors ? a.errors - b.errors : a.timeSeconds - b.timeSeconds);
    leaderboards[currState.levelId] = list.slice(0, 10);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboards));
  } 
  catch (err)
  {
    console.error("Leaderboard save failed:", err);
  }
}

function leaderBoard(levelId)
{
  const leaderboards = loadLeaderboard();
  const list = leaderboards[levelId] || [];
  leaderboardBody.innerHTML = "";
  if (list.length === 0)
  {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="5" style="text-align: center;">Még nincs rögzített eredmény ezen a szinten.</td>`;
    leaderboardBody.appendChild(tr);
    return;
  }
  list.forEach((entry, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}.</td>
      <td>${entry.playerName}</td>
      <td class="font-mono">${entry.formattedTime}</td>
      <td class="font-mono">${entry.errors}</td>
      <td>${entry.date}</td>
    `;
    leaderboardBody.appendChild(tr);
  });
}

init();