// uiController.js
import * as estado from './estado.js'; // Importa todas as variáveis de estado
import { canvas, vertices, arestas, custosArestas } from './sketch.js';
import { gerarListaAdjacencia, gerarMatrizAdjacencia } from './logic/estado.js';

// mostrarRepresentacao() - grafo-codigo.js
export function mostrarRepresentacao(tipo) {
    let codigo = '';
    let descricao = '';

    switch (tipo) {
        case 'lista':
            codigo = window.gerarListaAdjacencia();
            descricao = 'A Lista de Adjacência representa o grafo usando um objeto ou dicionário, onde cada vértice aponta para uma lista de vértices vizinhos. É eficiente em termos de espaço para grafos esparsos e ideal para percursos como BFS e DFS.';
            break;

        case 'matrizAdj':
            codigo = window.gerarMatrizAdjacencia();
            descricao = 'A Matriz de Adjacência usa uma matriz (tabela) onde as linhas e colunas representam os vértices. Um valor 1 indica uma conexão entre vértices, e 0 indica ausência. É útil para verificar se dois vértices são adjacentes em tempo constante.';
            break;

        case 'matrizInc':
            codigo = window.gerarMatrizIncidencia();
            descricao = 'A Matriz de Incidência representa o grafo com vértices nas linhas e arestas nas colunas. Para grafos direcionados, usa -1 para origem e 1 para destino. Para não direcionados, usa 1 em ambas as posições. É útil em aplicações algébricas e fluxos.';
            break;
    }

    document.getElementById('code-output').textContent = codigo;
    document.getElementById('descricao-output').textContent = descricao;
}

// ativarModoAdicionarVertice() - grafo-codigo.js
export function ativarModoAdicionarVertice() {
    estado.modoAtual = 'adicionarVertice';
    document.getElementById('canvas-container').style.cursor = 'crosshair';
}

// ativarModoAdicionarArestaDirecionada() - grafo-codigo.js
export function ativarModoAdicionarArestaDirecionada() {
    modoAdicionarAresta = true;
    arestaNDirecionada = false;
    verticeSelecionado = null;
}

// ativarModoAdicionarArestaNDirecionada() - grafo-codigo.js
function ativarModoAdicionarArestaNDirecionada() {
    modoAdicionarAresta = true;
    arestaNDirecionada = true;
    verticeSelecionado = null;
}

// ativarModoRemover() - grafo-codigo.js
function ativarModoEditor() {
    modoEditor = !modoEditor;

    const botao = document.getElementById('botaoEditar');
    botao.textContent = modoEditor ? 'Sair do Modo Editor' : 'Editar';

    if (modoEditor) {
        canvas.elt.style.cursor = 'pointer';
    } else {
        canvas.elt.style.filter = '';
        canvas.elt.style.cursor = 'default';
        verticesSelecionados.forEach(v => delete v.cor);
        verticesSelecionados = [];
        verticeSelecionadoParaEdicao = null;
    }
}

// executarBusca(algoritmo) - grafo-buscas.js
export function executarBusca(algoritmo) {
    if (intervaloAnimacao) {
        clearInterval(intervaloAnimacao);
        intervaloAnimacao = null;
    }

    criarModalSelecaoVertices(algoritmo);
    animacaoBusca = resultado.animation;
    passoAtualAnimacao = 0;
    updateAnimation();
}

// limparCores() - grafo-buscas.js
function limparCores() {
    // Reset vertex appearance
    vertices.forEach(v => {
        v.cor = null;
        v.texto = null;
    });

    // Reset edge appearance
    arestas.forEach(a => {
        a.cor = null;
    });

    // Reset search state
    animacaoBusca = [];
    passoAtualAnimacao = 0;

    // Stop any running animation
    if (intervaloAnimacao) {
        clearInterval(intervaloAnimacao);
        intervaloAnimacao = null;
    }
    if (playInterval) {
        clearInterval(playInterval);
        playInterval = null;
    }
    isPlaying = false;

    // Reset UI
    select('#code-output').html('Cores e estado de busca resetados.');
    select('#descricao-output').html('Pronto para nova execução.');
}

// criarModalSelecaoVertices(algoritmo) - grafo-buscas.js
function criarModalSelecaoVertices(algoritmo) {
    // Remove modal existente, se houver
    const existingModal = select('.modal-busca');
    if (existingModal) existingModal.remove();

    // Cria o modal
    const modal = createDiv('');
    modal.class('modal-busca fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50');
    modal.parent(document.body);

    // Cria o conteúdo do modal
    const modalContent = createDiv('');
    modalContent.class('bg-white rounded-lg p-6 w-96');
    modalContent.parent(modal);

    // Título do modal
    const title = createElement('h3', `Executar ${getAlgorithmName(algoritmo)}`);
    title.class('text-lg font-semibold mb-4');
    title.parent(modalContent);

    // Seleção do vértice inicial
    const startLabel = createElement('label', 'Vértice inicial:');
    startLabel.class('block mb-2');
    startLabel.parent(modalContent);

    const startSelect = createSelect();
    startSelect.class('w-full mb-4 p-2 border rounded');
    startSelect.parent(modalContent);
    startSelect.option('Selecione um vértice', '');

    // Seleção do vértice final (opcional)
    const endLabel = createElement('label', 'Vértice final (opcional):');
    endLabel.class('block mb-2');
    endLabel.parent(modalContent);

    const endSelect = createSelect();
    endSelect.class('w-full mb-4 p-2 border rounded');
    endSelect.parent(modalContent);
    endSelect.option('Selecione um vértice', '');

    // Peso padrão para arestas (para Dijkstra/UCS)
    const weightDiv = createDiv('');
    weightDiv.class('mb-4 hidden');
    weightDiv.parent(modalContent);

    const weightLabel = createElement('label', 'Peso padrão para arestas:');
    weightLabel.class('block mb-2');
    weightLabel.parent(weightDiv);

    const weightInput = createInput('1');
    weightInput.attribute('type', 'number');
    weightInput.attribute('min', '1');
    weightInput.class('w-full p-2 border rounded');
    weightInput.parent(weightDiv);

    // Butãos Cancelar e Executar
    const buttonsDiv = createDiv('');
    buttonsDiv.class('flex justify-end space-x-2');
    buttonsDiv.parent(modalContent);

    const cancelButton = createButton('Cancelar');
    cancelButton.class('px-4 py-2 bg-gray-300 rounded hover:bg-gray-400');
    cancelButton.parent(buttonsDiv);
    cancelButton.mousePressed(() => modal.remove());

    const runButton = createButton('Executar');
    runButton.class('px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600');
    runButton.parent(buttonsDiv);

    // Popula os dropdowns de vértices
    vertices.forEach(v => {
        startSelect.option(v.label, v.label);
        endSelect.option(v.label, v.label);
    });

    // Mostra o input de peso para Dijkstra/UCS
    if (algoritmo === 'dijkstra' || algoritmo === 'ucs') {
        weightDiv.removeClass('hidden');
    }

    // Rodar o botão handler
    runButton.mousePressed(() => {
        const startLabel = startSelect.value();
        const endLabel = endSelect.value() || null;

        if (!startLabel) {
            alert('Por favor, selecione um vértice inicial');
            return;
        }

        const startVertex = vertices.find(v => v.label === startLabel);
        const endVertex = endLabel ? vertices.find(v => v.label === endLabel) : null;

        // Valida vertices
        if ((algoritmo === 'dijkstra' || algoritmo === 'ucs') && weightInput.value()) {
            const defaultWeight = parseInt(weightInput.value());
            if (!isNaN(defaultWeight)) {
                arestas.forEach(a => {
                    const key = `${a.de.label}-${a.para.label}`;
                    custosArestas[key] = defaultWeight;
                    if (!a.direcionada) {
                        const reverseKey = `${a.para.label}-${a.de.label}`;
                        custosArestas[reverseKey] = defaultWeight;
                    }
                });
            }
        }

        let resultado;
        try {
            switch (algoritmo) {
                case 'bfs':
                    resultado = bfs(startVertex, endVertex);
                    break;
                case 'dfs':
                    resultado = dfs(startVertex, endVertex);
                    break;
                case 'dijkstra':
                    resultado = dijkstra(startVertex, endVertex);
                    break;
            }

            if (resultado.error) {
                alert(resultado.error);
                return;
            }

            // Monta a animação
            animacaoBusca = resultado.animation;
            passoAtualAnimacao = 0;
            updateAnimation();

            // Atualiza a descrição e pseudocódigo
            atualizarOutputBusca(algoritmo, startVertex, endVertex);

            // Fecha o modal
            modal.remove();

        } catch (error) {
            alert('Erro: ' + error.message);
        }
    });
}

// obterNomeAlgoritmo(algoritmo) - grafo-buscas.js
function obterNomeAlgoritmo(algoritmo) {
    switch (algoritmo) {
        case 'bfs': return 'Busca em Largura (BFS)';
        case 'dfs': return 'Busca em Profundidade (DFS)';
        case 'dijkstra': return 'Algoritmo de Dijkstra';
        default: return 'Busca';
    }
}

// atualizarOutputBusca(algoritmo, startVertex, endVertex) - grafo-buscas.js
function atualizarOutputBusca(algoritmo, startVertex, endVertex) {
    const descricaoOutput = select('#descricao-output');
    const codeOutput = select('#code-output');

    let descricao = '';
    let pseudocodigo = '';

    switch (algoritmo) {
        case 'bfs':
            descricao = `Executando Busca em Largura começando no vértice ${startVertex.label}`;
            if (endVertex) descricao += ` para encontrar caminho até ${endVertex.label}`;

            pseudocodigo = `// Pseudocódigo BFS aqui...`;
            break;

        case 'dfs':
            descricao = `Executando Busca em Profundidade começando no vértice ${startVertex.label}`;
            if (endVertex) descricao += ` para encontrar caminho até ${endVertex.label}`;

            pseudocodigo = `// Pseudocódigo DFS aqui...`;
            break;

        case 'dijkstra':
            descricao = `Executando Algoritmo de Dijkstra começando no vértice ${startVertex.label}`;
            if (endVertex) descricao += ` para encontrar caminho mais curto até ${endVertex.label}`;

            pseudocodigo = `// Pseudocódigo Dijkstra aqui...`;
            break;
    }

    descricaoOutput.html(descricao);
    codeOutput.html(pseudocodigo);
}

// toggleSidebar() - index.html
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const icon = document.getElementById("toggle-icon");
    const openBtn = document.getElementById("open-sidebar");
    const isOpen = sidebar.classList.contains("w-64");

    if (isOpen) {
        sidebar.classList.remove("w-64", "p-4");
        sidebar.classList.add("w-0", "overflow-hidden");
        icon.classList.remove("fa-chevron-left");
        icon.classList.add("fa-chevron-right");
        openBtn.classList.remove("hidden");
    } else {
        sidebar.classList.remove("w-0", "overflow-hidden");
        sidebar.classList.add("w-64", "p-4");
        icon.classList.remove("fa-chevron-right");
        icon.classList.add("fa-chevron-left");
        openBtn.classList.add("hidden");
    }
}