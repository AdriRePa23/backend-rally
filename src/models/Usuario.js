const pool = require("../config/db");

const Usuario = {
    create: async (data) => {
        const { nombre, email, contrasena, rol_id } = data;
        const [result] = await pool.query(
            "INSERT INTO usuarios (nombre, email, contrasena, rol_id) VALUES (?, ?, ?, ?)",
            [nombre, email, contrasena, rol_id]
        );
        return result.insertId;
    },

    findByEmail: async (email) => {
        const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);
        return rows[0];
    },

    findById: async (id) => {
        const [rows] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);
        return rows[0];
    },

    updateData: async (id, data) => {
        const { nombre, email, contrasena, foto_perfil, verificado, rol_id } = data;
        await pool.query(
            "UPDATE usuarios SET nombre = ?, email = ?, contrasena = ?, foto_perfil = ?, verificado = ?, rol_id = ? WHERE id = ?",
            [nombre, email, contrasena, foto_perfil, verificado, rol_id, id]
        );
    },

    updatePassword: async (id, data) => {
        const { contrasena } = data;
        await pool.query("UPDATE usuarios SET contrasena = ? WHERE id = ?", [contrasena, id]);
    },
    update: async (id, data) => {
        const fields = Object.keys(data).map((key) => `${key} = ?`).join(", ");
        const values = Object.values(data);
        await pool.query(`UPDATE usuarios SET ${fields} WHERE id = ?`, [...values, id]);
    },

    delete: async (id) => {
        await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);
    },
};

module.exports = Usuario;