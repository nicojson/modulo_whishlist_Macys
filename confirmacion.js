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

  window.mostrarConfirmacion = function (datos) {
    // Coloca el nombre del grupo en el cuadro de solo lectura
    document.getElementById("error-guardar-grupo").textContent = "";
    campoNombre.value = datos.nombreGrupo;

    // Limpia la lista anterior y agrega cada participante como un elemento <li>
    listaParticipantes.innerHTML = "";
    for (let i = 0; i < datos.participantes.length; i++) {
      const li = document.createElement("li");
      li.textContent = datos.participantes[i];
      listaParticipantes.appendChild(li);
    }

    // Asegura que los botones Sí/No estén visibles.
    bloqueBotones.classList.remove("oculto");

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
    const error = document.getElementById("error-guardar-grupo");
    try {
      localStorage.setItem("grupoConfirmado", JSON.stringify(window.appIntercambio));
    } catch {
      error.textContent = "No se pudo guardar el grupo. Revisa el almacenamiento del navegador e intenta de nuevo.";
      return;
    }
    error.textContent = "";
    window.mostrarInicioGrupo();
  });

});
