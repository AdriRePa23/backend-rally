const Usuario = require("../models/Usuario");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

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

module.exports = { getUserById, updateUser, deleteUser };
