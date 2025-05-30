const Publicacion = require("../models/Publicacion");
const cloudinary = require("../config/cloudinary");
const Rally = require("../models/Rally");

const createPublicacion = async (req, res) => {
    const { descripcion, rally_id } = req.body;

    if (!req.file || !rally_id) {
        return res.status(400).json({ message: "La imagen y el ID del rally son obligatorios" });
    }

    try {
        // Comprobar el número máximo de fotos permitidas en el rally
        const rally = await Rally.findById(rally_id);
        if (!rally) {
            return res.status(404).json({ message: "Rally no encontrado" });
        }
        const maxFotos = rally.cantidad_fotos_max;
        // Contar las publicaciones del usuario en este rally
        const publicacionesUsuario = await Publicacion.findAllByUsuarioId(req.user.id);
        const publicacionesEnRally = publicacionesUsuario.filter(p => p.rally_id == rally_id);
        if (publicacionesEnRally.length >= maxFotos) {
            return res.status(400).json({ message: `No puedes subir más de ${maxFotos} fotos a este rally.` });
        }

        // Subir la imagen a Cloudinary
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            folder: "publicaciones", // Carpeta en Cloudinary
            resource_type: "image",
        });

        // Crear la publicación en la base de datos
        const publicacionId = await Publicacion.create({
            usuario_id: req.user.id,
            fotografia: uploadResult.secure_url,
            descripcion,
            estado: "pendiente", // Estado inicial de la publicación
            rally_id,
        });

        res.status(201).json({ message: "Publicación creada correctamente", publicacionId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear la publicación" });
    }
};

const getPublicacionesByRally = async (req, res) => {
    const { rally_id } = req.query;

    if (!rally_id) {
        return res.status(400).json({ message: "El ID del rally es obligatorio" });
    }

    try {
        const publicaciones = await Publicacion.findAllByRallyId(rally_id);
        res.status(200).json(publicaciones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener las publicaciones" });
    }
};

// Obtener publicaciones por usuario
const getPublicacionesByUsuario = async (req, res) => {
    const { usuario_id } = req.params;
    try {
        const publicaciones = await Publicacion.findAllByUsuarioId(usuario_id);
        res.status(200).json(publicaciones);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las publicaciones del usuario" });
    }
};

// Obtener publicaciones de un rally por usuario
const getPublicacionesByRallyAndUsuario = async (req, res) => {
    const { rally_id, usuario_id } = req.query;
    if (!rally_id || !usuario_id) {
        return res.status(400).json({ message: "Se requiere rally_id y usuario_id" });
    }
    try {
        const publicaciones = await Publicacion.findAllByUsuarioId(usuario_id);
        const filtradas = publicaciones.filter(p => p.rally_id == rally_id);
        res.status(200).json(filtradas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las publicaciones" });
    }
};

// Obtener todas las publicaciones de un rally ordenadas por votos descendente
const getPublicacionesByRallyOrderByVotos = async (req, res) => {
    const { rally_id } = req.query;
    if (!rally_id) {
        return res.status(400).json({ message: "El ID del rally es obligatorio" });
    }
    try {
        const publicaciones = await Publicacion.findAllByRallyIdOrderByVotos(rally_id);
        res.status(200).json(publicaciones);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las publicaciones ordenadas por votos" });
    }
};

const deletePublicacion = async (req, res) => {
    const { id } = req.params;

    try {
        const publicacion = await Publicacion.findById(id);
        if (!publicacion) {
            return res.status(404).json({ message: "Publicación no encontrada" });
        }

        if (publicacion.usuario_id !== req.user.id && req.user.rol_id !== 2) {
            return res.status(403).json({ message: "No tienes permiso para eliminar esta publicación" });
        }

        // Eliminar la imagen de Cloudinary
        const publicacionUrl = publicacion.fotografia;
        const publicacionPublicId = publicacionUrl.split("/").pop().split(".")[0]; // Obtener el public_id
        await cloudinary.uploader.destroy(`publicaciones/${publicacionPublicId}`);

        // Eliminar la publicación de la base de datos
        await Publicacion.delete(id);

        res.status(200).json({ message: "Publicación eliminada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar la publicación" });
    }
};

// Obtener una publicación por su id
const getPublicacionById = async (req, res) => {
    const { id } = req.params;
    try {
        const publicacion = await Publicacion.findById(id);
        if (!publicacion) {
            return res.status(404).json({ message: "Publicación no encontrada" });
        }
        res.status(200).json(publicacion);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la publicación" });
    }
};

module.exports = { createPublicacion, getPublicacionesByRally, deletePublicacion, getPublicacionesByUsuario, getPublicacionById, getPublicacionesByRallyAndUsuario, getPublicacionesByRallyOrderByVotos };