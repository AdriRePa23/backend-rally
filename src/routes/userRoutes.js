// Rutas de usuario: registro, login, perfil, gestión de usuarios y roles
const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { getUserById, updateUser, deleteUser, getUserPrivateInfo, listUsers, getMe, updatePassword, getUserStats, createAdmin, getAdminById, updateAdmin, deleteAdmin, createGestor, listGestores, getGestorById, updateGestor, deleteGestor } = require("../controllers/userController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { check, validationResult } = require("express-validator");

const router = express.Router();

// Obtener información de un usuario por ID (pública)
router.get("/:id", getUserById);

// Obtener toda la información privada de un usuario (solo dueño o admin)
router.get("/:id/private", protect, getUserPrivateInfo);

// Actualizar usuario (protegido, permite subir foto de perfil)
router.put(
    "/:id",
    protect,
    upload.single("foto_perfil"),
    [
        check("nombre", "El nombre debe tener un máximo de 255 caracteres").optional().isLength({ max: 255 }).trim().escape(),
        check("email", "El email debe ser válido y tener un máximo de 255 caracteres")
            .optional()
            .isEmail()
            .isLength({ max: 255 })
            .trim().escape(),
        check("rol_id", "El rol debe ser un número entero válido").optional().isInt({ min: 1, max: 3 }),
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // Validar unicidad de email si se actualiza
        if (req.body.email) {
            const Usuario = require("../models/Usuario");
            const user = await Usuario.findByEmail(req.body.email);
            if (user && user.id != req.params.id) {
                return res.status(400).json({ errors: [{ msg: "El email ya está registrado", param: "email" }] });
            }
        }
        // Validar tipo y tamaño de foto_perfil si se sube
        if (req.file) {
            const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
            if (!allowedTypes.includes(req.file.mimetype)) {
                return res.status(400).json({ errors: [{ msg: "Solo se permiten imágenes JPG, PNG o WEBP", param: "foto_perfil" }] });
            }
            if (req.file.size > 5 * 1024 * 1024) {
                return res.status(400).json({ errors: [{ msg: "La imagen no puede superar los 5MB", param: "foto_perfil" }] });
            }
        }
        next();
    },
    updateUser
);

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

// Gestión de administradores y gestores (solo admin principal)
router.post("/admin", protect, createAdmin);
router.get("/admin/:id", protect, getAdminById);
router.put("/admin/:id", protect, updateAdmin);
router.delete("/admin/:id", protect, deleteAdmin);
router.post("/gestor", protect, createGestor);
router.get("/gestor", protect, listGestores);
router.get("/gestor/:id", protect, getGestorById);
router.put("/gestor/:id", protect, updateGestor);
router.delete("/gestor/:id", protect, deleteGestor);

// Exporta el router de usuario
module.exports = router;
