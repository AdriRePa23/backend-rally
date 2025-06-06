// Rutas de comentarios: crear, consultar y eliminar comentarios
const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { createComentario, getComentariosByPublicacion, deleteComentario, getComentariosByUsuario } = require("../controllers/comentarioController");
const { check, validationResult } = require("express-validator");

const router = express.Router();

// Crear un comentario (requiere autenticación y validación)
router.post(
    "/",
    protect,
    [
        check("publicacion_id", "El ID de la publicación es obligatorio y debe ser un número entero").notEmpty().isInt(),
        check("comentario", "El comentario es obligatorio y debe tener máximo 500 caracteres")
            .notEmpty()
            .isLength({ max: 500 })
            .trim()
            .escape(),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    createComentario
);

// Obtener comentarios de una publicación
router.get(
    "/",
    [
        check("publicacion_id", "El ID de la publicación es obligatorio y debe ser un número entero").notEmpty().isInt(),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    getComentariosByPublicacion
);

// Obtener comentarios de un usuario
router.get("/usuario/:usuario_id", getComentariosByUsuario);

// Eliminar un comentario (requiere autenticación)
router.delete(
    "/:id",
    protect,
    [
        check("id", "El ID del comentario debe ser un número entero").isInt(),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    deleteComentario
);

// Exporta el router de comentarios
module.exports = router;