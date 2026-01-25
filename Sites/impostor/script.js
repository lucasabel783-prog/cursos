document.addEventListener("DOMContentLoaded", () => {

  let totalPlayers = 0;
  let totalImpostors = 0;
  let currentPlayer = 0;

  let impostors = [];
  let playerNames = [];

  let chosenWord = "";
  let chosenHints = [];

  const words = [
    { word: "Praia", hints: ["Areia", "Mar", "Verão"] },
    { word: "Hospital", hints: ["Doente", "Remédio", "Emergência"] },
    { word: "Escola", hints: ["Estudo", "Aluno", "Sala"] },
    { word: "Cinema", hints: ["Filme", "Tela", "Pipoca"] },
    { word: "Aeroporto", hints: ["Avião", "Viagem", "Bagagem"] },
    { word: "Restaurante", hints: ["Comida", "Cardápio", "Garçom"] },
    { word: "Shopping", hints: ["Compras", "Loja", "Praça"] },
    { word: "Fazenda", hints: ["Campo", "Animais", "Plantação"] },
    { word: "Igreja", hints: ["Fé", "Banco", "Oração"] },
    { word: "Academia", hints: ["Exercício", "Peso", "Suor"] },
    { word: "Biblioteca", hints: ["Livros", "Silêncio", "Estudo"] },
    { word: "Padaria", hints: ["Pão", "Forno", "Manhã"] },
    { word: "Mercado", hints: ["Compras", "Carrinho", "Caixa"] },
    { word: "Estádio", hints: ["Torcida", "Jogo", "Arquibancada"] },
    { word: "Piscina", hints: ["Água", "Cloro", "Mergulho"] },
    { word: "Hotel", hints: ["Quarto", "Hospedagem", "Viagem"] },
    { word: "Banco", hints: ["Dinheiro", "Conta", "Senha"] },
    { word: "Farmácia", hints: ["Remédio", "Receita", "Caixa"] },
    { word: "Parque", hints: ["Natureza", "Árvore", "Passeio"] },
    { word: "Zoológico", hints: ["Animais", "Jaula", "Visita"] },
    { word: "Cachorro", hints: ["Latido", "Coleira", "Pet"] },
    { word: "Gato", hints: ["Miau", "Bigode", "Telhado"] },
    { word: "Cavalo", hints: ["Corrida", "Sela", "Campo"] },
    { word: "Leão", hints: ["Rei", "Juba", "Selva"] },
    { word: "Elefante", hints: ["Tromba", "Grande", "Cinza"] },
    { word: "Pássaro", hints: ["Voo", "Asa", "Ninho"] },
    { word: "Peixe", hints: ["Escama", "Água", "Aquário"] },
    { word: "Abelha", hints: ["Mel", "Colmeia", "Ferrão"] },
    { word: "Aranha", hints: ["Teia", "Oito", "Inseto"] },
    { word: "Cobra", hints: ["Veneno", "Rastejar", "Escama"] },
    { word: "Pizza", hints: ["Queijo", "Forno", "Fatias"] },
    { word: "Hambúrguer", hints: ["Carne", "Pão", "Lanche"] },
    { word: "Sorvete", hints: ["Frio", "Casquinha", "Doce"] },
    { word: "Chocolate", hints: ["Doce", "Cacau", "Barra"] },
    { word: "Bolo", hints: ["Festa", "Vela", "Massa"] },
    { word: "Macarrão", hints: ["Molho", "Prato", "Itália"] },
    { word: "Arroz", hints: ["Branco", "Grão", "Panela"] },
    { word: "Feijão", hints: ["Caldo", "Preto", "Prato"] },
    { word: "Café", hints: ["Quente", "Xícara", "Manhã"] },
    { word: "Suco", hints: ["Fruta", "Copo", "Gelado"] },
    { word: "Carro", hints: ["Motor", "Volante", "Estrada"] },
    { word: "Moto", hints: ["Capacete", "Duas", "Velocidade"] },
    { word: "Bicicleta", hints: ["Pedal", "Roda", "Ciclovia"] },
    { word: "Ônibus", hints: ["Passagem", "Linha", "Parada"] },
    { word: "Trem", hints: ["Trilho", "Estação", "Vagão"] },
    { word: "Navio", hints: ["Mar", "Porto", "Grande"] },
    { word: "Avião", hints: ["Asa", "Altitude", "Viagem"] },
    { word: "Helicóptero", hints: ["Hélice", "Ar", "Resgate"] },
    { word: "Computador", hints: ["Tela", "Teclado", "Mouse"] },
    { word: "Celular", hints: ["Toque", "Mensagem", "App"] },
    { word: "Televisão", hints: ["Canal", "Controle", "Tela"] },
    { word: "Internet", hints: ["Rede", "WiFi", "Online"] },
    { word: "Câmera", hints: ["Foto", "Lente", "Flash"] },
    { word: "Relógio", hints: ["Hora", "Pulso", "Alarme"] },
    { word: "Fone", hints: ["Som", "Ouvido", "Música"] },
    { word: "Controle", hints: ["Botão", "TV", "Jogo"] }
  ];

  const setup = document.getElementById("setup");
  const game = document.getElementById("game");
  const end = document.getElementById("end");

  const playerText = document.getElementById("playerText");
  const wordEl = document.getElementById("word");
  const errorEl = document.getElementById("error");
  const namesContainer = document.getElementById("namesContainer");
  const impostorCount = document.getElementById("impostorCount");

  const revealBtn = document.getElementById("revealBtn");

  document.getElementById("generateNamesBtn").addEventListener("click", generateNameInputs);
  document.getElementById("startBtn").addEventListener("click", startGame);
  document.getElementById("nextBtn").addEventListener("click", nextPlayer);
  document.getElementById("resetBtn").addEventListener("click", resetGame);
  document.getElementById("nextRoundBtn").addEventListener("click", nextRound);

  // SEGURAR PARA REVELAR (MODO CELULAR)
  revealBtn.addEventListener("mousedown", () => wordEl.classList.remove("hidden"));
  revealBtn.addEventListener("mouseup", () => wordEl.classList.add("hidden"));
  revealBtn.addEventListener("touchstart", () => wordEl.classList.remove("hidden"));
  revealBtn.addEventListener("touchend", () => wordEl.classList.add("hidden"));

  function generateNameInputs() {
    namesContainer.innerHTML = "";
    totalPlayers = Number(document.getElementById("playersInput").value);

    for (let i = 0; i < totalPlayers; i++) {
      const input = document.createElement("input");
      input.placeholder = `Nome do jogador ${i + 1}`;
      input.classList.add("name-input");
      namesContainer.appendChild(input);
    }
  }

  function startGame() {
    const nameInputs = document.querySelectorAll(".name-input");
    playerNames = [];

    for (let input of nameInputs) {
      if (input.value.trim() === "") {
        errorEl.innerText = "Preencha todos os nomes.";
        return;
      }
      playerNames.push(input.value.trim());
    }

    totalPlayers = playerNames.length;
    totalImpostors = Number(document.getElementById("impostorsInput").value);

    if (totalImpostors >= totalPlayers) {
      errorEl.innerText = "Impostores devem ser menos que jogadores.";
      return;
    }

    errorEl.innerText = "";
    currentPlayer = 0;
    impostors = [];

    const selected = words[Math.floor(Math.random() * words.length)];
    chosenWord = selected.word;
    chosenHints = [...selected.hints];

    // SORTEIA IMPOSTORES
    while (impostors.length < totalImpostors) {
      const rand = Math.floor(Math.random() * totalPlayers);
      if (!impostors.includes(rand)) impostors.push(rand);
    }

    // EMBARALHA AS DICAS ENTRE IMPOSTORES
    chosenHints = shuffleArray(chosenHints).slice(0, totalImpostors);

    setup.classList.add("hidden");
    game.classList.remove("hidden");

    impostorCount.innerText = `Existem ${totalImpostors} impostor(es) neste jogo.`;

    showPlayer();
  }

  function showPlayer() {
    playerText.innerText = playerNames[currentPlayer];

    const impostorPosition = impostors.indexOf(currentPlayer);

    if (impostorPosition !== -1) {
      const difficulty = Number(document.getElementById("difficulty").value);
      const hint = chosenHints[impostorPosition] || chosenHints[0];

      wordEl.innerHTML = `
        😈 <strong>Você é o IMPOSTOR</strong><br><br>
        💡 <em>Dica:</em> ${hint}
      `;
    } else {
      wordEl.innerHTML = `
        ✅ <strong>Sua palavra é:</strong><br><br>
        ${chosenWord}
      `;
    }
  }

  function nextPlayer() {
    currentPlayer++;

    if (currentPlayer >= totalPlayers) {
      game.classList.add("hidden");
      end.classList.remove("hidden");
    } else {
      showPlayer();
    }
  }

  function nextRound() {
  end.classList.add("hidden");
  game.classList.remove("hidden");
  currentPlayer = 0;
  impostors = [];

  // Se já tiver nomes, não precisa preencher de novo
  // Mantém totalPlayers e totalImpostors

  const selected = words[Math.floor(Math.random() * words.length)];
  chosenWord = selected.word;
  chosenHints = [...selected.hints];

  while (impostors.length < totalImpostors) {
    const rand = Math.floor(Math.random() * totalPlayers);
    if (!impostors.includes(rand)) impostors.push(rand);
  }

  chosenHints = shuffleArray(chosenHints).slice(0, totalImpostors);

  showPlayer();
}

  function resetGame() {
    end.classList.add("hidden");
    setup.classList.remove("hidden");
    namesContainer.innerHTML = "";
    impostorCount.innerText = "";
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

});
