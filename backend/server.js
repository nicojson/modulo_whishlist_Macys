const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// Guardar grupo y participantes en transacción
app.post("/api/grupos", async (req, res) => {
  const { nombreGrupo, participantes } = req.body;
  if (
    !nombreGrupo ||
    !Array.isArray(participantes) ||
    participantes.length < 3
  ) {
    return res.status(400).json({
      error: "Se requiere nombre del grupo y mínimo 3 participantes.",
    });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const resGrupo = await client.query(
      "INSERT INTO grupos (nombre) VALUES ($1) RETURNING grupo_id, nombre, creado_en",
      [nombreGrupo.trim()],
    );
    const grupo = resGrupo.rows[0];

    const participantesGuardados = [];
    for (const nombrePart of participantes) {
      const resPart = await client.query(
        "INSERT INTO participantes (grupo_id, nombre) VALUES ($1, $2) RETURNING participante_id, nombre",
        [grupo.grupo_id, nombrePart.trim()],
      );
      participantesGuardados.push(resPart.rows[0]);
    }

    await client.query("COMMIT");
    res.status(201).json({ ...grupo, participantes: participantesGuardados });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error al guardar grupo:", err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Obtener el grupo activo más reciente
app.get("/api/grupos/actual", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT grupo_id, nombre FROM grupos ORDER BY grupo_id DESC LIMIT 1",
    );
    res.json(result.rows[0] || null);
  } catch (err) {
    console.error("Error al consultar grupo:", err);
    res.status(500).json({ error: err.message });
  }
});

// Guardar los 3 deseos normalizados (Sprint 2 - USB)
app.post("/api/wishlists", async (req, res) => {
  const { grupoId, participanteId = null, deseos } = req.body;
  if (
    !grupoId ||
    !Array.isArray(deseos) ||
    deseos.length !== 3 ||
    deseos.some((d) => !d.trim())
  ) {
    return res
      .status(400)
      .json({ error: "Se requiere grupoId y exactamente 3 deseos válidos." });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const resWishlist = await client.query(
      `INSERT INTO wishlists (grupo_id, participante_id, confirmada)
       VALUES ($1, $2, TRUE)
       RETURNING wishlist_id, grupo_id, participante_id, confirmada, creada_en`,
      [grupoId, participanteId],
    );
    const wishlist = resWishlist.rows[0];

    const deseosInsertados = [];
    for (let i = 0; i < deseos.length; i++) {
      const resDeseo = await client.query(
        `INSERT INTO wishlist_deseos (wishlist_id, orden, descripcion)
         VALUES ($1, $2, $3)
         RETURNING deseo_id, orden, descripcion`,
        [wishlist.wishlist_id, i + 1, deseos[i].trim()],
      );
      deseosInsertados.push(resDeseo.rows[0]);
    }

    await client.query("COMMIT");
    res.status(201).json({ ...wishlist, deseos: deseosInsertados });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error al guardar wishlist:", err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Consultar wishlists guardadas de un grupo
app.get("/api/wishlists/:grupoId", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         w.wishlist_id,
         g.nombre AS nombre_grupo,
         p.nombre AS nombre_participante,
         w.confirmada,
         w.creada_en,
         JSON_AGG(
           JSON_BUILD_OBJECT('orden', d.orden, 'descripcion', d.descripcion)
           ORDER BY d.orden
         ) AS deseos
       FROM wishlists w
       INNER JOIN grupos g ON g.grupo_id = w.grupo_id
       LEFT JOIN participantes p ON p.participante_id = w.participante_id
       INNER JOIN wishlist_deseos d ON d.wishlist_id = w.wishlist_id
       WHERE w.grupo_id = $1
       GROUP BY w.wishlist_id, g.nombre, p.nombre
       ORDER BY w.wishlist_id DESC`,
      [req.params.grupoId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error al consultar wishlists:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(4000, () => {
  console.log("Servidor PostgreSQL activo en http://localhost:4000");
});
