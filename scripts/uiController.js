import estado from './estado.js';
import { gerarListaAdjacencia, gerarMatrizAdjacencia, gerarMatrizIncidencia } from './logic/representacoesGrafos.js';
import { buscaEmLargura, buscaEmProfundidade, dijkstra, buscaAEstrela } from './logic/algoritmosBusca.js';
import { atualizarPassoAnimacao } from './animacao.js';

/**
 * Exibe a representação de um grafo (lista, matriz de adjacência, matriz de incidência) no painel de código.
 * @param {string} tipo - O tipo de representação ('lista', 'matrizAdj', 'matrizInc').
 */
// Antigo mostrarRepresentacao() - grafo-codigo.js
export function mostrarRepresentacao(tipo) {
    const { vertices, arestas } = estado;
    let codigo = '';
    let descricao = '';

    switch (tipo) {
        case 'lista':
            codigo = gerarListaAdjacencia(vertices, arestas);
            descricao = 'A Lista de Adjacência representa o grafo usando um mapa, onde cada vértice aponta para uma lista de seus vizinhos.';
            break;
        case 'matrizAdj':
            codigo = gerarMatrizAdjacencia(vertices, arestas);
            descricao = 'A Matriz de Adjacência usa uma tabela onde um valor 1 indica uma conexão entre vértices, e 0 a ausência dela.';
            break;
        case 'matrizInc':
            codigo = gerarMatrizIncidencia(vertices, arestas);
            descricao = 'A Matriz de Incidência relaciona vértices (linhas) com arestas (colunas). Útil para certas análises de grafos.';
            break;
    }

    document.getElementById('code-output').textContent = codigo;
    document.getElementById('descricao-output').textContent = descricao;
}

/**
 * Altera o modo de interação atual do canvas.
 * @param {string} novoModo - O novo modo a ser ativado.
 */
// Antigo ativarModoAdicionarVertice() - grafo-codigo.js | ativarModoAdicionarArestaDirecionada() - grafo-codigo.js | ativarModoAdicionarArestaNDirecionada() - grafo-codigo.js | ativarModoRemover() - grafo-codigo.js
export function ativarModo(novoModo) {
    estado.modoAtual = novoModo;
    const canvasContainer = document.getElementById('canvas-container');

    // Limpa as seleções quando troca de modo
    if (estado.verticeSelecionado) {
        estado.verticeSelecionado.cor = null;
        estado.verticeSelecionado = null;
    }

    // Atualiza o cursor do canvas
    if (novoModo === 'adicionarVertice') {
        canvasContainer.style.cursor = 'crosshair';
    } else if (novoModo === 'adicionarArestaDirecionada' || novoModo === 'adicionarArestaNaoDirecionada') {
        canvasContainer.style.cursor = 'pointer';
    } else { // 'remover' ou 'nenhum'
        canvasContainer.style.cursor = 'default';
    }

    // Se ativarmos outro modo, garanta que o botão "Editar" volte ao normal.
    const botaoEditar = document.getElementById('botaoEditar');
    botaoEditar.textContent = 'Editar';
    botaoEditar.classList.remove('bg-yellow-500', 'text-black'); // Remove cores de "ativo"
    botaoEditar.classList.add('bg-gray-500', 'text-white'); // Adiciona cores de "inativo"
    document.getElementById('canvas-container').style.backgroundColor = '#ffffff'; // Reseta cor do canvas
}

/**
 * Altera especificamente o modo de edição do canvas.
 */
export function alternarModoEditar() {
    const botaoEditar = document.getElementById('botaoEditar');
    const canvasContainer = document.getElementById('canvas-container');

    if (estado.modoAtual === 'editar') {
        // Estava no modo Editar, agora vamos SAIR
        estado.modoAtual = 'nenhum';
        botaoEditar.textContent = 'Editar';
        botaoEditar.classList.remove('bg-yellow-500', 'text-black');
        botaoEditar.classList.add('bg-gray-500', 'text-white');
        canvasContainer.style.backgroundColor = '#ffffff';
    } else {
        // Estava em outro modo, agora vamos ENTRAR no modo Editar
        estado.modoAtual = 'editar';
        botaoEditar.textContent = 'Sair da Edição';
        botaoEditar.classList.remove('bg-gray-500', 'text-white');
        botaoEditar.classList.add('bg-yellow-500', 'text-black');
        canvasContainer.style.backgroundColor = '#fafafa';
    }
}

/**
 * Limpa as cores de feedback visual do grafo e reseta o estado da animação.
 */
// Antigo limparCores() - grafo-buscas.js
export function limparCores() {
    // Reseta a aparência dos vértices
    estado.vertices.forEach(v => {
        v.cor = null;
        v.texto = null;
    });
    // Reseta a aparência das arestas
    estado.arestas.forEach(a => {
        a.cor = null;
    });

    // Reseta o estado da busca
    estado.animacaoBusca = [];
    estado.passoAtualAnimacao = 0;

    // Limpa o painel de código e descrição
    document.getElementById('code-output').textContent = 'Selecione uma forma de visualização para ver o código correspondente aqui.';
    document.getElementById('descricao-output').textContent = 'Selecione uma forma de visualização para ver a explicação aqui.';
}

/**
 * Inicia o processo de uma busca, abrindo um modal para o usuário selecionar os vértices.
 * @param {string} algoritmo - O algoritmo a ser executado ('bfs', 'dfs', 'dijkstra', 'aEstrela').
 */
// Antigo executarBusca(algoritmo) - grafo-buscas.js
export function executarBusca(algoritmo) {
    if (estado.vertices.length === 0 || estado.arestas.length === 0) {
        alert('O grafo está vazio. Adicione vértices e arestas antes de executar uma busca.');
        return;
    }

    if (estado.vertices.length < 2) {
        alert('O grafo não possui vértices suficientes. Você precisa de pelo menos dois vértices para executar uma busca!');
        return;
    }

    criarModalSelecaoVertices(algoritmo);
}

/**
 * Cria e exibe um modal para o usuário selecionar os vértices de início e fim da busca.
 * @param {string} algoritmo - O nome do algoritmo de busca.
 */
// Antigo criarModalSelecaoVertices(algoritmo) - grafo-buscas.js
function criarModalSelecaoVertices(algoritmo) {
    // Remove modal existente, se houver
    const modalExistente = document.querySelector('.modal-busca');
    if (modalExistente) modalExistente.remove();

    // Cria os elementos do modal
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-busca fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';

    const modalContent = document.createElement('div');
    modalContent.className = 'bg-white rounded-lg p-6 w-96';

    // Título
    modalContent.innerHTML = `<h3 class="text-lg font-semibold mb-4">Executar ${obterNomeAlgoritmo(algoritmo)}</h3>`;

    // Dropdown Vértice Inicial
    modalContent.innerHTML += `<label class="block mb-2">Vértice inicial:</label>`;
    const selectInicial = document.createElement('select');
    selectInicial.className = 'w-full mb-4 p-2 border rounded';

    // Dropdown Vértice Final
    modalContent.innerHTML += `<label class="block mb-2">Vértice final:</label>`;
    const selectFinal = document.createElement('select');
    selectFinal.className = 'w-full mb-4 p-2 border rounded';

    // Adiciona as opções aos selects
    estado.vertices.forEach(v => {
        selectInicial.options.add(new Option(v.rotulo, v.rotulo));
        selectFinal.options.add(new Option(v.rotulo, v.rotulo));
    });
    modalContent.appendChild(selectInicial);
    modalContent.appendChild(selectFinal);

    // Botões
    const botoesDiv = document.createElement('div');
    botoesDiv.className = 'flex justify-end space-x-2';

    const btnCancelar = document.createElement('button');
    btnCancelar.textContent = 'Cancelar';
    btnCancelar.className = 'px-4 py-2 bg-gray-300 rounded hover:bg-gray-400';
    btnCancelar.onclick = () => modalOverlay.remove();

    const btnExecutar = document.createElement('button');
    btnExecutar.textContent = 'Executar';
    btnExecutar.className = 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600';

    // Lógica do botão Executar
    btnExecutar.onclick = () => {
        const rotuloInicial = selectInicial.value;
        const rotuloFinal = selectFinal.value;

        // Valida se os vértices foram selecionados
        if (!rotuloInicial || !rotuloFinal) {
            alert('Por favor, selecione os vértices de início e fim.');
            return;
        }

        // Valida se os vértices são diferentes
        if (rotuloInicial === rotuloFinal) {
            alert('O vértice inicial e final não podem ser o mesmo. Selecione vértices diferentes.');
            return;
        }

        // Encontra os vértices correspondentes
        const verticeInicial = estado.vertices.find(v => v.rotulo === rotuloInicial);
        const verticeFinal = estado.vertices.find(v => v.rotulo === rotuloFinal);

        let resultado;
        // Tenta executar o algoritmo de busca selecionado
        try {
            switch (algoritmo) {
                case 'bfs':
                    resultado = buscaEmLargura(estado.arestas, verticeInicial, verticeFinal);
                    break;

                case 'dfs':
                    resultado = buscaEmProfundidade(estado.arestas, verticeInicial, verticeFinal);
                    break;

                case 'dijkstra':
                    resultado = dijkstra(estado.vertices, estado.arestas, verticeInicial, verticeFinal, estado.custosArestas);
                    break;

                case 'aEstrela':
                    resultado = buscaAEstrela(estado.vertices, estado.arestas, verticeInicial, verticeFinal, estado.custosArestas);
                    break;

                default:
                    throw new Error('Algoritmo desconhecido: ' + algoritmo);
            }

            if (resultado && resultado.animacao) {
                estado.animacaoBusca = resultado.animacao;
                estado.passoAtualAnimacao = 0;
                atualizarPassoAnimacao();
                atualizarOutputBusca(algoritmo, verticeInicial, verticeFinal);
            }
        } catch (erro) {
            alert('Ocorreu um erro ao executar a busca: ' + erro.message);
        } finally {
            modalOverlay.remove();
        }
    };

    // Adiciona os botões ao modal
    botoesDiv.appendChild(btnCancelar);
    botoesDiv.appendChild(btnExecutar);
    modalContent.appendChild(botoesDiv);
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
}

/**
 * Retorna o nome completo de um algoritmo para exibição na UI.
 * @param {string} algoritmo - O identificador do algoritmo.
 * @returns {string} O nome formatado.
 */
// Antigo obterNomeAlgoritmo(algoritmo) - grafo-buscas.js
function obterNomeAlgoritmo(algoritmo) {
    const nomes = {
        bfs: 'Busca em Largura (BFS)',
        dfs: 'Busca em Profundidade (DFS)',
        dijkstra: 'Algoritmo de Dijkstra',
        aEstrela: 'Algoritmo A* (A-Estrela)',
    };
    return nomes[algoritmo] || 'Algoritmo Desconhecido';
}

/**
 * Atualiza o painel de código com a descrição e o pseudocódigo do algoritmo em execução.
 * @param {string} algoritmo - O identificador do algoritmo.
 * @param {object} verticeInicial - O vértice onde a busca começou.
 * @param {object} verticeFinal - O vértice de destino da busca.
 */
// Antigo atualizarOutputBusca(algoritmo, startVertex, endVertex) - grafo-buscas.js
function atualizarOutputBusca(algoritmo, verticeInicial, verticeFinal) {
    const descricaoOutput = document.getElementById('descricao-output');
    const codigoOutput = document.getElementById('code-output');

    let descricao = `Executando ${obterNomeAlgoritmo(algoritmo)} de '${verticeInicial.rotulo}' para '${verticeFinal.rotulo}'.`;
    let pseudocodigo = '';

    switch (algoritmo) {
        case 'bfs':
            pseudocodigo = `
1. Criar uma FILA e adicionar o VÉRTICE INICIAL.
2. Marcar o VÉRTICE INICIAL como visitado.
3. Enquanto a FILA não estiver vazia:
4.   Remover VÉRTICE ATUAL da FILA.
5.   Se VÉRTICE ATUAL for o DESTINO, parar.
6.   Para cada VIZINHO não visitado do VÉRTICE ATUAL:
7.     Marcar VIZINHO como visitado.
8.     Adicionar VIZINHO na FILA.
            `;
            break;
        case 'dfs':
            pseudocodigo = `
1. Criar uma PILHA e adicionar o VÉRTICE INICIAL.
2. Enquanto a PILHA não estiver vazia:
3.   Remover VÉRTICE ATUAL da PILHA.
4.   Se VÉRTICE ATUAL não foi visitado:
5.     Marcar como visitado.
6.     Se VÉRTICE ATUAL for o DESTINO, parar.
7.     Para cada VIZINHO do VÉRTICE ATUAL:
8.       Adicionar VIZINHO na PILHA.
            `;
            break;
        case 'dijkstra':
            pseudocodigo = `
1. Criar FILA DE PRIORIDADE para os vértices.
2. Definir distância de todos como INFINITO, menos o INICIAL (0).
3. Enquanto a FILA não estiver vazia:
4.   Extrair VÉRTICE ATUAL (com menor distância) da FILA.
5.   Para cada VIZINHO do VÉRTICE ATUAL:
6.     Calcular nova distância (dist(atual) + peso da aresta).
7.     Se nova distância < dist(vizinho):
8.       Atualizar distância do VIZINHO e seu predecessor.
9.       Atualizar prioridade do VIZINHO na FILA.
            `;
            break;
        case 'aEstrela':
            pseudocodigo = `
// f(n) = g(n) + h(n)
// g(n) = custo real do início até n
// h(n) = heurística (distância em linha reta) de n até o fim

1. Criar FILA DE PRIORIDADE para os vértices (ordenar por f(n)).
2. Adicionar VÉRTICE INICIAL na FILA.
3. Enquanto a FILA não estiver vazia:
4.   Extrair VÉRTICE ATUAL (com menor f(n)) da FILA.
5.   Se VÉRTICE ATUAL for o DESTINO, reconstruir caminho e parar.
6.   Para cada VIZINHO do VÉRTICE ATUAL:
7.     Calcular novo g(vizinho).
8.     Se novo g(vizinho) < g(vizinho) conhecido:
9.       Atualizar g(vizinho), predecessor e f(vizinho).
10.      Adicionar/Atualizar VIZINHO na FILA.
            `;
            break;
    }

    descricaoOutput.textContent = descricao;
    codigoOutput.textContent = pseudocodigo.trim();
}

/**
 * Controla a visibilidade da barra lateral e seus elementos.
 */
// Antigo toggleSidebar() - index.html
export function alternarBarraLateral() {
    const barraLateral = document.getElementById("sidebar");
    const iconeSeta = document.getElementById("toggle-icon");
    const btnAbrir = document.getElementById("open-sidebar");
    const estaAberta = barraLateral.classList.contains("w-64");

    if (estaAberta) {
        // Fechar a barra lateral 
        barraLateral.classList.remove("w-64", "p-4");
        barraLateral.classList.add("w-0", "overflow-hidden");
        // Esconder o botão de fechar e mostrar o de abrir
        btnAbrir.classList.remove("hidden");
        iconeSeta.classList.remove("fa-chevron-left");
        iconeSeta.classList.add("fa-chevron-right");
    } else {
        // Abrir a barra lateral
        barraLateral.classList.remove("w-0", "overflow-hidden");
        barraLateral.classList.add("w-64", "p-4");
        // Esconder o botão de abrir e mostrar o de fechar
        btnAbrir.classList.add("hidden");
        iconeSeta.classList.remove("fa-chevron-right");
        iconeSeta.classList.add("fa-chevron-left");
    }
}