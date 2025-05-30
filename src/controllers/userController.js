const Usuario = require("../models/Usuario");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const bcrypt = require("bcrypt");
const pool = require("../config/db");

// Obtener información de un usuario por ID (pública)
const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await Usuario.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        // No devolver la contraseña
        const { contrasena, ...userData } = user;
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el usuario" });
    }
};

// Obtener toda la información privada de un usuario (solo dueño, admin o gestor)
const getUserPrivateInfo = async (req, res) => {
    const { id } = req.params;
    try {
        if (req.user.id !== parseInt(id) && req.user.rol_id !== 2 && req.user.rol_id !== 3) {
            return res.status(403).json({ message: "No tienes permiso para ver esta información" });
        }
        const user = await Usuario.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la información privada del usuario" });
    }
};

// Actualizar datos de un usuario (solo dueño, admin o gestor)
const updateUser = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const user = await Usuario.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        if (req.user.id !== parseInt(id) && req.user.rol_id !== 2 && req.user.rol_id !== 3) {
            return res.status(403).json({ message: "No tienes permiso para modificar este usuario" });
        }
        await Usuario.update(id, data);
        res.status(200).json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el usuario" });
    }
};

// Eliminar un usuario (solo dueño, admin o gestor)
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await Usuario.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        if (req.user.id !== parseInt(id) && req.user.rol_id !== 2 && req.user.rol_id !== 3) {
            return res.status(403).json({ message: "No tienes permiso para eliminar este usuario" });
        }
        // Eliminar la foto de perfil de Cloudinary si existe
        if (user.foto_perfil) {
            const publicId = user.foto_perfil.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(`usuarios/${publicId}`);
        }
        await Usuario.delete(id);
        res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el usuario" });
    }
};

// Listar todos los usuarios o buscar por nombre/email (solo admin)
const listUsers = async (req, res) => {
    if (req.user.rol_id !== 2) {
        return res.status(403).json({ message: "No tienes permiso para ver los usuarios" });
    }
    const { search, limit = 20, page = 1 } = req.query;
    const offset = (page - 1) * limit;
    try {
        const users = await Usuario.findAll(search, limit, offset);
        res.status(200).json(users.map(u => {
            const { contrasena, ...userData } = u;
            return userData;
        }));
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los usuarios" });
    }
};

// Obtener el usuario autenticado (me)
const getMe = async (req, res) => {
    try {
        const user = await Usuario.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        const { contrasena, ...userData } = user;
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el perfil" });
    }
};

// Actualizar contraseña de usuario (solo dueño, admin o gestor)
const updatePassword = async (req, res) => {
    const { id } = req.params;
    const { nuevaContrasena } = req.body;
    try {
        if (req.user.id !== parseInt(id) && req.user.rol_id !== 2 && req.user.rol_id !== 3) {
            return res.status(403).json({ message: "No tienes permiso para cambiar la contraseña de este usuario" });
        }
        if (!nuevaContrasena || nuevaContrasena.length < 6) {
            return res.status(400).json({ message: "La nueva contraseña debe tener al menos 6 caracteres" });
        }
        const hashed = await bcrypt.hash(nuevaContrasena, 10);
        await Usuario.updatePassword(id, { contrasena: hashed });
        res.status(200).json({ message: "Contraseña actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la contraseña" });
    }
};

// Obtener estadísticas de usuario
const getUserStats = async (req, res) => {
    const { id } = req.params;
    try {
        // Número de publicaciones
        const [pubs] = await pool.query("SELECT COUNT(*) AS total_publicaciones FROM publicaciones WHERE usuario_id = ?", [id]);
        // Número de comentarios
        const [coms] = await pool.query("SELECT COUNT(*) AS total_comentarios FROM comentarios WHERE usuario_id = ?", [id]);
        // Número de rallies creados
        const [rallies] = await pool.query("SELECT COUNT(*) AS total_rallies FROM rallies WHERE creador_id = ?", [id]);
        // Número de votos
        const [votos] = await pool.query("SELECT COUNT(*) AS total_votos FROM votaciones WHERE usuario_id = ?", [id]);
        res.status(200).json({
            total_publicaciones: pubs[0].total_publicaciones,
            total_comentarios: coms[0].total_comentarios,
            total_rallies: rallies[0].total_rallies,
            total_votos: votos[0].total_votos
        });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener estadísticas del usuario" });
    }
};

// Crear administrador (solo admin)
const createAdmin = async (req, res) => {
    if (req.user.rol_id !== 2) {
        return res.status(403).json({ message: "Solo un administrador puede crear administradores" });
    }
    const { nombre, email, contrasena } = req.body;
    try {
        if (!nombre || !email || !contrasena) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }
        const hashed = await bcrypt.hash(contrasena, 10);
        const adminId = await Usuario.createAdmin({ nombre, email, contrasena: hashed, rol_id: 1 });
        res.status(201).json({ message: "Administrador creado correctamente", adminId });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el administrador" });
    }
};

// Crear gestor (solo admin)
const createGestor = async (req, res) => {
    if (req.user.rol_id !== 2) {
        return res.status(403).json({ message: "Solo un administrador puede crear gestores" });
    }
    const { nombre, email, contrasena } = req.body;
    try {
        if (!nombre || !email || !contrasena) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }
        const hashed = await bcrypt.hash(contrasena, 10);
        const gestorId = await Usuario.createAdmin({ nombre, email, contrasena: hashed, rol_id: 3 });
        res.status(201).json({ message: "Gestor creado correctamente", gestorId });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el gestor" });
    }
};

// Obtener administrador por id
const getAdminById = async (req, res) => {
    const { id } = req.params;
    try {
        const admin = await Usuario.findAdminById(id);
        if (!admin) {
            return res.status(404).json({ message: "Administrador no encontrado" });
        }
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el administrador" });
    }
};

// Actualizar administrador
const updateAdmin = async (req, res) => {
    const { id } = req.params;
    const { nombre, email, contrasena } = req.body;
    try {
        const admin = await Usuario.findAdminById(id);
        if (!admin) {
            return res.status(404).json({ message: "Administrador no encontrado" });
        }
        let hashed = admin.contrasena;
        if (contrasena) {
            hashed = await bcrypt.hash(contrasena, 10);
        }
        await Usuario.updateAdmin(id, { nombre: nombre || admin.nombre, email: email || admin.email, contrasena: hashed });
        res.status(200).json({ message: "Administrador actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el administrador" });
    }
};

// Eliminar administrador
const deleteAdmin = async (req, res) => {
    const { id } = req.params;
    try {
        const admin = await Usuario.findAdminById(id);
        if (!admin) {
            return res.status(404).json({ message: "Administrador no encontrado" });
        }
        await Usuario.deleteAdmin(id);
        res.status(200).json({ message: "Administrador eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el administrador" });
    }
};

// Listar gestores (solo admin)
const listGestores = async (req, res) => {
    if (req.user.rol_id !== 2) {
        return res.status(403).json({ message: "Solo un administrador puede ver los gestores" });
    }
    try {
        const pool = require("../config/db");
        const [gestores] = await pool.query("SELECT id, nombre, email, rol_id FROM usuarios WHERE rol_id = 3");
        res.status(200).json(gestores);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los gestores" });
    }
};

// Obtener gestor por id (solo admin)
const getGestorById = async (req, res) => {
    if (req.user.rol_id !== 2) {
        return res.status(403).json({ message: "Solo un administrador puede ver los gestores" });
    }
    const { id } = req.params;
    try {
        const pool = require("../config/db");
        const [gestores] = await pool.query("SELECT id, nombre, email, rol_id FROM usuarios WHERE id = ? AND rol_id = 3", [id]);
        if (!gestores[0]) {
            return res.status(404).json({ message: "Gestor no encontrado" });
        }
        res.status(200).json(gestores[0]);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el gestor" });
    }
};

// Actualizar gestor (solo admin)
const updateGestor = async (req, res) => {
    if (req.user.rol_id !== 2) {
        return res.status(403).json({ message: "Solo un administrador puede actualizar gestores" });
    }
    const { id } = req.params;
    const { nombre, email, contrasena } = req.body;
    try {
        const pool = require("../config/db");
        const [gestores] = await pool.query("SELECT * FROM usuarios WHERE id = ? AND rol_id = 3", [id]);
        if (!gestores[0]) {
            return res.status(404).json({ message: "Gestor no encontrado" });
        }
        let hashed = gestores[0].contrasena;
        if (contrasena) {
            const bcrypt = require("bcrypt");
            hashed = await bcrypt.hash(contrasena, 10);
        }
        await pool.query("UPDATE usuarios SET nombre = ?, email = ?, contrasena = ? WHERE id = ? AND rol_id = 3", [nombre || gestores[0].nombre, email || gestores[0].email, hashed, id]);
        res.status(200).json({ message: "Gestor actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el gestor" });
    }
};

// Eliminar gestor (solo admin)
const deleteGestor = async (req, res) => {
    if (req.user.rol_id !== 2) {
        return res.status(403).json({ message: "Solo un administrador puede eliminar gestores" });
    }
    const { id } = req.params;
    try {
        const pool = require("../config/db");
        const [gestores] = await pool.query("SELECT * FROM usuarios WHERE id = ? AND rol_id = 3", [id]);
        if (!gestores[0]) {
            return res.status(404).json({ message: "Gestor no encontrado" });
        }
        await pool.query("DELETE FROM usuarios WHERE id = ? AND rol_id = 3", [id]);
        res.status(200).json({ message: "Gestor eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el gestor" });
    }
};

module.exports = { getUserById, updateUser, deleteUser, getUserPrivateInfo, listUsers, getMe, updatePassword, getUserStats, createAdmin, createGestor, getAdminById, updateAdmin, deleteAdmin, listGestores, getGestorById, updateGestor, deleteGestor };
