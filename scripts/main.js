import { iniciarTutorialGuiado, encerrarTutorial, proximoPassoTutorial, passoAnteriorTutorial } from './tutorial.js';
import { inicializarCanvas, desenharGrafo } from './renderizador.js';
import { tratarClique, mouseArrastado, mouseSolto, teclaPressionada } from './interacao.js';
import * as ui from './uiController.js';
import * as animacao from './animacao.js';

// Assim que a página carregar
document.addEventListener('DOMContentLoaded', () => {
    const jaFezTutorial = localStorage.getItem("graphia_tutorial_concluido");

    if(!jaFezTutorial){
        setTimeout(() => {
            iniciarTutorialGuiado();
            localStorage.setItem('graphia_tutorial_concluido', 'true');
        }, 500);
    }
});

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

// --- Conecta o HTML (botões do Tutorial) ao JS ---
window.iniciarTutorialGuiado = iniciarTutorialGuiado;
window.encerrarTutorial = encerrarTutorial;
window.proximoPassoTutorial = proximoPassoTutorial;
window.passoAnteriorTutorial = passoAnteriorTutorial;

console.log("Simulador de Grafos Modularizado e Iniciado!");