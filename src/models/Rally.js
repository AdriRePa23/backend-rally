const pool = require("../config/db");

const Rally = {
    create: async (data) => {
        const { nombre, descripcion, fecha_inicio, fecha_fin, categorias, estado, creador_id, cantidad_fotos_max } = data;
        const [result] = await pool.query(
            "INSERT INTO rallies (nombre, descripcion, fecha_inicio, fecha_fin, categorias, estado, creador_id, cantidad_fotos_max) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [nombre, descripcion, fecha_inicio, fecha_fin, categorias, estado, creador_id, cantidad_fotos_max]
        );
        return result.insertId;
    },

    findAll: async () => {
        const [rows] = await pool.query("SELECT * FROM rallies");
        return rows;
    },

    findAllWithImages: async () => {
        const [rallies] = await pool.query("SELECT * FROM rallies");
        const ralliesConImagen = await Promise.all(
            rallies.map(async (rally) => {
                const [imagenMasVotada] = await pool.query(
                    `
                    SELECT p.fotografia, COUNT(v.id) AS votos
                    FROM publicaciones p
                    LEFT JOIN votaciones v ON p.id = v.publicacion_id
                    WHERE p.rally_id = ?
                    GROUP BY p.id
                    ORDER BY votos DESC
                    LIMIT 1
                    `,
                    [rally.id]
                );
                return { ...rally, imagenMasVotada: imagenMasVotada[0] };
            })
        );
        return ralliesConImagen;
    },

    findById: async (id) => {
        const [rows] = await pool.query("SELECT * FROM rallies WHERE id = ?", [id]);
        return rows[0];
    },

    update: async (id, data) => {
        const { nombre, descripcion, fecha_inicio, fecha_fin, categorias, estado, cantidad_fotos_max } = data;
        await pool.query(
            "UPDATE rallies SET nombre = ?, descripcion = ?, fecha_inicio = ?, fecha_fin = ?, categorias = ?, estado = ?, cantidad_fotos_max = ? WHERE id = ?",
            [nombre, descripcion, fecha_inicio, fecha_fin, categorias, estado, cantidad_fotos_max, id]
        );
    },

    delete: async (id) => {
        await pool.query("DELETE FROM rallies WHERE id = ?", [id]);
    },
};

module.exports = Rally;