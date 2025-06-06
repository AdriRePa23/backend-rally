// Rutas de publicaciones: crear, consultar, eliminar y modificar publicaciones
const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { createPublicacion, getPublicacionesByRally, deletePublicacion, getPublicacionesByUsuario, getPublicacionById, getPublicacionesByRallyAndUsuario, getPublicacionesByRallyOrderByVotos } = require("../controllers/publicacionController");
const multer = require("multer");
const { check, validationResult } = require("express-validator");

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Configuración básica de multer

// Crear una publicación (requiere autenticación y validación de imagen)
router.post(
    "/",
    protect,
    upload.single("fotografia"),
    [
        check("rally_id", "El ID del rally es obligatorio").notEmpty().isInt().withMessage("Debe ser un número entero"),
        check("descripcion", "La descripción debe tener un máximo de 500 caracteres")
            .optional()
            .isLength({ max: 500 })
            .trim().escape(),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // Validar imagen
        if (!req.file) {
            return res.status(400).json({ errors: [{ msg: "La imagen es obligatoria", param: "fotografia" }] });
        }
        // Validar tipo y tamaño de imagen
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ errors: [{ msg: "Solo se permiten imágenes JPG, PNG o WEBP", param: "fotografia" }] });
        }
        if (req.file.size > 5 * 1024 * 1024) {
            return res.status(400).json({ errors: [{ msg: "La imagen no puede superar los 5MB", param: "fotografia" }] });
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

// Eliminar una publicación (requiere autenticación)
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

// Obtener publicaciones por estado (query o ruta)
router.get("/publicaciones", async (req, res) => {
    const { estado } = req.query;
    try {
        const publicaciones = await require("../models/Publicacion").findByEstado(estado);
        res.status(200).json(publicaciones);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener publicaciones" });
    }
});

// Modificar el estado de una publicación (solo admin o gestor)
const { verifyToken } = require("../controllers/authController");
router.put("/publicaciones/:id/estado", verifyToken, async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    const usuario = req.user;
    if (![2, 3].includes(usuario.rol_id)) {
        return res.status(403).json({ message: "No tienes permisos para modificar el estado" });
    }
    try {
        await require("../models/Publicacion").updateEstado(id, estado);
        res.status(200).json({ message: "Estado actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el estado" });
    }
});

// Obtener publicaciones por estado (el estado va en la ruta)
router.get("/estado/:estado", async (req, res) => {
    const { estado } = req.params;
    try {
        const publicaciones = await require("../models/Publicacion").findByEstado(estado);
        res.status(200).json(publicaciones);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener publicaciones" });
    }
});

// Exporta el router de publicaciones
module.exports = router;