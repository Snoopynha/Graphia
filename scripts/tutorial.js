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
        titulo: "2. Conectando com Arestas Simples",
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
        alvo: "#animation-controls",
        titulo: "6. Controle de Animação",
        texto: "Controle a velocidade e navegue passo a passo pelos algoritmos de busca executados.",
        posicao: "left"
    },
    {
        alvo: "#code-output",
        titulo: "7. Estruturas e Código",
        texto: "Veja aqui o pseudocódigo do algoritmo ou a representação formal (matriz/lista) do seu grafo.",
        posicao: "left"
    },
    {
        alvo: "#btn-iniciar-tutorial",
        titulo: "Ajuda",
        texto: "Precisa relembrar algo? Clique aqui a qualquer momento para reiniciar este tour.",
        posicao: "bottom"
    },
    {
        alvo: "#btn-formulario",
        titulo: "Sua Opinião conta!",
        texto: "Acesse os formulários para avaliar a ferramenta. Seu feedback é fundamental para o meu TCC!",
        posicao: "bottom"
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

    const navbar = alvoEl.closest('nav');
    if (navbar) {
        navbar.classList.remove('z-50');
        navbar.classList.add('z-[9999]');
        estadoTutorial.navbarElevada = navbar;
    }
    if (alvoEl.tagName === 'I') {
        alvoEl.style.display = 'inline-block';
        alvoEl.classList.add('bg-white', 'rounded-lg', 'p-2', 'ring-4', 'ring-[#DAC2FF]');
        estadoTutorial.isIcone = true;
    } else {
        alvoEl.classList.add('ring-4', 'ring-[#DAC2FF]');
        estadoTutorial.isIcone = false;
    }

    alvoEl.classList.add('relative', 'z-[9999]', 'shadow-lg');
    alvoEl.style.pointerEvents = 'auto';
    
    const rect = alvoEl.getBoundingClientRect();
    const scrollY = window.scrollY;
    const larguraTooltip = 320;
    let topo = 0;
    let esquerda = 0;
    tooltip.style.transform = 'none'; // Reseta o transform do centro
    
    switch (passo.posicao) {
        case 'bottom':
            topo = rect.bottom + scrollY + 15;
            esquerda = rect.left + (rect.width / 2) - (larguraTooltip / 2);
            break;
        case 'right':
            topo = rect.top + scrollY;
            esquerda = rect.right + 15;
            break;
        case 'left':
            topo = rect.top + scrollY;
            esquerda = rect.left - larguraTooltip - 15;
            break;
        default:
            tooltip.style.top = '50%';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translate(-50%, -50%)';
    }

    const margemSeguranca = 20;
    const larguraJanela = window.innerWidth;

    if (esquerda < margemSeguranca) {
        esquerda = margemSeguranca;
    } else if (esquerda + larguraTooltip > larguraJanela - margemSeguranca) {
        esquerda = larguraJanela - larguraTooltip - margemSeguranca;
    }

    tooltip.style.top = `${topo}px`;
    tooltip.style.left = `${esquerda}px`;
}

function removerDestaqueAlvo() {
    if (estadoTutorial.alvoAtualDestacado) {
        const el = estadoTutorial.alvoAtualDestacado;
        
        // Remove as classes de destaque gerais
        el.classList.remove('relative', 'z-[9999]', 'shadow-lg', 'ring-4', 'ring-[#DAC2FF]');
        el.style.pointerEvents = '';
        
        // Remove as classes brancas apenas se for ícone (evita o bug de botões ficarem transparentes)
        if (estadoTutorial.isIcone) {
            el.classList.remove('bg-white', 'rounded-lg', 'p-2');
            el.style.display = ''; 
        }
        
        estadoTutorial.alvoAtualDestacado = null;
    }

    // Devolve a navbar para o seu lugar normal após o destaque do ícone terminar
    if (estadoTutorial.navbarElevada) {
        estadoTutorial.navbarElevada.classList.remove('z-[9999]');
        estadoTutorial.navbarElevada.classList.add('z-50');
        estadoTutorial.navbarElevada = null;
    }
}