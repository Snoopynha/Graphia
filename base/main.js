import { inicializarCanvas, desenharGrafo } from './renderizador.js';
import { tratarClique, mouseArrastado, teclaPressionada } from './interacao.js';
import * as uiController from './uiController.js';
import * as animacao from './animacao.js';

// Conecta as funções do p5.js ao nosso código modular
window.setup = inicializarCanvas;
window.draw = desenharGrafo;
window.mousePressed = tratarClique;
window.mouseDragged = mouseArrastado;
window.keyPressed = teclaPressionada;

// Expõe as funções de UI e Animação para serem chamadas pelo HTML (onclick, onchange)
window.mostrarRepresentacao = uiController.mostrarRepresentacao;
window.ativarModoAdicionarVertice = uiController.ativarModoAdicionarVertice;
window.ativarModoAdicionarArestaDirecionada = uiController.ativarModoAdicionarArestaDirecionada;
window.ativarModoAdicionarArestaNDirecionada = uiController.ativarModoAdicionarArestaNDirecionada;
window.ativarModoEditor = uiController.ativarModoEditor;
window.limparCores = uiController.limparCores;
window.executarBusca = uiController.executarBusca;
window.toggleSidebar = uiController.toggleSidebar;

window.proximoPasso = animacao.proximoPasso;
window.passoAnterior = animacao.passoAnterior;
window.alternarReproducao = animacao.alternarReproducao;
window.mudarVelocidadeAnimacao = animacao.mudarVelocidadeAnimacao;

console.log("Simulador de Grafos Modularizado e Iniciado!");