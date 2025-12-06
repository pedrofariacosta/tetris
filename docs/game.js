const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

// Aumenta o tamanho de tudo em 20x (cada pixel vira um bloco de 20x20)
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

// Desenha tudo na tela
function desenhar() {
    // Pinta o fundo de preto
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Desenha as peças fixas da Arena
    desenharMatriz(arena, {x: 0, y: 0});
    // Desenha a peça atual do Jogador
    desenharMatriz(jogador.matriz, jogador.pos);
}

function desenharMatriz(matriz, offset) {
    matriz.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = cores[value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

// --- 3. MOVIMENTAÇÃO ---

function jogadorDerrubar() {
    jogador.pos.y++;
    if (colisao(arena, jogador)) {
        // Se bateu, volta um pra cima
        jogador.pos.y--;
        // Fixa na arena
        fundir(arena, jogador);

        // Limpa as linhas e atualiza placar
        arenaVarrer();

        // Reseta posição e pega nova peça
        jogadorReset();
    }
    dropCounter = 0;
}

// Move para os lados
function jogadorMover(dir) {
    jogador.pos.x += dir;
    if (colisao(arena, jogador)) {
        jogador.pos.x -= dir;
    }
}

// Rotaciona a peça
function jogadorRotacionar(dir) {
    const pos = jogador.pos.x;
    let offset = 1;
    rotacionar(jogador.matriz, dir);
    // Wall kick (se rodar e bater na parede, empurra a peça pro lado)
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
    jogador.matriz = criarPeca(pecas[pecas.length * Math.random() | 0]);
    jogador.pos.y = 0;
    jogador.pos.x = (arena[0].length / 2 | 0) -
        (jogador.matriz[0].length / 2 | 0);

    // Se resetar e já bater, é Game Over
    if (colisao(arena, jogador)) {
        // Antes de zerar, salva a pontuação se for maior que 0
        if (jogador.score > 0) {
            salvarRecorde(jogador.score);
        }

        arena.forEach(row => row.fill(0)); // Limpa o jogo
        // Zera a pontuação e atualiza a tela
        jogador.score = 0;
        atualizarPlacar();
    }
}

// --- 4. CONTROLE DE TEMPO (GAME LOOP) ---
let dropCounter = 0;
let dropInterval = 1000; // 1000ms = 1 segundo (Velocidade do jogo)

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
const arena = criarMatriz(12, 20); // Tabuleiro de 12 largura x 20 altura

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
    } else if (event.keyCode === 81) { // Tecla Q (Gira Esquerda)
        jogadorRotacionar(-1);
    } else if (event.keyCode === 87) { // Tecla W (Gira Direita)
        jogadorRotacionar(1);
    } else if (event.keyCode === 38) { // Seta Cima (Gira Direita - padrão)
        jogadorRotacionar(1);
    }
});

function arenaVarrer() {
    let linhasRemovidas = 0;

    // Percorre a arena de baixo para cima
    outer: for (let y = arena.length - 1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            // Se encontrar um zero, a linha não está cheia. Pula para a próxima.
            if (arena[y][x] === 0) {
                continue outer;
            }
        }

        // Se chegou aqui, a linha 'y' está cheia!
        // 1. Remove a linha cheia (splice) e pega ela limpa (fill(0))
        const row = arena.splice(y, 1)[0].fill(0);

        // 2. Coloca a linha limpa no topo da arena
        arena.unshift(row);

        // 3. Como tudo desceu, precisamos checar o mesmo índice 'y' de novo
        ++y;

        // 4. Conta quantas linhas foram removidas
        linhasRemovidas++;
    }

    // Calcula a pontuação: 10 pontos por linha, com bônus se fizer várias de uma vez
    if (linhasRemovidas > 0) {
        // Ex: 1 linha = 10pts, 2 linhas = 30pts, 3 linhas = 70pts...
        jogador.score += linhasRemovidas * 10 * linhasRemovidas;
        atualizarPlacar();
    }
}

function atualizarPlacar() {
    document.getElementById('score').innerText = jogador.score;
}

// Função que chama o Backend Java
function salvarRecorde(pontos) {
    // URL do seu Backend no Render
    const urlBackend = 'https://tetris-549n.onrender.com/ranking';

    const payload = {
        pontuacao: pontos,
        dataRegistro: new Date().toISOString().split('T')[0], // Pega a data de hoje (AAAA-MM-DD)
        jogador: { id: 1 } // Associa fixo ao Player 1 que criamos acima
    };

    console.log("Enviando pontuação...", payload);

    fetch(urlBackend, { // Endereço do Controller do Kaique
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(response => {
            if (response.ok) {
                console.log("Pontuação salva com sucesso!");
                alert("Recorde salvo no banco de dados!");
            } else {
                console.error("Erro ao salvar:", response.status);
                alert("Erro ao salvar pontuação. Veja o console.");
            }
        })
        .catch(erro => console.error("Erro de conexão:", erro));
}

// Nova função para buscar o Top 3
function carregarRanking() {
    // URL do seu backend
    const urlBackend = 'https://tetris-549n.onrender.com/ranking';

    fetch(urlBackend)
        .then(response => response.json())
        .then(data => {
            // Ordena por pontuação (maior para menor)
            data.sort((a, b) => b.pontuacao - a.pontuacao);

            // Pega só os 3 primeiros
            const top3 = data.slice(0, 3);

            const lista = document.getElementById('ranking-list');
            lista.innerHTML = ''; // Limpa a lista

            top3.forEach(item => {
                const li = document.createElement('li');
                // Aqui estamos assumindo que o backend retorna o objeto jogador
                // Se não retornar nome, vai aparecer "Anônimo"
                const nome = item.jogador ? item.jogador.nomeUsuario : 'Anônimo';
                li.innerHTML = `<span>${nome}</span> <span>${item.pontuacao}</span>`;
                lista.appendChild(li);
            });
        })
        .catch(err => console.error("Erro ao carregar ranking:", err));
}

// Carrega o ranking assim que o jogo abre
carregarRanking();

jogadorReset();
update();