const pool = require("../config/db");

const Comentario = {
    create: async (data) => {
        const { usuario_id, publicacion_id, comentario } = data;
        const [result] = await pool.query(
            "INSERT INTO comentarios (usuario_id, publicacion_id, comentario) VALUES (?, ?, ?)",
            [usuario_id, publicacion_id, comentario]
        );
        return result.insertId;
    },

    findAllByPublicacionId: async (publicacion_id) => {
        const [rows] = await pool.query(
            "SELECT c.id, c.comentario, c.created_at, u.nombre AS usuario_nombre, u.foto_perfil AS usuario_foto FROM comentarios c JOIN usuarios u ON c.usuario_id = u.id WHERE c.publicacion_id = ? ORDER BY c.created_at DESC",
            [publicacion_id]
        );
        return rows;
    },

    findById: async (id) => {
        const [rows] = await pool.query("SELECT * FROM comentarios WHERE id = ?", [id]);
        return rows[0];
    },

    delete: async (id) => {
        await pool.query("DELETE FROM comentarios WHERE id = ?", [id]);
    },
};

module.exports = Comentario;