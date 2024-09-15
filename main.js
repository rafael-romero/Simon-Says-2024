let numeroDeRondas = 0;
let jugadasPc = [];
let jugadasUsuario = [];
const colores = ["rojo", "verde", "azul", "amarillo"];
const $botones = document.querySelectorAll(".botones");
const $btnJugar = document.querySelector("#btn-jugar");

function habilitarBotones(botones) {
  botones.forEach((boton) => {
    boton.disabled = false;
  });
}

function deshabilitarBotones(botones) {
  botones.forEach((boton) => {
    boton.disabled = true;
  });
}

function colocarTextoEnElemento(elemento, texto, color) {
  const mensaje = document.querySelector(`#${elemento}`);
  mensaje.textContent = texto;
  mensaje.classList.remove("verde", "rojo", "amarillo", "naranja", "blanco");
  mensaje.classList.add(color);
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

function mostrarJugadasDePc(jugadasPc) {
  const unSegundo = 1000;
  jugadasPc.forEach((jugada, index) => {
    const tiempoDeLaJugadaPc = (index + 1) * unSegundo;
    setTimeout(accionarBoton, tiempoDeLaJugadaPc, jugada);
  });
}

function elegirNumeroRandom(colores) {
  const cantidadDeColores = colores.length;
  return Math.floor(Math.random() * cantidadDeColores);
}

function realizarJugadaPc(jugadasPc) {
  const numeroElegido = elegirNumeroRandom(colores);
  jugadasPc.push(colores[numeroElegido]);
}

function mostrarElemento(elemento) {
  document.querySelector(`#${elemento}`).classList.remove("oculto");
  document.querySelector(`#${elemento}`).classList.add("visible");
}

function desarrollarJuego() {
  numeroDeRondas++;
  const unSegundo = 1000;
  const textoTurnoDeLaPc = "TURNO DE LA PC";
  const textoProximoTurnoParaJugar = "ES SU TURNO DE JUGAR!!!";
  colocarTextoEnElemento(
    "numero-de-rondas",
    `RONDA NUMERO: ${numeroDeRondas}`,
    "blanco"
  );
  mostrarElemento("numero-de-rondas");
  colocarTextoEnElemento("estado", textoTurnoDeLaPc, "amarillo");
  realizarJugadaPc(jugadasPc);
  setTimeout(mostrarJugadasDePc, unSegundo, jugadasPc);
  jugadasUsuario = [];
  const tiempoDeJugarLaPc = (jugadasPc.length + 1.5) * unSegundo;
  setTimeout(() => {
    colocarTextoEnElemento("estado", textoProximoTurnoParaJugar, "verde");
    habilitarBotones($botones);
  }, tiempoDeJugarLaPc + unSegundo);
}

function reiniciarContadores() {
  jugadasPc = [];
  jugadasUsuario = [];
  numeroDeRondas = 0;
}

function ocultarElemento(elemento) {
  document.querySelector(`#${elemento}`).classList.remove("visible");
  document.querySelector(`#${elemento}`).classList.add("oculto");
}

function iniciarJuego() {
  const dosSegundos = 2000;
  const textoBienvenido = "BIENVENIDO, VAMOS A JUGAR!!!";
  reiniciarContadores();
  colocarTextoEnElemento("estado", textoBienvenido, "naranja");
  mostrarElemento("estado");
  setTimeout(desarrollarJuego, dosSegundos);
}

function reproducirSonido(elemento) {
  document.querySelector(`#${elemento}`).play();
}

$btnJugar.onclick = function () {
  deshabilitarBotones($botones);
  ocultarElemento("btn-jugar");
  reproducirSonido("sonido-comienzo-del-juego");
  iniciarJuego();
};

function habilitarJugarNuevamente(btnJugar) {
  const textoJugarNuevamente = "JUGAMOS NUEVAMENTE?";
  btnJugar.textContent = textoJugarNuevamente;
  mostrarElemento("btn-jugar");
  colocarTextoEnElemento("numero-de-rondas", "", "blanco");
}

function finalizarPartida() {
  const unSegundo = 1000;
  const textoPerdiste = "PERDISTE!!!";
  deshabilitarBotones($botones);
  reproducirSonido("sonido-perdedor");
  colocarTextoEnElemento("estado", textoPerdiste, "rojo");
  setTimeout(() => {
    ocultarElemento("numero-de-rondas");
    ocultarElemento("estado");
    habilitarJugarNuevamente($btnJugar);
  }, unSegundo);
  
}

function compararJugadas() {
  const unSegundo = 1000;
  for (let i = 0; i < jugadasUsuario.length; i++) {
    if (jugadasUsuario[i] !== jugadasPc[i]) {
      deshabilitarBotones($botones);
      return setTimeout(finalizarPartida, unSegundo);
    }
  }
  if (jugadasUsuario.length === jugadasPc.length) {
    deshabilitarBotones($botones);
    setTimeout(desarrollarJuego, unSegundo);
  }
}

$botones.forEach((boton) => {
  boton.addEventListener("click", (event) => {
    const idDelBotonSeleccionado = event.target.id;
    const color = idDelBotonSeleccionado.substring(4);
    jugadasUsuario.push(color);
    accionarBoton(color);
    compararJugadas();
  });
});

deshabilitarBotones($botones);
