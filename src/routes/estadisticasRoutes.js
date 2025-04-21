const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware"); // Middleware para roles
const { getEstadisticas } = require("../controllers/estadisticasController");

const router = express.Router();

// Ruta para obtener estadísticas (solo administradores)
router.get("/", protect, authorize([2]), getEstadisticas);

module.exports = router;