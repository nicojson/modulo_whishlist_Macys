// Integra el grupo confirmado, la captura de deseos y el resumen persistente.
document.addEventListener("DOMContentLoaded", () => {
  const vistas = ["vista-crear-grupo", "vista-confirmacion", "vista-inicio-grupo", "vista-deseos", "vista-final"];
  const selector = document.getElementById("usuario-deseos");
  const campos = [1, 2, 3].map((numero) => document.getElementById(`deseo-${numero}`));
  const error = document.getElementById("error-almacenamiento");
  const errorDeseos = document.getElementById("error-deseos");
  let grupoActual = null;

  function mostrarVista(id) {
    vistas.forEach((vista) => document.getElementById(vista).classList.toggle("oculto", vista !== id));
    const wishlistActiva = id === "vista-deseos" || id === "vista-final";
    document.getElementById("tab-grupo").classList.toggle("activa", !wishlistActiva);
    document.getElementById("tab-wishlist").classList.toggle("activa", wishlistActiva);
    document.getElementById("titulo-modulo-wishlist").classList.toggle("oculto", !wishlistActiva);
    const titulo = document.getElementById(id).querySelector("h1");
    titulo.setAttribute("tabindex", "-1");
    titulo.focus();
  }

  function avisar(mensaje) {
    error.textContent = mensaje;
    error.classList.toggle("oculto", !mensaje);
  }

  function leer(clave) {
    try {
      const texto = localStorage.getItem(clave);
      return texto === null ? null : JSON.parse(texto);
    } catch {
      avisar("No se pudieron leer los datos guardados. Puedes volver a registrarlos; revisa el almacenamiento del navegador si el problema continúa.");
      return null;
    }
  }

  function grupoValido(grupo) {
    return grupo && typeof grupo.nombreGrupo === "string" && grupo.nombreGrupo.trim() &&
      Array.isArray(grupo.participantes) && grupo.participantes.length >= 3 &&
      grupo.participantes.every((nombre) => typeof nombre === "string" && nombre.trim());
  }

  function deseosValidos(datos) {
    return datos && grupoActual && datos.nombreGrupo === grupoActual.nombreGrupo &&
      grupoActual.participantes.includes(datos.participante) &&
      Array.isArray(datos.deseos) && datos.deseos.length === 3 &&
      datos.deseos.every((deseo) => typeof deseo === "string" && deseo.trim() && deseo.length <= 300);
  }

  // La pantalla final siempre obtiene sus datos del almacenamiento, no del formulario.
  function mostrarFinal() {
    const datos = leer("wishlistUsuario");
    if (!deseosValidos(datos)) {
      avisar("No hay una lista válida de tres deseos para este grupo. Registra tus deseos de nuevo.");
      return false;
    }
    document.getElementById("grupo-final").textContent = `Grupo: ${datos.nombreGrupo}`;
    document.getElementById("usuario-final").textContent = `Participante: ${datos.participante}`;
    const lista = document.getElementById("lista-deseos-final");
    lista.replaceChildren();
    datos.deseos.forEach((deseo) => {
      const elemento = document.createElement("li");
      elemento.textContent = deseo;
      lista.appendChild(elemento);
    });
    selector.value = datos.participante;
    mostrarVista("vista-final");
    return true;
  }

  window.mostrarInicioGrupo = function () {
    const grupo = leer("grupoConfirmado");
    if (!grupoValido(grupo)) {
      avisar("No hay un grupo guardado válido. Crea y confirma un grupo para continuar.");
      mostrarVista("vista-crear-grupo");
      return;
    }
    grupoActual = grupo;
    const seleccionado = selector.value;
    selector.replaceChildren();
    grupo.participantes.forEach((nombre) => {
      const opcion = document.createElement("option");
      opcion.value = nombre;
      opcion.textContent = nombre;
      selector.appendChild(opcion);
    });
    if (grupo.participantes.includes(seleccionado)) selector.value = seleccionado;
    document.getElementById("nombre-grupo-inicio").textContent = grupo.nombreGrupo;
    mostrarVista("vista-inicio-grupo");
  };

  document.getElementById("btn-registrar-deseos").addEventListener("click", () => {
    const guardados = leer("wishlistUsuario");
    const propios = deseosValidos(guardados) && guardados.participante === selector.value;
    campos.forEach((campo, indice) => {
      campo.value = propios ? guardados.deseos[indice] : "";
      campo.removeAttribute("aria-invalid");
      campo.classList.remove("input-error");
    });
    errorDeseos.textContent = "";
    document.getElementById("contexto-deseos").textContent = `${selector.value} · ${grupoActual.nombreGrupo}. Escribe tus tres deseos en orden de preferencia.`;
    mostrarVista("vista-deseos");
    campos[0].focus();
  });

  document.getElementById("form-deseos").addEventListener("submit", (evento) => {
    evento.preventDefault();
    const deseos = campos.map((campo) => campo.value.trim());
    campos.forEach((campo, indice) => {
      const invalido = !deseos[indice] || deseos[indice].length > 300;
      campo.classList.toggle("input-error", invalido);
      campo.setAttribute("aria-invalid", String(invalido));
    });
    const primerInvalido = campos.find((campo) => campo.getAttribute("aria-invalid") === "true");
    if (primerInvalido) {
      errorDeseos.textContent = "Completa los tres deseos con un máximo de 300 caracteres por deseo.";
      primerInvalido.focus();
      return;
    }
    try {
      localStorage.setItem("wishlistUsuario", JSON.stringify({
        nombreGrupo: grupoActual.nombreGrupo,
        participante: selector.value,
        deseos,
      }));
    } catch {
      errorDeseos.textContent = "No se pudieron guardar tus deseos. Revisa el almacenamiento del navegador e intenta de nuevo.";
      return;
    }
    errorDeseos.textContent = "";
    avisar("");
    mostrarFinal();
  });

  document.getElementById("btn-volver-grupo").addEventListener("click", window.mostrarInicioGrupo);
  document.getElementById("btn-cancelar-deseos").addEventListener("click", window.mostrarInicioGrupo);
  document.getElementById("btn-crear-otro-grupo").addEventListener("click", () => {
    grupoActual = null;
    document.getElementById("btn-cancelar").click();
    mostrarVista("vista-crear-grupo");
  });

  document.getElementById("tab-grupo").addEventListener("click", () => {
    if (grupoActual) window.mostrarInicioGrupo();
    else mostrarVista("vista-crear-grupo");
  });
  document.getElementById("tab-wishlist").addEventListener("click", () => {
    if (!grupoActual) {
      avisar("Crea y confirma un grupo antes de registrar tus deseos.");
      return;
    }
    document.getElementById("btn-registrar-deseos").click();
  });

  // Restaura la pantalla final al recargar si existe una lista completa.
  const grupo = leer("grupoConfirmado");
  if (grupoValido(grupo)) {
    window.mostrarInicioGrupo();
    const deseos = leer("wishlistUsuario");
    if (deseosValidos(deseos)) mostrarFinal();
  } else if (grupo !== null) {
    avisar("Los datos del grupo guardado no son válidos. Crea y confirma un grupo para continuar.");
  }
});
