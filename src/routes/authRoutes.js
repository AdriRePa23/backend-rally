const express = require("express");
const { check, validationResult } = require("express-validator");
const { registerUser, loginUser, verifyToken, resendVerification, requestPasswordReset, resetPassword, verifyEmail } = require("../controllers/authController");
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
        check("password", "La contraseña es obligatoria, debe tener entre 6 y 255 caracteres, una mayúscula, una minúscula y un número")
            .notEmpty()
            .isLength({ min: 6, max: 255 })
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // Validación extra: email único
        const existingUser = await Usuario.findByEmail(req.body.email);
        if (existingUser) {
            return res.status(400).json({ errors: [{ msg: "El email ya está registrado", param: "email" }] });
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

router.get("/verify-email", verifyEmail);

// Reenviar email de verificación
router.post("/resend-verification", resendVerification);

// Solicitar recuperación de contraseña
router.post("/request-password-reset", requestPasswordReset);

// Restablecer contraseña
router.post("/reset-password", resetPassword);

module.exports = router;