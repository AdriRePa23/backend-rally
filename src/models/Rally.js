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