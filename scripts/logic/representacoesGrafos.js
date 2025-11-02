/**
 * Gera a representação em lista de adjacência do grafo.
 * @param {Array<object>} vertices - Lista de vértices do grafo (cada vértice deve ter um atributo 'rotulo').
 * @param {Array<object>} arestas - Lista de arestas do grafo (cada aresta deve ter atributos 'de' e 'para', que são rótulos de vértices).
 * @returns {string} - Representação em lista de adjacência do grafo.
 * 
 * @example
 * Exemplo de saída:
 * A -> B, C
 * B -> A
 * C -> A
 */
// Antigo window.gerarListaAdjacencia = function() - grafo-manipulacao.js
export function gerarListaAdjacencia(vertices, arestas) {
    const lista = {};
    // Adiciona todos os vértices à lista
    for (let v of vertices) {
        lista[v.rotulo] = [];
    }
    // Adiciona as arestas à lista
    for (let a of arestas) {
        // Supondo que a.de e a.para são objetos vértice com atributo rotulo
        lista[a.de.rotulo].push(a.para.rotulo);
        // Se a aresta não for direcionada, adiciona o vértice de origem à lista de adjacência do vértice de destino
        if (!a.direcionada) {
            lista[a.para.rotulo].push(a.de.rotulo);
        }
    }

    let saida = '';
    // Gera a string de saída
    for (let chave in lista) {
        // Remove espaços em branco e vírgulas no final da string
        saida += `${chave} -> ${lista[chave].join(', ')}\n`;
    }

    return saida;
}

/**
 * Gera a representação em matriz de adjacência do grafo.
 * @param {Array<object>} vertices - Lista de vértices do grafo (cada vértice deve ter um atributo 'rotulo').
 * @param {Array<object>} arestas - Lista de arestas do grafo (cada aresta deve ter atributos 'de' e 'para', que são rótulos de vértices).
 * @returns {string} - Representação em matriz de adjacência do grafo.
 * 
 * @example
 * Exemplo de saída:
 *    A  B  C
 * A  0  1  1
 * B  1  0  0
 * C  1  0  0
 */
// Antigo window.gerarMatrizAdjacencia = function() - grafo-manipulacao.js
export function gerarMatrizAdjacencia(vertices, arestas) {
    // Obtém os rótulos dos vértices
    const rotulos = vertices.map(v => v.rotulo);
    const n = rotulos.length;
    // Inicializa a matriz com zeros
    // Os vertices são indexados de 0 a n-1
    const matriz = Array.from({ length: n }, () => Array(n).fill(0));

    // Preenche a matriz com as arestas
    for (let a of arestas) {
        // Supondo que a.de e a.para são objetos vértice com atributo rotulo
        const i = rotulos.indexOf(a.de.rotulo);
        const j = rotulos.indexOf(a.para.rotulo);
        // Verifica se os índices são válidos
        if (i !== -1 && j !== -1) {
            matriz[i][j] = 1;
            // Se a aresta não for direcionada, adiciona o vértice de origem à lista de adjacência do vértice de destino
            if (!a.direcionada) {
                matriz[j][i] = 1;
            }
        }
    }

    return formatarMatriz(rotulos, rotulos, matriz, 'Matriz de Adjacência');
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
    const rotulos = vertices.map(v => v.rotulo);
    // Pega o número de vértices e arestas
    const n = rotulos.length;
    const m = arestas.length;
    // Inicializa a matriz com zeros
    // Os vertices são indexados de 0 a n-1 e as arestas de 0 a m-1
    const matriz = Array.from({ length: n }, () => Array(m).fill(0));

    // Preenche a matriz com as arestas
    arestas.forEach((a, indice) => {
        const i = rotulos.indexOf(a.de.rotulo);
        const j = rotulos.indexOf(a.para.rotulo);
        // Verifica se os índices são válidos
        if (i !== -1 && j !== -1) {
            // Para arestas direcionadas, usa -1 para o vértice de origem e 1 para o vértice de destino
            if (a.direcionada) {
                matriz[i][indice] = -1;
                matriz[j][indice] = 1;
            } else {
                matriz[i][indice] = 1;
                matriz[j][indice] = 1;
            }
        }
    });

    // Gera rótulos para as arestas
    const rotulosArestas = arestas.map((_, indice) => `E${indice + 1}`);
    return formatarMatriz(rotulos, rotulosArestas, matriz, 'Matriz de Incidência');
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