// Modelo de Votación: gestiona votos sobre publicaciones
const pool = require("../config/db");

const Votacion = {
    // Crea un nuevo voto
    create: async (data) => {
        const { ip, publicacion_id, usuario_id } = data;
        try {
            const [result] = await pool.query(
                "INSERT INTO votaciones (ip, publicacion_id, usuario_id) VALUES (?, ?, ?)",
                [ip, publicacion_id, usuario_id]
            );
            return result.insertId;
        } catch (error) {
            // No log de error en producción para evitar fuga de información
            throw error;
        }
    },

    // Busca voto por usuario y publicación
    findByUserAndPublicacion: async (usuario_id, publicacion_id) => {
        try {
            const [rows] = await pool.query(
                "SELECT * FROM votaciones WHERE usuario_id = ? AND publicacion_id = ?",
                [usuario_id, publicacion_id]
            );
            return rows[0];
        } catch (error) {
            // No log de error en producción para evitar fuga de información
            throw error;
        }
    },

    // Busca voto por IP y publicación
    findByIpAndPublicacion: async (ip, publicacion_id) => {
        try {
            const [rows] = await pool.query(
                "SELECT * FROM votaciones WHERE ip = ? AND publicacion_id = ?",
                [ip, publicacion_id]
            );
            return rows[0];
        } catch (error) {
            // No log de error en producción para evitar fuga de información
            throw error;
        }
    },

    // Obtiene todos los votos de una publicación
    findByPublicacionId: async (publicacion_id) => {
        try {
            const [rows] = await pool.query("SELECT * FROM votaciones WHERE publicacion_id = ?", [publicacion_id]);
            return rows;
        } catch (error) {
            // No log de error en producción para evitar fuga de información
            throw error;
        }
    },

    // Elimina un voto por ID
    delete: async (id) => {
        try {
            const [result] = await pool.query("DELETE FROM votaciones WHERE id = ?", [id]);
            return result.affectedRows;
        } catch (error) {
            // No log de error en producción para evitar fuga de información
            throw error;
        }
    },
};

// Exporta el modelo de votación
module.exports = Votacion;