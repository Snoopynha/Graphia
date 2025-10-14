import * as estado from './estado.js';

// tratarClique() - grafo-editor.js
// TEM QUE ALTERAR
export function tratarClique() {
    if (modoEditor) {
        const v = obterVerticeClicado(mouseX, mouseY);

        if (v) {
            const agora = millis();

            if (agora - ultimaInteracao < 300 && verticeSelecionadoParaEdicao === v) {
                // Duplo clique → editar
                if (inputNome) inputNome.remove(); // Limpa qualquer outro input

                const canvasRect = canvas.elt.getBoundingClientRect();
                const inputX = v.x + canvasRect.left - 50;
                const inputY = v.y + canvasRect.top - 10;

                inputNome = createInput(v.label);
                inputNome.position(inputX, inputY);
                inputNome.size(100);
                inputNome.class('px-2 py-1 text-sm rounded border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-400');
                inputNome.elt.focus();

                inputNome.elt.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        const novoTexto = inputNome.value().trim();
                        if (novoTexto !== '') {
                            v.label = novoTexto;
                        }
                        inputNome.remove();
                        inputNome = null;
                    }
                });

                return;
            }

            verticeSelecionadoParaEdicao = v;
            ultimaInteracao = agora;

            // Seleção para mover
            if (!verticesSelecionados.includes(v)) {
                verticesSelecionados.push(v);
                v.cor = '#facc15';
            } else {
                verticesSelecionados = verticesSelecionados.filter(u => u !== v);
                delete v.cor;
            }

            offsetArrasto = verticesSelecionados.map(v => ({
                vx: v,
                dx: mouseX - v.x,
                dy: mouseY - v.y
            }));
            arrastando = true;
        } else {
            // Clicou fora
            verticesSelecionados.forEach(v => delete v.cor);
            verticesSelecionados = [];
            verticeSelecionadoParaEdicao = null;
        }

        return;
    }

    if (modoAdicionarVertice) {
        if (inputNome) inputNome.remove();

        const canvasRect = canvas.elt.getBoundingClientRect();
        const inputX = mouseX + canvasRect.left;
        const inputY = mouseY + canvasRect.top;

        inputNome = createInput('');
        inputNome.position(inputX, inputY);
        inputNome.size(100);
        inputNome.class('px-2 py-1 text-sm rounded border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-400');
        inputNome.elt.focus();

        inputNome.elt.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const nome = inputNome.value().trim();
                if (nome !== '') {
                    vertices.push({ x: mouseX, y: mouseY, label: nome });
                }
                inputNome.remove();
                inputNome = null;
                modoAdicionarVertice = false;
            }
        });

        return; // Impede que a lógica de aresta rode ao adicionar vértice
    }

    if (modoAdicionarAresta) {
        const v = obterVerticeClicado(mouseX, mouseY);
        if (!v) return;

        if (!verticeSelecionado) {
            verticeSelecionado = v;
        } else {
            arestas.push({
                de: verticeSelecionado,
                para: v,
                direcionada: !arestaNDirecionada
            });
            verticeSelecionado = null;
            modoAdicionarAresta = false;
        }
    }

    if (modoMover) {
        const v = obterVerticeClicado(mouseX, mouseY);

        if (v) {
            if (!verticesSelecionados.includes(v)) {
                verticesSelecionados.push(v);
                v.cor = '#facc15';
            } else {
                verticesSelecionados = verticesSelecionados.filter(u => u !== v);
                delete v.cor;
            }

            offsetArrasto = verticesSelecionados.map(v => ({
                vx: v,
                dx: mouseX - v.x,
                dy: mouseY - v.y
            }));

            arrastando = true;
        }
    } else {
        verticesSelecionados.forEach(v => delete v.cor);
        verticesSelecionados = [];
        modoMover = false;
        arrastando = false;
    }

    return;
}

export function mouseSolto() {
    estado.arrastando = false;
}

// Antiga mouseDragged() - grafo-editor.js
export function mouseArrastado() {
    if (estado.modoAtual === 'editar' && estado.arrastando) {
        for (let info of estado.deslocamentoArrasto) {
            info.vx.x = mouseX - info.dx;
            info.vx.y = mouseY - info.dy;
        }
    }
}

// Antiga keyPressed() - grafo-editor.js
export function teclaPressionada() {
    if (estado.modoAtual === 'editar' && (keyCode === DELETE || keyCode === BACKSPACE)) {
        if (estado.verticesSelecionados.length > 0) {
            // Remove vértices selecionados
            estado.verticesSelecionados.forEach(v => {
                const index = estado.vertices.indexOf(v);
                if (index !== -1) estado.vertices.splice(index, 1);

                // Remove arestas ligadas a ele
                for (let i = estado.arestas.length - 1; i >= 0; i--) {
                    if (estado.arestas[i].de === v || estado.arestas[i].para === v) {
                        estado.arestas.splice(i, 1);
                    }
                }
            });

            estado.verticesSelecionados = [];
        }
    }
}

// obterVerticeClicado() - grafo-editor.js
function obterVerticeClicado(mx, my) {
    for (let v of estado.vertices) {
        if (dist(mx, my, v.x, v.y) <= 35) return v;
    }

    return null;
}