document.addEventListener("DOMContentLoaded", () => {
  const MINIMO_PARTICIPANTES = 3;
  const registro = document.getElementById("registro-participante");
  const botonAbrir = document.getElementById("btn-agregar-participantes");
  const input = document.getElementById("nombre-participante");
  const lista = document.getElementById("lista-participantes");
  const listaVacia = document.getElementById("lista-vacia");
  const contador = document.getElementById("contador-participantes");
  const errorNombre = document.getElementById("error-participante");
  const errorMinimo = document.getElementById("error-minimo-participantes");
  const participantes = window.appIntercambio.participantes;

  function limpiarErrorNombre() {
    input.classList.remove("input-error");
    input.removeAttribute("aria-invalid");
    errorNombre.textContent = "";
  }

  function actualizarListado() {
    lista.replaceChildren();
    participantes.forEach((nombre) => {
      const elemento = document.createElement("li");
      elemento.textContent = nombre;
      lista.appendChild(elemento);
    });
    listaVacia.classList.toggle("oculto", participantes.length > 0);
    contador.textContent = `${participantes.length} participantes registrados. Mínimo: ${MINIMO_PARTICIPANTES}.`;
    if (participantes.length >= MINIMO_PARTICIPANTES) {
      errorMinimo.textContent = "";
    }
  }

  // Punto de integración con el botón del formulario del grupo.
  window.abrirModalParticipantes = function () {
    registro.classList.remove("oculto");
    botonAbrir.setAttribute("aria-expanded", "true");
    input.focus();
  };

  function agregarParticipante() {
    const nombre = input.value.trim();
    if (!nombre) {
      input.classList.add("input-error");
      input.setAttribute("aria-invalid", "true");
      errorNombre.textContent = "Ingresa el nombre del participante.";
      input.focus();
      return;
    }
    participantes.push(nombre);
    input.value = "";
    limpiarErrorNombre();
    actualizarListado();
    input.focus();
  }

  window.validarParticipantes = function () {
    if (participantes.length >= MINIMO_PARTICIPANTES) return true;
    errorMinimo.textContent = `Registra al menos ${MINIMO_PARTICIPANTES} participantes antes de continuar.`;
    window.abrirModalParticipantes();
    return false;
  };

  window.reiniciarParticipantes = function () {
    participantes.length = 0;
    input.value = "";
    limpiarErrorNombre();
    errorMinimo.textContent = "";
    registro.classList.add("oculto");
    botonAbrir.setAttribute("aria-expanded", "false");
    actualizarListado();
  };

  document.getElementById("btn-registrar-participante")
    .addEventListener("click", agregarParticipante);
  input.addEventListener("input", limpiarErrorNombre);
  input.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
      evento.preventDefault();
      agregarParticipante();
    }
  });
  actualizarListado();
});
