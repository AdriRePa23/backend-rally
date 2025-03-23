const Votacion = require("../models/Votacion");

const createVotacion = async (req, res) => {
    const { publicacion_id } = req.body;

    if (!publicacion_id) {
        return res.status(400).json({ message: "El ID de la publicación es obligatorio" });
    }

    try {
        const ip = req.ip; // Obtener la IP del cliente
        const usuario_id = req.user ? req.user.id : null; // Si el usuario está autenticado

        // Verificar si ya votó (por usuario o IP)
        const existingVoteByIp = await Votacion.findByIpAndPublicacion(ip, publicacion_id);
        const existingVoteByUser = usuario_id
            ? await Votacion.findByUserAndPublicacion(usuario_id, publicacion_id)
            : null;

        if (existingVoteByIp || existingVoteByUser) {
            return res.status(400).json({ message: "Ya has votado por esta publicación" });
        }

        // Crear el voto
        await Votacion.create({ ip, publicacion_id, usuario_id });

        res.status(201).json({ message: "Voto registrado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al registrar el voto" });
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
        console.error(error);
        res.status(500).json({ message: "Error al obtener los votos" });
    }
};

module.exports = { createVotacion, getVotosByPublicacion };