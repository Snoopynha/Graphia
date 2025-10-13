export let vertices = [];
export let arestas = [];
export let custosArestas = {};

// Estado de Interação
export let modoAtual = 'nenhum'; // 'adicionarVertice', 'adicionarAresta', 'adicionarArestaNaoDirecionada, 'editar'
export let verticeSelecionado = null;
export let verticesSelecionados = [];
export let arrastando = false;
export let deslocamentoArrasto = [];

// Estado da Animação
export let animacaoBusca = [];
export let passoAtualAnimacao = 0;
export let reproduzindoAnimacao = false;
export let intervaloReproducao = null;
export let velocidadeAnimacao = 1000;