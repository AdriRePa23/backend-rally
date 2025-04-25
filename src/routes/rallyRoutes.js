const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { createRally, updateRally, deleteRally, getRallies, getRalliesConImagen } = require("../controllers/rallyController");
const { check, validationResult } = require("express-validator");

const router = express.Router();

// Crear un rally
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
        check("fecha_inicio", "La fecha de inicio es obligatoria y debe ser válida").notEmpty().isDate(),
        check("fecha_fin", "La fecha de fin es obligatoria y debe ser válida").notEmpty().isDate(),
        check("categorias", "Las categorías deben tener un máximo de 255 caracteres")
            .optional()
            .isLength({ max: 255 }),
        check("cantidad_fotos_max", "La cantidad máxima de fotos debe ser un número entero positivo")
            .notEmpty()
            .isInt({ min: 1 }),
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

// Listar todos los rallies con imagen mas votada
router.get("/card", getRalliesConImagen);

// Actualizar un rally
router.put(
    "/:id",
    protect,
    [
        check("nombre", "El nombre debe tener un máximo de 255 caracteres").optional().isLength({ max: 255 }),
        check("descripcion", "La descripción debe tener un máximo de 500 caracteres").optional().isLength({ max: 500 }),
        check("fecha_inicio", "La fecha de inicio debe ser válida").optional().isDate(),
        check("fecha_fin", "La fecha de fin debe ser válida").optional().isDate(),
        check("categorias", "Las categorías deben tener un máximo de 255 caracteres").optional().isLength({ max: 255 }),
        check("cantidad_fotos_max", "La cantidad máxima de fotos debe ser un número entero positivo")
            .optional()
            .isInt({ min: 1 }),
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

// Eliminar un rally
router.delete(
    "/:id",
    protect,
    [
        check("id", "El ID del rally debe ser un número entero").isInt(),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    deleteRally
);

module.exports = router;