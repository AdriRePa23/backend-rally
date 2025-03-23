const pool = require("../config/db");

const Votacion = {
    create: async (data) => {
        const { ip, publicacion_id, usuario_id } = data;
        const [result] = await pool.query(
            "INSERT INTO votaciones (ip, publicacion_id, usuario_id) VALUES (?, ?, ?)",
            [ip, publicacion_id, usuario_id]
        );
        return result.insertId;
    },

    findByPublicacionId: async (publicacion_id) => {
        const [rows] = await pool.query("SELECT * FROM votaciones WHERE publicacion_id = ?", [publicacion_id]);
        return rows;
    },

    findByUserAndPublicacion: async (usuario_id, publicacion_id) => {
        const [rows] = await pool.query(
            "SELECT * FROM votaciones WHERE usuario_id = ? AND publicacion_id = ?",
            [usuario_id, publicacion_id]
        );
        return rows[0];
    },

    findByIpAndPublicacion: async (ip, publicacion_id) => {
        const [rows] = await pool.query(
            "SELECT * FROM votaciones WHERE ip = ? AND publicacion_id = ?",
            [ip, publicacion_id]
        );
        return rows[0];
    },

    delete: async (id) => {
        const [result] = await pool.query("DELETE FROM votaciones WHERE id = ?", [id]);
        return result.affectedRows;
    },

    
};

module.exports = Votacion;