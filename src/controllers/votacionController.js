// Controlador de votaciones para publicaciones
const Votacion = require("../models/Votacion");
const Publicacion = require("../models/Publicacion");

// Crea un voto para una publicación, validando que no se vote dos veces ni a sí mismo
const createVotacion = async (req, res) => {
    const { publicacion_id, ip } = req.body;

    // Validación básica de datos requeridos
    if (!publicacion_id || !ip) {
        return res.status(400).json({ message: "El ID de la publicación y la IP son obligatorios" });
    }

    try {
        // Verifica que la publicación exista
        const publicacion = await Publicacion.findById(publicacion_id);
        if (!publicacion) {
            return res.status(404).json({ message: "La publicación no existe" });
        }
        const usuario_id = req.user ? req.user.id : null;
        // Evita votos duplicados por IP o usuario
        const existingVoteByIp = await Votacion.findByIpAndPublicacion(ip, publicacion_id);
        const existingVoteByUser = usuario_id
            ? await Votacion.findByUserAndPublicacion(usuario_id, publicacion_id)
            : null;
        if (existingVoteByIp || existingVoteByUser) {
            return res.status(400).json({ message: "Ya has votado por esta publicación" });
        }
        // Registra el voto
        await Votacion.create({ ip, publicacion_id, usuario_id });
        return res.status(201).json({ message: "Voto registrado correctamente" });
    } catch (error) {
        // No mostrar detalles del error en producción
        return res.status(500).json({ message: "Error al registrar el voto" });
    }
};

// Obtiene todos los votos de una publicación específica
const getVotosByPublicacion = async (req, res) => {
    const { publicacion_id } = req.query;
    // Validación básica
    if (!publicacion_id) {
        return res.status(400).json({ message: "El ID de la publicación es obligatorio" });
    }
    try {
        const votos = await Votacion.findByPublicacionId(publicacion_id);
        res.status(200).json(votos);
    } catch (error) {
        // No mostrar detalles del error en producción
        res.status(500).json({ message: "Error al obtener los votos" });
    }
};

// Exporta las funciones del controlador
module.exports = { createVotacion, getVotosByPublicacion };