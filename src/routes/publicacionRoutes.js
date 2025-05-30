const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { createPublicacion, getPublicacionesByRally, deletePublicacion, getPublicacionesByUsuario, getPublicacionById, getPublicacionesByRallyAndUsuario, getPublicacionesByRallyOrderByVotos } = require("../controllers/publicacionController");
const multer = require("multer");
const { check, validationResult } = require("express-validator");

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Configuración básica de multer

// Crear una publicación
router.post(
    "/",
    protect,
    upload.single("fotografia"),
    [
        check("rally_id", "El ID del rally es obligatorio").notEmpty().isInt().withMessage("Debe ser un número entero"),
        check("descripcion", "La descripción debe tener un máximo de 500 caracteres")
            .optional()
            .isLength({ max: 500 }),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    createPublicacion
);

// Obtener publicaciones de un rally
router.get(
    "/",
    [
        check("rally_id", "El ID del rally es obligatorio").notEmpty().isInt().withMessage("Debe ser un número entero"),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    getPublicacionesByRally
);

// Obtener publicaciones de un usuario
router.get("/usuario/:usuario_id", getPublicacionesByUsuario);

// Obtener una publicación por su id
router.get("/:id", getPublicacionById);

// Obtener publicaciones de un rally por usuario
router.get("/rally-usuario", getPublicacionesByRallyAndUsuario);

// Obtener publicaciones de un rally ordenadas por votos descendente
router.get("/ordenadas/votos", getPublicacionesByRallyOrderByVotos);

// Eliminar una publicación
router.delete(
    "/:id",
    protect,
    [
        check("id", "El ID de la publicación debe ser un número entero").isInt(),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    deletePublicacion
);

module.exports = router;