const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { createPublicacion, getPublicacionesByRally, deletePublicacion } = require("../controllers/publicacionController");
const multer = require("multer");

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Configuración básica de multer

// Crear una publicación
router.post("/", protect, upload.single("fotografia"), createPublicacion);

// Obtener publicaciones de un rally
router.get("/", getPublicacionesByRally);

// Eliminar una publicación
router.delete("/:id", protect, deletePublicacion);

module.exports = router;