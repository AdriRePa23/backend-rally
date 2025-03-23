const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { createVotacion, getVotosByPublicacion } = require("../controllers/votacionController");

const router = express.Router();

// Crear un voto
router.post("/", protect, createVotacion);

// Obtener votos de una publicación
router.get("/", getVotosByPublicacion);

module.exports = router;