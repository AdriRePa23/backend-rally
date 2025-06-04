const pool = require("../config/db");

const Rally = {
  create: async (data) => {
    const {
      nombre,
      descripcion,
      fecha_inicio,
      fecha_fin,
      categorias,
      estado,
      creador_id,
      cantidad_fotos_max,
    } = data;
    try {
      const [result] = await pool.query(
        "INSERT INTO rallies (nombre, descripcion, fecha_inicio, fecha_fin, categorias, estado, creador_id, cantidad_fotos_max) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          nombre,
          descripcion,
          fecha_inicio,
          fecha_fin,
          categorias,
          estado,
          creador_id,
          cantidad_fotos_max,
        ]
      );
      return result.insertId;
    } catch (error) {
      // No log de error en producción para evitar fuga de información
      throw error;
    }
  },

  findAll: async () => {
    try {
      const [rows] = await pool.query("SELECT * FROM rallies");
      return rows;
    } catch (error) {
      // No log de error en producción para evitar fuga de información
      throw error;
    }
  },

  findAllWithImages: async () => {
    // Obtener todos los rallies
    const [rallies] = await pool.query("SELECT * FROM rallies");

    // Procesar cada rally para obtener su primera imagen publicada
    const ralliesConImagen = await Promise.all(
        rallies.map(async (rally) => {
            // Consulta para obtener la primera imagen publicada en el rally
            const [primeraImagen] = await pool.query(
                `
                SELECT p.fotografia
                FROM publicaciones p
                WHERE p.rally_id = ?
                ORDER BY p.created_at ASC
                LIMIT 1
                `,
                [rally.id]
            );

            // Retornar el rally con la imagen asociada (o null si no hay imágenes)
            return {
                ...rally,
                imagen: primeraImagen[0]?.fotografia || null,
            };
        })
    );

    // Devolver todos los rallies con sus respectivas imágenes
    return ralliesConImagen;
  },

  findById: async (id) => {
    try {
      const [rows] = await pool.query("SELECT * FROM rallies WHERE id = ?", [id]);
      return rows[0];
    } catch (error) {
      // No log de error en producción para evitar fuga de información
      throw error;
    }
  },

  update: async (id, data) => {
    const {
      nombre,
      descripcion,
      fecha_inicio,
      fecha_fin,
      categorias,
      estado,
      cantidad_fotos_max,
    } = data;
    try {
      await pool.query(
        "UPDATE rallies SET nombre = ?, descripcion = ?, fecha_inicio = ?, fecha_fin = ?, categorias = ?, estado = ?, cantidad_fotos_max = ? WHERE id = ?",
        [
          nombre,
          descripcion,
          fecha_inicio,
          fecha_fin,
          categorias,
          estado,
          cantidad_fotos_max,
          id,
        ]
      );
    } catch (error) {
      // No log de error en producción para evitar fuga de información
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await pool.query("DELETE FROM rallies WHERE id = ?", [id]);
    } catch (error) {
      // No log de error en producción para evitar fuga de información
      throw error;
    }
  },

  findAllByUsuarioId: async (usuario_id) => {
    try {
      const [rows] = await pool.query("SELECT * FROM rallies WHERE creador_id = ?", [usuario_id]);
      return rows;
    } catch (error) {
      // No log de error en producción para evitar fuga de información
      throw error;
    }
  },

  // Buscar rallies por nombre (LIKE)
  findByNombreLike: async (nombre) => {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM rallies WHERE nombre LIKE ?",
        [`%${nombre}%`]
      );
      return rows;
    } catch (error) {
      // No log de error en producción para evitar fuga de información
      throw error;
    }
  },
};

module.exports = Rally;
