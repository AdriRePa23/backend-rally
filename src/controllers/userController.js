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

// Obtener toda la información privada de un usuario (solo dueño o admin)
const getUserPrivateInfo = async (req, res) => {
    const { id } = req.params;
    try {
        if (req.user.id !== parseInt(id) && req.user.rol_id !== 1) {
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

// Actualizar datos de un usuario (solo nombre y foto_perfil)
const updateUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await Usuario.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        // Solo el propio usuario o un admin (rol_id 1) puede modificar
        if (req.user.id !== parseInt(id) && req.user.rol_id !== 1) {
            return res.status(403).json({ message: "No tienes permiso para modificar este usuario" });
        }

        const dataToUpdate = {};
        // Actualizar nombre si viene en el body
        if (req.body.nombre) {
            dataToUpdate.nombre = req.body.nombre;
        }

        // Actualizar foto de perfil si viene un archivo
        if (req.file) {
            // Subir nueva foto a Cloudinary
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: "usuarios",
                resource_type: "image",
            });
            dataToUpdate.foto_perfil = uploadResult.secure_url;

            // Eliminar archivo local temporal
            fs.unlinkSync(req.file.path);

            // Eliminar la foto anterior de Cloudinary si existía
            if (user.foto_perfil) {
                const publicId = user.foto_perfil.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(`usuarios/${publicId}`);
            }
        }

        if (Object.keys(dataToUpdate).length === 0) {
            return res.status(400).json({ message: "No se proporcionaron datos para actualizar" });
        }

        await Usuario.update(id, dataToUpdate);
        res.status(200).json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el usuario" });
    }
};

// Eliminar un usuario
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await Usuario.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        // Solo el propio usuario o un admin (rol_id 1) puede eliminar
        if (req.user.id !== parseInt(id) && req.user.rol_id !== 1) {
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
    if (req.user.rol_id !== 1) {
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

// Actualizar contraseña de usuario (solo dueño o admin)
const updatePassword = async (req, res) => {
    const { id } = req.params;
    const { nuevaContrasena } = req.body;
    try {
        if (req.user.id !== parseInt(id) && req.user.rol_id !== 1) {
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

module.exports = { getUserById, updateUser, deleteUser, getUserPrivateInfo, listUsers, getMe, updatePassword, getUserStats };
