const express = require("express");
const { check, validationResult } = require("express-validator");
const { registerUser, loginUser, verifyToken, resendVerification, requestPasswordReset, resetPassword } = require("../controllers/authController");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario"); // Asegúrate de que la ruta sea correcta
const path = require("path");

const router = express.Router();

// Validaciones para registrar usuarios
router.post(
    "/register",
    [
        check("nombre", "El nombre es obligatorio y debe tener un máximo de 255 caracteres")
            .notEmpty()
            .isLength({ max: 255 }),
        check("email", "El email es obligatorio, debe ser válido y tener un máximo de 255 caracteres")
            .notEmpty()
            .isEmail()
            .isLength({ max: 255 }),
        check("password", "La contraseña es obligatoria, debe tener entre 6 y 255 caracteres")
            .notEmpty()
            .isLength({ min: 6, max: 255 }),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    registerUser
);

// Validaciones para iniciar sesión
router.post(
    "/login",
    [
        check("email", "El email es obligatorio y debe ser válido")
            .notEmpty()
            .isEmail()
            .isLength({ max: 255 }),
        check("password", "La contraseña es obligatoria y debe tener entre 6 y 255 caracteres")
            .notEmpty()
            .isLength({ min: 6, max: 255 }),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    loginUser
);

router.post("/verify-token", verifyToken, (req, res) => {
    // Si el token es válido, `req.user` contendrá los datos del usuario
    res.status(200).json({
        message: "Token válido",
        user: req.user, // Devuelve los datos del usuario decodificados del token
    });
});

router.get("/verify-email", async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).sendFile(path.join(__dirname, "../views/verify-error.html"));
    }

    try {
        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Actualizar el campo "verificado" del usuario
        await Usuario.update(decoded.id, { verificado: 1 });

        // Enviar la página HTML de éxito
        res.sendFile(path.join(__dirname, "../views/verify-success.html"));
    } catch (error) {
        console.error(error);
        res.status(400).sendFile(path.join(__dirname, "../views/verify-error.html"));
    }
});

// Reenviar email de verificación
router.post("/resend-verification", resendVerification);

// Solicitar recuperación de contraseña
router.post("/request-password-reset", requestPasswordReset);

// Restablecer contraseña
router.post("/reset-password", resetPassword);

module.exports = router;