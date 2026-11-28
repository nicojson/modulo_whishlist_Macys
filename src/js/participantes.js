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
  const botonRegistrar = document.getElementById("btn-registrar-participante");
  const botonCancelarEdicion = document.getElementById("btn-cancelar-edicion");
  let indiceEdicion = null;

  function terminarEdicion() {
    indiceEdicion = null;
    input.value = "";
    botonRegistrar.textContent = "Agregar";
    botonCancelarEdicion.classList.add("oculto");
    limpiarErrorNombre();
  }

  function limpiarErrorNombre() {
    input.classList.remove("input-error");
    input.removeAttribute("aria-invalid");
    errorNombre.textContent = "";
  }

  function actualizarListado() {
    lista.replaceChildren();
    participantes.forEach((nombre, indice) => {
      const elemento = document.createElement("li");
      elemento.classList.add("fila-participante");
      const texto = document.createElement("span");
      texto.textContent = nombre;
      const botonEditar = document.createElement("button");
      botonEditar.type = "button";
      botonEditar.className = "btn btn-azul";
      botonEditar.textContent = "Editar";
      botonEditar.setAttribute("aria-label", `Editar a ${nombre}`);
      botonEditar.addEventListener("click", () => {
        indiceEdicion = indice;
        input.value = participantes[indice];
        botonRegistrar.textContent = "Guardar cambio";
        botonCancelarEdicion.classList.remove("oculto");
        limpiarErrorNombre();
        window.abrirModalParticipantes();
        input.select();
      });
      const botonEliminar = document.createElement("button");
      botonEliminar.type = "button";
      botonEliminar.className = "btn btn-rojo";
      botonEliminar.textContent = "Eliminar";
      botonEliminar.setAttribute("aria-label", `Eliminar a ${nombre}`);
      botonEliminar.addEventListener("click", () => {
        participantes.splice(indice, 1);
        if (indiceEdicion === indice) {
          terminarEdicion();
        } else if (indiceEdicion !== null && indiceEdicion > indice) {
          indiceEdicion -= 1;
        }
        actualizarListado();
        const siguiente = lista.children[Math.min(indice, participantes.length - 1)];
        if (siguiente) {
          siguiente.querySelector(".btn-rojo").focus();
        } else {
          botonAbrir.focus();
        }
      });
      const acciones = document.createElement("div");
      acciones.className = "acciones-participante";
      acciones.append(botonEditar, botonEliminar);
      elemento.append(texto, acciones);
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
      return false;
    }
    if (indiceEdicion === null) {
      participantes.push(nombre);
    } else {
      participantes[indiceEdicion] = nombre;
    }
    terminarEdicion();
    actualizarListado();
    input.focus();
    return true;
  }

  window.validarParticipantes = function () {
    if (indiceEdicion !== null && !agregarParticipante()) return false;
    if (participantes.length >= MINIMO_PARTICIPANTES) return true;
    errorMinimo.textContent = `Registra al menos ${MINIMO_PARTICIPANTES} participantes antes de continuar.`;
    window.abrirModalParticipantes();
    return false;
  };

  window.reiniciarParticipantes = function () {
    participantes.length = 0;
    terminarEdicion();
    errorMinimo.textContent = "";
    registro.classList.add("oculto");
    botonAbrir.setAttribute("aria-expanded", "false");
    actualizarListado();
  };

  botonRegistrar.addEventListener("click", agregarParticipante);
  botonCancelarEdicion.addEventListener("click", () => {
    terminarEdicion();
    input.focus();
  });
  botonAbrir.addEventListener("click", terminarEdicion);
  input.addEventListener("input", limpiarErrorNombre);
  input.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
      evento.preventDefault();
      agregarParticipante();
    }
  });
  actualizarListado();
});
