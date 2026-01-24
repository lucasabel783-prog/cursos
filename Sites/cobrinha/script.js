const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");

const startScreen = document.querySelector(".start-screen");
const startBtn = document.getElementById("startBtn");
const playerNameInput = document.getElementById("playerName");
const snakeColorInput = document.getElementById("snakeColor");

const timerDisplay = document.getElementById("time");

const size = 30;
const initialPosition = { x: 270, y: 240 };

let snake = [{ x: initialPosition.x, y: initialPosition.y }];
let direction = null;
let loopId = null;
let gameRunning = false;
let gameOverState = false;
let grow = false;
let snakeColor = "#ffffff";
let playerName = "";

let seconds = 0;
let timerInterval = null;

const incrementScore = () => {
  score.innerText = +score.innerText + 10;
};

const randomNumber = (min, max) =>
  Math.round(Math.random() * (max - min) + min);

const randomPosition = () => {
  const number = randomNumber(0, canvas.width - size);
  return Math.round(number / size) * size;
};

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

const drawSnake = () => {
  snake.forEach((pos) => {
    ctx.fillStyle = snakeColor;
    ctx.fillRect(pos.x, pos.y, size, size);
  });
};

const moveSnake = () => {
  if (!direction) return;

  const head = snake[snake.length - 1];
  let newHead = { x: head.x, y: head.y };

  if (direction === "right") newHead.x += size;
  if (direction === "left") newHead.x -= size;
  if (direction === "down") newHead.y += size;
  if (direction === "up") newHead.y -= size;

  if (newHead.x < 0) newHead.x = canvas.width - size;
  if (newHead.x > canvas.width - size) newHead.x = 0;
  if (newHead.y < 0) newHead.y = canvas.height - size;
  if (newHead.y > canvas.height - size) newHead.y = 0;

  snake.push(newHead);

  if (!grow) {
    snake.shift();
  } else {
    grow = false;
  }
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

const gameOver = () => {
  clearInterval(loopId);
  clearInterval(timerInterval);

  gameOverState = true;
  gameRunning = false;

  menu.style.display = "flex";
  finalScore.innerText = score.innerText;
  canvas.style.filter = "blur(2px)";
};

const gameLoop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid();
  drawFood();
  moveSnake();
  checkEat();
  checkCollision();
  drawSnake();
};

const startTimer = () => {
  seconds = 0;
  timerDisplay.innerText = "00:00";

  timerInterval = setInterval(() => {
    seconds++;

    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");

    timerDisplay.innerText = `${min}:${sec}`;
  }, 1000);
};

const startGame = () => {
  clearInterval(loopId);
  gameRunning = true;
  loopId = setInterval(gameLoop, 200);

  startTimer();
};

// 🔥 START BUTTON
startBtn.addEventListener("click", () => {
  playerName = playerNameInput.value.trim();
  snakeColor = snakeColorInput.value;

  if (playerName === "") {
    alert("Digite seu nome para começar!");
    return;
  }

  startScreen.style.display = "none";
});

// 🟩 Atualiza a cor durante o jogo também
snakeColorInput.addEventListener("input", () => {
  snakeColor = snakeColorInput.value;
});

document.addEventListener("keydown", ({ key }) => {
  if (gameOverState) return;
  if (!gameRunning) startGame();

  if (key === "ArrowRight" && direction !== "left") direction = "right";
  if (key === "ArrowLeft" && direction !== "right") direction = "left";
  if (key === "ArrowDown" && direction !== "up") direction = "down";
  if (key === "ArrowUp" && direction !== "down") direction = "up";
});

buttonPlay.addEventListener("click", () => {
  score.innerText = "00";
  snake = [{ x: 270, y: 240 }];
  direction = null;
  grow = false;

  gameOverState = false;
  gameRunning = false;

  menu.style.display = "none";
  canvas.style.filter = "none";
});