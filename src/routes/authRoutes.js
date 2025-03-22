const express = require("express");
const { check, validationResult } = require("express-validator");
const { registerUser, loginUser } = require("../controllers/authController");

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

module.exports = router;