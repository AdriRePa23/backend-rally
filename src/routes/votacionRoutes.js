const express = require("express");
const optionalAuth = require("../middlewares/optionalAuthMiddleware");
const { createVotacion, getVotosByPublicacion } = require("../controllers/votacionController");

const router = express.Router();

// Crear un voto (autenticación opcional)
router.post("/", optionalAuth, createVotacion);

// Obtener votos de una publicación
router.get("/", getVotosByPublicacion);

module.exports = router;