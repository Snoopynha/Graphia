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
    // Marca o vértice de início como visitado
    const visitados = new Set([verticeInicio.rotulo]);
    // Mapa de predecessores (os anteriores) para reconstrução do caminho
    const predecessores = { [verticeInicio.rotulo]: null };

    // Animação inicial
    animacao.push({
        mensagem: `Iniciando BFS a partir de ${verticeInicio.rotulo}.`,
        verticesVisitados: [verticeInicio.rotulo]
    });

    // Loop principal da BFS
    let encontrado = false;
    // Enquanto houver vértices na fila
    while (fila.length > 0) {
        // Remove o vértice da frente da fila
        const atual = fila.shift();

        // Marca o vértice atual como visitado
        animacao.push({
            mensagem: `Visitando ${atual.rotulo}...`,
            verticesAtuais: [atual.rotulo],
            verticesVisitados: Array.from(visitados)
        });

        // Se chegamos ao vértice de destino, encerramos a busca
        if (atual === verticeFim) {
            encontrado = true;
            break;
        }

        // Obtém os vizinhos do vértice atual
        const vizinhos = obterVizinhos(atual, arestas);
        // Para cada vizinho não visitado, marca como visitado e adiciona à fila
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

    // Reconstrói o caminho se encontrado
    if (encontrado) {
        const caminho = reconstruirCaminho(predecessores, verticeFim.rotulo);
        animacao.push({
            mensagem: `Caminho encontrado! Comprimento: ${caminho.length - 1} arestas.`,
            caminho: caminho,
            verticesVisitados: Array.from(visitados)
        });
        // Caso contrário, indica que o vértice de fim não é alcançável
    } else {
        animacao.push({
            mensagem: `Vértice ${verticeFim.rotulo} não alcançável a partir de ${verticeInicio.rotulo}.`,
            verticesVisitados: Array.from(visitados)
        });
    }

    return { animacao };
}

/**
 * Executa a Busca em Profundidade (DFS).
 * Encontra um caminho (não necessariamente o mais curto).
 * @param {Array<object>} arestas - Lista de arestas do grafo (cada aresta deve ter atributos 'de' e 'para', que são rótulos de vértices).
 * @param {object} verticeInicio - Vértice de início da busca.
 * @param {object} verticeFim - Vértice de fim da busca.
 * @returns {object} - Objeto contendo a animação da busca.
 */
export function buscaEmProfundidade(arestas, verticeInicio, verticeFim) {
    const animacao = [];
    // Pilha para a DFS, iniciando com o vértice de início
    const pilha = [verticeInicio];
    // Conjunto para rastrear os vértices visitados
    const visitados = new Set();
    // Mapa de predecessores (os anteriores) para reconstrução do caminho
    const predecessores = { [verticeInicio.rotulo]: null };

    // Animação inicial
    animacao.push({
        mensagem: `Iniciando DFS a partir de ${verticeInicio.rotulo}.`,
        verticesAtuais: [verticeInicio.rotulo]
    });

    // Loop principal da DFS
    let encontrado = false;
    // Enquanto houver vértices na pilha
    while (pilha.length > 0) {
        // Remove o vértice do topo da pilha
        const atual = pilha.pop();

        // Se já foi visitado, pula para o próximo
        if (visitados.has(atual.rotulo)) continue;
        visitados.add(atual.rotulo);

        animacao.push({
            mensagem: `Visitando ${atual.rotulo}...`,
            verticesAtuais: [atual.rotulo],
            verticesVisitados: Array.from(visitados)
        });

        // Se chegamos ao vértice de destino, encerramos a busca
        if (atual === verticeFim) {
            encontrado = true;
            break;
        }

        // Obtém os vizinhos do vértice atual
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

    // Reconstrói o caminho se encontrado
    if (encontrado) {
        const caminho = reconstruirCaminho(predecessores, verticeFim.rotulo);
        animacao.push({
            mensagem: `Caminho encontrado!`,
            caminho: caminho,
            verticesVisitados: Array.from(visitados)
        });
    // Caso contrário, indica que o vértice de fim não é alcançável
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
    // Mapa de distâncias mínimas conhecidas
    const distancias = {};
    // Mapa de predecessores (os anteriores) para reconstrução do caminho
    const predecessores = {};
    // Fila de prioridade para selecionar o próximo vértice com a menor distância
    const filaPrioridade = new FilaDePrioridade();

    // Inicializa distâncias e predecessores
    vertices.forEach(v => {
        distancias[v.rotulo] = Infinity;
        predecessores[v.rotulo] = null;
    });
    // Define a distância do vértice inicial como 0
    distancias[verticeInicio.rotulo] = 0;
    // Adiciona o vértice inicial à fila de prioridade
    filaPrioridade.enfileirar(verticeInicio, 0);

    // Animação inicial
    animacao.push({
        mensagem: `Iniciando Dijkstra. Distância de ${verticeInicio.rotulo} = 0.`,
        verticesVisitados: [verticeInicio.rotulo]
    });

    // Loop principal do Dijkstra
    while (!filaPrioridade.estaVazia()) {
        // Remove o vértice com a menor distância da fila
        const { elemento: atual } = filaPrioridade.desenfileirar();

        animacao.push({
            mensagem: `Visitando ${atual.rotulo} (Distância: ${distancias[atual.rotulo]})`,
            verticesAtuais: [atual.rotulo],
            verticesVisitados: Object.keys(predecessores).filter(k => predecessores[k] !== null)
        });

        // Se chegamos ao vértice de destino, encerramos a busca
        if (atual === verticeFim) break;

        // Obtém os vizinhos do vértice atual com seus respectivos pesos
        const vizinhos = obterVizinhosComPesos(atual, arestas, custosArestas);
        for (const { vizinho, peso } of vizinhos) {
            const novaDistancia = distancias[atual.rotulo] + peso;

            // Animação da análise do vizinho
            animacao.push({
                mensagem: `Analisando ${vizinho.rotulo} (Dist. atual: ${distancias[vizinho.rotulo]})`,
                arestasAtuais: [{ de: atual.rotulo, para: vizinho.rotulo }]
            });

            // Se a nova distância for menor, atualiza a distância e o predecessor
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

    // Reconstrói o caminho encontrado
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
    // Mapa de predecessores (os anteriores) para reconstrução do caminho
    const predecessores = {};
    // Custo real do início até o nó
    const gScore = {};
    // Custo estimado (gScore + heurística)
    const fScore = {};
    // Fila de prioridade para selecionar o próximo vértice com o menor fScore
    const filaPrioridade = new FilaDePrioridade();

    // Inicializa gScore e fScore
    vertices.forEach(v => {
        gScore[v.rotulo] = Infinity;
        fScore[v.rotulo] = Infinity;
    });

    // Define o gScore do vértice inicial como 0 e calcula o fScore inicial
    gScore[verticeInicio.rotulo] = 0;
    // Calcula a heurística (distância euclidiana) para o fScore inicial
    fScore[verticeInicio.rotulo] = distanciaEuclidiana(verticeInicio, verticeFim);
    // Adiciona o vértice inicial à fila de prioridade
    predecessores[verticeInicio.rotulo] = null;
    // Adiciona o vértice inicial à fila de prioridade
    filaPrioridade.enfileirar(verticeInicio, fScore[verticeInicio.rotulo]);

    animacao.push({
        mensagem: `Iniciando A*. Custo g(${verticeInicio.rotulo})=0, f=${fScore[verticeInicio.rotulo].toFixed(2)}`,
        verticesVisitados: [verticeInicio.rotulo]
    });

    // Conjunto para rastrear os nós visitados na animação
    const nosVisitadosAnimacao = new Set([verticeInicio.rotulo]);

    // Loop principal do A*
    while (!filaPrioridade.estaVazia()) {
        // Remove o vértice com o menor fScore da fila
        const { elemento: atual } = filaPrioridade.desenfileirar();

        animacao.push({
            mensagem: `Visitando ${atual.rotulo} (g: ${gScore[atual.rotulo]}, f: ${fScore[atual.rotulo].toFixed(2)})`,
            verticesAtuais: [atual.rotulo],
            verticesVisitados: Array.from(nosVisitadosAnimacao)
        });

        // Se chegamos ao vértice de destino, reconstruímos o caminho
        if (atual === verticeFim) {
            const caminho = reconstruirCaminho(predecessores, verticeFim.rotulo);
            animacao.push({
                mensagem: `Caminho encontrado! Custo: ${gScore[verticeFim.rotulo]}`,
                caminho: caminho,
                verticesVisitados: Array.from(nosVisitadosAnimacao)
            });
            return { animacao };
        }

        // Obtém os vizinhos do vértice atual com seus respectivos pesos
        const vizinhos = obterVizinhosComPesos(atual, arestas, custosArestas);
        // Para cada vizinho, calcula o gScore tentativo
        for (const { vizinho, peso } of vizinhos) {
            const gScoreTentativo = gScore[atual.rotulo] + peso;

            animacao.push({
                mensagem: `Analisando ${vizinho.rotulo} (g atual: ${gScore[vizinho.rotulo]})`,
                arestasAtuais: [{ de: atual.rotulo, para: vizinho.rotulo }]
            });

            // Se o gScore tentativo for melhor, atualiza os scores e o predecessor
            if (gScoreTentativo < gScore[vizinho.rotulo]) {
                // Este é um caminho melhor para o vizinho
                predecessores[vizinho.rotulo] = atual.rotulo;
                // Atualiza gScore e fScore
                gScore[vizinho.rotulo] = gScoreTentativo;
                // fScore = gScore + heurística
                fScore[vizinho.rotulo] = gScoreTentativo + distanciaEuclidiana(vizinho, verticeFim);

                // Adiciona o vizinho à fila de prioridade
                filaPrioridade.enfileirar(vizinho, fScore[vizinho.rotulo]);
                // Marca o nó como visitado na animação
                nosVisitadosAnimacao.add(vizinho.rotulo);

                animacao.push({
                    mensagem: `Caminho para ${vizinho.rotulo} atualizado! g=${gScoreTentativo}, f=${fScore[vizinho.rotulo].toFixed(2)}`,
                    verticesVisitados: Array.from(nosVisitadosAnimacao)
                });
            }
        }
    }

    // Se chegamos aqui, o vértice de fim não é alcançável
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
    // Implementação da fila de prioridade (Min-Heap)
    constructor() {
        this.elementos = [];
    }

    // Adiciona um elemento à fila de prioridade
    enfileirar(elemento, prioridade) {
        this.elementos.push({ elemento, prioridade });
        this.elementos.sort((a, b) => a.prioridade - b.prioridade);
    }
    
    // Remove e retorna o elemento com a
    desenfileirar() {
        return this.elementos.shift();
    }

    // Verifica se a fila está vazia
    estaVazia() {
        return this.elementos.length === 0;
    }
}

/**
 * Retorna uma lista de vértices vizinhos de um vértice.
 * @param {Array<object>} vertices - Lista de vértices do grafo (cada vértice deve ter um atributo 'rotulo').
 * @param {Array<object>} arestas - Lista de arestas do grafo (cada aresta deve ter atributos 'de' e 'para', que são rótulos de vértices).
 * @returns {Array<object>} - Retorna uma array contendo os vizinhos
 */
function obterVizinhos(vertice, arestas) {
    // Obtém os vizinhos de um vértice
    const vizinhos = [];
    // Para cada aresta, verifica se o vértice é o ponto de partida ou chegada
    for (const aresta of arestas) {
        // Se o vértice é o ponto de partida, adiciona o ponto de chegada como vizinho
        if (aresta.de === vertice) {
            vizinhos.push(aresta.para);
        // Se o vértice é o ponto de chegada e a aresta não é direcionada, adiciona o ponto de partida como vizinho
        } else if (aresta.para === vertice && !aresta.direcionada) {
            vizinhos.push(aresta.de);
        }
    }

    return vizinhos;
}

/**
 * Retorna vizinhos com o custo (peso) da aresta para chegar até eles.
 * @param {Array<object>} vertices - Lista de vértices do grafo (cada vértice deve ter um atributo 'rotulo').
 * @param {Array<object>} arestas - Lista de arestas do grafo (cada aresta deve ter atributos 'de' e 'para', que são rótulos de vértices).
 * @param {number} custosArestas - Peso das arestas do grafo.
 * @returns {Array<object>} - Retorna uma array contendo os vizinhos e seus respectivos pesos.
 */
function obterVizinhosComPesos(vertice, arestas, custosArestas) {
    // Obtém os vizinhos de um vértice junto com o peso da aresta
    const vizinhos = [];
    
    // Para cada aresta, verifica se o vértice é o ponto de partida ou chegada
    for (const aresta of arestas) {
        let vizinho = null;
        // Se o vértice é o ponto de partida, adiciona o ponto de chegada como vizinho
        if (aresta.de === vertice) {
            vizinho = aresta.para;
        // Se o vértice é o ponto de chegada e a aresta não é direcionada, adiciona o ponto de partida como vizinho
        } else if (aresta.para === vertice && !aresta.direcionada) {
            vizinho = aresta.de;
        }

        // Obtém o peso da aresta
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
 * @param {object} predecessores - Mapa de predecessores dos vértices.
 * @param {string} rotuloFim - Rótulo do vértice de fim.
 * @returns {Array<string>} - Retorna o caminho reconstruído como uma array de rótulos de vértices.
 */
function reconstruirCaminho(predecessores, rotuloFim) {
    // Reconstrói o caminho a partir do mapa de predecessores
    const caminho = [];
    // Começa do vértice de fim e volta até o início
    let atual = rotuloFim;
    
    // Enquanto houver um predecessor, adiciona ao caminho
    while (atual !== null) {
        caminho.unshift(atual);
        atual = predecessores[atual];
    }

    return caminho;
}

/**
 * Calcula a distância em linha reta entre dois vértices (heurística para A*).
 * @param {object} v1 - Primeiro vértice.
 * @param {object} v2 - Segundo vértice.
 * @returns {number} - Retorna a distância euclidiana entre os dois vértices.
 */
function distanciaEuclidiana(v1, v2) {
    // Calcula a distância euclidiana entre dois vértices
    const dx = v1.x - v2.x;
    const dy = v1.y - v2.y;
    return Math.sqrt(dx * dx + dy * dy);
}