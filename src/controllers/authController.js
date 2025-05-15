const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Usuario = require("../models/Usuario"); // Modelo de usuario
const sendEmail = require("../config/sendgrid"); // Configuración de SendGrid

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
        const verificationUrl = `http://localhost:3000/api/auth/verify-email?token=${verificationToken}`;
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
        // Buscar el usuario por email
        const user = await Usuario.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Verificar si el usuario está verificado
        if (user.verificado === 0) {
            return res.status(403).json({ message: "Por favor, verifica tu cuenta antes de iniciar sesión" });
        }

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(password, user.contrasena);
        if (!isMatch) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        // Generar un token JWT
        const token = jwt.sign(
            { id: user.id, nombre: user.nombre, email: user.email, rol_id: user.rol_id },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        res.status(200).json({ message: "Inicio de sesión exitoso", token });
    } catch (error) {
        console.error(error);
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

module.exports = { registerUser, loginUser, verifyToken };

