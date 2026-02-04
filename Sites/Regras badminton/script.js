const bancoQuestões = {
    facil: [
        { q: "Quantos pontos são necessários para vencer um set?", o: ["15", "21", "25"], a: 1 },
        { q: "O que é usado para jogar Badminton?", o: ["Bola", "Volante", "Disco"], a: 1 },
        { q: "O saque inicial (0-0) é de qual lado?", o: ["Direito", "Esquerdo", "Meio"], a: 0 }
    ],
    medio: [
        { q: "O volante toca na fita da rede e cai dentro. O que acontece?", o: ["Ponto válido", "Falta", "Repete "], a: 0 },
        { q: "No serviço de pares, qual linha de fundo vale?", o: ["A última", "A de dentro", "Nenhuma"], a: 1 },
        { q: "Tocar na rede com a raquete é:", o: ["Permitido", "Falta", "Ponto seu"], a: 1 }
    ],
    dificil: [
        { q: "No empate 29-29, quem ganha?", o: ["Quem abrir 2 pontos", "Quem fizer 30", "Empata"], a: 1 },
        { q: "Se o volante bate no seu teto e cai dentro:", o: ["Ponto seu", "Falta sua", "Repete"], a: 1 },
        { q: "O que vai receber se move antes do serviço e o serviço cai fora:", o: ["Falta do que recebeu", "Ponto do que recebeu", "Repete"], a: 0 }
    ]
};

let perguntasAtuais = [];
let indiceAtual = 0;
let acertos = 0;

function iniciarQuiz(nivel) {
    perguntasAtuais = bancoQuestões[nivel];
    indiceAtual = 0;
    acertos = 0;
    document.getElementById('setup-quiz').style.display = 'none';
    document.getElementById('quiz-jogo').style.display = 'block';
    mostrarPergunta();
}

function mostrarPergunta() {
    const q = perguntasAtuais[indiceAtual];
    document.getElementById('pergunta-atual').innerText = indiceAtual + 1;
    document.getElementById('pergunta-texto').innerText = q.q;
    const container = document.getElementById('opcoes-container');
    container.innerHTML = "";
    
    q.o.forEach((opcao, i) => {
        const btn = document.createElement('button');
        btn.innerText = opcao;
        btn.onclick = () => validarResposta(i);
        container.appendChild(btn);
    });
}

function validarResposta(escolha) {
    if(escolha === perguntasAtuais[indiceAtual].a) acertos++;
    
    indiceAtual++;
    if(indiceAtual < perguntasAtuais.length) {
        mostrarPergunta();
    } else {
        finalizarQuiz();
    }
}

function finalizarQuiz() {
    document.getElementById('quiz-jogo').style.display = 'none';
    document.getElementById('quiz-resultado').style.display = 'block';
    document.getElementById('score-texto').innerText = `Você acertou ${acertos} de ${perguntasAtuais.length}!`;
}

function resetQuiz() {
    document.getElementById('quiz-resultado').style.display = 'none';
    document.getElementById('setup-quiz').style.display = 'block';
}

function pesquisaGlobal() {
    const input = document.getElementById('campoPesquisa').value;
    const listaResultados = document.getElementById('resultados-pesquisa');
    
    // 1. O Teu Índice: Aqui defines tudo o que o site tem
    const siteMap = [
        { titulo: "Regras do Jogo", url: "regras.html", tags: "campo volante faltas pontos", categoria: "Página Principal" },
        { titulo: "Área de Login", url: "login.html", tags: "entrar acesso conta", categoria: "Acesso" },
        { titulo: "Download PDF", url: "regras-badminton.pdf", tags: "baixar guia portugal volante", categoria: "Documento" },
        { titulo: "Quadra Interativa", url: "campo.html", tags: "linhas medidas desenho", categoria: "Ferramenta" },
        { titulo: "Quiz", url: "Quiz.html", tags: "perguntas resposta quiz", categoria: "Quiz" },
        { titulo: "Jogadas", url: "Jogadas.html", tags: "jogo Fora Rede", categoria: "Jogadas" }
    ];

    const normalizar = (texto) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const termo = normalizar(input);

    // Limpar resultados anteriores
    listaResultados.innerHTML = "";

    if (termo.length < 2) {
        listaResultados.style.display = "none";
        return;
    }

    // 2. Filtrar o índice
    const encontrados = siteMap.filter(item => 
        normalizar(item.titulo).includes(termo) || normalizar(item.tags).includes(termo)
    );

    // 3. Gerar o HTML dos resultados
    if (encontrados.length > 0) {
        encontrados.forEach(item => {
            const link = document.createElement('a');
            link.href = item.url;
            link.className = 'resultado-item';
            link.innerHTML = `<strong>${item.titulo}</strong><span>${item.categoria}</span>`;
            listaResultados.appendChild(link);
        });
        listaResultados.style.display = "block";
    } else {
        listaResultados.innerHTML = "<div class='resultado-item'>Nada encontrado...</div>";
        listaResultados.style.display = "block";
    }
}

// Fechar a lista se clicar fora dela
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
        document.getElementById('resultados-pesquisa').style.display = "none";
    }
});

// Abre e fecha o painel
function togglePainel() {
    document.getElementById('painel-config').classList.toggle('aberto');
}

// Ajusta o brilho usando a opacidade do overlay preto
function ajustarBrilho() {
    const valor = document.getElementById('bright-range').value;
    // Converte o valor (30 a 100) para opacidade (0.7 a 0)
    const opacidade = (100 - valor) / 100;
    document.getElementById('overlay-brilho').style.opacity = opacidade;
}

// Muda o tamanho da letra no site todo
function mudarFonte(tamanho) {
    document.documentElement.style.setProperty('--font-size-base', tamanho);
}

// Liga/Desliga o Modo Escuro
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}
