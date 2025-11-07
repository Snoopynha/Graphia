// Objeto que constrói as variáveis
const estadoGlobal = {
    vertices: [],
    arestas: [],
    custosArestas: {},

    // Estado de Interação
    modoAtual: 'nenhum', // 'adicionarVertice', 'adicionarAresta', 'adicionarArestaNaoDirecionada, 'editar'
    verticeSelecionado: null,
    verticesSelecionados: [],
    arrastando: false,
    deslocamentoArrasto: [],

    // Estado da Animação
    animacaoBusca: [],
    passoAtualAnimacao: 0,
    reproduzindoAnimacao: false,
    intervaloReproducao: null,
    velocidadeAnimacao: 1000
};

export default estadoGlobal;