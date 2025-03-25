const Comentario = require("../models/Comentario");
const Publicacion = require("../models/Publicacion");

// Crear un comentario
const createComentario = async (req, res) => {
    const { publicacion_id, comentario } = req.body;

    try {
        // Verificar si la publicación existe
        const publicacion = await Publicacion.findById(publicacion_id);
        if (!publicacion) {
            return res.status(404).json({ message: "La publicación no existe" });
        }

        // Crear el comentario
        const comentarioId = await Comentario.create({
            usuario_id: req.user.id,
            publicacion_id,
            comentario,
        });

        res.status(201).json({ message: "Comentario creado correctamente", comentarioId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear el comentario" });
    }
};

// Obtener comentarios de una publicación
const getComentariosByPublicacion = async (req, res) => {
    const { publicacion_id } = req.query;

    try {
        // Verificar si la publicación existe
        const publicacion = await Publicacion.findById(publicacion_id);
        if (!publicacion) {
            return res.status(404).json({ message: "La publicación no existe" });
        }

        // Obtener los comentarios
        const comentarios = await Comentario.findAllByPublicacionId(publicacion_id);
        res.status(200).json(comentarios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los comentarios" });
    }
};

// Eliminar un comentario
const deleteComentario = async (req, res) => {
    const { id } = req.params;

    try {
        // Verificar si el comentario existe
        const comentario = await Comentario.findById(id);
        if (!comentario) {
            return res.status(404).json({ message: "El comentario no existe" });
        }

        // Verificar si el usuario tiene permiso para eliminar el comentario
        if (comentario.usuario_id !== req.user.id && req.user.rol_id !== 2) {
            return res.status(403).json({ message: "No tienes permiso para eliminar este comentario" });
        }

        // Eliminar el comentario
        await Comentario.delete(id);
        res.status(200).json({ message: "Comentario eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar el comentario" });
    }
};

module.exports = { createComentario, getComentariosByPublicacion, deleteComentario };