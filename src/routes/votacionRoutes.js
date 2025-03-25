const express = require("express");
const optionalAuth = require("../middlewares/optionalAuthMiddleware");
const { createVotacion, getVotosByPublicacion } = require("../controllers/votacionController");
const { check, validationResult } = require("express-validator");

const router = express.Router();

// Crear un voto (autenticación opcional)
router.post(
    "/",
    optionalAuth,
    [
        check("publicacion_id", "El ID de la publicación es obligatorio y debe ser un número entero")
            .notEmpty()
            .isInt(),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    createVotacion
);

// Obtener votos de una publicación
router.get(
    "/",
    [
        check("publicacion_id", "El ID de la publicación es obligatorio y debe ser un número entero")
            .notEmpty()
            .isInt(),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    getVotosByPublicacion
);

module.exports = router;