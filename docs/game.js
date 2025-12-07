const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

// --- NOVO: Contexto da Próxima Peça ---
const nextCanvas = document.getElementById('next');
const nextContext = nextCanvas.getContext('2d');
// Escala menor para o canvas pequeno (25px por bloco fica bom em 100px)
nextContext.scale(20, 20);
// --------------------------------------

let usuarioAtualId = 1;
// Variável para guardar qual é a próxima peça
let proximaPecaMatriz = null;

context.scale(30, 30);

// --- 1. DEFINIÇÃO DAS PEÇAS ---
function criarPeca(tipo) {
    if (tipo === 'I') {
        return [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ];
    } else if (tipo === 'L') {
        return [
            [0, 2, 0],
            [0, 2, 0],
            [0, 2, 2],
        ];
    } else if (tipo === 'J') {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [3, 3, 0],
        ];
    } else if (tipo === 'O') {
        return [
            [4, 4],
            [4, 4],
        ];
    } else if (tipo === 'Z') {
        return [
            [5, 5, 0],
            [0, 5, 5],
            [0, 0, 0],
        ];
    } else if (tipo === 'S') {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    } else if (tipo === 'T') {
        return [
            [0, 7, 0],
            [7, 7, 7],
            [0, 0, 0],
        ];
    }
}

// Define as cores para os números 1 a 7
const cores = [
    null,
    '#FF0D72', // I - Rosa/Vermelho
    '#0DC2FF', // L - Azul Ciano
    '#0DFF72', // J - Verde
    '#F538FF', // O - Roxo
    '#FF8E0D', // Z - Laranja
    '#FFE138', // S - Amarelo
    '#3877FF', // T - Azul Escuro
];

// --- 2. LÓGICA DO TABULEIRO (ARENA) ---
function criarMatriz(w, h) {
    const matriz = [];
    while (h--) {
        matriz.push(new Array(w).fill(0));
    }
    return matriz;
}

// Verifica se a peça bateu em algo (paredes ou outras peças)
function colisao(arena, jogador) {
    const m = jogador.matriz;
    const o = jogador.pos;
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
                (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

// Copia a peça do jogador para dentro da arena (fixa a peça)
function fundir(arena, jogador) {
    jogador.matriz.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + jogador.pos.y][x + jogador.pos.x] = value;
            }
        });
    });
}

// Desenha tudo na tela principal
function desenhar() {
    // Limpa a tela mantendo a transparência (para ver o céu do CSS)
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha as peças fixas da Arena
    desenharMatriz(arena, {x: 0, y: 0});

    // Cálculo da sombra (Ghost Piece)
    const ghost = {
        pos: { x: jogador.pos.x, y: jogador.pos.y },
        matriz: jogador.matriz,
        score: 0
    };

    // Derruba o fantasma até bater
    while (!colisao(arena, ghost)) {
        ghost.pos.y++;
    }
    ghost.pos.y--; // Sobe um passo

    // Desenha o Fantasma (passando true para o último parâmetro)
    desenharMatriz(ghost.matriz, ghost.pos, true);

    // Desenha a peça real do Jogador
    desenharMatriz(jogador.matriz, jogador.pos);
}

function desenharMatriz(matriz, offset, isGhost = false) {
    matriz.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                const posX = x + offset.x;
                const posY = y + offset.y;

                // ESTILO FANTASMA (Sombra)
                if (isGhost) {
                    context.fillStyle = 'rgba(255, 255, 255, 0.2)'; // Branco transparente
                    context.fillRect(posX, posY, 1, 1);
                    context.lineWidth = 0.05;
                    context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                    context.strokeRect(posX, posY, 1, 1);
                    return;
                }

                // ESTILO PEDRA/RUNA
                const corBase = cores[value];

                // 1. Preenchimento Base
                context.fillStyle = corBase;
                context.fillRect(posX, posY, 1, 1);

                // 2. Borda Grossa Escura
                context.lineWidth = 0.08;
                context.strokeStyle = '#222';
                context.strokeRect(posX, posY, 1, 1);

                // 3. Efeito de Relevo
                // Luz
                context.fillStyle = 'rgba(255, 255, 255, 0.4)';
                context.beginPath();
                context.moveTo(posX, posY + 1);
                context.lineTo(posX, posY);
                context.lineTo(posX + 1, posY);
                context.lineTo(posX + 0.8, posY + 0.2);
                context.lineTo(posX + 0.2, posY + 0.2);
                context.lineTo(posX + 0.2, posY + 0.8);
                context.fill();

                // Sombra
                context.fillStyle = 'rgba(0, 0, 0, 0.2)';
                context.beginPath();
                context.moveTo(posX + 1, posY);
                context.lineTo(posX + 1, posY + 1);
                context.lineTo(posX, posY + 1);
                context.lineTo(posX + 0.2, posY + 0.8);
                context.lineTo(posX + 0.8, posY + 0.8);
                context.lineTo(posX + 0.8, posY + 0.2);
                context.fill();

                // 4. Detalhe de textura
                context.fillStyle = 'rgba(0, 0, 0, 0.1)';
                context.fillRect(posX + 0.3, posY + 0.3, 0.4, 0.4);
            }
        });
    });
}

// --- 3. MOVIMENTAÇÃO ---

function jogadorDerrubar() {
    jogador.pos.y++;
    if (colisao(arena, jogador)) {
        jogador.pos.y--;
        fundir(arena, jogador);
        arenaVarrer();
        jogadorReset();
    }
    dropCounter = 0;
}

// --- Função Drop Rápido (Hard Drop) ---
function jogadorDropRapido() {
    while (!colisao(arena, jogador)) {
        jogador.pos.y++;
    }
    jogador.pos.y--;
    fundir(arena, jogador);
    arenaVarrer();
    jogadorReset();
    dropCounter = 0;
}

function jogadorMover(dir) {
    jogador.pos.x += dir;
    if (colisao(arena, jogador)) {
        jogador.pos.x -= dir;
    }
}

function jogadorRotacionar(dir) {
    const pos = jogador.pos.x;
    let offset = 1;
    rotacionar(jogador.matriz, dir);
    while (colisao(arena, jogador)) {
        jogador.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > jogador.matriz[0].length) {
            rotacionar(jogador.matriz, -dir);
            jogador.pos.x = pos;
            return;
        }
    }
}

function rotacionar(matriz, dir) {
    for (let y = 0; y < matriz.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [
                matriz[x][y],
                matriz[y][x],
            ] = [
                matriz[y][x],
                matriz[x][y],
            ];
        }
    }
    if (dir > 0) {
        matriz.forEach(row => row.reverse());
    } else {
        matriz.reverse();
    }
}

function jogadorReset() {
    const pecas = 'ILJOTSZ';

    // --- LÓGICA DA PRÓXIMA PEÇA ---
    if (proximaPecaMatriz === null) {
        proximaPecaMatriz = criarPeca(pecas[pecas.length * Math.random() | 0]);
    }
    jogador.matriz = proximaPecaMatriz;
    proximaPecaMatriz = criarPeca(pecas[pecas.length * Math.random() | 0]);

    // Atualiza o desenho no painel lateral
    desenharProximaNoPainel();
    // -----------------------------

    jogador.pos.y = 0;
    jogador.pos.x = (arena[0].length / 2 | 0) - (jogador.matriz[0].length / 2 | 0);

    // --- GAME OVER ---
    if (colisao(arena, jogador)) {
        // 1. Salva o recorde
        if (jogador.score > 0) {
            salvarRecorde(jogador.score);
        }

        // 2. Atualiza o texto da pontuação no Modal
        document.getElementById('final-score').innerText = jogador.score;

        // 3. Mostra o Modal (remove a classe hidden)
        document.getElementById('game-over-modal').classList.remove('hidden');

        // 4. Limpa a arena para parar a colisão, mas NÃO zera o score ainda
        arena.forEach(row => row.fill(0));

        // (O reset do score e do usuário agora acontece na função reiniciarPartida)
    }
}

// --- 4. CONTROLE DE TEMPO ---
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        jogadorDerrubar();
    }

    desenhar();
    requestAnimationFrame(update);
}

// --- 5. INICIALIZAÇÃO ---
const arena = criarMatriz(12, 20);
const jogador = {
    pos: {x: 0, y: 0},
    matriz: null,
    score: 0,
};

// Captura as teclas
document.addEventListener('keydown', event => {
    if (event.keyCode === 37) { // Seta Esquerda
        jogadorMover(-1);
    } else if (event.keyCode === 39) { // Seta Direita
        jogadorMover(1);
    } else if (event.keyCode === 40) { // Seta Baixo
        jogadorDerrubar();
    } else if (event.keyCode === 81) { // Q
        jogadorRotacionar(-1);
    } else if (event.keyCode === 87) { // W
        jogadorRotacionar(1);
    } else if (event.keyCode === 38) { // Cima
        jogadorRotacionar(1);
    } else if (event.keyCode === 32) { // Espaço (Hard Drop)
        jogadorDropRapido();
    }
});

function arenaVarrer() {
    let linhasRemovidas = 0;
    outer: for (let y = arena.length - 1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;
        linhasRemovidas++;
    }
    if (linhasRemovidas > 0) {
        jogador.score += linhasRemovidas * 10 * linhasRemovidas;
        atualizarPlacar();
    }
}

function atualizarPlacar() {
    document.getElementById('score').innerText = jogador.score;
}

// Função que chama o Backend Java
function salvarRecorde(pontos) {
    const urlBackend = 'https://tetris-549n.onrender.com/ranking';
    const payload = {
        pontuacao: pontos,
        dataRegistro: new Date().toISOString().split('T')[0],
        jogador: { id: usuarioAtualId }
    };

    console.log("Enviando pontuação...", payload);

    fetch(urlBackend, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
        .then(response => {
            if (response.ok) {
                console.log("Pontuação salva com sucesso!");
                alert("Recorde salvo no banco de dados!");
                carregarRanking();
            } else {
                console.error("Erro ao salvar:", response.status);
                alert("Erro ao salvar pontuação. Veja o console.");
            }
        })
        .catch(erro => console.error("Erro de conexão:", erro));
}

function iniciarJogo() {
    const nomeInput = document.getElementById('username').value;
    if (!nomeInput) {
        alert("Por favor, digite seu nome!");
        return;
    }
    const urlLogin = 'https://tetris-549n.onrender.com/jogadores/arcade';

    fetch(urlLogin, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: nomeInput })
    })
        .then(response => response.json())
        .then(jogador => {
            usuarioAtualId = jogador.id;
            alert(`Bem-vindo, ${jogador.nomeUsuario}! O jogo vai começar.`);
            document.getElementById('tetris').focus();
            jogadorReset();
        })
        .catch(erro => {
            console.error(erro);
            alert("Erro ao conectar com o servidor.");
        });
}

function carregarRanking() {
    const urlBackend = 'https://tetris-549n.onrender.com/ranking';
    fetch(urlBackend)
        .then(response => response.json())
        .then(data => {
            data.sort((a, b) => b.pontuacao - a.pontuacao);
            const top3 = data.slice(0, 3);
            const lista = document.getElementById('ranking-list');
            lista.innerHTML = '';
            top3.forEach(item => {
                const li = document.createElement('li');
                const nome = item.jogador ? item.jogador.nomeUsuario : 'Anônimo';
                li.innerHTML = `<span>${nome}</span> <span>${item.pontuacao}</span>`;
                lista.appendChild(li);
            });
        })
        .catch(err => console.error("Erro ao carregar ranking:", err));
}

// --- FUNÇÃO PARA DESENHAR NO PAINEL LATERAL ---
function desenharProximaNoPainel() {
    // Limpa o canvas pequeno
    nextContext.fillStyle = '#1a1a1a'; // Fundo escuro
    nextContext.fillRect(0, 0, nextCanvas.width, nextCanvas.height);

    if (!proximaPecaMatriz) return;

    // Calcula o centro para desenhar
    const offsetX = (4 - proximaPecaMatriz[0].length) / 2;
    const offsetY = (4 - proximaPecaMatriz.length) / 2;

    proximaPecaMatriz.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                // Usamos o estilo "Pedra" simplificado para o painel
                nextContext.fillStyle = cores[value];
                nextContext.fillRect(x + offsetX, y + offsetY, 1, 1);

                nextContext.lineWidth = 0.1;
                nextContext.strokeStyle = '#fff';
                nextContext.strokeRect(x + offsetX, y + offsetY, 1, 1);
            }
        });
    });
}

function reiniciarPartida() {
    // Esconde o modal
    document.getElementById('game-over-modal').classList.add('hidden');
    // Reseta o jogo
    arena.forEach(row => row.fill(0));
    jogador.score = 0;
    atualizarPlacar();
    usuarioAtualId = 1; // Reseta usuário se quiser
    document.getElementById('username').value = "";
    jogadorReset();
    update(); // Garante que o loop volte se tiver parado
}

// Carrega o ranking assim que o jogo abre
carregarRanking();
jogadorReset();
update();