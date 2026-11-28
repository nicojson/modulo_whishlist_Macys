const API_URL = "http://localhost:4000/api";

window.apiIntercambio = {
  async guardarGrupo(nombreGrupo, participantes) {
    try {
      const resp = await fetch(`${API_URL}/grupos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombreGrupo, participantes }),
      });
      if (!resp.ok) throw new Error("Error en servidor al guardar grupo");
      const grupoDB = await resp.json();

      localStorage.setItem(
        "grupoConfirmado",
        JSON.stringify({
          grupo_id: grupoDB.grupo_id,
          nombreGrupo: grupoDB.nombre,
          participantes: grupoDB.participantes,
        }),
      );
      return grupoDB;
    } catch (error) {
      console.warn(
        "Backend no disponible, guardando solo en localStorage:",
        error.message,
      );
      return null;
    }
  },

  async guardarWishlist(deseos, participanteId = null) {
    try {
      let grupoGuardado = JSON.parse(
        localStorage.getItem("grupoConfirmado") || "null",
      );

      if (!grupoGuardado?.grupo_id) {
        const respGrupo = await fetch(`${API_URL}/grupos/actual`);
        const grupoDB = await respGrupo.json();
        if (!grupoDB)
          throw new Error("No hay ningún grupo registrado en PostgreSQL.");
        grupoGuardado = grupoDB;
      }

      const resp = await fetch(`${API_URL}/wishlists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grupoId: grupoGuardado.grupo_id,
          participanteId,
          deseos,
        }),
      });
      if (!resp.ok) throw new Error("Error en servidor al guardar wishlist");
      return await resp.json();
    } catch (error) {
      console.warn(
        "Backend no disponible, guardando solo en localStorage:",
        error.message,
      );
      return null;
    }
  },
};
