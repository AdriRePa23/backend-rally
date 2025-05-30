const pool = require("../config/db");

const Publicacion = {
    create: async (data) => {
        const { usuario_id, fotografia, descripcion, estado, rally_id } = data;
        const [result] = await pool.query(
            "INSERT INTO publicaciones (usuario_id, fotografia, descripcion, estado, rally_id) VALUES (?, ?, ?, ?, ?)",
            [usuario_id, fotografia, descripcion, estado, rally_id]
        );
        return result.insertId;
    },

    findAllByRallyId: async (rally_id) => {
        const [rows] = await pool.query("SELECT * FROM publicaciones WHERE rally_id = ?", [rally_id]);
        return rows;
    },

    findAllByRallyIdOrderByVotos: async (rally_id) => {
        const [rows] = await pool.query(`
            SELECT p.*, COUNT(v.id) AS votos
            FROM publicaciones p
            LEFT JOIN votaciones v ON p.id = v.publicacion_id
            WHERE p.rally_id = ?
            GROUP BY p.id
            ORDER BY votos DESC
        `, [rally_id]);
        return rows;
    },

    findById: async (id) => {
        const [rows] = await pool.query("SELECT * FROM publicaciones WHERE id = ?", [id]);
        return rows[0];
    },

    update: async (id, data) => {
        const { fotografia, descripcion, estado } = data;
        await pool.query(
            "UPDATE publicaciones SET fotografia = ?, descripcion = ?, estado = ? WHERE id = ?",
            [fotografia, descripcion, estado, id]
        );
    },

    delete: async (id) => {
        await pool.query("DELETE FROM publicaciones WHERE id = ?", [id]);
    },

    findAllByUsuarioId: async (usuario_id) => {
        const [rows] = await pool.query("SELECT * FROM publicaciones WHERE usuario_id = ?", [usuario_id]);
        return rows;
    },
};

module.exports = Publicacion;