/**
 * Gera a representação em lista de adjacência do grafo.
 * @param {Array<object>} vertices - Lista de vértices do grafo (cada vértice deve ter um atributo 'rotulo').
 * @param {Array<object>} arestas - Lista de arestas do grafo (cada aresta deve ter atributos 'de' e 'para', que são rótulos de vértices).
 * @returns {object} - Objeto contendo a lista de adjacência.
 * 
 * @example
 * Exemplo de saída:
 *{
 * tipo: "lista",
 * dados: {
 *  A: ["B", "C"],
 *  B: ["A"],
 *  C: []
 *  }
 *}
 */
// Antigo window.gerarListaAdjacencia = function() - grafo-manipulacao.js
export function gerarListaAdjacencia(vertices, arestas) {
    const lista = {};
    // Adiciona todos os vértices
    vertices.forEach(v => lista[v.rotulo] = []);
    // Percorre as arestas e monta as conexões
    arestas.forEach(a => {
        lista[a.de.rotulo].push(a.para.rotulo);
        if (!a.direcionada) lista[a.para.rotulo].push(a.de.rotulo);
    });

    return { tipo: 'lista', dados: lista };
}

/**
 * Gera a representação em matriz de adjacência do grafo.
 * @param {Array<object>} vertices - Lista de vértices do grafo (cada vértice deve ter um atributo 'rotulo').
 * @param {Array<object>} arestas - Lista de arestas do grafo (cada aresta deve ter atributos 'de' e 'para', que são rótulos de vértices).
 * @returns {object} - Objeto contendo matriz de adjacência.
 * 
 * @example
 *{
 * tipo: 'matrizAdj',
 * cabecalho: rotulos,
 * linhas: rotulos,
 * matriz: [...]
 *}
 */
// Antigo window.gerarMatrizAdjacencia = function() - grafo-manipulacao.js
export function gerarMatrizAdjacencia(vertices, arestas) {
    // Obtém os rótulos dos vértices
    const rotulos = vertices.map(v => v.rotulo);
    const n = rotulos.length;
    // Inicializa a matriz com zeros
    const matriz = Array.from({ length: n }, () => Array(n).fill(0));

    // Preenche a matriz com as arestas
    arestas.forEach(a => {
        // Encontra os índices dos vértices
        const i = rotulos.indexOf(a.de.rotulo);
        const j = rotulos.indexOf(a.para.rotulo);
        if (i !== -1 && j !== -1) {
            matriz[i][j] = 1;
            // Se não for direcionado, adiciona conexão inversa
            if (!a.direcionada) matriz[j][i] = 1;
        }
    });

    return { tipo: 'matrizAdj', cabecalho: rotulos, linhas: rotulos, matriz };
}

/**
 * Gera a representação em matriz de incidência do grafo.
 * @param {Array<object>} vertices - Lista de vértices do grafo (cada vértice deve ter um atributo 'rotulo').
 * @param {Array<object>} arestas - Lista de arestas do grafo (cada aresta deve ter atributos 'de' e 'para', que são rótulos de vértices).
 * @returns {string} - Representação em matriz de incidência do grafo.
 * 
 * @example
 * Exemplo de saída:
 *    A  B  C
 * A  1  0 -1
 * B -1  1  0
 * C  0  1  1
 */
// Antigo window.gerarMatrizIncidencia = function() - grafo-manipulacao.js
export function gerarMatrizIncidencia(vertices, arestas) {
    // Obtém os rótulos dos vértices
    const rotulosV = vertices.map(v => v.rotulo);
    // Gera rótulos para as arestas
    const rotulosA = arestas.map((_, i) => `A${i + 1}`);
    const matriz = Array.from({ length: rotulosV.length }, () => Array(arestas.length).fill(0));

    // Preenche a matriz com as arestas
    arestas.forEach((a, j) => {
        const deIdx = rotulosV.indexOf(a.de.rotulo);
        const paraIdx = rotulosV.indexOf(a.para.rotulo);
        if (a.direcionada) {
            matriz[deIdx][j] = -1;
            matriz[paraIdx][j] = 1;
        } else {
            matriz[deIdx][j] = 1;
            matriz[paraIdx][j] = 1;
        }
    });

    return { tipo: 'matrizInc', cabecalho: rotulosA, linhas: rotulosV, matriz, objetosArestas: arestas };
}

// --- FUNÇÕES E CLASSES AUXILIARES (NÃO EXPORTADAS) ---

/**
 * Formata uma matriz numérica em uma string alinhada e legível.
 * @param {string[]} rotulosLinhas - Lista de rótulos para as linhas.
 * @param {string[]} rotulosColunas - Lista de rótulos para as colunas.
 * @param {number[][]} matriz - Matriz numérica a ser formatada.
 * @param {string} [titulo] - Título opcional exibido no topo.
 * @returns {string} - Representação textual formatada da matriz.
 */
export function formatarMatriz(rotulosLinhas, rotulosColunas, matriz, titulo = '') {
    const n = rotulosLinhas.length;
    const m = rotulosColunas.length;

    // Determina automaticamente o tamanho das colunas
    const rotuloLinhaMaisLongo = Math.max(...rotulosLinhas.map(r => r.length));
    const rotuloColunaMaisLongo = Math.max(...rotulosColunas.map(r => r.length));
    const maiorValor = Math.max(...matriz.flat().map(v => String(v).length));
    const larguraColuna = Math.max(rotuloColunaMaisLongo, maiorValor, 3) + 2;

    let saida = titulo ? `${titulo}\n\n` : '';
    saida += ''.padEnd(rotuloLinhaMaisLongo + 2);

    // Cabeçalho
    for (const c of rotulosColunas) {
        saida += c.padStart(larguraColuna);
    }
    saida += '\n';

    // Corpo
    for (let i = 0; i < n; i++) {
        saida += rotulosLinhas[i].padEnd(rotuloLinhaMaisLongo + 2);
        for (let j = 0; j < m; j++) {
            saida += String(matriz[i][j]).padStart(larguraColuna);
        }
        saida += '\n';
    }

    return saida;
}