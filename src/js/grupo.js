// Estado compartido entre los módulos de grupo, participantes y confirmación
window.appIntercambio = window.appIntercambio || {
  nombreGrupo: "",
  participantes: [],
};

// Espera a que exista el formulario antes de conectar sus controles.
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-crear-grupo");
  const inputNombre = document.getElementById("nombre-grupo");
  const mensajeObligatorio = document.getElementById("mensaje-obligatorio");
  const btnCancelar = document.getElementById("btn-cancelar");
  const btnAgregarParticipantes = document.getElementById(
    "btn-agregar-participantes",
  );
  const bannerEnvio = document.getElementById("banner-envio");

  // Valida que el nombre del grupo no esté vacío
  function validarNombreGrupo() {
    const valor = inputNombre.value.trim();

    if (valor === "") {
      inputNombre.classList.add("input-error");
      mensajeObligatorio.textContent =
        "* Campo obligatorio: Ingrese el nombre del grupo para continuar.";
      inputNombre.focus();
      return false;
    }

    inputNombre.classList.remove("input-error");
    mensajeObligatorio.textContent = "* Campo obligatorio";
    return true;
  }

  // Quita el estado de error en cuanto el usuario empieza a escribir
  inputNombre.addEventListener("input", () => {
    if (inputNombre.value.trim() !== "") {
      inputNombre.classList.remove("input-error");
      mensajeObligatorio.textContent = "* Campo obligatorio";
    }
  });

  // Botón "agregar participantes" (punto de enlace con el registro)
  btnAgregarParticipantes.addEventListener("click", () => {
    if (typeof window.abrirModalParticipantes === "function") {
      window.abrirModalParticipantes();
    } else {
      alert(
        "Módulo de registro de participantes (en integración con BR y AE).",
      );
    }
  });

  // Botón "cancelar": limpia el formulario y reinicia el estado
  btnCancelar.addEventListener("click", () => {
    form.reset();
    inputNombre.classList.remove("input-error");
    mensajeObligatorio.textContent = "* Campo obligatorio";
    bannerEnvio.classList.add("oculto");
    window.appIntercambio.nombreGrupo = "";
    window.reiniciarParticipantes();
  });

  // Botón "guardar": valida, captura y envía los datos a confirmación
  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if (!validarNombreGrupo()) {
      return;
    }

    if (!window.validarParticipantes()) {
      return;
    }

    const nombreCapturado = inputNombre.value.trim();
    window.appIntercambio.nombreGrupo = nombreCapturado;
    localStorage.setItem(
      "datosGrupoIntercambio",
      JSON.stringify(window.appIntercambio),
    );

    // Si el módulo de confirmación (AF, CL) ya está conectado, lo abre; si no, muestra evidencia de envío
    if (typeof window.mostrarConfirmacion === "function") {
      window.mostrarConfirmacion(window.appIntercambio);
    } else {
      bannerEnvio.innerHTML = `
        <strong>Datos listos y enviados a Confirmación (S/N):</strong><br>
        • <b>Grupo:</b> ${window.appIntercambio.nombreGrupo}<br>
        • <b>Participantes:</b> ${window.appIntercambio.participantes.join(", ")}
      `;
      bannerEnvio.classList.remove("oculto");
    }
  });
});
