import estado from './estado.js';

let canvas;

/**
 * Cria e configura o canvas do p5.js dentro do container HTML.
 * Também adiciona um listener para redimensionar o canvas com a janela.
 */
// Antigo setup() - grafo-editor.js
export function inicializarCanvas() {
    const container = document.getElementById('canvas-container');
    canvas = createCanvas(container.offsetWidth, container.offsetHeight);
    canvas.parent('canvas-container');
    textAlign(CENTER, CENTER);
    textSize(20);

    // Função para redimensionar o canvas
    window.addEventListener('resize', () => {
        resizeCanvas(container.offsetWidth, container.offsetHeight);
    });
}

/**
 * Função principal de desenho, chamada a cada frame pelo p5.js.
 * Desenha todas as arestas e vértices do grafo.
 */
// Antigo draw() - grafo-editor.js
export function desenharGrafo() {
    background(255);
    strokeWeight(2);

    // --- 1. Desenha as arestas ---
    for (let aresta of estado.arestas) {
        stroke(aresta.cor || 0);
        const raioVertice = 35;

        // Caso 1: auto-laço (a aresta começa e termina no mesmo vértice)
        if (aresta.de === aresta.para) {
            desenharLaco(aresta.de, aresta);
            continue;
        }

        // Ponto de início e fim da aresta, ajustados para não sobrepor os vértices
        const dx = aresta.para.x - aresta.de.x;
        const dy = aresta.para.y - aresta.de.y;
        const distancia = dist(aresta.de.x, aresta.de.y, aresta.para.x, aresta.para.y);
        const offsetX = (dx / distancia) * raioVertice;
        const offsetY = (dy / distancia) * raioVertice;

        // Ponto inicial e final da linha da aresta
        const x1 = aresta.de.x + offsetX;
        const y1 = aresta.de.y + offsetY;
        const x2 = aresta.para.x - offsetX;
        const y2 = aresta.para.y - offsetY;

        // Caso 2: arestas nos dois sentidos (A->B e B->A)
        const arestaReversa = estado.arestas.find(outra => outra.de === aresta.para && outra.para === aresta.de);

        if (arestaReversa) {
            const curvatura = 20; // Ajuste a curvatura conforme necessário
            const meioX = (x1 + x2) / 2 - (dy / distancia) * curvatura;
            const meioY = (y1 + y2) / 2 + (dx / distancia) * curvatura;
            noFill();
            bezier(x1, y1, meioX, meioY, meioX, meioY, x2, y2);
            if (aresta.direcionada) {
                desenharSeta(meioX, meioY, x2, y2);
            }
        } else {
            // Caso 3: aresta simples (A->B)
            line(x1, y1, x2, y2);
            if (aresta.direcionada) {
                desenharSeta(x1, y1, x2, y2);
            }
        }

        // Desenha o peso da aresta
        const chave = `${aresta.de.rotulo}-${aresta.para.rotulo}`;
        const chaveReversa = `${aresta.para.rotulo}-${aresta.de.rotulo}`;
        const peso = estado.custosArestas[chave] || estado.custosArestas[chaveReversa] || 1;

        const meioX = (aresta.de.x + aresta.para.x) / 2;
        const meioY = (aresta.de.y + aresta.para.y) / 2;

        fill(255);
        stroke(0);
        strokeWeight(1);
        circle(meioX, meioY, 30);
        fill(0);
        noStroke();
        text(peso, meioX, meioY);
    }

    // --- 2. Desenha os vértices ---
    for (let vertice of estado.vertices) {
        stroke(0);
        strokeWeight(1);
        fill(vertice.cor || 255);
        circle(vertice.x, vertice.y, 70);

        if (vertice.rotulo) {
            fill(0);
            noStroke();
            text(vertice.rotulo, vertice.x, vertice.y);
        }

        if (vertice.texto) {
            textSize(12);
            text(vertice.texto, vertice.x, vertice.y + 50);
            textSize(20);
        }
    }
}

/**
 * Desenha a ponta de uma seta para arestas direcionadas.
 */
// desenharSeta() - grafo-editor.js
function desenharSeta(x1, y1, x2, y2) {
    const angulo = atan2(y2 - y1, x2 - x1);
    const tamanho = 10;
    push();
    translate(x2, y2);
    rotate(angulo);
    fill(0);
    noStroke();
    triangle(0, 0, -tamanho, -tamanho / 2, -tamanho, tamanho / 2);
    pop();
}

/**
 * Desenha uma aresta de laço (que sai e volta para o mesmo vértice).
 */
function desenharLaco(vertice, aresta) {
    const raioVertice = 35;
    const raioLacoX = 30;
    const raioLacoY = 40;

    // Posição do laço acima do vértice
    const x = vertice.x;
    const y = vertice.y - raioVertice;

    // --- 1. Desenha o laço ---
    noFill();
    stroke(aresta.cor || 0);
    strokeWeight(2);
    // Pontos de controle da curva de Bézier para criar o formato de "gota"
    const pontoControle1 = { x: x - raioLacoX, y: y - raioLacoY };
    const pontoControle2 = { x: x + raioLacoX, y: y - raioLacoY };
    bezier(x, y, pontoControle1.x, pontoControle1.y, pontoControle2.x, pontoControle2.y, x, y);

    // --- 2. Desenha a seta, se a aresta for direcionada ---
    if (aresta.direcionada) {
        desenharSeta(pontoControle2.x, pontoControle2.y, x, y);
    }

    // --- 3. Desenha o peso da aresta ---
    const chave = `${aresta.de.rotulo}-${aresta.para.rotulo}`;
    const peso = estado.custosArestas[chave] || 1;

    // Posição do peso no meio do laço
    const pesoX = x;
    const pesoY = y - raioLacoY;

    // Desenha o círculo de fundo e o texto do peso 
    fill(255);
    stroke(0);
    strokeWeight(1);
    circle(pesoX, pesoY, 30);
    fill(0);
    noStroke();
    textSize(16);
    text(peso, pesoX, pesoY);
    textSize(20);
}