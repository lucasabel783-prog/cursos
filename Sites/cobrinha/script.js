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

const timerDisplay = document.getElementById("time");
const rankingList = document.getElementById("rankingList");

const size = 30;
const initialPosition = { x: 270, y: 240 };

let snake = [{ x: initialPosition.x, y: initialPosition.y }];
let direction = null;
let started = false;
let loopId = null;
let timerInterval = null;

let grow = false;
let snakeColor = "#ffffff";
let playerName = "";
let difficulty = "easy";

let seconds = 0;
let rankingOpen = true;

let obstacles = [];
let obstacleInterval = null;

let gameSpeed = 300;
const baseSpeed = 300;

let currentTab = "all";

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

    // cara malvada
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

const drawSnake = () => {
  snake.forEach((pos, index) => {
    const isHead = index === snake.length - 1;
    const isTail = index === 0;

    ctx.fillStyle = snakeColor;

    // corpo normal
    if (!isHead && !isTail) {
      ctx.fillRect(pos.x, pos.y, size, size);
      return;
    }

    // ===========================
    // CABEÇA (arredondado na frente)
    // ===========================
    if (isHead) {
      ctx.beginPath();

      if (direction === "right") {
        ctx.roundRect(pos.x, pos.y, size, size, [0, 12, 12, 0]);
      }
      if (direction === "left") {
        ctx.roundRect(pos.x, pos.y, size, size, [12, 0, 0, 12]);
      }
      if (direction === "up") {
        ctx.roundRect(pos.x, pos.y, size, size, [12, 12, 0, 0]);
      }
      if (direction === "down") {
        ctx.roundRect(pos.x, pos.y, size, size, [0, 0, 12, 12]);
      }

      ctx.fill();

      // olhos
      ctx.fillStyle = "#000";

      if (direction === "right") {
        ctx.fillRect(pos.x + 20, pos.y + 10, 3, 3);
        ctx.fillRect(pos.x + 20, pos.y + 18, 3, 3);
      }
      if (direction === "left") {
        ctx.fillRect(pos.x + 7, pos.y + 10, 3, 3);
        ctx.fillRect(pos.x + 7, pos.y + 18, 3, 3);
      }
      if (direction === "up") {
        ctx.fillRect(pos.x + 10, pos.y + 7, 3, 3);
        ctx.fillRect(pos.x + 18, pos.y + 7, 3, 3);
      }
      if (direction === "down") {
        ctx.fillRect(pos.x + 10, pos.y + 20, 3, 3);
        ctx.fillRect(pos.x + 18, pos.y + 20, 3, 3);
      }

      return;
    }

    // ===========================
    // CAUDA (arredondado atrás)
    // ===========================
    if (isTail && snake.length > 1) {
  const next = snake[1];

  if (next.x > pos.x) {
    // cauda aponta pra direita
    ctx.beginPath();
    ctx.roundRect(pos.x, pos.y, size, size, [12, 0, 0, 12]);
    ctx.fill();
  }

  if (next.x < pos.x) {
    // cauda aponta pra esquerda
    ctx.beginPath();
    ctx.roundRect(pos.x, pos.y, size, size, [0, 12, 12, 0]);
    ctx.fill();
  }

  if (next.y > pos.y) {
    // cauda aponta pra baixo
    ctx.beginPath();
    ctx.roundRect(pos.x, pos.y, size, size, [0, 12, 12, 0]);
    ctx.fill();
  }

  if (next.y < pos.y) {
    // cauda aponta pra cima
    ctx.beginPath();
    ctx.roundRect(pos.x, pos.y, size, size, [12, 0, 0, 12]);
    ctx.fill();
  }
}



const moveSnake = () => {
  if (!direction) return;

  const head = snake[snake.length - 1];
  let newHead = { x: head.x, y: head.y };

  if (direction === "right") newHead.x += size;
  if (direction === "left") newHead.x -= size;
  if (direction === "down") newHead.y += size;
  if (direction === "up") newHead.y -= size;

  if (newHead.x < 0 || newHead.x > canvas.width - size ||
      newHead.y < 0 || newHead.y > canvas.height - size) {

    if (difficulty === "easy") {
      if (newHead.x < 0) newHead.x = canvas.width - size;
      if (newHead.x > canvas.width - size) newHead.x = 0;
      if (newHead.y < 0) newHead.y = canvas.height - size;
      if (newHead.y > canvas.height - size) newHead.y = 0;
    } else {
      gameOver();
      return;
    }
  }

  snake.push(newHead);

  if (!grow) snake.shift();
  else grow = false;
};

const drawGrid = () => {
  ctx.strokeStyle = "#191919";
  for (let i = size; i < canvas.width; i += size) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }
};

const checkEat = () => {
  const head = snake[snake.length - 1];

  if (head.x === food.x && head.y === food.y) {
    incrementScore();
    grow = true;

    do {
      food.x = randomPosition();
      food.y = randomPosition();
    } while (snake.some((pos) => pos.x === food.x && pos.y === food.y));

    food.color = randomColor();
  }
};

const checkCollision = () => {
  const head = snake[snake.length - 1];

  const selfCollision = snake.slice(0, -1).some(
    (pos) => pos.x === head.x && pos.y === head.y
  );

  if (selfCollision) gameOver();
};

const checkObstacleCollision = () => {
  const head = snake[snake.length - 1];

  if (obstacles.some(ob => ob.x === head.x && ob.y === head.y)) {
    gameOver();
  }
};

const gameOver = () => {
  clearInterval(loopId);
  clearInterval(timerInterval);
  clearInterval(obstacleInterval);

  started = false;

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

const gameLoop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid();
  drawFood();
  drawObstacles();
  moveSnake();
  checkEat();
  checkCollision();
  checkObstacleCollision();
  drawSnake();
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
  direction = null;
  grow = false;
  food.x = randomPosition();
  food.y = randomPosition();
  food.color = randomColor();
  obstacles = [];
};

const spawnObstacles = () => {
  obstacles = [];

  for (let i = 0; i < 2; i++) {
    let x, y;

    do {
      x = randomPosition();
      y = randomPosition();
    } while (snake.some(pos => pos.x === x && pos.y === y));

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

  if (difficulty === "extreme") gameSpeed = baseSpeed * 0.5;
  else gameSpeed = baseSpeed;

  startGameLoop();

  clearInterval(obstacleInterval);
  obstacles = [];

  if (difficulty === "hard") {
    obstacleInterval = setInterval(spawnObstacles, 15000);
  }
  if (difficulty === "extreme") {
    obstacleInterval = setInterval(spawnObstacles, 10000);
  }
};

const saveRanking = () => {
  const time = timerDisplay.innerText;
  const scoreValue = parseInt(score.innerText);

  const rankingKey = "snakeRanking_" + difficulty;
  const ranking = JSON.parse(localStorage.getItem(rankingKey)) || [];

  ranking.push({
    name: playerName,
    color: snakeColor,
    time,
    score: scoreValue,
  });

  ranking.sort((a, b) => b.score - a.score);
  localStorage.setItem(rankingKey, JSON.stringify(ranking.slice(0, 10)));
};

const renderRanking = () => {
  rankingList.innerHTML = "";

  const allKeys = ["snakeRanking_easy", "snakeRanking_medium", "snakeRanking_hard", "snakeRanking_extreme"];
  let ranking = [];

  if (currentTab === "all") {
    allKeys.forEach(key => {
      const list = JSON.parse(localStorage.getItem(key)) || [];
      ranking = ranking.concat(list);
    });

    ranking.sort((a, b) => b.score - a.score);
    ranking = ranking.slice(0, 10);

  } else {
    const key = "snakeRanking_" + currentTab;
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
  if (!["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(key)) return;

  if (!started) {
    started = true;
    startTimer();
  }

  if (key == "ArrowRight" && direction != "left") direction = "right";
  if (key == "ArrowLeft" && direction != "right") direction = "left";
  if (key == "ArrowDown" && direction != "up") direction = "down";
  if (key == "ArrowUp" && direction != "down") direction = "up";
});

buttonPlay.addEventListener("click", () => {
  startScreen.style.display = "flex";
  menu.style.display = "none";
  canvas.style.filter = "none";

  clearInterval(loopId);
  clearInterval(timerInterval);
  clearInterval(obstacleInterval);
});
