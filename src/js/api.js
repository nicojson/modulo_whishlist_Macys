const API_URL = "http://localhost:4000/api";

// Devuelve null si el backend no responde; el formulario conserva el respaldo local.
window.apiIntercambio = {
  async guardarGrupo(nombreGrupo, participantes) {
    try {
      const resp = await fetch(`${API_URL}/grupos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombreGrupo, participantes }),
      });
      if (!resp.ok) throw new Error("Error en servidor al guardar grupo");
      return await resp.json();
    } catch (error) {
      console.warn("Grupo guardado solo en este navegador:", error.message);
      return null;
    }
  },

  async guardarWishlist(deseos, participanteId, grupoId) {
    // No usar el ultimo grupo del servidor: podria pertenecer a otra persona.
    if (!grupoId || !participanteId) return null;
    try {
      const resp = await fetch(`${API_URL}/wishlists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grupoId, participanteId, deseos }),
      });
      if (!resp.ok) throw new Error("Error en servidor al guardar wishlist");
      return await resp.json();
    } catch (error) {
      console.warn("Deseos guardados solo en este navegador:", error.message);
      return null;
    }
  },
};
