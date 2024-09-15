let numeroDeRondas = 0;
let jugadasPc = [];
let jugadasUsuario = [];
const colores = ["rojo", "verde", "azul", "amarillo"];

function habilitarBotones() {
  $botones.forEach((boton) => {
    boton.disabled = false;
  });
}

function deshabilitarBotones() {
  $botones.forEach((boton) => {
    boton.disabled = true;
  });
}

function colocarTextoEnElemento(elemento, texto) {
  document.querySelector(`#${elemento}`).textContent = texto;
}

function accionarBoton(colorElegido) {
  const medioSegundo = 500;
  const $boton = document.querySelector(`#btn-${colorElegido}`);
  $boton.style.transform = "scale(1.2)";
  setTimeout(() => {
    $boton.style.transform = "scale(1)";
  }, medioSegundo);

  const sonidoDelBoton = document.querySelector(`#sonido-btn-${colorElegido}`);
  if (sonidoDelBoton.paused) {
    sonidoDelBoton.play();
  } else {
    sonidoDelBoton.pause();
    sonidoDelBoton.currentTime = 0;
    sonidoDelBoton.play();
  }
}

function mostrarJugadasDePc() {
  const unSegundo = 1000;
  jugadasPc.forEach((jugada, index) => {
    const tiempoDeLaJugadaPc = (index + 1) * unSegundo;
    setTimeout(accionarBoton, tiempoDeLaJugadaPc, jugada);
  });
}

function elegirNumeroRandom() {
  const cantidadDeColores = colores.length;
  return Math.floor(Math.random() * cantidadDeColores);
}

function realizarJugadaPc() {
  const numeroElegido = elegirNumeroRandom();
  jugadasPc.push(colores[numeroElegido]);
}

function desarrollarJuego() {
  numeroDeRondas++;
  colocarTextoEnElemento("numero-de-rondas", `RONDA NUMERO: ${numeroDeRondas}`);
  const unSegundo = 1000;
  const textoTurnoDeLaPc = "TURNO DE LA PC";
  const textoProximoTurnoParaJugar = "ES SU TURNO DE JUGAR!!!";
  colocarTextoEnElemento("estado", textoTurnoDeLaPc);
  realizarJugadaPc();
  setTimeout(mostrarJugadasDePc(), unSegundo);
  jugadasUsuario = [];
  const tiempoDeJugarLaPc = (jugadasPc.length + 1.5) * unSegundo;
  setTimeout(() => {
    colocarTextoEnElemento("estado", textoProximoTurnoParaJugar);
    habilitarBotones();
  }, tiempoDeJugarLaPc + unSegundo);
}

function reiniciarContadores() {
  jugadasPc = [];
  jugadasUsuario = [];
  numeroDeRondas = 0;
}

function iniciarJuego() {
  const dosSegundos = 2000;
  const textoBienvenido = "BIENVENIDO, VAMOS A JUGAR!!!";
  reiniciarContadores();
  colocarTextoEnElemento("estado", textoBienvenido);
  setTimeout(desarrollarJuego, dosSegundos);
}

function ocultarElemento(elemento) {
  document.querySelector(`#${elemento}`).classList.remove("visible");
  document.querySelector(`#${elemento}`).classList.add("oculto");
}

function mostrarElemento(elemento) {
  document.querySelector(`#${elemento}`).classList.remove("oculto");
  document.querySelector(`#${elemento}`).classList.add("visible");
}

const $btnJugar = document.querySelector("#btn-jugar");
$btnJugar.onclick = function () {
  const unSegundo = 1000;
  deshabilitarBotones();
  mostrarElemento("numero-de-rondas");
  mostrarElemento("estado");
  ocultarElemento("btn-jugar");
  document.querySelector("#sonido-comienzo-del-juego").play();
  iniciarJuego();
};

function habilitarJugarNuevamente() {
  const textoJugarNuevamente = "JUGAMOS NUEVAMENTE?";
  $btnJugar.textContent = textoJugarNuevamente;
  mostrarElemento("btn-jugar");
}

function finalizarPartida() {
  const unSegundo = 1000;
  const textoPerdiste = "PERDISTE!!!";
  deshabilitarBotones();
  colocarTextoEnElemento("estado", textoPerdiste);
  setTimeout(habilitarJugarNuevamente, unSegundo);
  document.querySelector("#sonido-perdedor").play();
}

function compararJugadas() {
  const unSegundo = 1000;
  for (let i = 0; i < jugadasUsuario.length; i++) {
    if (jugadasUsuario[i] !== jugadasPc[i]) {
      deshabilitarBotones();
      return setTimeout(finalizarPartida, unSegundo);
    }
  }
  if (jugadasUsuario.length === jugadasPc.length) {
    deshabilitarBotones();
    setTimeout(desarrollarJuego, unSegundo);
  }
}

const $botones = document.querySelectorAll(".botones");
$botones.forEach((boton) => {
  boton.addEventListener("click", (event) => {
    const idDelBotonSeleccionado = event.target.id;
    const color = idDelBotonSeleccionado.substring(4);
    jugadasUsuario.push(color);
    accionarBoton(color);
    compararJugadas();
  });
});
