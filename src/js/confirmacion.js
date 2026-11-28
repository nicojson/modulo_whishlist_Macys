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
  const mensajeGuardado = document.getElementById("mensaje-guardado");
  const textoGuardado = document.getElementById("texto-guardado");
  const btnVolverInicio = document.getElementById("btn-volver-inicio");

  // Esta función la llama grupo.js cuando el usuario presiona "guardar"
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

    // Asegura que los botones sí y no estén visibles y oculta el aviso de éxito
    bloqueBotones.classList.remove("oculto");
    mensajeGuardado.classList.add("oculto");

    // Cambia de pantalla: oculta el formulario y muestra la confirmación
    vistaCrearGrupo.classList.add("oculto");
    vistaConfirmacion.classList.remove("oculto");
  };

  // Botón "no": cancela el guardado y regresa a editar sin borrar los datos
  btnNo.addEventListener("click", () => {
    vistaConfirmacion.classList.add("oculto");
    vistaCrearGrupo.classList.remove("oculto");
  });

  // Botón "sí": guarda el grupo en localStorage y en PostgreSQL
  btnSi.addEventListener("click", async () => {
    const { nombreGrupo, participantes } = window.appIntercambio;

    localStorage.setItem(
      "grupoConfirmado",
      JSON.stringify(window.appIntercambio),
    );

    await window.apiIntercambio.guardarGrupo(nombreGrupo, participantes);

    bloqueBotones.classList.add("oculto");
    textoGuardado.textContent = `¡Listo! El grupo "${nombreGrupo}" se guardó correctamente.`;
    mensajeGuardado.classList.remove("oculto");
  });

  // Botón "crear otro grupo": limpia el formulario y regresa al inicio
  btnVolverInicio.addEventListener("click", () => {
    document.getElementById("form-crear-grupo").reset();
    window.appIntercambio.nombreGrupo = "";
    window.reiniciarParticipantes();
    vistaConfirmacion.classList.add("oculto");
    vistaCrearGrupo.classList.remove("oculto");
  });
});
