import * as estado from './estado.js';

// nextStep() - grafo-editor.js
export function proximoPasso() {
    if (estado.passoAtualAnimacao < estado.animacaoBusca.length - 1) {
        estado.passoAtualAnimacao++;
        atualizarPassoAnimacao();
    }
}

// prevStep() - grafo-editor.js
export function passoAnterior() {
    if (estado.passoAtualAnimacao > 0) {
        estado.passoAtualAnimacao--;
        atualizarPassoAnimacao();
    }
}

// togglePlay() - grafo-editor.js
// TEM QUE ALTERAR
export function alternarReproducao() {
    const playButton = select('#animation-controls button:nth-child(3)');

    if (isPlaying) {
        // Pausar a animação
        playButton.html('<i class="fas fa-play"></i> Play');
        clearInterval(playInterval);
        isPlaying = false;
    } else {
        // Iniciar a animação
        playButton.html('<i class="fas fa-pause"></i> Pause');
        isPlaying = true;

        // Se já está no final, volta ao início
        if (passoAtualAnimacao >= animacaoBusca.length - 1) {
            passoAtualAnimacao = 0;
        }

        playInterval = setInterval(() => {
            if (passoAtualAnimacao < animacaoBusca.length - 1) {
                passoAtualAnimacao++;
                updateAnimation();
            } else {
                // Chegou ao final, para a animação
                togglePlay();
            }
        }, animationSpeed);
    }
}

// changeAnimationSpeed() - grafo-editor.js
export function mudarVelocidadeAnimacao() {
    animationSpeed = parseInt(estado.velocidadeAnimacao);
    if (estado.passoAtualAnimacao > 0) {
        // Se está rodando, reinicia com a nova velocidade
        alternarReproducao(); // Pausa
        alternarReproducao(); // Reinicia
    }
}

// updateAnimation() - grafo-editor.js
// TEM QUE ALTERAR
function atualizarPassoAnimacao() {
    if (animacaoBusca.length === 0) return;

    const currentStep = animacaoBusca[passoAtualAnimacao];

    // Primeiro, resetamos todas as cores
    vertices.forEach(v => {
        v.cor = null;
        v.texto = null;
    });

    arestas.forEach(a => {
        a.cor = null;
    });

    // Aplicamos as cores do passo atual
    if (currentStep.visitedVertices) {
        currentStep.visitedVertices.forEach(vLabel => {
            const v = vertices.find(vert => vert.label === vLabel);
            if (v) v.cor = '#60a5fa'; // Azul para visitados
        });
    }

    if (currentStep.currentVertices) {
        currentStep.currentVertices.forEach(vLabel => {
            const v = vertices.find(vert => vert.label === vLabel);
            if (v) {
                v.cor = '#f59e0b'; // Laranja para atual
                v.texto = currentStep.message || '';
            }
        });
    }

    if (currentStep.visitedEdges) {
        currentStep.visitedEdges.forEach(edge => {
            const a = arestas.find(a =>
                (a.de.label === edge.from && a.para.label === edge.to) ||
                (!a.direcionada && a.de.label === edge.to && a.para.label === edge.from)
            );
            if (a) a.cor = '#60a5fa'; // Azul para arestas visitadas
        });
    }

    if (currentStep.currentEdges) {
        currentStep.currentEdges.forEach(edge => {
            const a = arestas.find(a =>
                (a.de.label === edge.from && a.para.label === edge.to) ||
                (!a.direcionada && a.de.label === edge.to && a.para.label === edge.from)
            );
            if (a) a.cor = '#f59e0b'; // Laranja para aresta atual
        });
    }

    if (currentStep.path) {
        currentStep.path.forEach((vLabel, i) => {
            const v = vertices.find(vert => vert.label === vLabel);
            if (v) v.cor = '#10b981'; // Verde para caminho

            if (i > 0) {
                const from = currentStep.path[i - 1];
                const to = vLabel;
                const a = arestas.find(a =>
                    (a.de.label === from && a.para.label === to) ||
                    (!a.direcionada && a.de.label === to && a.para.label === from)
                );
                if (a) a.cor = '#10b981'; // Verde para arestas do caminho
            }
        });
    }

    // Atualiza o texto de saída
    const outputArea = select('#code-output');
    let outputText = `<strong>${currentStep.message || ''}</strong>`;
    if (currentStep.details) {
        outputText += `<div class="mt-2 text-sm text-gray-700">${currentStep.details}</div>`;
    }
    outputArea.html(outputText);

    // Destaca a linha de código atual
    if (currentStep.codeStep) {
        selectAll('.code-line').forEach(line => {
            const lineNum = parseInt(line.elt.getAttribute('data-line'));
            line.style('background-color', lineNum === currentStep.codeStep ? '#fef08a' : 'transparent');
            line.style('font-weight', lineNum === currentStep.codeStep ? 'bold' : 'normal');
        });
    }
}