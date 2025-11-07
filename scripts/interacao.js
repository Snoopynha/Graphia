import estado from './estado.js';

/**
 * Função principal que lida com todos os cliques no canvas.
 * O comportamento muda de acordo com o 'estado.modoAtual'.
 */
// Antigo tratarClique() - grafo-editor.js
export function tratarClique() {
    // Impede de ser adicionado algo fora dos limites do canvas
    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
        return; 
    }

    // Descobre o vértice que foi clicado
    const verticeClicado = obterVerticeClicado(mouseX, mouseY);

    switch (estado.modoAtual) {
        case 'adicionarVertice':
            const entradaNome = document.getElementById('input-nome-vertice');
            const nome = entradaNome.value.trim() || `V${estado.vertices.length + 1}`;
            if (!nome) {
                alert("O nome do vértice não pode ser vazio.");
                return
            }
            if (estado.vertices.some(v => v.rotulo === nome)) {
                alert("Já existe um vértice com esse nome.");
                return
            }
            // Adiciona um novo vértice na posição do clique
            estado.vertices.push({ x: mouseX, y: mouseY, rotulo: nome });

            // Limpa o campo de entrada
            entradaNome.value = '';
            entradaNome.focus();
            break;
            
        case 'adicionarArestaDirecionada':
        case 'adicionarArestaNaoDirecionada':
            if (!verticeClicado) {
                // Se não clicou em nenhum vértice, não faz nada
                if (estado.verticeSelecionado) {
                    estado.verticeSelecionado.cor = null;
                    estado.verticeSelecionado = null;
                }
                ativarModo('nenhum');
                estado.modoAtual = 'nenhum';
                document.getElementById('canvas-container').style.cursor = 'default';
                return;
            }

            if (!estado.verticeSelecionado) {
                // É o primeiro clique (seleciona o vértice de origem)
                estado.verticeSelecionado = verticeClicado;
                estado.verticeSelecionado.cor = '#facc15'; // Marca visualmente
            } else {
                // É o segundo clique (seleciona o vértice de destino e cria a aresta)
                const ehDirecionada = estado.modoAtual === 'adicionarArestaDirecionada';
                estado.arestas.push({
                    de: estado.verticeSelecionado,
                    para: verticeClicado,
                    direcionada: ehDirecionada
                });

                // Limpa a seleção
                estado.verticeSelecionado.cor = null;
                estado.verticeSelecionado = null;
                estado.modoAtual = 'nenhum';
                ativarModo('nenhum');
                document.getElementById('canvas-container').style.cursor = 'default';
            }
            break;
            
        case 'editar':
            if (verticeClicado) {
                if (keyIsDown(SHIFT)) {
                    // Adiciona ou remove da seleção
                    const indice = estado.verticesSelecionados.indexOf(verticeClicado);
                    if (indice > -1) {
                        // Já estava selecionado, então remove (toggle)
                        estado.verticesSelecionados.splice(indice, 1);
                        verticeClicado.cor = null;
                    } else {
                        // Não estava selecionado, então adiciona
                        estado.verticesSelecionados.push(verticeClicado);
                        verticeClicado.cor = '#facc15';
                    }
                } else {
                    // Seleciona apenas o clicado
                    estado.verticesSelecionados.forEach(v => v.cor = null);
                    // Define a seleção como sendo APENAS o vértice clicado
                    estado.verticesSelecionados = [verticeClicado];
                    verticeClicado.cor = '#facc15';
                }

                // Prepara para o arrasto de TODOS os vértices selecionados
                estado.arrastando = true;
                estado.deslocamentoArrasto = estado.verticesSelecionados.map(v => ({
                    vx: v,
                    dx: mouseX - v.x,
                    dy: mouseY - v.y
                }));
            } else {
                // Clicou fora de qualquer vértice, limpa todas as seleções
                estado.verticesSelecionados.forEach(v => v.cor = null);
                estado.verticesSelecionados = [];
                estado.arrastando = false;
            }
            break;

        default:
            // Limpa seleções se clicar fora de vértices
            if (!verticeClicado) {
                estado.verticesSelecionados.forEach(v => v.cor = null);
                estado.verticesSelecionados = [];
                if (estado.verticeSelecionado) {
                    estado.verticeSelecionado.cor = null;
                    estado.verticeSelecionado = null;
                }
            }
            break;
    }
}

/**
 * Chamada quando o botão do mouse é solto.
 * Interrompe qualquer arrasto em andamento.
 */
// Antiga mouseReleased() - grafo-editor.js
export function mouseSolto() {
    estado.arrastando = false;
    estado.deslocamentoArrasto = [];
}

/**
 * Chamada enquando o mouse é arrastado.
 * Atualiza a posição dos vértices sendo arrastados.
 */
// Antiga mouseDragged() - grafo-editor.js
export function mouseArrastado() {
    if (estado.modoAtual === 'editar' && estado.arrastando) {
        for (let info of estado.deslocamentoArrasto) {
            info.vx.x = mouseX - info.dx;
            info.vx.y = mouseY - info.dy;
        }
    }
}

/**
 * Chamada quando uma tecla é pressionada.
 * Permite deletar vértices selecionados com DELETE ou BACKSPACE.
 */
// Antiga keyPressed() - grafo-editor.js
export function teclaPressionada() {
    if (estado.modoAtual === 'editar' && (keyCode === DELETE || keyCode === BACKSPACE)) {
        if (estado.verticesSelecionados.length > 0) {

            // Remove as arestas conectadas aos vértices selecionados
            estado.arestas = estado.arestas.filter(a =>
                !estado.verticesSelecionados.includes(a.de) &&
                !estado.verticesSelecionados.includes(a.para)
            );

            // Remove os vértices selecionados
            estado.vertices = estado.vertices.filter(v =>
                !estado.verticesSelecionados.includes(v)
            );

            // Limpa a seleção
            estado.verticesSelecionados = [];
        }
    }
}

/**
 * Função auxiliar para encontrar o vértice clicado.
 * @param {*} mx - coordenada x do clique
 * @param {*} my - coordenada y do clique
 * @returns {object|null} - o vértice clicado ou null se nenhum foi clicado
 */
// obterVerticeClicado() - grafo-editor.js
function obterVerticeClicado(mx, my) {
    // Verifica do último ao primeiro para priorizar vértices desenhados por cima
    for (let i = estado.vertices.length - 1; i >= 0; i--) {
        const v = estado.vertices[i];
        // Calcula a distância do clique até o vértice
        const distancia = dist(mx, my, v.x, v.y);
        // Se estiver dentro do raio de clique (35 pixels), retorna o vértice
        if (distancia <= 35) return v;
    }

    return null;
}