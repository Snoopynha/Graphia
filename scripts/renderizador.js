import * as estado from './estado.js';

let canvas;

// Antigo setup() - grafo-editor.js
export function inicializarCanvas() {
    const container = document.getElementById('canvas-container');
    canvas = createCanvas(container.offsetWidth, container.offsetHeight);
    canvas.parent('canvas-container');
    textAlign(CENTER, CENTER);
    textSize(20);
}

// Antigo draw() - grafo-editor.js
export function desenharGrafo() {
    background(255);
    // Desenha primeiro as arestas
    for (let a of estado.arestas) {
        stroke(a.cor || 0);
        strokeWeight(2);
        line(a.de.x, a.de.y, a.para.x, a.para.y);

        // Desenho de setas, pesos, laços

        const raio = 35; // raio do vértice

        // Caso 1: auto-laço (de === para)
        if (a.de === a.para) {
            const cx = a.de.x;
            const cy = a.de.y;

            // Parâmetros do laço
            const loopRadiusX = 40;
            const loopRadiusY = 60;

            noFill();
            stroke(0);

            // Ponto inicial e final do laço (em cima do vértice)
            const x1 = cx - loopRadiusX / 2;
            const y1 = cy - raio;
            const x2 = cx + loopRadiusX / 2;
            const y2 = cy - raio;

            // Pontos de controle (acima do vértice)
            const cx1 = x1;
            const cy1 = y1 - loopRadiusY;
            const cx2 = x2;
            const cy2 = y2 - loopRadiusY;

            // Desenhar o laço
            bezier(x1, y1, cx1, cy1, cx2, cy2, x2, y2);

            // Desenhar seta no final da curva (x2, y2), com tangente da curva
            if (a.direcionada) {
                // Calcular ângulo da tangente no final da curva
                const dx = x2 - cx2;
                const dy = y2 - cy2;
                const angle = atan2(dy, dx);

                push();
                translate(x2, y2);
                rotate(angle);
                fill(0);
                stroke(0);
                const tam = 10;
                triangle(0, 0, -tam, -tam / 2, -tam, tam / 2);
                pop();
            }

            continue;
        }

        // Caso 2: laço entre outros vértices (de ---> para)
        const dx = a.para.x - a.de.x;
        const dy = a.para.y - a.de.y;
        const distTotal = dist(a.de.x, a.de.y, a.para.x, a.para.y);
        const offsetX = (dx / distTotal) * raio;
        const offsetY = (dy / distTotal) * raio;

        const x1 = a.de.x + offsetX;
        const y1 = a.de.y + offsetY;
        const x2 = a.para.x - offsetX;
        const y2 = a.para.y - offsetY;

        // Caso 3 : checa se existe aresta reversa (1->2 && 2->1) entre os mesmos nós
        const reversa = arestas.find(other =>
            other.de === a.para &&
            other.para === a.de &&
            other.direcionada === a.direcionada
        );

        if (reversa && reversa !== a) {
            // Desenha curva se há reversa (1->2 && 2->1)
            const curva = 40; // Curva da seta
            const cx = (x1 + x2) / 2 - (dy / distTotal) * curva;
            const cy = (y1 + y2) / 2 + (dx / distTotal) * curva;

            noFill();
            bezier(x1, y1, cx, cy, cx, cy, x2, y2);

            if (a.direcionada) {
                desenharSeta(cx, cy, x2, y2);
            }
        } else {
            // Aresta normal (reta)
            line(x1, y1, x2, y2);
            if (a.direcionada) {
                desenharSeta(x1, y1, x2, y2);
            }
        }
        // Mostra os pesos
        const key = `${a.de.label}-${a.para.label}`;
        const reverseKey = `${a.para.label}-${a.de.label}`;
        const weight = custosArestas[key] || custosArestas[reverseKey] || 1;

        //Coloca o peso no meio da aresta
        const midX = (a.de.x + a.para.x) / 2;
        const midY = (a.de.y + a.para.y) / 2;

        fill(255);
        stroke(0);
        circle(midX, midY, 30);
        fill(0);
        text(weight, midX, midY);
    }

    // Desenha os vértices 
    for (let v of estado.vertices) {
        stroke(0);
        strokeWeight(1);
        fill(v.cor || 255);
        circule(v.x, v.y, 70);

        if (v.rotulo) {
            fill(0);
            noStroke();
            text(v.rotulo, v.x, v.y);
        }
    }
}

// desenharSeta() - grafo-editor.js
function desenharSeta(x1, y1, x2, y2) {
    const angle = atan2(y2 - y1, x2 - x1);
    const tam = 10;

    push();
    translate(x2, y2);
    rotate(angle);
    fill(0);
    noStroke();
    triangle(0, 0, -tam, -tam / 2, -tam, tam / 2);
    pop();
}