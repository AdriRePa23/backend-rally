const express = require("express");
const { check, validationResult } = require("express-validator");
const { protect } = require("../middlewares/authMiddleware");
const {
    createRally,
    getRallies,
    updateRally,
    deleteRally,
} = require("../controllers/rallyController");

const router = express.Router();

// Crear un rally (solo usuarios autenticados)
router.post(
    "/",
    protect,
    [
        check("nombre", "El nombre es obligatorio y debe tener un máximo de 255 caracteres")
            .notEmpty()
            .isLength({ max: 255 }),
        check("descripcion", "La descripción debe tener un máximo de 500 caracteres")
            .optional()
            .isLength({ max: 500 }),
        check("fecha_inicio", "La fecha de inicio es obligatoria y debe ser válida")
            .notEmpty()
            .isDate(),
        check("fecha_fin", "La fecha de fin es obligatoria y debe ser válida")
            .notEmpty()
            .isDate(),
        check("categorias", "Las categorías deben tener un máximo de 255 caracteres")
            .optional()
            .isLength({ max: 255 }),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    createRally
);

// Listar todos los rallies
router.get("/", getRallies);

// Modificar un rally (solo el creador o administradores)
router.put(
    "/:id",
    protect,
    [
        check("nombre", "El nombre debe tener un máximo de 255 caracteres")
            .optional()
            .isLength({ max: 255 }),
        check("descripcion", "La descripción debe tener un máximo de 500 caracteres")
            .optional()
            .isLength({ max: 500 }),
        check("fecha_inicio", "La fecha de inicio debe ser válida")
            .optional()
            .isDate(),
        check("fecha_fin", "La fecha de fin debe ser válida")
            .optional()
            .isDate(),
        check("categorias", "Las categorías deben tener un máximo de 255 caracteres")
            .optional()
            .isLength({ max: 255 }),
        check("estado", "El estado debe ser 'activo' o 'finalizado'")
            .optional()
            .isIn(["activo", "finalizado"]),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    updateRally
);

// Eliminar un rally (solo el creador o administradores)
router.delete("/:id", protect, deleteRally);

module.exports = router;