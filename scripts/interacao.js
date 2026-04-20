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
            let contador = 1;
            let novoNome = `V${contador}`;

            // Verifica se V1, V2... já existem para não repetir
            while (estado.vertices.some(v => v.rotulo === novoNome)) {
                contador++;
                novoNome = `V${contador}`;
            }

            // Adiciona um novo vértice na posição do clique
            estado.vertices.push({ x: mouseX, y: mouseY, rotulo: novoNome });
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
                // Tenta ver se clicou em uma aresta já que não clicou em um vértice
                const arestaClicada = obterArestaClicada(mouseX, mouseY);

                if (arestaClicada) {
                    abrirEditorDePeso(arestaClicada);
                } else {
                    // Clicou fora de qualquer vértice, limpa todas as seleções
                    estado.verticesSelecionados.forEach(v => v.cor = null);
                    estado.verticesSelecionados = [];
                    estado.arrastando = false;
                }
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

/**
 * Função auxiliar para encontrar a aresta clicada usando distância ponto-segmento.
 * @param {number} mx - coordenada x do clique
 * @param {number} my - coordenada y do clique
 * @returns {object|null} - a aresta clicada ou null se nenhuma foi clicada
 */
function obterArestaClicada(mx, my) {
    const TOLERANCIA = 10;

    // Verifica do último ao primeiro para priorizar arestas desenhadas por cima
    for (let i = estado.arestas.length - 1; i >= 0; i--) {
        const aresta = estado.arestas[i];
        const x1 = aresta.de.x;
        const y1 = aresta.de.y;
        const x2 = aresta.para.x;
        const y2 = aresta.para.y;

        const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
        if (l2 === 0) continue; // Caso os vértices estejam na mesma coordenada

        // Projeta o ponto do mouse no vetor da aresta para achar o ponto mais próximo
        let t = ((mx - x1) * (x2 - x1) + (my - y1) * (y2 - y1)) / l2;
        t = Math.max(0, Math.min(1, t));
        const projX = x1 + t * (x2 - x1);
        const projY = y1 + t * (y2 - y1);

        // Calcula a distância do clique até o ponto projetado na aresta
        const distancia = dist(mx, my, projX, projY);
        if (distancia <= TOLERANCIA) {
            return aresta;
        }
    }

    return null;
}

/**
 * Cria uma interface HTML flutuante para editar o peso da aresta
 * @param {object} aresta - A aresta que foi clicada
 */
function abrirEditorDePeso(aresta) {
    // Garante que o objeto de custos existe no estado
    if (!estado.custosArestas) estado.custosArestas = {};

    const chaveDePara = `${aresta.de.rotulo}-${aresta.para.rotulo}`;
    const chaveParaDe = `${aresta.para.rotulo}-${aresta.de.rotulo}`;
    
    // Pega o valor atual (assume 1 se não existir)
    let valorAtual = estado.custosArestas[chaveDePara] !== undefined ? estado.custosArestas[chaveDePara] : 1;

    // Remove o modal anterior se por acaso existir algum preso na tela
    let modalExistente = document.getElementById('modal-editor-peso');
    if (modalExistente) modalExistente.remove();

    const overlay = document.createElement('div');
    overlay.id = 'modal-editor-peso';
    Object.assign(overlay.style, {
        position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex', justifyContent: 'center', alignItems: 'center', 
        zIndex: '9999'
    });

    const caixa = document.createElement('div');
    Object.assign(caixa.style, {
        backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)', width: '280px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
    });

    const titulo = document.createElement('h3');
    const seta = aresta.direcionada ? '→' : '↔';
    titulo.innerText = `Editar peso (${aresta.de.rotulo} ${seta} ${aresta.para.rotulo})`;
    Object.assign(titulo.style, { 
        margin: '0 0 15px 0', fontSize: '16px', color: '#1f2937' 
    });

    const input = document.createElement('input');
    input.type = 'number';
    input.value = valorAtual;
    Object.assign(input.style, {
        width: '100%', padding: '10px', marginBottom: '15px',
        border: '1px solid #d1d5db', borderRadius: '4px', 
        boxSizing: 'border-box', fontSize: '14px', outline: 'none'
    });
    input.onfocus = () => input.style.borderColor = '#3b82f6';
    input.onblur = () => input.style.borderColor = '#d1d5db';

    const containerBotoes = document.createElement('div');
    Object.assign(containerBotoes.style, { 
        display: 'flex', justifyContent: 'flex-end', gap: '10px' 
    });

    const salvarPeso = () => {
        const novoPeso = parseFloat(input.value);
        if (!isNaN(novoPeso)) {
            // Atualiza a aresta
            estado.custosArestas[chaveDePara] = novoPeso;
            if (!aresta.direcionada) {
                estado.custosArestas[chaveParaDe] = novoPeso;
            }
        }
        overlay.remove();
    };

    const btnCancelar = document.createElement('button');
    btnCancelar.innerText = 'Cancelar';
    Object.assign(btnCancelar.style, {
        padding: '8px 12px', border: 'none', backgroundColor: '#f3f4f6',
        color: '#374151', borderRadius: '4px', cursor: 'pointer', fontWeight: '500'
    });
    btnCancelar.onclick = () => overlay.remove();

    const btnSalvar = document.createElement('button');
    btnSalvar.innerText = 'Salvar';
    Object.assign(btnSalvar.style, {
        padding: '8px 16px', border: 'none', backgroundColor: '#3b82f6',
        color: '#ffffff', borderRadius: '4px', cursor: 'pointer', fontWeight: '500'
    });
    btnSalvar.onclick = salvarPeso;

    // Permite salvar apertando "Enter" e cancelar com "Escape"
    input.onkeydown = (e) => { 
        if (e.key === 'Enter') salvarPeso(); 
        if (e.key === 'Escape') overlay.remove(); 
    };

    // Monta o modal na tela
    containerBotoes.appendChild(btnCancelar);
    containerBotoes.appendChild(btnSalvar);
    caixa.appendChild(titulo);
    caixa.appendChild(input);
    caixa.appendChild(containerBotoes);
    overlay.appendChild(caixa);
    document.body.appendChild(overlay);

    input.focus();
    input.select();
}