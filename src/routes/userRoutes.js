const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { getUserById, updateUser, deleteUser, getUserPrivateInfo, listUsers, getMe, updatePassword, getUserStats, createAdmin, getAdminById, updateAdmin, deleteAdmin, createGestor, listGestores, getGestorById, updateGestor, deleteGestor } = require("../controllers/userController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = express.Router();

// Obtener información de un usuario por ID (pública)
router.get("/:id", getUserById);

// Obtener toda la información privada de un usuario (solo dueño o admin)
router.get("/:id/private", protect, getUserPrivateInfo);

// Actualizar usuario (protegido, permite subir foto de perfil)
router.put("/:id", protect, upload.single("foto_perfil"), updateUser);

// Actualizar contraseña de usuario (solo dueño o admin)
router.put("/:id/password", protect, updatePassword);

// Eliminar usuario (protegido)
router.delete("/:id", protect, deleteUser);

// Listar todos los usuarios o buscar por nombre/email (solo admin)
router.get("/", protect, listUsers);

// Obtener el usuario autenticado (me)
router.get("/me/profile", protect, getMe);

// Obtener estadísticas de usuario
router.get("/:id/stats", getUserStats);

// Crear administrador (solo admin principal)
router.post("/admin", protect, createAdmin);
// Obtener administrador por id (solo admin principal)
router.get("/admin/:id", protect, getAdminById);
// Actualizar administrador (solo admin principal)
router.put("/admin/:id", protect, updateAdmin);
// Eliminar administrador (solo admin principal)
router.delete("/admin/:id", protect, deleteAdmin);

// Crear gestor (solo admin)
router.post("/gestor", protect, createGestor);
// Listar gestores (solo admin)
router.get("/gestor", protect, listGestores);
// Obtener gestor por id (solo admin)
router.get("/gestor/:id", protect, getGestorById);
// Actualizar gestor (solo admin)
router.put("/gestor/:id", protect, updateGestor);
// Eliminar gestor (solo admin)
router.delete("/gestor/:id", protect, deleteGestor);

module.exports = router;
