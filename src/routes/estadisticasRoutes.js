const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { getEstadisticas } = require("../controllers/estadisticasController");

const router = express.Router();

// Ruta para obtener estadísticas (solo administradores)
router.get("/", protect, getEstadisticas);

module.exports = router;