const pool = require("../config/db");

const Votacion = {
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

    findByPublicacionId: async (publicacion_id) => {
        try {
            const [rows] = await pool.query("SELECT * FROM votaciones WHERE publicacion_id = ?", [publicacion_id]);
            return rows;
        } catch (error) {
            // No log de error en producción para evitar fuga de información
            throw error;
        }
    },

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

module.exports = Votacion;