import { inicializarCanvas, desenharGrafo } from './renderizador.js';
import { tratarClique, mouseArrastado, mouseSolto, teclaPressionada } from './interacao.js';
import * as ui from './uiController.js';
import * as animacao from './animacao.js';

// --- Conecta o p5.js ---
window.setup = inicializarCanvas;
window.draw = desenharGrafo;
window.mousePressed = tratarClique;
window.mouseDragged = mouseArrastado;
window.mouseReleased = mouseSolto;
window.keyPressed = teclaPressionada;

// --- Conecta o HTML (botões) ao uiController ---
window.mostrarRepresentacao = ui.mostrarRepresentacao;
window.ativarModo = ui.ativarModo;
window.alternarModoEditar = ui.alternarModoEditar;
window.limparCores = ui.limparCores;
window.executarBusca = ui.executarBusca;
window.alternarBarraLateral = ui.alternarBarraLateral;

// --- Conecta o HTML (botões) ao animacao ---
window.proximoPasso = animacao.proximoPasso;
window.passoAnterior = animacao.passoAnterior;
window.alternarReproducao = animacao.alternarReproducao;
window.mudarVelocidadeAnimacao = animacao.mudarVelocidadeAnimacao;

console.log("Simulador de Grafos Modularizado e Iniciado!");