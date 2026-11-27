// Muestra el resumen y permite volver a editar o confirmar el grupo.
document.addEventListener("DOMContentLoaded", () => {
  // 1. Referencias a las dos pantallas
  const vistaCrearGrupo = document.getElementById("vista-crear-grupo");
  const vistaConfirmacion = document.getElementById("vista-confirmacion");

  // 2. Referencias a los campos donde mostraremos el resumen
  const campoNombre = document.getElementById("confirmar-nombre");
  const listaParticipantes = document.getElementById("confirmar-participantes");

  // 3. Referencias a los botones y mensajes
  const bloqueBotones = document.getElementById("botones-confirmacion");
  const btnNo = document.getElementById("btn-no");
  const btnSi = document.getElementById("btn-si");
  const mensajeGuardado = document.getElementById("mensaje-guardado");
  const textoGuardado = document.getElementById("texto-guardado");
  const btnVolverInicio = document.getElementById("btn-volver-inicio");

  // Lee localStorage y muestra el último grupo confirmado.
  function mostrarGrupoDesdeStorage() {
    const panel = document.getElementById("panel-localstorage");
    const datoTexto = localStorage.getItem("grupoConfirmado");

    if (!datoTexto) {
      panel.classList.add("oculto");
      return;
    }

    const grupo = JSON.parse(datoTexto);
    panel.innerHTML = `
      <strong>Último grupo guardado en memoria (localStorage):</strong><br>
      <b>Grupo:</b> <span class="grupo-guardado-nombre"></span><br>
      <b>Participantes (<span class="grupo-guardado-total"></span>):</b>
      <span class="grupo-guardado-participantes"></span>
    `;
    // Inserta los datos como texto para conservar los nombres sin interpretar HTML.
    panel.querySelector(".grupo-guardado-nombre").textContent = grupo.nombreGrupo;
    panel.querySelector(".grupo-guardado-total").textContent = grupo.participantes.length;
    panel.querySelector(".grupo-guardado-participantes").textContent = grupo.participantes.join(", ");
    panel.classList.remove("oculto");
  }

  mostrarGrupoDesdeStorage();

  // Esta función la llama grupo.js cuando el usuario presiona "Guardar"
  window.mostrarConfirmacion = function (datos) {
    // Coloca el nombre del grupo en el cuadro de solo lectura
    campoNombre.value = datos.nombreGrupo;

    // Limpia la lista anterior y agrega cada participante como un elemento <li>
    listaParticipantes.innerHTML = "";
    for (let i = 0; i < datos.participantes.length; i++) {
      const li = document.createElement("li");
      li.textContent = datos.participantes[i];
      listaParticipantes.appendChild(li);
    }

    // Asegura que los botones Sí/No estén visibles y oculta el aviso de éxito
    bloqueBotones.classList.remove("oculto");
    mensajeGuardado.classList.add("oculto");

    // Cambia de pantalla: oculta el formulario y muestra la confirmación
    vistaCrearGrupo.classList.add("oculto");
    vistaConfirmacion.classList.remove("oculto");
  };

  // BOTÓN "NO": Cancela el guardado y regresa a editar sin borrar los datos
  btnNo.addEventListener("click", () => {
    vistaConfirmacion.classList.add("oculto");
    vistaCrearGrupo.classList.remove("oculto");
  });

  // BOTÓN "SÍ": Guarda el grupo definitivamente en localStorage
  btnSi.addEventListener("click", () => {
    // Guarda una copia confirmada en este navegador, incluso al cerrar la página.
    localStorage.setItem(
      "grupoConfirmado",
      JSON.stringify(window.appIntercambio),
    );
    mostrarGrupoDesdeStorage();

    bloqueBotones.classList.add("oculto");
    textoGuardado.textContent = `¡Listo! El grupo "${window.appIntercambio.nombreGrupo}" se guardó correctamente.`;
    mensajeGuardado.classList.remove("oculto");
  });

  // BOTÓN "CREAR OTRO GRUPO": Limpia el formulario y regresa al inicio
  btnVolverInicio.addEventListener("click", () => {
    document.getElementById("form-crear-grupo").reset();
    window.appIntercambio.nombreGrupo = "";
    window.reiniciarParticipantes();
    vistaConfirmacion.classList.add("oculto");
    vistaCrearGrupo.classList.remove("oculto");
  });
});
