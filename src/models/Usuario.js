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

    findAll: async (search, limit, offset) => {
        let query = "SELECT * FROM usuarios";
        let params = [];
        if (search) {
            query += " WHERE nombre LIKE ? OR email LIKE ?";
            params.push(`%${search}%`, `%${search}%`);
        }
        query += " ORDER BY id DESC";
        if (limit) {
            query += " LIMIT ? OFFSET ?";
            params.push(Number(limit), Number(offset) || 0);
        }
        const [rows] = await pool.query(query, params);
        return rows;
    },

    createAdmin: async (data) => {
        const { nombre, email, contrasena, rol_id } = data;
        const [result] = await pool.query(
            "INSERT INTO usuarios (nombre, email, contrasena, rol_id) VALUES (?, ?, ?, ?)",
            [nombre, email, contrasena, rol_id]
        );
        return result.insertId;
    },
    findAdminById: async (id) => {
        const [rows] = await pool.query("SELECT id, nombre, email, rol_id FROM usuarios WHERE id = ? AND rol_id = 1", [id]);
        return rows[0];
    },
    updateAdmin: async (id, data) => {
        const { nombre, email, contrasena } = data;
        await pool.query(
            "UPDATE usuarios SET nombre = ?, email = ?, contrasena = ? WHERE id = ? AND rol_id = 1",
            [nombre, email, contrasena, id]
        );
    },
    deleteAdmin: async (id) => {
        await pool.query("DELETE FROM usuarios WHERE id = ? AND rol_id = 1", [id]);
    },
};

module.exports = Usuario;