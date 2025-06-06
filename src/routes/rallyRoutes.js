// Rutas de rallies: crear, consultar, actualizar y eliminar rallies
const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { createRally, updateRally, deleteRally, getRallies, getRalliesConImagen, getRallyById, getRalliesByUsuario } = require("../controllers/rallyController");
const { check, validationResult } = require("express-validator");

const router = express.Router();

// Crear un rally (requiere autenticación y validación de datos)
router.post(
    "/",
    protect,
    [
        check("nombre", "El nombre es obligatorio y debe tener un máximo de 255 caracteres")
            .notEmpty()
            .isLength({ max: 255 })
            .trim().escape(),
        check("descripcion", "La descripción debe tener un máximo de 500 caracteres")
            .optional()
            .isLength({ max: 500 })
            .trim().escape(),
        check("fecha_inicio", "La fecha de inicio es obligatoria y debe ser válida").notEmpty().isDate(),
        check("fecha_fin", "La fecha de fin es obligatoria y debe ser válida").notEmpty().isDate(),
        check("categorias", "Las categorías deben tener un máximo de 255 caracteres")
            .optional()
            .isLength({ max: 255 })
            .trim().escape(),
        check("cantidad_fotos_max", "La cantidad máxima de fotos debe ser un número entero positivo y máximo 100")
            .notEmpty()
            .isInt({ min: 1, max: 100 }),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // Validar que fecha_fin > fecha_inicio
        const { fecha_inicio, fecha_fin } = req.body;
        if (new Date(fecha_fin) <= new Date(fecha_inicio)) {
            return res.status(400).json({ errors: [{ msg: "La fecha de fin debe ser posterior a la de inicio", param: "fecha_fin" }] });
        }
        next();
    },
    createRally
);

// Listar todos los rallies
router.get("/", getRallies);

// Listar todos los rallies con imagen más votada
router.get("/card", getRalliesConImagen);

// Obtener información de un rally por ID
router.get("/:id", getRallyById);

// Obtener rallies creados por un usuario
router.get("/usuario/:usuario_id", getRalliesByUsuario);

// Buscar rallies por nombre (LIKE)
router.get("/buscar/nombre/:nombre", async (req, res) => {
    const { nombre } = req.params;
    try {
        const rallies = await require("../models/Rally").findByNombreLike(nombre);
        res.status(200).json(rallies);
    } catch (error) {
        res.status(500).json({ message: "Error al buscar rallies por nombre" });
    }
});

// Actualizar un rally (requiere autenticación)
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

// Eliminar un rally (requiere autenticación)
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

// Exporta el router de rallies
module.exports = router;