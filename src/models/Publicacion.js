// Modelo de Publicación: gestiona operaciones sobre la tabla 'publicaciones'
const pool = require("../config/db");

const Publicacion = {
    // Crea una nueva publicación
    create: async (data) => {
        const { usuario_id, fotografia, descripcion, estado, rally_id } = data;
        try {
            const [result] = await pool.query(
                "INSERT INTO publicaciones (usuario_id, fotografia, descripcion, estado, rally_id) VALUES (?, ?, ?, ?, ?)",
                [usuario_id, fotografia, descripcion, estado, rally_id]
            );
            return result.insertId;
        } catch (error) {
            // No log de error en producción para evitar fuga de información
            throw error;
        }
    },

    // Obtiene todas las publicaciones de un rally
    findAllByRallyId: async (rally_id) => {
        try {
            const [rows] = await pool.query("SELECT * FROM publicaciones WHERE rally_id = ?", [rally_id]);
            return rows;
        } catch (error) {
            // No log de error en producción para evitar fuga de información
            throw error;
        }
    },

    // Obtiene todas las publicaciones de un rally ordenadas por votos
    findAllByRallyIdOrderByVotos: async (rally_id) => {
        try {
            const [rows] = await pool.query(`
                SELECT p.*, COUNT(v.id) AS votos
                FROM publicaciones p
                LEFT JOIN votaciones v ON p.id = v.publicacion_id
                WHERE p.rally_id = ?
                GROUP BY p.id
                ORDER BY votos DESC
            `, [rally_id]);
            return rows;
        } catch (error) {
            // No log de error en producción para evitar fuga de información
            throw error;
        }
    },

    // Busca publicación por ID
    findById: async (id) => {
        try {
            const [rows] = await pool.query("SELECT * FROM publicaciones WHERE id = ?", [id]);
            return rows[0];
        } catch (error) {
            // No log de error en producción para evitar fuga de información
            throw error;
        }
    },

    // Actualiza datos de una publicación
    update: async (id, data) => {
        const { fotografia, descripcion, estado } = data;
        try {
            await pool.query(
                "UPDATE publicaciones SET fotografia = ?, descripcion = ?, estado = ? WHERE id = ?",
                [fotografia, descripcion, estado, id]
            );
        } catch (error) {
            // No log de error en producción para evitar fuga de información
            throw error;
        }
    },

    // Elimina una publicación
    delete: async (id) => {
        try {
            await pool.query("DELETE FROM publicaciones WHERE id = ?", [id]);
        } catch (error) {
            // No log de error en producción para evitar fuga de información
            throw error;
        }
    },

    // Obtiene todas las publicaciones de un usuario
    findAllByUsuarioId: async (usuario_id) => {
        try {
            const [rows] = await pool.query("SELECT * FROM publicaciones WHERE usuario_id = ?", [usuario_id]);
            return rows;
        } catch (error) {
            // No log de error en producción para evitar fuga de información
            throw error;
        }
    },

    // Busca publicaciones por estado
    findByEstado: async (estado) => {
        let query = "SELECT * FROM publicaciones";
        let params = [];
        if (estado) {
            query += " WHERE estado = ?";
            params.push(estado);
        }
        try {
            const [rows] = await pool.query(query, params);
            return rows;
        } catch (error) {
            // No log de error en producción para evitar fuga de información
            throw error;
        }
    },

    // Actualiza solo el estado de una publicación
    updateEstado: async (id, estado) => {
        try {
            await pool.query("UPDATE publicaciones SET estado = ? WHERE id = ?", [estado, id]);
        } catch (error) {
            // No log de error en producción para evitar fuga de información
            throw error;
        }
    },
};

// Exporta el modelo de publicación
module.exports = Publicacion;