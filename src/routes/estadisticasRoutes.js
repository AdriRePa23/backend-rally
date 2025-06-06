// Rutas de estadísticas: consulta de estadísticas generales y por rally
const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { getEstadisticas, getEstadisticasRally } = require("../controllers/estadisticasController");

const router = express.Router();

// Ruta para obtener estadísticas generales (solo administradores)
router.get("/", protect, getEstadisticas);

// Ruta para obtener estadísticas de un rally (solo dueño o admin)
router.get("/rally/:id", protect, getEstadisticasRally);

// Exporta el router de estadísticas
module.exports = router;