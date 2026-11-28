// Muestra el resumen y permite volver a editar o confirmar el grupo.
document.addEventListener("DOMContentLoaded", () => {
  // Referencias a las dos pantallas
  const vistaCrearGrupo = document.getElementById("vista-crear-grupo");
  const vistaConfirmacion = document.getElementById("vista-confirmacion");

  // Referencias a los campos donde mostraremos el resumen
  const campoNombre = document.getElementById("confirmar-nombre");
  const listaParticipantes = document.getElementById("confirmar-participantes");

  // Referencias a los botones y mensajes
  const bloqueBotones = document.getElementById("botones-confirmacion");
  const btnNo = document.getElementById("btn-no");
  const btnSi = document.getElementById("btn-si");

  // Esta función la llama grupo.js cuando el usuario presiona "Guardar"
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

    // Asegura que los botones Sí/No estén visibles y oculta el aviso de éxito
    bloqueBotones.classList.remove("oculto");

    // Cambia de pantalla: oculta el formulario y muestra la confirmación
    vistaCrearGrupo.classList.add("oculto");
    vistaConfirmacion.classList.remove("oculto");
  };

  // Botón "no": cancela el guardado y regresa a editar sin borrar los datos
  btnNo.addEventListener("click", () => {
    vistaConfirmacion.classList.add("oculto");
    vistaCrearGrupo.classList.remove("oculto");
  });

  // BOTÓN "SÍ": Guarda el grupo definitivamente en localStorage
  btnSi.addEventListener("click", () => {
    localStorage.setItem(
      "grupoConfirmado",
      JSON.stringify(window.appIntercambio),
    );

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
