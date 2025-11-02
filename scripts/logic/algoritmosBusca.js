/**
 * Executa a Busca em Largura (BFS).
 * Encontra o caminho mais curto em número de arestas.
 * @param {Array<object>} arestas - Lista de arestas do grafo (cada aresta deve ter atributos 'de' e 'para', que são rótulos de vértices).
 * @param {object} verticeInicio - Vértice de início da busca.
 * @param {object} verticeFim - Vértice de fim da busca.
 * @returns {object} - Objeto contendo a animação da busca.
 */
export function buscaEmLargura(arestas, verticeInicio, verticeFim) {
    const animacao = [];
    const fila = [verticeInicio];
    const visitados = new Set([verticeInicio.rotulo]);
    const predecessores = { [verticeInicio.rotulo]: null };

    animacao.push({
        mensagem: `Iniciando BFS a partir de ${verticeInicio.rotulo}.`,
        verticesVisitados: [verticeInicio.rotulo]
    });

    let encontrado = false;
    while (fila.length > 0) {
        const atual = fila.shift();

        animacao.push({
            mensagem: `Visitando ${atual.rotulo}...`,
            verticesAtuais: [atual.rotulo],
            verticesVisitados: Array.from(visitados)
        });

        if (atual === verticeFim) {
            encontrado = true;
            break;
        }

        const vizinhos = obterVizinhos(atual, arestas);
        for (const vizinho of vizinhos) {
            if (!visitados.has(vizinho.rotulo)) {
                visitados.add(vizinho.rotulo);
                predecessores[vizinho.rotulo] = atual.rotulo;
                fila.push(vizinho);
                animacao.push({
                    mensagem: `Descobrindo ${vizinho.rotulo} a partir de ${atual.rotulo}.`,
                    verticesVisitados: Array.from(visitados),
                    arestasAtuais: [{ de: atual.rotulo, para: vizinho.rotulo }]
                });
            }
        }
    }

    if (encontrado) {
        const caminho = reconstruirCaminho(predecessores, verticeFim.rotulo);
        animacao.push({
            mensagem: `Caminho encontrado! Comprimento: ${caminho.length - 1} arestas.`,
            caminho: caminho,
            verticesVisitados: Array.from(visitados)
        });
    } else {
        animacao.push({
            mensagem: `Vértice ${verticeFim.rotulo} não alcançável a partir de ${verticeInicio.rotulo}.`,
            verticesVisitados: Array.from(visitados)
        });
    }

    return { animacao };
}

/**
 * Executa a Busca em Profundidade (DFS) iterativa.
 * Encontra um caminho (não necessariamente o mais curto).
 * @param {Array<object>} arestas - Lista de arestas do grafo (cada aresta deve ter atributos 'de' e 'para', que são rótulos de vértices).
 * @param {object} verticeInicio - Vértice de início da busca.
 * @param {object} verticeFim - Vértice de fim da busca.
 * @returns {object} - Objeto contendo a animação da busca.
 */
export function buscaEmProfundidade(arestas, verticeInicio, verticeFim) {
    const animacao = [];
    const pilha = [verticeInicio];
    const visitados = new Set();
    const predecessores = { [verticeInicio.rotulo]: null };

    animacao.push({
        mensagem: `Iniciando DFS a partir de ${verticeInicio.rotulo}.`,
        verticesAtuais: [verticeInicio.rotulo]
    });

    let encontrado = false;
    while (pilha.length > 0) {
        const atual = pilha.pop();

        if (visitados.has(atual.rotulo)) continue;
        visitados.add(atual.rotulo);

        animacao.push({
            mensagem: `Visitando ${atual.rotulo}...`,
            verticesAtuais: [atual.rotulo],
            verticesVisitados: Array.from(visitados)
        });

        if (atual === verticeFim) {
            encontrado = true;
            break;
        }

        const vizinhos = obterVizinhos(atual, arestas);
        // Invertemos os vizinhos para que a ordem de visita (na pilha) seja mais natural
        for (const vizinho of vizinhos.reverse()) {
            if (!visitados.has(vizinho.rotulo)) {
                predecessores[vizinho.rotulo] = atual.rotulo;
                pilha.push(vizinho);
                animacao.push({
                    mensagem: `Empilhando ${vizinho.rotulo} a partir de ${atual.rotulo}.`,
                    verticesVisitados: Array.from(visitados),
                    arestasAtuais: [{ de: atual.rotulo, para: vizinho.rotulo }]
                });
            }
        }
    }

     if (encontrado) {
        const caminho = reconstruirCaminho(predecessores, verticeFim.rotulo);
        animacao.push({
            mensagem: `Caminho encontrado!`,
            caminho: caminho,
            verticesVisitados: Array.from(visitados)
        });
    } else {
        animacao.push({
            mensagem: `Vértice ${verticeFim.rotulo} não alcançável.`,
            verticesVisitados: Array.from(visitados)
        });
    }

    return { animacao };
}

/**
 * Executa o Algoritmo de Dijkstra.
 * Encontra o caminho mais curto em termos de custo (peso) das arestas.
 * @param {Array<object>} vertices - Lista de vértices do grafo (cada vértice deve ter um atributo 'rotulo').
 * @param {Array<object>} arestas - Lista de arestas do grafo (cada aresta deve ter atributos 'de' e 'para', que são rótulos de vértices).
 * @param {object} verticeInicio - Vértice de início da busca.
 * @param {object} verticeFim - Vértice de fim da busca.
 * @param {number} custosArestas - Peso das arestas do grafo.
 * @returns {object} - Objeto contendo a animação da busca.
 */
export function dijkstra(vertices, arestas, verticeInicio, verticeFim, custosArestas) {
    const animacao = [];
    const distancias = {};
    const predecessores = {};
    const filaPrioridade = new FilaDePrioridade();

    vertices.forEach(v => {
        distancias[v.rotulo] = Infinity;
        predecessores[v.rotulo] = null;
    });
    distancias[verticeInicio.rotulo] = 0;
    filaPrioridade.enfileirar(verticeInicio, 0);

    animacao.push({
        mensagem: `Iniciando Dijkstra. Distância de ${verticeInicio.rotulo} = 0.`,
        verticesVisitados: [verticeInicio.rotulo]
    });

    while (!filaPrioridade.estaVazia()) {
        const { elemento: atual } = filaPrioridade.desenfileirar();
        
        animacao.push({
            mensagem: `Visitando ${atual.rotulo} (Distância: ${distancias[atual.rotulo]})`,
            verticesAtuais: [atual.rotulo],
            verticesVisitados: Object.keys(predecessores).filter(k => predecessores[k] !== null)
        });

        if (atual === verticeFim) break;

        const vizinhos = obterVizinhosComPesos(atual, arestas, custosArestas);
        for (const { vizinho, peso } of vizinhos) {
            const novaDistancia = distancias[atual.rotulo] + peso;
            
            animacao.push({
                mensagem: `Analisando ${vizinho.rotulo} (Dist. atual: ${distancias[vizinho.rotulo]})`,
                arestasAtuais: [{de: atual.rotulo, para: vizinho.rotulo}]
            });

            if (novaDistancia < distancias[vizinho.rotulo]) {
                distancias[vizinho.rotulo] = novaDistancia;
                predecessores[vizinho.rotulo] = atual.rotulo;
                filaPrioridade.enfileirar(vizinho, novaDistancia);
                
                animacao.push({
                    mensagem: `Distância para ${vizinho.rotulo} atualizada: ${novaDistancia}`,
                    verticesVisitados: Object.keys(predecessores).filter(k => predecessores[k] !== null)
                });
            }
        }
    }

    const caminho = reconstruirCaminho(predecessores, verticeFim.rotulo);
    animacao.push({
        mensagem: `Caminho mais curto encontrado! Custo: ${distancias[verticeFim.rotulo]}`,
        caminho: caminho
    });

    return { animacao };
}

/**
 * Executa o Algoritmo A* (A-Estrela).
 * Encontra o caminho mais curto usando uma heurística (distância em linha reta).
 * @param {Array<object>} vertices - Lista de vértices do grafo (cada vértice deve ter um atributo 'rotulo').
 * @param {Array<object>} arestas - Lista de arestas do grafo (cada aresta deve ter atributos 'de' e 'para', que são rótulos de vértices).
 * @param {object} verticeInicio - Vértice de início da busca.
 * @param {object} verticeFim - Vértice de fim da busca.
 * @param {number} custosArestas - Peso das arestas do grafo.
 * @returns {object} - Objeto contendo a animação da busca.
 */
export function buscaAEstrela(vertices, arestas, verticeInicio, verticeFim, custosArestas) {
    const animacao = [];
    const predecessores = {};
    const gScore = {}; // Custo real do início até o nó
    const fScore = {}; // Custo estimado (gScore + heurística)
    const filaPrioridade = new FilaDePrioridade();

    vertices.forEach(v => {
        gScore[v.rotulo] = Infinity;
        fScore[v.rotulo] = Infinity;
    });

    gScore[verticeInicio.rotulo] = 0;
    fScore[verticeInicio.rotulo] = distanciaEuclidiana(verticeInicio, verticeFim);
    predecessores[verticeInicio.rotulo] = null;
    filaPrioridade.enfileirar(verticeInicio, fScore[verticeInicio.rotulo]);

    animacao.push({
        mensagem: `Iniciando A*. Custo g(${verticeInicio.rotulo})=0, f=${fScore[verticeInicio.rotulo].toFixed(2)}`,
        verticesVisitados: [verticeInicio.rotulo]
    });

    const nosVisitadosAnimacao = new Set([verticeInicio.rotulo]);

    while (!filaPrioridade.estaVazia()) {
        const { elemento: atual } = filaPrioridade.desenfileirar();
        
        animacao.push({
            mensagem: `Visitando ${atual.rotulo} (g: ${gScore[atual.rotulo]}, f: ${fScore[atual.rotulo].toFixed(2)})`,
            verticesAtuais: [atual.rotulo],
            verticesVisitados: Array.from(nosVisitadosAnimacao)
        });

        if (atual === verticeFim) {
            const caminho = reconstruirCaminho(predecessores, verticeFim.rotulo);
            animacao.push({
                mensagem: `Caminho encontrado! Custo: ${gScore[verticeFim.rotulo]}`,
                caminho: caminho,
                verticesVisitados: Array.from(nosVisitadosAnimacao)
            });
            return { animacao };
        }

        const vizinhos = obterVizinhosComPesos(atual, arestas, custosArestas);
        for (const { vizinho, peso } of vizinhos) {
            const gScoreTentativo = gScore[atual.rotulo] + peso;

            animacao.push({
                mensagem: `Analisando ${vizinho.rotulo} (g atual: ${gScore[vizinho.rotulo]})`,
                arestasAtuais: [{de: atual.rotulo, para: vizinho.rotulo}]
            });

            if (gScoreTentativo < gScore[vizinho.rotulo]) {
                // Este é um caminho melhor para o vizinho
                predecessores[vizinho.rotulo] = atual.rotulo;
                gScore[vizinho.rotulo] = gScoreTentativo;
                fScore[vizinho.rotulo] = gScoreTentativo + distanciaEuclidiana(vizinho, verticeFim);
                
                filaPrioridade.enfileirar(vizinho, fScore[vizinho.rotulo]);
                nosVisitadosAnimacao.add(vizinho.rotulo);

                animacao.push({
                    mensagem: `Caminho para ${vizinho.rotulo} atualizado! g=${gScoreTentativo}, f=${fScore[vizinho.rotulo].toFixed(2)}`,
                    verticesVisitados: Array.from(nosVisitadosAnimacao)
                });
            }
        }
    }
    
    animacao.push({
        mensagem: `Vértice ${verticeFim.rotulo} não alcançável.`,
        verticesVisitados: Array.from(nosVisitadosAnimacao)
    });

    return { animacao };
}


// --- FUNÇÕES E CLASSES AUXILIARES (NÃO EXPORTADAS) ---

/**
 * Classe simples de Fila de Prioridade (Min-Heap) para Dijkstra e A*.
 */
class FilaDePrioridade {
    constructor() {
        this.elementos = [];
    }
    enfileirar(elemento, prioridade) {
        this.elementos.push({ elemento, prioridade });
        this.elementos.sort((a, b) => a.prioridade - b.prioridade); // Simples, mas ineficiente. OK para este projeto.
    }
    desenfileirar() {
        return this.elementos.shift();
    }
    estaVazia() {
        return this.elementos.length === 0;
    }
}

/**
 * Retorna uma lista de vértices vizinhos de um vértice.
 */
function obterVizinhos(vertice, arestas) {
    const vizinhos = [];
    for (const aresta of arestas) {
        if (aresta.de === vertice) {
            vizinhos.push(aresta.para);
        } else if (aresta.para === vertice && !aresta.direcionada) {
            vizinhos.push(aresta.de);
        }
    }
    return vizinhos;
}

/**
 * Retorna vizinhos com o custo (peso) da aresta para chegar até eles.
 */
function obterVizinhosComPesos(vertice, arestas, custosArestas) {
    const vizinhos = [];
    for (const aresta of arestas) {
        let vizinho = null;
        if (aresta.de === vertice) {
            vizinho = aresta.para;
        } else if (aresta.para === vertice && !aresta.direcionada) {
            vizinho = aresta.de;
        }
        
        if (vizinho) {
            const chave = `${aresta.de.rotulo}-${aresta.para.rotulo}`;
            const chaveReversa = `${aresta.para.rotulo}-${aresta.de.rotulo}`;
            const peso = custosArestas[chave] || custosArestas[chaveReversa] || 1;
            vizinhos.push({ vizinho, peso });
        }
    }
    return vizinhos;
}

/**
 * Reconstrói o caminho a partir do mapa de predecessores.
 */
function reconstruirCaminho(predecessores, rotuloFim) {
    const caminho = [];
    let atual = rotuloFim;
    while (atual !== null) {
        caminho.unshift(atual);
        atual = predecessores[atual];
    }
    return caminho;
}

/**
 * Calcula a distância em linha reta entre dois vértices (heurística para A*).
 */
function distanciaEuclidiana(v1, v2) {
    const dx = v1.x - v2.x;
    const dy = v1.y - v2.y;
    return Math.sqrt(dx * dx + dy * dy);
}