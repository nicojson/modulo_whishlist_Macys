// Estado compartido entre captura, confirmación y visualización
window.appWishlist = window.appWishlist || {
  grupo: "",
  deseos: ["", "", ""],
  confirmado: false,
};

document.addEventListener("DOMContentLoaded", () => {
  const el = (id) => document.getElementById(id);
  const vistaGrupo = el("vista-crear-grupo");
  const vistaConfGrupo = el("vista-confirmacion");
  const vistaDeseos = el("vista-captura-deseos");
  const vistaConfDeseos = el("vista-confirmacion-deseos");
  const titulo = el("titulo-modulo-wishlist");
  const tabGrupo = el("tab-grupo");
  const tabWishlist = el("tab-wishlist");
  const form = el("form-capturar-deseos");
  const alerta = el("alerta-validacion-deseos");
  const contador = el("contador-deseos");
  const resumen = el("resumen-deseos-capturados");
  const contexto = el("contexto-grupo-wishlist");
  const campos = [1, 2, 3].map((n) => ({
    input: el(`deseo-${n}`),
    error: el(`error-deseo-${n}`),
    etiqueta: `Deseo ${n}`,
  }));

  // Muestra la vista del grupo o la de la wishlist
  function mostrarVista(esWishlist) {
    tabGrupo.classList.toggle("activa", !esWishlist);
    tabWishlist.classList.toggle("activa", esWishlist);
    titulo.classList.toggle("oculto", !esWishlist);
    vistaGrupo.classList.toggle("oculto", esWishlist);
    vistaConfGrupo.classList.add("oculto");
    vistaDeseos.classList.toggle("oculto", !esWishlist);
    vistaConfDeseos.classList.add("oculto");
  }

  // Carga el nombre del grupo si ya fue confirmado
  function cargarGrupo() {
    const texto = localStorage.getItem("grupoConfirmado");
    if (!texto) return;
    const grupo = JSON.parse(texto);
    window.appWishlist.grupo = grupo.nombreGrupo;
    contexto.textContent = `Grupo activo: ${grupo.nombreGrupo}`;
    contexto.classList.remove("oculto");
  }

  // Cuenta cuántos deseos ya tienen texto
  function actualizarContador() {
    const listos = campos.filter((c) => c.input.value.trim()).length;
    contador.textContent = `${listos} de 3 deseos completados`;
  }

  // Revisa que los tres deseos tengan texto
  function validar() {
    let faltan = 0;
    let primero = null;
    campos.forEach((c) => {
      const vacio = c.input.value.trim() === "";
      c.input.classList.toggle("input-error", vacio);
      c.error.textContent = vacio ? `- El ${c.etiqueta} es obligatorio.` : "";
      if (vacio) {
        faltan += 1;
        primero = primero || c.input;
      }
    });
    alerta.textContent = faltan
      ? `Faltan ${faltan} deseo(s) por completar antes de continuar.`
      : "";
    alerta.classList.toggle("oculto", faltan === 0);
    if (primero) primero.focus();
    return faltan === 0;
  }

  tabGrupo.addEventListener("click", () => mostrarVista(false));
  tabWishlist.addEventListener("click", () => {
    cargarGrupo();
    mostrarVista(true);
  });

  // Quita el error del campo cuando el usuario escribe
  campos.forEach((c) => {
    c.input.addEventListener("input", () => {
      if (c.input.value.trim()) {
        c.input.classList.remove("input-error");
        c.error.textContent = "";
      }
      alerta.classList.add("oculto");
      actualizarContador();
    });
  });

  // Limpia los tres campos y el borrador guardado
  el("btn-limpiar-deseos").addEventListener("click", () => {
    form.reset();
    campos.forEach((c) => {
      c.input.classList.remove("input-error");
      c.error.textContent = "";
    });
    alerta.classList.add("oculto");
    window.appWishlist.deseos = ["", "", ""];
    localStorage.removeItem("wishlistBorrador");
    actualizarContador();
    campos[0].input.focus();
  });

  // Guarda los deseos y abre la confirmación
  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    if (!validar()) return;

    const deseos = campos.map((c) => c.input.value.trim());
    window.appWishlist.deseos = deseos;
    localStorage.setItem("wishlistBorrador", JSON.stringify(window.appWishlist));

    if (typeof window.mostrarConfirmacionDeseos === "function") {
      window.mostrarConfirmacionDeseos(window.appWishlist);
      return;
    }

    resumen.replaceChildren();
    deseos.forEach((texto) => {
      const item = document.createElement("li");
      item.textContent = texto;
      resumen.appendChild(item);
    });
    vistaDeseos.classList.add("oculto");
    vistaConfDeseos.classList.remove("oculto");
  });

  // Regresa a editar los deseos sin borrarlos
  el("btn-regresar-captura-deseos").addEventListener("click", () => {
    vistaConfDeseos.classList.add("oculto");
    vistaDeseos.classList.remove("oculto");
  });

  cargarGrupo();
  actualizarContador();
});
