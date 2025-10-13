// window.gerarListaAdjacencia = function() - grafo-manipulacao.js
export function gerarListaAdjacencia(vertices, arestas) {
    const lista = {};
    for (let v of vertices) {
        lista[v.rotulo] = [];
    }
    for (let a of arestas) {
        lista[a.de.rotulo].push(a.para.rotulo);
        if (!a.direcionada) {
            lista[a.para.rotulo].push(a.de.rotulo);
        }
    }
    let saida = '';
    for (let chave in lista) {
        saida += `${chave} -> ${lista[chave].join(', ')}\n`;
    }
    return saida;
}

// window.gerarMatrizAdjacencia = function() - grafo-manipulacao.js
export function gerarMatrizAdjacencia(vertices, arestas) {
    const rotulos = vertices.map(v => v.rotulo);
    const n = rotulos.length;
    const matriz = Array.from({ length: n }, () => Array(n).fill(0));

    for (let a of arestas) {
        const i = rotulos.indexOf(a.de.rotulo);
        const j = rotulos.indexOf(a.para.rotulo);
        if (i !== -1 && j !== -1) {
            matriz[i][j] = 1;
            if (!a.direcionada) {
                matriz[j][i] = 1;
            }
        }
    }
    let saida = '   ' + rotulos.join('  ') + '\n';
    for (let i = 0; i < n; i++) {
        saida += rotulos[i] + ' ' + matriz[i].join('  ') + '\n';
    }
    return saida;
}

// window.gerarMatrizIncidencia = function() - grafo-manipulacao.js
export function gerarMatrizIncidencia(vertices, arestas) {
    const rotulos = vertices.map(v => v.rotulo);
    const n = rotulos.length;
    const m = arestas.length;
    const matriz = Array.from({ length: n }, () => Array(m).fill(0));

    arestas.forEach((a, indice) => {
        const i = rotulos.indexOf(a.de.rotulo);
        const j = rotulos.indexOf(a.para.rotulo);
        if (i !== -1 && j !== -1) {
            if (a.direcionada) {
                matriz[i][indice] = -1;
                matriz[j][indice] = 1;
            } else {
                matriz[i][indice] = 1;
                matriz[j][indice] = 1;
            }
        }
    });
    let saida = '';
    for (let i = 0; i < n; i++) {
        saida += rotulos[i] + ' | ' + matriz[i].join('  ') + '\n';
    }
    return saida;
}