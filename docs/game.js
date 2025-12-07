/* ==========================================================================
   CONFIGURAÇÕES INICIAIS E VARIÁVEIS GLOBAIS
   ========================================================================== */
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

// Configuração do Canvas Pequeno (Próxima Peça)
const nextCanvas = document.getElementById('next');
const nextContext = nextCanvas.getContext('2d');

// Ajuste de Escala (Zoom)
context.scale(30, 30); // Jogo Principal

// --- CORREÇÃO AQUI ---
// Mudamos de 25 para 20. 
// Como o canvas tem 80px, 80/20 = 4 blocos de largura. Agora as peças cabem!
nextContext.scale(20, 20);

// Variáveis de Estado do Jogo
let usuarioAtualId = 1;       // ID 1 = Player 1 / Anônimo (Padrão)
let proximaPecaMatriz = null; // Guarda qual será a próxima peça a cair

// Controle de Tempo (Game Loop)
let dropCounter = 0;
let dropInterval = 1000; // Velocidade de queda (1000ms = 1 segundo)
let lastTime = 0;


/* ==========================================================================
   SEÇÃO 1: DEFINIÇÃO DAS PEÇAS E CORES
   ========================================================================== */

// Define o formato de cada peça (Tetrimino)
function criarPeca(tipo) {
    switch (tipo) {
        case 'I':
            return [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
            ];
        case 'L':
            return [
                [0, 2, 0],
                [0, 2, 0],
                [0, 2, 2],
            ];
        case 'J':
            return [
                [0, 3, 0],
                [0, 3, 0],
                [3, 3, 0],
            ];
        case 'O':
            return [
                [4, 4],
                [4, 4],
            ];
        case 'Z':
            return [
                [5, 5, 0],
                [0, 5, 5],
                [0, 0, 0],
            ];
        case 'S':
            return [
                [0, 6, 6],
                [6, 6, 0],
                [0, 0, 0],
            ];
        case 'T':
            return [
                [0, 7, 0],
                [7, 7, 7],
                [0, 0, 0],
            ];
    }
}

// Cores para cada número (Índice 0 é vazio/nulo)
const cores = [
    null,
    '#FF0D72', // 1: I - Rosa/Vermelho
    '#0DC2FF', // 2: L - Azul Ciano
    '#0DFF72', // 3: J - Verde
    '#F538FF', // 4: O - Roxo
    '#FF8E0D', // 5: Z - Laranja
    '#FFE138', // 6: S - Amarelo
    '#3877FF', // 7: T - Azul Escuro
];


/* ==========================================================================
   SEÇÃO 2: LÓGICA DA ARENA (O TABULEIRO)
   ========================================================================== */

function criarMatriz(w, h) {
    const matriz = [];
    while (h--) {
        matriz.push(new Array(w).fill(0));
    }
    return matriz;
}

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

function fundir(arena, jogador) {
    jogador.matriz.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + jogador.pos.y][x + jogador.pos.x] = value;
            }
        });
    });
}

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


/* ==========================================================================
   SEÇÃO 3: VISUALIZAÇÃO E DESENHO
   ========================================================================== */

function desenhar() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    desenharMatriz(arena, {x: 0, y: 0});

    const ghost = {
        pos: { x: jogador.pos.x, y: jogador.pos.y },
        matriz: jogador.matriz,
        score: 0
    };
    while (!colisao(arena, ghost)) {
        ghost.pos.y++;
    }
    ghost.pos.y--;

    desenharMatriz(ghost.matriz, ghost.pos, true);

    desenharMatriz(jogador.matriz, jogador.pos);
}

function desenharMatriz(matriz, offset, isGhost = false) {
    matriz.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                const posX = x + offset.x;
                const posY = y + offset.y;

                if (isGhost) {
                    context.fillStyle = 'rgba(255, 255, 255, 0.2)';
                    context.fillRect(posX, posY, 1, 1);
                    context.lineWidth = 0.05;
                    context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                    context.strokeRect(posX, posY, 1, 1);
                    return;
                }

                const corBase = cores[value];

                context.fillStyle = corBase;
                context.fillRect(posX, posY, 1, 1);

                context.lineWidth = 0.08;
                context.strokeStyle = '#222';
                context.strokeRect(posX, posY, 1, 1);

                context.fillStyle = 'rgba(255, 255, 255, 0.4)';
                context.beginPath();
                context.moveTo(posX, posY + 1);
                context.lineTo(posX, posY);
                context.lineTo(posX + 1, posY);
                context.lineTo(posX + 0.8, posY + 0.2);
                context.lineTo(posX + 0.2, posY + 0.2);
                context.lineTo(posX + 0.2, posY + 0.8);
                context.fill();

                context.fillStyle = 'rgba(0, 0, 0, 0.2)';
                context.beginPath();
                context.moveTo(posX + 1, posY);
                context.lineTo(posX + 1, posY + 1);
                context.lineTo(posX, posY + 1);
                context.lineTo(posX + 0.2, posY + 0.8);
                context.lineTo(posX + 0.8, posY + 0.8);
                context.lineTo(posX + 0.8, posY + 0.2);
                context.fill();

                context.fillStyle = 'rgba(0, 0, 0, 0.1)';
                context.fillRect(posX + 0.3, posY + 0.3, 0.4, 0.4);
            }
        });
    });
}

// Desenha a próxima peça no painel lateral
function desenharProximaNoPainel() {
    // Limpa o canvas pequeno (Fundo escuro)
    nextContext.fillStyle = '#1a1a1a';
    nextContext.fillRect(0, 0, nextCanvas.width, nextCanvas.height);

    if (!proximaPecaMatriz) return;

    // Calcula o centro para desenhar
    // Como a escala é 20 e o canvas é 80, temos exatamente 4 blocos de largura.
    const offsetX = (4 - proximaPecaMatriz[0].length) / 2;
    const offsetY = (4 - proximaPecaMatriz.length) / 2;

    proximaPecaMatriz.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                // Estilo simplificado para o painel lateral
                nextContext.fillStyle = cores[value];
                nextContext.fillRect(x + offsetX, y + offsetY, 1, 1);
                nextContext.lineWidth = 0.1;
                nextContext.strokeStyle = '#fff';
                nextContext.strokeRect(x + offsetX, y + offsetY, 1, 1);
            }
        });
    });
}

function atualizarPlacar() {
    document.getElementById('score').innerText = jogador.score;
}


/* ==========================================================================
   SEÇÃO 4: MECÂNICA DE JOGO
   ========================================================================== */

function jogadorMover(dir) {
    jogador.pos.x += dir;
    if (colisao(arena, jogador)) {
        jogador.pos.x -= dir;
    }
}

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
            [matriz[x][y], matriz[y][x]] = [matriz[y][x], matriz[x][y]];
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

    if (proximaPecaMatriz === null) {
        proximaPecaMatriz = criarPeca(pecas[pecas.length * Math.random() | 0]);
    }
    jogador.matriz = proximaPecaMatriz;
    proximaPecaMatriz = criarPeca(pecas[pecas.length * Math.random() | 0]);

    desenharProximaNoPainel();

    jogador.pos.y = 0;
    jogador.pos.x = (arena[0].length / 2 | 0) - (jogador.matriz[0].length / 2 | 0);

    if (colisao(arena, jogador)) {
        if (jogador.score > 0) {
            salvarRecorde(jogador.score);
        }

        document.getElementById('final-score').innerText = jogador.score;
        document.getElementById('game-over-modal').classList.remove('hidden');

        arena.forEach(row => row.fill(0));
    }
}

function reiniciarPartida() {
    document.getElementById('game-over-modal').classList.add('hidden');

    arena.forEach(row => row.fill(0));
    jogador.score = 0;
    atualizarPlacar();

    usuarioAtualId = 1;
    document.getElementById('username').value = "";

    jogadorReset();
    update();
}

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


/* ==========================================================================
   SEÇÃO 5: INTEGRAÇÃO COM BACKEND (API)
   ========================================================================== */

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
                console.log("Pontuação salva!");
                carregarRanking();
            } else {
                console.error("Erro ao salvar:", response.status);
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

            arena.forEach(row => row.fill(0));
            jogador.score = 0;
            atualizarPlacar();
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


/* ==========================================================================
   SEÇÃO 6: INICIALIZAÇÃO E EVENTOS
   ========================================================================== */

const arena = criarMatriz(12, 20);
const jogador = {
    pos: {x: 0, y: 0},
    matriz: null,
    score: 0,
};

document.addEventListener('keydown', event => {
    if (event.keyCode === 37) { // Esquerda
        jogadorMover(-1);
    } else if (event.keyCode === 39) { // Direita
        jogadorMover(1);
    } else if (event.keyCode === 40) { // Baixo
        jogadorDerrubar();
    } else if (event.keyCode === 81) { // Q (Gira)
        jogadorRotacionar(-1);
    } else if (event.keyCode === 87) { // W (Gira)
        jogadorRotacionar(1);
    } else if (event.keyCode === 38) { // Cima (Gira)
        jogadorRotacionar(1);
    } else if (event.keyCode === 32) { // Espaço (Hard Drop)
        jogadorDropRapido();
    }
});

// Inicia
carregarRanking();
jogadorReset();
update();