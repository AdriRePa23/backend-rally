const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Usuario = require("../models/Usuario");
const sendEmail = require("../config/sendgrid");
const crypto = require("crypto");

const registerUser = async (req, res) => {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    try {
        // Verificar si el usuario ya existe
        const existingUser = await Usuario.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "El usuario ya está registrado" });
        }

        // Cifrar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario
        const userId = await Usuario.create({
            nombre,
            email,
            contrasena: hashedPassword,
            rol_id: 1, 
            verificado: 0, // Usuario no verificado inicialmente
        });

        // Generar un token de verificación
        const verificationToken = jwt.sign(
            { id: userId, email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" } // El token expira en 1 día
        );

        // Enviar correo de verificación
        const verificationUrl = process.env.FRONTEND_URL +`/auth/verify-email?token=${verificationToken}`;
        await sendEmail(
            email,
            "Verifica tu cuenta",
            `
                <h1>Bienvenido a PicMeTogether</h1>
                <p>Por favor, verifica tu cuenta haciendo clic en el siguiente enlace:</p>
                <a href="${verificationUrl}">Verificar cuenta</a>
            `
        );

        res.status(201).json({ message: "Usuario registrado correctamente. Revisa tu correo para verificar tu cuenta." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al registrar el usuario" });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    try {
        const user = await Usuario.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if (user.verificado === 0) {
            return res.status(403).json({ message: "Por favor, verifica tu cuenta antes de iniciar sesión" });
        }

        const isMatch = await bcrypt.compare(password, user.contrasena);
        if (!isMatch) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        const token = jwt.sign(
            { id: user.id, nombre: user.nombre, email: user.email, rol_id: user.rol_id },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        res.status(200).json({ message: "Inicio de sesión exitoso", token });
    } catch (error) {
        res.status(500).json({ message: "Error al iniciar sesión" });
    }
};

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Acceso denegado" });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: "Token no válido" });
    }
};

// Reenviar email de verificación
const resendVerification = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "El email es obligatorio" });
    }
    try {
        const user = await Usuario.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        if (user.verificado) {
            return res.status(400).json({ message: "El usuario ya está verificado" });
        }
        const jwt = require("jsonwebtoken");
        const verificationToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        const verificationUrl = process.env.FRONTEND_URL +`auth/verify-email?token=${verificationToken}`;
        await sendEmail(
            email,
            "Verifica tu cuenta",
            `<h1>Bienvenido a PicMeTogether</h1><p>Por favor, verifica tu cuenta haciendo clic en el siguiente enlace:</p><a href="${verificationUrl}">Verificar cuenta</a>`
        );
        res.status(200).json({ message: "Correo de verificación reenviado" });
    } catch (error) {
        res.status(500).json({ message: "Error al reenviar el correo de verificación" });
    }
};

// Solicitar recuperación de contraseña
const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "El email es obligatorio" });
    }
    try {
        const user = await Usuario.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        // Generar token único y temporal
        const token = crypto.randomBytes(32).toString("hex");
        const expires = Date.now() + 1000 * 60 * 30; // 30 minutos
        // Guardar token y expiración en memoria (ideal: en BD, aquí simple)
        if (!global.passwordResetTokens) global.passwordResetTokens = {};
        global.passwordResetTokens[token] = { userId: user.id, expires };
        // Enviar email con enlace
        const resetUrl = process.env.FRONTEND_URL +`/auth/reset-password?token=${token}`;
        await sendEmail(
            email,
            "Recupera tu contraseña",
            `<p>Haz clic en el siguiente enlace para restablecer tu contraseña (válido 30 minutos):</p><a href="${resetUrl}">${resetUrl}</a>`
        );
        res.status(200).json({ message: "Correo de recuperación enviado" });
    } catch (error) {
        res.status(500).json({ message: "Error al solicitar recuperación de contraseña" });
    }
};

// Restablecer contraseña
const resetPassword = async (req, res) => {
    const { token } = req.query;
    const { nuevaContrasena } = req.body;
    if (!token || !nuevaContrasena) {
        return res.status(400).json({ message: "Token y nueva contraseña son obligatorios" });
    }
    try {
        if (!global.passwordResetTokens || !global.passwordResetTokens[token]) {
            return res.status(400).json({ message: "Token inválido o expirado" });
        }
        const { userId, expires } = global.passwordResetTokens[token];
        if (Date.now() > expires) {
            delete global.passwordResetTokens[token];
            return res.status(400).json({ message: "Token expirado" });
        }
        const bcrypt = require("bcrypt");
        const hashed = await bcrypt.hash(nuevaContrasena, 10);
        await Usuario.updatePassword(userId, { contrasena: hashed });
        delete global.passwordResetTokens[token];
        res.status(200).json({ message: "Contraseña restablecida correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al restablecer la contraseña" });
    }
};

// Verificar email (mover lógica aquí desde la ruta)
const verifyEmail = async (req, res) => {
    const { token } = req.query;
    const path = require("path");
    const jwt = require("jsonwebtoken");
    const Usuario = require("../models/Usuario");
    if (!token) {
        return res.status(400).json({ message: "Token expirado o invalido" });
    }
    try {
        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Actualizar el campo "verificado" del usuario
        await Usuario.update(decoded.id, { verificado: 1 });
        res.status(200).json({ message: "Cuenta verificada correctamente" });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: error.message || "Token expirado o invalido" });
    }
};

module.exports = { registerUser, loginUser, verifyToken, resendVerification, requestPasswordReset, resetPassword, verifyEmail };

