import estado from './estado.js';

/**
 * Avança para o próximo passo da animação da busca.
 */
// Antigo nextStep() - grafo-editor.js
export function proximoPasso() {
    if (estado.passoAtualAnimacao < estado.animacaoBusca.length - 1) {
        estado.passoAtualAnimacao++;
        atualizarPassoAnimacao();
    }
}

/**
 * Retorna para o passo anterior da animação da busca.
 */
// Antigo prevStep() - grafo-editor.js
export function passoAnterior() {
    if (estado.passoAtualAnimacao > 0) {
        estado.passoAtualAnimacao--;
        atualizarPassoAnimacao();
    }
}

/**
 * Inicia ou pausa a reprodução automática da animação.
 */
// Antigo togglePlay() - grafo-editor.js
export function alternarReproducao() {
    const btnPlay = document.querySelector('#animation-controls button:nth-child(3)');
    const btnAnterior = document.querySelector('#animation-controls button:nth-child(1)');
    const btnProximo = document.querySelector('#animation-controls button:nth-child(2)');

    // Se está no meio de uma reprodução
    if (estado.reproduzindoAnimacao) {
        // Para o looping
        clearInterval(estado.intervaloReproducao);
        estado.reproduzindoAnimacao = false;

        // Atualiza a UI
        btnPlay.innerHTML = '<i class="fas fa-play"></i> Play';
        // Reabilita os botões
        btnAnterior.disabled = false;
        btnProximo.disabled = false;
    } else {
        // Começa a animação
        estado.reproduzindoAnimacao = true;

        // Se a animação já terminou, reinicia do começo
        if (estado.passoAtualAnimacao >= estado.animacaoBusca.length - 1) {
            estado.passoAtualAnimacao = 0;
            atualizarPassoAnimacao();
        }

        // Atualiza a UI
        btnPlay.innerHTML = '<i class="fas fa-pause"></i> Pause';
        btnAnterior.disabled = true;
        btnProximo.disabled = true;

        // Cria o loop que avança os passos
        estado.intervaloReproducao = setInterval(() => {
            if (estado.passoAtualAnimacao < estado.animacaoBusca.length - 1) {
                proximoPasso();
            } else {
                alternarReproducao();
            }
        }, estado.velocidadeAnimacao);
    }
}

/**
 * Altera a velocidade da reprodução automática.
 * @param {string} novaVelocidade - O novo valor de velocidade em milissegundos.
 */
// Antigo changeAnimationSpeed() - grafo-editor.js
export function mudarVelocidadeAnimacao(novaVelocidade) {
    estado.velocidadeAnimacao = parseInt(novaVelocidade);
    if (estado.reproduzindoAnimacao) {
        // Se está rodando a animação, reinicia com a nova velocidade
        alternarReproducao(); // Pausa
        alternarReproducao(); // Reinicia com nova velocidade
    }
}

/**
 * Atualiza o estado visual do grafo (cores, textos) com base no passo atual da animação.
 * Esta função é o coração do feedback visual das buscas.
 */
// Antigo updateAnimation() - grafo-editor.js
export function atualizarPassoAnimacao() {
    // Reseta cores e textos
    estado.vertices.forEach(v => {
        v.cor = null;
        v.texto = null;
    });

    estado.arestas.forEach(a => {
        a.cor = null;
    });

    // Se não houver passos, não faz nada
    if (estado.animacaoBusca.length === 0) return;

    const passoAtual = estado.animacaoBusca[estado.passoAtualAnimacao];

    // Pinta os vertices ja visitados de azul e os atuais de laranja
    if (passoAtual.verticesVisitados) {
        passoAtual.verticesVisitados.forEach(rotulo => {
            const v = estado.vertices.find(vert => vert.rotulo === rotulo);
            if (v) v.cor = '#60a5fa'; // Azul para vertices visitados
        });
    }

    if (passoAtual.verticesAtuais) {
        passoAtual.verticesAtuais.forEach(rotulo => {
            const v = estado.vertices.find(vert => vert.rotulo === rotulo);
            if (v) {
                v.cor = '#f59e0b'; // Laranja para vertices atuais
                v.texto = passoAtual.mensagem || '';
            }
        });
    }

    // Pinta as arestas visitadas de azul e a atual de laranja
    if (passoAtual.arestasVisitadas) {
        passoAtual.arestasVisitadas.forEach(arestaInfo => {
            const a = estado.arestas.find(a =>
                (a.de.rotulo === arestaInfo.de && a.para.rotulo === arestaInfo.para) ||
                (!a.direcionada && a.de.rotulo === arestaInfo.para && a.para.rotulo === arestaInfo.de)
            );
            if (a) a.cor = '#60a5fa'; // Azul para arestas visitadas
        });
    }

    if (passoAtual.arestasAtuais) {
        passoAtual.arestasAtuais.forEach(arestaInfo => {
            const a = estado.arestas.find(a =>
                (a.de.rotulo === arestaInfo.de && a.para.rotulo === arestaInfo.para) ||
                (!a.direcionada && a.de.rotulo === arestaInfo.para && a.para.rotulo === arestaInfo.de)
            );
            if (a) a.cor = '#f59e0b'; // Laranja para arestas atuais
        });
    }

    // Destaca o caminho encontrado
    if (passoAtual.caminho) {
        for (let i = 0; i < passoAtual.caminho.length; i++) {
            const rotulo = passoAtual.caminho[i];
            const v = estado.vertices.find(vert => vert.rotulo === rotulo);
            if (v) v.cor = '#10b981';

            if (i > 0) {
                const rotuloAnterior = passoAtual.caminho[i - 1];
                const a = estado.arestas.find(a =>
                    (a.de.rotulo === rotuloAnterior && a.para.rotulo === rotulo) ||
                    (!a.direcionada && a.de.rotulo === rotulo && a.para.rotulo === rotuloAnterior)
                );
                if (a) a.cor = '#10b981';
            }
        }
    }

    // Atualiza o painel de descrição com a mensagem do passo atual
    const areaDescricao = document.getElementById('descricao-output');
    if (areaDescricao) {
        areaDescricao.textContent = passoAtual.mensagem || '';
    }
}