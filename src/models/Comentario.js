// Modelo de Comentario: gestiona operaciones sobre la tabla 'comentarios'
const pool = require("../config/db");

const Comentario = {
    // Crea un nuevo comentario
    create: async (data) => {
        const { usuario_id, publicacion_id, comentario } = data;
        try {
            const [result] = await pool.query(
                "INSERT INTO comentarios (usuario_id, publicacion_id, comentario) VALUES (?, ?, ?)",
                [usuario_id, publicacion_id, comentario]
            );
            return result.insertId;
        } catch (error) {
            // No log de error en producción para evitar fuga de información
            throw error;
        }
    },

    // Obtiene todos los comentarios de una publicación
    findAllByPublicacionId: async (publicacion_id) => {
        try {
            const [rows] = await pool.query(
                `SELECT 
                c.id, 
                c.comentario, 
                c.created_at, 
                c.usuario_id, 
                u.nombre AS usuario_nombre, 
                u.foto_perfil AS usuario_foto 
            FROM comentarios c 
            JOIN usuarios u ON c.usuario_id = u.id 
            WHERE c.publicacion_id = ? 
            ORDER BY c.created_at DESC`,
                [publicacion_id]
            );
            return rows;
        } catch (error) {
            // No log de error en producción para evitar fuga de información
            throw error;
        }
    },

    // Obtiene todos los comentarios de un usuario
    findAllByUsuarioId: async (usuario_id) => {
        try {
            const [rows] = await pool.query(
                `SELECT c.*, u.nombre AS usuario_nombre, u.foto_perfil AS usuario_foto
            FROM comentarios c
            JOIN usuarios u ON c.usuario_id = u.id
            WHERE c.usuario_id = ?
            ORDER BY c.created_at DESC`,
                [usuario_id]
            );
            return rows;
        } catch (error) {
            // No log de error en producción para evitar fuga de información
            throw error;
        }
    },

    // Busca comentario por ID
    findById: async (id) => {
        try {
            const [rows] = await pool.query("SELECT * FROM comentarios WHERE id = ?", [id]);
            return rows[0];
        } catch (error) {
            // No log de error en producción para evitar fuga de información
            throw error;
        }
    },

    // Elimina un comentario
    delete: async (id) => {
        try {
            await pool.query("DELETE FROM comentarios WHERE id = ?", [id]);
        } catch (error) {
            // No log de error en producción para evitar fuga de información
            throw error;
        }
    },
};

// Exporta el modelo de comentario
module.exports = Comentario;