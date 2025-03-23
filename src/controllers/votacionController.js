const Votacion = require("../models/Votacion");

const createVotacion = async (req, res) => {
    const { publicacion_id } = req.body;

    if (!publicacion_id) {
        return res.status(400).json({ message: "El ID de la publicación es obligatorio" });
    }

    try {
        const ip = req.ip; // Obtener la IP del cliente
    
        // Verificar si ya votó (IP)
        const existingVote = await Votacion.findByIpAndPublicacion(ip, publicacion_id);
        if (existingVote) {
            return res.status(400).json({ message: "Ya has votado por esta publicación desde esta IP" });
        }
        

        // Crear el voto
        await Votacion.create({ ip, publicacion_id});

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