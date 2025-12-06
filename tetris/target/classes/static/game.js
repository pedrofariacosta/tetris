const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

// Aumenta a escala para os quadradinhos não ficarem minúsculos
context.scale(20, 20);

// Desenha o fundo preto
context.fillStyle = '#000';
context.fillRect(0, 0, canvas.width, canvas.height);

// Função que desenha uma peça (exemplo estático)
function desenharPeca(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = 'red';
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

// Uma peça 'T' de exemplo
const peca = [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
];

// Onde a peça está
const jogador = {
    pos: {x: 5, y: 5},
    matrix: peca,
};

// Loop de atualização (Game Loop)
let lastTime = 0;
function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    // Aqui vamos limpar a tela e redesenhar a peça caindo
    // (Lógica de movimento virá depois)

    // Desenha a peça parada só pra testar
    desenharPeca(jogador.matrix, jogador.pos);

    requestAnimationFrame(update);
}

// Inicia o jogo
update();

// Exemplo de como conectar com seu Backend Java (para o futuro)
function salvarPontuacao() {
    fetch('http://localhost:8080/ranking', { // Seu Controller Spring Boot
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pontuacao: 100,
            dataRegistro: new Date().toISOString()
        })
    })
        .then(response => console.log("Salvo com sucesso!"))
        .catch(error => console.error("Erro:", error));
}