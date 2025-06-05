const Votacion = require("../models/Votacion");
const Publicacion = require("../models/Publicacion"); 

// Valida que el usuario no vote dos veces ni a sí mismo antes de registrar el voto
const createVotacion = async (req, res) => {
    const { publicacion_id, ip } = req.body;

    if (!publicacion_id || !ip) {
        return res.status(400).json({ message: "El ID de la publicación y la IP son obligatorios" });
    }

    try {
        // Verificar si la publicación existe
        const publicacion = await Publicacion.findById(publicacion_id);
        if (!publicacion) {
            return res.status(404).json({ message: "La publicación no existe" });
        }
        const usuario_id = req.user ? req.user.id : null;
        // Verificar si ya votó (por IP o usuario)
        const existingVoteByIp = await Votacion.findByIpAndPublicacion(ip, publicacion_id);
        const existingVoteByUser = usuario_id
            ? await Votacion.findByUserAndPublicacion(usuario_id, publicacion_id)
            : null;

        if (existingVoteByIp || existingVoteByUser) {
            return res.status(400).json({ message: "Ya has votado por esta publicación" });
        }

        // Crear el voto
        await Votacion.create({ ip, publicacion_id, usuario_id });

        return res.status(201).json({ message: "Voto registrado correctamente" });
    } catch (error) {
        return res.status(500).json({ message: "Error al registrar el voto" });
    }
};


const getVotosByPublicacion = async (req, res) => {
    const { publicacion_id } = req.query;

    if (!publicacion_id) {
        return res.status(400).json({ message: "El ID de la publicación es obligatorio" });
    }

    try {
        const votos = await Votacion.findByPublicacionId(publicacion_id);
        res.status(200).json(votos);
    } catch (error) {
        // No log de error en producción para evitar fuga de información
        res.status(500).json({ message: "Error al obtener los votos" });
    }
};

module.exports = { createVotacion, getVotosByPublicacion };