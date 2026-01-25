const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const score = document.querySelector(".score--value");
const configBtn = document.getElementById("configBtn");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");

const startScreen = document.querySelector(".start-screen");
const startBtn = document.getElementById("startBtn");
const playerNameInput = document.getElementById("playerName");
const snakeColorInput = document.getElementById("snakeColor");
const difficultySelect = document.getElementById("difficulty");
const gameModeSelect = document.getElementById("gameMode");
const themeSelect = document.getElementById("theme");
const sensitivityInput = document.getElementById("sensitivity");

const timerDisplay = document.getElementById("time");
const rankingList = document.getElementById("rankingList");
const bestScoreDisplay = document.getElementById("bestScore");
const pauseOverlay = document.getElementById("pauseOverlay");

const size = 30;
const initialPosition = { x: 270, y: 240 };

let snake = [{ x: initialPosition.x, y: initialPosition.y }];
let direction = "right";
let started = false;
let paused = false;
let loopId = null;
let timerInterval = null;

let grow = false;
let snakeColor = "#ffffff";
let playerName = "";
let difficulty = "easy";
let gameMode = "single";
let theme = "neon";
let sensitivity = 3;

let seconds = 0;
let rankingOpen = true;

let obstacles = [];
let obstacleInterval = null;

let gameSpeed = 300;
const baseSpeed = 300;

let currentTab = "all";

let powerups = [];
let particles = [];

let players = [];

const drawRoundedRect = (x, y, w, h, r = 6) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
};

const incrementScore = () => {
  score.innerText = String(Number(score.innerText) + 10).padStart(2, "0");
};

const randomNumber = (min, max) =>
  Math.round(Math.random() * (max - min) + min);

const randomPosition = () => {
  const number = randomNumber(0, canvas.width - size);
  return Math.round(number / size) * size;
};

document.querySelectorAll(".ranking-tabs .tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".ranking-tabs .tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    currentTab = tab.dataset.diff;
    renderRanking();
  });
});

const randomColor = () => {
  const red = randomNumber(0, 255);
  const green = randomNumber(0, 255);
  const blue = randomNumber(0, 255);
  return `rgb(${red}, ${green}, ${blue})`;
};

const themes = {
  neon: { bg: "#0b0b0b", grid: "#191919" },
  space: { bg: "#05021a", grid: "#1a1a3a" },
  forest: { bg: "#061b0a", grid: "#0f2a13" }
};

const food = {
  x: randomPosition(),
  y: randomPosition(),
  color: randomColor(),
};

const drawFood = () => {
  ctx.fillStyle = food.color;
  ctx.fillRect(food.x, food.y, size, size);
};

const drawObstacles = () => {
  obstacles.forEach(ob => {
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(ob.x, ob.y, size, size);

    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(ob.x + 10, ob.y + 10, 3, 0, Math.PI * 2);
    ctx.arc(ob.x + 20, ob.y + 10, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(ob.x + 8, ob.y + 22);
    ctx.quadraticCurveTo(ob.x + 15, ob.y + 16, ob.x + 22, ob.y + 22);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();
  });
};

const drawPowerups = () => {
  powerups.forEach(p => {
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, size, size);
  });
};

const drawParticles = () => {
  particles.forEach((p, idx) => {
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
    p.life--;

    if (p.life <= 0) particles.splice(idx, 1);
  });
};

const drawSnake = (snakeObj, color, player) => {
  snakeObj.forEach((pos, index) => {
    const isHead = index === snakeObj.length - 1;
    const isTail = index === 0;

    ctx.fillStyle = color;

    if (isHead) {
      drawRoundedRect(pos.x, pos.y, size, size, 12);
      ctx.fillStyle = "#000";

      const dir = player.direction;

      if (dir === "right") {
        ctx.fillRect(pos.x + 20, pos.y + 10, 3, 3);
        ctx.fillRect(pos.x + 20, pos.y + 18, 3, 3);
      }
      if (dir === "left") {
        ctx.fillRect(pos.x + 7, pos.y + 10, 3, 3);
        ctx.fillRect(pos.x + 7, pos.y + 18, 3, 3);
      }
      if (dir === "up") {
        ctx.fillRect(pos.x + 10, pos.y + 7, 3, 3);
        ctx.fillRect(pos.x + 18, pos.y + 7, 3, 3);
      }
      if (dir === "down") {
        ctx.fillRect(pos.x + 10, pos.y + 20, 3, 3);
        ctx.fillRect(pos.x + 18, pos.y + 20, 3, 3);
      }

      return;
    }

    if (!isHead && !isTail) {
      ctx.fillRect(pos.x, pos.y, size, size);
    }
  });
};

const moveSnake = (snakeObj, dir, diff) => {
  if (!dir) return;

  const head = snakeObj[snakeObj.length - 1];
  let newHead = { x: head.x, y: head.y };

  if (dir === "right") newHead.x += size;
  if (dir === "left") newHead.x -= size;
  if (dir === "down") newHead.y += size;
  if (dir === "up") newHead.y -= size;

  if (
    newHead.x < 0 ||
    newHead.x > canvas.width - size ||
    newHead.y < 0 ||
    newHead.y > canvas.height - size
  ) {
    if (diff === "easy" || diff === "medium") {
      if (newHead.x < 0) newHead.x = canvas.width - size;
      if (newHead.x > canvas.width - size) newHead.x = 0;
      if (newHead.y < 0) newHead.y = canvas.height - size;
      if (newHead.y > canvas.height - size) newHead.y = 0;
    } else {
      gameOver();
      return;
    }
  }

  snakeObj.push(newHead);

  if (!grow) snakeObj.shift();
  else grow = false;
};

const createParticles = (x, y, color) => {
  for (let i = 0; i < 12; i++) {
    particles.push({
      x: x + randomNumber(-10, 10),
      y: y + randomNumber(-10, 10),
      size: randomNumber(2, 4),
      color,
      life: randomNumber(10, 20)
    });
  }
};

const checkEat = (snakeObj, color) => {
  const head = snakeObj[snakeObj.length - 1];

  if (head.x === food.x && head.y === food.y) {
    incrementScore();
    grow = true;
    createParticles(food.x, food.y, color);

    do {
      food.x = randomPosition();
      food.y = randomPosition();
    } while (
      snake.some((pos) => pos.x === food.x && pos.y === food.y) ||
      obstacles.some((ob) => ob.x === food.x && ob.y === food.y)
    );

    food.color = randomColor();
  }
};

const checkCollision = (snakeObj) => {
  const head = snakeObj[snakeObj.length - 1];

  const selfCollision = snakeObj.slice(0, -1).some(
    (pos) => pos.x === head.x && pos.y === head.y
  );

  if (selfCollision) return true;
  return false;
};

const checkObstacleCollision = (snakeObj) => {
  const head = snakeObj[snakeObj.length - 1];
  return obstacles.some(ob => ob.x === head.x && ob.y === head.y);
};

const gameOver = () => {
  clearInterval(loopId);
  clearInterval(timerInterval);
  clearInterval(obstacleInterval);

  started = false;
  paused = false;

  saveRanking();
  renderRanking();

  menu.style.display = "flex";
  finalScore.innerText = score.innerText;
  canvas.style.filter = "blur(2px)";
};

const resetToConfig = () => {
  clearInterval(loopId);
  clearInterval(timerInterval);
  clearInterval(obstacleInterval);

  direction = null;
  started = false;
  obstacles = [];

  startScreen.style.display = "flex";
  menu.style.display = "none";
  canvas.style.filter = "none";
};

configBtn.addEventListener("click", resetToConfig);

const drawGrid = () => {
  ctx.strokeStyle = themes[theme].grid;
  ctx.lineWidth = 1;

  for (let x = 0; x <= canvas.width; x += size) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y <= canvas.height; y += size) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
};

const gameLoop = () => {
  if (paused) return;

  ctx.fillStyle = themes[theme].bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawGrid();
  drawFood();
  drawObstacles();
  drawPowerups();
  drawParticles();

  players.forEach(player => {
    moveSnake(player.snake, player.direction, difficulty);

    checkEat(player.snake, player.color);

    if (checkCollision(player.snake) || checkObstacleCollision(player.snake)) {
      gameOver();
      return;
    }

    drawSnake(player.snake, player.color, player);
  });
};

const startGameLoop = () => {
  clearInterval(loopId);
  loopId = setInterval(() => {
    gameLoop();
  }, gameSpeed);
};

const startTimer = () => {
  timerInterval = setInterval(() => {
    seconds++;
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    timerDisplay.innerText = `${min}:${sec}`;
  }, 1000);
};

const resetGame = () => {
  score.innerText = "00";
  snake = [{ x: initialPosition.x, y: initialPosition.y }];
  direction = "right";
  grow = false;
  food.x = randomPosition();
  food.y = randomPosition();
  food.color = randomColor();
  obstacles = [];
  powerups = [];
  particles = [];
};

const spawnObstacles = () => {
  obstacles = [];

  for (let i = 0; i < 2; i++) {
    let x, y;

    do {
      x = randomPosition();
      y = randomPosition();
    } while (
      snake.some(pos => pos.x === x && pos.y === y) ||
      (food.x === x && food.y === y)
    );

    obstacles.push({ x, y });
  }

  setTimeout(() => {
    obstacles = [];
  }, 10000);
};

const startGame = () => {
  started = false;
  seconds = 0;
  timerDisplay.innerText = "00:00";

  resetGame();
  menu.style.display = "none";
  canvas.style.filter = "none";

  difficulty = difficultySelect.value;
  gameMode = gameModeSelect.value;
  theme = themeSelect.value;
  sensitivity = Number(sensitivityInput.value);

  document.body.style.backgroundColor = themes[theme].bg;

  gameSpeed = baseSpeed - (sensitivity * 40);

  clearInterval(obstacleInterval);
  obstacles = [];

  if (difficulty === "hard") {
    obstacleInterval = setInterval(spawnObstacles, 15000);
  }
  if (difficulty === "extreme") {
    obstacleInterval = setInterval(spawnObstacles, 10000);
  }

  players = createPlayers(gameMode);
  renderBestScore();
  startGameLoop();
};

const createPlayers = (mode) => {
  if (mode === "single") {
    return [{
      name: playerName,
      color: snakeColor,
      snake: [{ x: initialPosition.x, y: initialPosition.y }],
      direction: "right",
      glow: false,
      magnet: false
    }];
  }

  if (mode === "coop") {
    return [
      {
        name: playerName,
        color: snakeColor,
        snake: [{ x: 120, y: 240 }],
        direction: "right",
        glow: false,
        magnet: false
      },
      {
        name: "CPU",
        color: "#00ff00",
        snake: [{ x: 420, y: 240 }],
        direction: "left",
        glow: false,
        magnet: false
      }
    ];
  }

  if (mode === "versus") {
    return [
      {
        name: playerName,
        color: snakeColor,
        snake: [{ x: 120, y: 240 }],
        direction: "right",
        glow: false,
        magnet: false
      },
      {
        name: "Player 2",
        color: "#ff00ff",
        snake: [{ x: 420, y: 240 }],
        direction: "left",
        glow: false,
        magnet: false
      }
    ];
  }
};

const renderBestScore = () => {
  const key = `snakeBest_${difficulty}_${gameMode}`;
  const best = localStorage.getItem(key) || "00";
  bestScoreDisplay.innerText = best;
};

const saveBestScore = () => {
  const key = `snakeBest_${difficulty}_${gameMode}`;
  const current = Number(score.innerText);
  const best = Number(localStorage.getItem(key) || 0);
  if (current > best) {
    localStorage.setItem(key, current);
  }
};

const saveRanking = () => {
  const time = timerDisplay.innerText;
  const scoreValue = parseInt(score.innerText);

  const rankingKey = `snakeRanking_${difficulty}_${gameMode}`;
  const ranking = JSON.parse(localStorage.getItem(rankingKey)) || [];

  ranking.push({
    name: playerName,
    color: snakeColor,
    time,
    score: scoreValue,
    mode: gameMode
  });

  ranking.sort((a, b) => b.score - a.score);
  localStorage.setItem(rankingKey, JSON.stringify(ranking.slice(0, 10)));

  saveBestScore();
};

const renderRanking = () => {
  rankingList.innerHTML = "";

  const allKeys = [
    `snakeRanking_easy_single`, `snakeRanking_medium_single`,
    `snakeRanking_hard_single`, `snakeRanking_extreme_single`,
    `snakeRanking_easy_coop`, `snakeRanking_medium_coop`,
    `snakeRanking_hard_coop`, `snakeRanking_extreme_coop`,
    `snakeRanking_easy_versus`, `snakeRanking_medium_versus`,
    `snakeRanking_hard_versus`, `snakeRanking_extreme_versus`
  ];

  let ranking = [];

  if (currentTab === "all") {
    allKeys.forEach(key => {
      const list = JSON.parse(localStorage.getItem(key)) || [];
      ranking = ranking.concat(list);
    });

    ranking.sort((a, b) => b.score - a.score);
    ranking = ranking.slice(0, 10);
  } else {
    const key = `snakeRanking_${currentTab}_${gameMode}`;
    ranking = JSON.parse(localStorage.getItem(key)) || [];
  }

  ranking.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("ranking-item");

    div.innerHTML = `
      <span>${index + 1}º</span>
      <span class="name" style="color:${item.color}">${item.name}</span>
      <span>${item.time}</span>
      <span>${String(item.score).padStart(2, "0")}</span>
    `;

    rankingList.appendChild(div);
  });
};

startBtn.addEventListener("click", () => {
  playerName = playerNameInput.value.trim();
  snakeColor = snakeColorInput.value;

  if (playerName === "") {
    alert("Digite seu nome para começar!");
    return;
  }

  startScreen.style.display = "none";
  renderRanking();
  startGame();
});

snakeColorInput.addEventListener("input", () => {
  snakeColor = snakeColorInput.value;
});

document.addEventListener("keydown", ({ key }) => {
  if (key === "p" || key === "P") {
    paused = !paused;
    pauseOverlay.style.display = paused ? "flex" : "none";
    return;
  }

  if (!["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "w", "a", "s", "d", "W", "A", "S", "D"].includes(key)) return;

  if (!started) {
    started = true;
    startTimer();
  }

  // Player 1 controls
  if (players[0]) {
    if (key === "ArrowRight" && players[0].direction !== "left") players[0].direction = "right";
    if (key === "ArrowLeft" && players[0].direction !== "right") players[0].direction = "left";
    if (key === "ArrowDown" && players[0].direction !== "up") players[0].direction = "down";
    if (key === "ArrowUp" && players[0].direction !== "down") players[0].direction = "up";
  }

  // WASD controls for player 2 (versus only)
  if (gameMode === "versus") {
    const p2 = players[1];
    if (key === "d" && p2.direction !== "left") p2.direction = "right";
    if (key === "a" && p2.direction !== "right") p2.direction = "left";
    if (key === "s" && p2.direction !== "up") p2.direction = "down";
    if (key === "w" && p2.direction !== "down") p2.direction = "up";
  }
});

buttonPlay.addEventListener("click", () => {
  startScreen.style.display = "flex";
  menu.style.display = "none";
  canvas.style.filter = "none";

  clearInterval(loopId);
  clearInterval(timerInterval);
  clearInterval(obstacleInterval);
});

/* CPU MOVE (COOP) */
const cpuMove = () => {
  if (gameMode !== "coop") return;

  const cpu = players[1];
  const head = cpu.snake[cpu.snake.length - 1];

  if (food.x > head.x) cpu.direction = "right";
  else if (food.x < head.x) cpu.direction = "left";
  else if (food.y > head.y) cpu.direction = "down";
  else if (food.y < head.y) cpu.direction = "up";
};

setInterval(cpuMove, 200);

/* TOUCH CONTROLS */
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

canvas.addEventListener("touchend", (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0 && players[0].direction !== "left") players[0].direction = "right";
    if (dx < 0 && players[0].direction !== "right") players[0].direction = "left";
  } else {
    if (dy > 0 && players[0].direction !== "up") players[0].direction = "down";
    if (dy < 0 && players[0].direction !== "down") players[0].direction = "up";
  }
});
