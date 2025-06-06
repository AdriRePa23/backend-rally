// Modelo de Usuario: gestiona operaciones sobre la tabla 'usuarios'
const pool = require("../config/db");

const Usuario = {
    // Crea un nuevo usuario
    create: async (data) => {
        const { nombre, email, contrasena, rol_id } = data;
        const [result] = await pool.query(
            "INSERT INTO usuarios (nombre, email, contrasena, rol_id) VALUES (?, ?, ?, ?)",
            [nombre, email, contrasena, rol_id]
        );
        return result.insertId;
    },

    // Busca usuario por email
    findByEmail: async (email) => {
        const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);
        return rows[0];
    },

    // Busca usuario por ID
    findById: async (id) => {
        const [rows] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);
        return rows[0];
    },

    // Actualiza todos los datos de un usuario
    updateData: async (id, data) => {
        const { nombre, email, contrasena, foto_perfil, verificado, rol_id } = data;
        await pool.query(
            "UPDATE usuarios SET nombre = ?, email = ?, contrasena = ?, foto_perfil = ?, verificado = ?, rol_id = ? WHERE id = ?",
            [nombre, email, contrasena, foto_perfil, verificado, rol_id, id]
        );
    },

    // Actualiza solo la contraseña
    updatePassword: async (id, data) => {
        const { contrasena } = data;
        await pool.query("UPDATE usuarios SET contrasena = ? WHERE id = ?", [contrasena, id]);
    },
    // Actualiza datos generales y foto de perfil (gestiona Cloudinary)
    update: async (id, data) => {
        // Si se incluye foto_perfil (archivo), subir a Cloudinary y reemplazar la anterior
        let foto_perfil_url = data.foto_perfil;
        const DEFAULT_IMG = 'https://res.cloudinary.com/di8rjwooa/image/upload/v1742723009/recursos/znkvsfuoi5e4ijatgvku.png';
        if (data.foto_perfil && typeof data.foto_perfil !== 'string') {
            const cloudinary = require("../config/cloudinary");
            // Obtener usuario actual para borrar la imagen anterior si no es la predeterminada
            const usuarioActual = await Usuario.findById(id);
            if (usuarioActual && usuarioActual.foto_perfil && usuarioActual.foto_perfil !== DEFAULT_IMG) {
                // Extraer public_id de la URL de Cloudinary
                const urlParts = usuarioActual.foto_perfil.split('/');
                const fileName = urlParts[urlParts.length - 1];
                const publicId = 'usuarios/' + fileName.split('.')[0];
                try {
                    await cloudinary.uploader.destroy(publicId);
                } catch (error) {
                    // No log de error en producción para evitar fuga de información
                    throw error;
                }
            }
            // Subir la nueva imagen
            const result = await cloudinary.uploader.upload(data.foto_perfil.path, {
                folder: "usuarios",
                resource_type: "image"
            });
            foto_perfil_url = result.secure_url;
        }
        // Construir el objeto de actualización
        const updateData = { ...data };
        if (foto_perfil_url) updateData.foto_perfil = foto_perfil_url;
        delete updateData.foto_perfil_path;
        const fields = Object.keys(updateData).map((key) => `${key} = ?`).join(", ");
        const values = Object.values(updateData);
        await pool.query(`UPDATE usuarios SET ${fields} WHERE id = ?`, [...values, id]);
    },

    // Elimina un usuario
    delete: async (id) => {
        await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);
    },

    // Lista usuarios con búsqueda y paginación
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

    // Crea un administrador o gestor
    createAdmin: async (data) => {
        const { nombre, email, contrasena, rol_id } = data;
        const [result] = await pool.query(
            "INSERT INTO usuarios (nombre, email, contrasena, rol_id) VALUES (?, ?, ?, ?)",
            [nombre, email, contrasena, rol_id]
        );
        return result.insertId;
    },
    // Busca admin por ID
    findAdminById: async (id) => {
        const [rows] = await pool.query("SELECT id, nombre, email, rol_id FROM usuarios WHERE id = ? AND rol_id = 1", [id]);
        return rows[0];
    },
    // Actualiza datos de admin
    updateAdmin: async (id, data) => {
        const { nombre, email, contrasena } = data;
        await pool.query(
            "UPDATE usuarios SET nombre = ?, email = ?, contrasena = ? WHERE id = ? AND rol_id = 1",
            [nombre, email, contrasena, id]
        );
    },
    // Elimina admin
    deleteAdmin: async (id) => {
        await pool.query("DELETE FROM usuarios WHERE id = ? AND rol_id = 1", [id]);
    },
};

// Exporta el modelo de usuario
module.exports = Usuario;