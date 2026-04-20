import { ativarModo, alternarBarraLateral } from './uiController.js';

const estadoTutorial = {
    ativo: false,
    passoAtual: 0,
    alvoAtualDestacado: null,
};

// Definição do fluxo passo a passo
const etapas = [
    {
        alvo: null,
        titulo: "Bem-vindo ao Graphia!",
        texto: "Este é o seu simulador interativo de grafos. Vamos fazer um tour rápido para você aprender a construir e analisar estruturas de dados visuais.",
        posicao: "centro",
        acaoPre: () => ativarModo('nenhum')
    },
    {
        alvo: "#btn-vertice",
        titulo: "1. Adicionando Vértices",
        texto: "Clique neste botão para ativar o modo de criação. Depois, basta clicar em qualquer lugar da área pontilhada (Canvas) para criar um novo nó (Vértice).",
        posicao: "bottom",
        acaoPre: () => ativarModo('adicionarVertice')
    },
    {
        alvo: "#btn-aresta-ndir",
        titulo: "2. Conectando com Arestas",
        texto: "Para criar uma ligação simples (Aresta não direcionada), ative este modo. E clique nos vértice dois vértices que você quer que tenham uma ligação.",
        posicao: "bottom",
        acaoPre: () => ativarModo('adicionarArestaNaoDirecionada')
    },
    {
        alvo: "#btn-aresta-dir",
        titulo: "2.1 Conectando com Arestas direcionadas",
        texto: "Para criar uma ligação com direção (Aresta direcionada), ative este modo. Clique primeiro no vértice de ORIGEM e depois no vértice de DESTINO.",
        posicao: "bottom",
        acaoPre: () => ativarModo('adicionarArestaDirecionada')
    },
    {
        alvo: "#botaoEditar",
        titulo: "3. Edição e Pesos",
        texto: "O modo Editar é o mais poderoso:\n• Clique num vértice para MOVER.\n• Segure SHIFT para selecionar VÁRIOS.\n• Aperte DELETE para apagar.\n• Clique numa ARESTA para mudar seu PESO.",
        posicao: "bottom",
        acaoPre: () => ativarModo('editar')
    },
    {
        alvo: "#botaoLimpar",
        titulo: "4. Limpando a Bagunça",
        texto: "Após rodar algoritmos, o grafo ficará colorido (visitados, caminhos). Use este botão para apagar as cores e resetar o simulador, mantendo a estrutura intacta.",
        posicao: "bottom"
    },
    {
        alvo: "#sidebar",
        titulo: "5. Representações e Algoritmos",
        texto: "Na barra lateral esquerda, você pode visualizar como o computador entende o grafo (Matrizes e Listas) e executar as famosas buscas (BFS, DFS, Dijkstra, A*).",
        posicao: "right",
        acaoPre: () => {
            const sidebar = document.getElementById("sidebar");
            if (sidebar.classList.contains("w-0")) alternarBarraLateral();
        }
    },
    {
        alvo: null,
        titulo: "Tudo pronto!",
        texto: "Agora é com você. Experimente desenhar um grafo, colocar pesos diferentes e rodar o Dijkstra para ver a mágica acontecer.",
        posicao: "centro",
        acaoPre: () => ativarModo('nenhum')
    }
];

export function iniciarTutorialGuiado() {
    estadoTutorial.ativo = true;
    estadoTutorial.passoAtual = 0;
    
    document.getElementById('tutorial-overlay').classList.remove('hidden');
    document.getElementById('tutorial-tooltip').classList.remove('hidden');
    
    renderizarPassoAtual();
}

export function encerrarTutorial() {
    estadoTutorial.ativo = false;
    document.getElementById('tutorial-overlay').classList.add('hidden');
    document.getElementById('tutorial-tooltip').classList.add('hidden');
    removerDestaqueAlvo();
    ativarModo('nenhum');
}

export function proximoPassoTutorial() {
    if (estadoTutorial.passoAtual < etapas.length - 1) {
        estadoTutorial.passoAtual++;
        renderizarPassoAtual();
    } else {
        encerrarTutorial();
    }
}

export function passoAnteriorTutorial() {
    if (estadoTutorial.passoAtual > 0) {
        estadoTutorial.passoAtual--;
        renderizarPassoAtual();
    }
}

function renderizarPassoAtual() {
    const passo = etapas[estadoTutorial.passoAtual];
    
    // Atualiza Textos
    document.getElementById('tutorial-titulo').innerText = passo.titulo;
    document.getElementById('tutorial-texto').innerText = passo.texto;
    document.getElementById('tutorial-contador').innerText = `${estadoTutorial.passoAtual + 1}/${etapas.length}`;
    
    // Atualiza Botões
    const btnProx = document.getElementById('tutorial-btn-proximo');
    btnProx.innerText = estadoTutorial.passoAtual === etapas.length - 1 ? 'Finalizar' : 'Próximo';
    
    const btnVoltar = document.getElementById('tutorial-btn-voltar');
    btnVoltar.style.display = estadoTutorial.passoAtual === 0 ? 'none' : 'block';

    // Executa a ação preparatória do passo (ex: ativar botão)
    if (passo.acaoPre) passo.acaoPre();

    // Adiciona destaque
    removerDestaqueAlvo();
    posicionarTooltip(passo);
}

function posicionarTooltip(passo) {
    const tooltip = document.getElementById('tutorial-tooltip');
    
    if (!passo.alvo) {
        // Centraliza na tela
        tooltip.style.top = '50%';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translate(-50%, -50%)';
        return;
    }

    const alvoEl = document.querySelector(passo.alvo);
    if (!alvoEl) return;

    estadoTutorial.alvoAtualDestacado = alvoEl;
    alvoEl.classList.add('relative', 'z-[9999]', 'shadow-lg');
    alvoEl.style.pointerEvents = 'auto';
    
    const rect = alvoEl.getBoundingClientRect();
    tooltip.style.transform = 'none'; // Reseta o transform do centro
    
    if (passo.posicao === 'bottom') {
        tooltip.style.top = `${rect.bottom + 15}px`;
        tooltip.style.left = `${rect.left + (rect.width / 2) - 160}px`;
    } else if (passo.posicao === 'right') {
        tooltip.style.top = `${rect.top + 20}px`;
        tooltip.style.left = `${rect.right + 15}px`;
    }
}

function removerDestaqueAlvo() {
    if (estadoTutorial.alvoAtualDestacado) {
        estadoTutorial.alvoAtualDestacado.classList.remove('relative', 'z-[9999]', 'shadow-lg');
        estadoTutorial.alvoAtualDestacado.style.pointerEvents = '';
        estadoTutorial.alvoAtualDestacado = null;
    }
}