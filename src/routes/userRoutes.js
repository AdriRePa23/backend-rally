const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { getUserById, updateUser, deleteUser, getUserPrivateInfo } = require("../controllers/userController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = express.Router();

// Obtener información de un usuario por ID (pública)
router.get("/:id", getUserById);

// Obtener toda la información privada de un usuario (solo dueño o admin)
router.get("/:id/private", protect, getUserPrivateInfo);

// Actualizar usuario (protegido, permite subir foto de perfil)
router.put("/:id", protect, upload.single("foto_perfil"), updateUser);

// Eliminar usuario (protegido)
router.delete("/:id", protect, deleteUser);

module.exports = router;
