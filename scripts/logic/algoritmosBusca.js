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
        tipo: 'INICIO', no: verticeInicio.rotulo,
        estrutura: fila.map(v => v.rotulo),
        motivo: `A busca se inicia em ${verticeInicio.rotulo}. O vértice é adicionado à fila de processamento.`,
        explicacao: 'A Busca em Largura (BFS) explora o grafo em camadas, garantindo encontrar o caminho com o menor número de arestas. Ela usa uma Fila (FIFO) como estrutura principal.',
        destaque: { verticesAtuais: [verticeInicio.rotulo], verticesVisitados: Array.from(visitados) }
    });

    // Loop principal da BFS
    let encontrado = false;
    // Enquanto houver vértices na fila
    while (fila.length > 0) {
        // Remove o vértice da frente da fila
        const atual = fila.shift();

        // Marca o vértice atual como visitado
        animacao.push({
            tipo: 'VISITA', no: atual.rotulo,
            estrutura: fila.map(v => v.rotulo),
            motivo: `Removido da frente da fila para analisar seus vizinhos.`,
            explicacao: 'Ao processar um nó, a BFS garante que todos os nós da camada atual sejam analisados antes de descer para a próxima camada do grafo.',
            destaque: { verticesAtuais: [atual.rotulo], verticesVisitados: Array.from(visitados) }
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
                    tipo: 'DESCOBERTA', no: vizinho.rotulo,
                    estrutura: fila.map(v => v.rotulo),
                    motivo: `O vizinho ${vizinho.rotulo} é novo. Ele entra no final da fila.`,
                    explicacao: 'Sempre que descobrimos um novo vértice válido, marcamos como visitado instantaneamente para evitar processamento duplicado (ciclos).',
                    destaque: { verticesVisitados: Array.from(visitados), arestasAtuais: [{ de: atual.rotulo, para: vizinho.rotulo }] }
                });
            }
        }
    }

    // Reconstrói o caminho se encontrado
    if (encontrado) {
        const caminho = reconstruirCaminho(predecessores, verticeFim.rotulo);
        animacao.push({
            tipo: 'FIM', no: verticeFim.rotulo, estrutura: [],
            motivo: `O alvo ${verticeFim.rotulo} foi processado e o caminho foi reconstruído.`,
            explicacao: 'Percorrendo os predecessores gravados durante a busca, da chegada até o final, conseguimos desenhar a rota exata.',
            destaque: { caminho: caminho, verticesVisitados: Array.from(visitados) }
        });
        // Caso contrário, indica que o vértice de fim não é alcançável
    } else {
        animacao.push({
            tipo: 'FIM', no: null, estrutura: [],
            motivo: 'A fila esvaziou sem encontrar o destino final.',
            explicacao: 'Quando a estrutura de dados (fila) fica vazia e não encontramos o alvo, significa que não existe um caminho possível entre a origem e o destino.',
            destaque: { verticesVisitados: Array.from(visitados) }
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
        tipo: 'INICIO', no: verticeInicio.rotulo,
        estrutura: pilha.map(v => v.rotulo),
        motivo: `Adicionando o ponto de partida ${verticeInicio.rotulo} no topo da pilha.`,
        explicacao: 'A Busca em Profundidade (DFS) avança até o limite de um caminho antes de retroceder. Ela utiliza uma Pilha (LIFO) para forçar a descida contínua nas conexões.',
        destaque: { verticesAtuais: [verticeInicio.rotulo] }
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
            tipo: 'VISITA', no: atual.rotulo,
            estrutura: pilha.map(v => v.rotulo),
            motivo: `Retirando do topo da pilha e marcando como visitado definitivamente.`,
            explicacao: 'A DFS mergulha em um caminho cego. Se houver opções, ela processa sempre a última opção que foi vista (o topo da pilha).',
            destaque: { verticesAtuais: [atual.rotulo], verticesVisitados: Array.from(visitados) }
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
                    tipo: 'DESCOBERTA', no: vizinho.rotulo,
                    estrutura: pilha.map(v => v.rotulo),
                    motivo: `Aresta explorada. O vizinho ${vizinho.rotulo} entra no topo da pilha.`,
                    explicacao: 'Ao empilhar, o algoritmo agenda este vizinho para ser explorado imediatamente no próximo passo, priorizando a profundidade.',
                    destaque: { verticesVisitados: Array.from(visitados), arestasAtuais: [{ de: atual.rotulo, para: vizinho.rotulo }] }
                });
            }
        }
    }

    // Reconstrói o caminho se encontrado
    if (encontrado) {
        const caminho = reconstruirCaminho(predecessores, verticeFim.rotulo);
        animacao.push({
            tipo: 'FIM', no: verticeFim.rotulo, estrutura: [],
            motivo: `Destino alcançado. Processo interrompido.`,
            explicacao: 'A DFS encontrou um caminho viável. É importante lembrar que ela NÃO garante o caminho mais curto, apenas um caminho possível.',
            destaque: { caminho: caminho, verticesVisitados: Array.from(visitados) }
        });
    // Caso contrário, indica que o vértice de fim não é alcançável
    } else {
        animacao.push({
            tipo: 'FIM', no: null, estrutura: [],
            motivo: `Pilha vazia. O grafo inteiro foi mapeado sem achar o destino.`,
            explicacao: 'Como a pilha LIFO secou, todos os caminhos em profundidade resultaram em becos sem saída em relação ao nosso alvo.',
            destaque: { verticesVisitados: Array.from(visitados) }
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

    const getFilaStr = () => filaPrioridade.elementos.map(e => `${e.elemento.rotulo}(${e.prioridade})`);

    // Animação inicial
    animacao.push({
        tipo: 'INICIO', no: verticeInicio.rotulo, estrutura: getFilaStr(),
        motivo: `Custos mapeados como Infinito. Partida ${verticeInicio.rotulo} tem custo 0.`,
        explicacao: 'O Dijkstra é focado no peso das arestas. Ele utiliza uma Fila de Prioridade (Min-Heap) para sempre avaliar o caminho mais barato conhecido primeiro.',
        destaque: { verticesVisitados: [verticeInicio.rotulo] }
    });

    // Loop principal do Dijkstra
    while (!filaPrioridade.estaVazia()) {
        // Remove o vértice com a menor distância da fila
        const { elemento: atual } = filaPrioridade.desenfileirar();

        animacao.push({
            tipo: 'VISITA', no: atual.rotulo, estrutura: getFilaStr(),
            motivo: `Nó mais próximo (custo: ${distancias[atual.rotulo]}) retirado da prioridade.`,
            explicacao: 'Ao processar o topo da fila de prioridade, o Dijkstra garante que encontrou a rota absoluta mais barata para o nó em questão.',
            destaque: { verticesAtuais: [atual.rotulo], verticesVisitados: Object.keys(predecessores).filter(k => predecessores[k] !== null) }
        });

        // Se chegamos ao vértice de destino, encerramos a busca
        if (atual === verticeFim) break;

        // Obtém os vizinhos do vértice atual com seus respectivos pesos
        const vizinhos = obterVizinhosComPesos(atual, arestas, custosArestas);
        for (const { vizinho, peso } of vizinhos) {
            const novaDistancia = distancias[atual.rotulo] + peso;

            // Se a nova distância for menor, atualiza a distância e o predecessor
            if (novaDistancia < distancias[vizinho.rotulo]) {
                distancias[vizinho.rotulo] = novaDistancia;
                predecessores[vizinho.rotulo] = atual.rotulo;
                filaPrioridade.enfileirar(vizinho, novaDistancia);

                animacao.push({
                    tipo: 'ATUALIZAÇÃO', no: vizinho.rotulo, estrutura: getFilaStr(),
                    motivo: `Aresta analisada. Novo custo total para chegar aqui é ${novaDistancia}.`,
                    explicacao: 'O processo de Relaxamento. Se encontrar um caminho de custo inferior a um nó, atualizamos seu valor e o reposicionamos na Fila.',
                    destaque: { verticesVisitados: Object.keys(predecessores).filter(k => predecessores[k] !== null), arestasAtuais: [{ de: atual.rotulo, para: vizinho.rotulo }] }
                });
            } else {
                animacao.push({
                    tipo: 'DESCOBERTA', no: vizinho.rotulo, estrutura: getFilaStr(),
                    motivo: `Avaliando rota alternativa (custo tentado: ${novaDistancia}), mas não é melhor.`,
                    explicacao: 'O caminho através do nó atual não melhorou o custo que já conhecemos para este vizinho, então ignoramos esta via.',
                    destaque: { arestasAtuais: [{ de: atual.rotulo, para: vizinho.rotulo }] }
                });
            }
        }
    }

    // Reconstrói o caminho encontrado
    const caminho = reconstruirCaminho(predecessores, verticeFim.rotulo);
    animacao.push({
        tipo: 'FIM', no: verticeFim.rotulo, estrutura: getFilaStr(),
        motivo: `Busca encerrada com Custo Mínimo Final de: ${distancias[verticeFim.rotulo]}.`,
        explicacao: 'A garantia matemática do Dijkstra assegura que não existe rota mais barata possível entre a origem e este destino (desde que não existam pesos negativos).',
        destaque: { caminho: caminho }
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
    // Conjunto para rastrear os nós visitados na animação
    const nosVisitadosAnimacao = new Set([verticeInicio.rotulo]);

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

    const getFilaStr = () => filaPrioridade.elementos.map(e => `${e.elemento.rotulo}(f:${e.prioridade.toFixed(0)})`);

    animacao.push({
        tipo: 'INICIO', no: verticeInicio.rotulo, estrutura: getFilaStr(),
        motivo: `Avaliando heurística do Início ao Fim. F-Score inicial é ${fScore[verticeInicio.rotulo].toFixed(1)}.`,
        explicacao: 'O A* soma o custo real percorrido (G) com uma previsão de distância em linha reta até o alvo (Heurística H). F = G + H. Ele usa uma Fila de Prioridade ordenada pelo valor F.',
        destaque: { verticesVisitados: [verticeInicio.rotulo] }
    });

    // Loop principal do A*
    while (!filaPrioridade.estaVazia()) {
        // Remove o vértice com o menor fScore da fila
        const { elemento: atual } = filaPrioridade.desenfileirar();

        animacao.push({
            tipo: 'VISITA', no: atual.rotulo, estrutura: getFilaStr(),
            motivo: `Nó mais promissor retirado (G: ${gScore[atual.rotulo]}, F: ${fScore[atual.rotulo].toFixed(1)}).`,
            explicacao: 'O algoritmo A* orienta a busca em direção ao alvo com base em sua posição, priorizando caminhos que se aproximam do objetivo e descartando aqueles que se afastam dele.',
            destaque: { verticesAtuais: [atual.rotulo], verticesVisitados: Array.from(nosVisitadosAnimacao) }
        });

        // Se chegamos ao vértice de destino, reconstruímos o caminho
        if (atual === verticeFim) {
            const caminho = reconstruirCaminho(predecessores, verticeFim.rotulo);
            animacao.push({
                tipo: 'FIM', no: verticeFim.rotulo, estrutura: [],
                motivo: `Alvo atingido de forma otimizada. Custo real (G): ${gScore[verticeFim.rotulo]}.`,
                explicacao: 'Unindo a precisão do Dijkstra com o direcionamento da Busca Gulosa, o A* encontra o menor caminho avaliando uma quantidade menor de nós.',
                destaque: { caminho: caminho, verticesVisitados: Array.from(nosVisitadosAnimacao) }
            });
            return { animacao };
        }

        // Obtém os vizinhos do vértice atual com seus respectivos pesos
        const vizinhos = obterVizinhosComPesos(atual, arestas, custosArestas);
        // Para cada vizinho, calcula o gScore tentativo
        for (const { vizinho, peso } of vizinhos) {
            const gScoreTentativo = gScore[atual.rotulo] + peso;

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
                    tipo: 'ATUALIZAÇÃO', no: vizinho.rotulo, estrutura: getFilaStr(),
                    motivo: `Nova rota melhorada! G ajustado para ${gScoreTentativo}. A expectativa final (F) caiu para ${fScore[vizinho.rotulo].toFixed(1)}.`,
                    explicacao: 'Como esta via é melhor e está promissora na direção do alvo, atualizamos a projeção F e reordenamos o vizinho na fila.',
                    destaque: { verticesVisitados: Array.from(nosVisitadosAnimacao), arestasAtuais: [{ de: atual.rotulo, para: vizinho.rotulo }] }
                });
            } else {
                animacao.push({
                    tipo: 'DESCOBERTA', no: vizinho.rotulo, estrutura: getFilaStr(),
                    motivo: `Analisou aresta, mas o G (${gScoreTentativo}) é pior do que o caminho já conhecido.`,
                    explicacao: 'Mesmo guiado por coordenadas, respeitamos o peso. Este caminho desvia negativamente, então descartamos.',
                    destaque: { arestasAtuais: [{ de: atual.rotulo, para: vizinho.rotulo }] }
                });
            }
        }
    }

    // Se chegamos aqui, o vértice de fim não é alcançável
    animacao.push({
        tipo: 'FIM', no: null, estrutura: [],
        motivo: 'A fila prioritária se esgotou. Alvo inatingível.',
        explicacao: 'Apesar do forte direcionamento geográfico e matemático, não foi encontrada nenhuma ligação válida de arestas até o destino.',
        destaque: { verticesVisitados: Array.from(nosVisitadosAnimacao) }
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