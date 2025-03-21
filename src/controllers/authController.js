const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const registerUser = async (req, res) => {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    try {
        const [existingUser] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "El usuario ya está registrado" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            "INSERT INTO usuarios (nombre, email, contrasena, rol_id) VALUES (?, ?, ?, ?)",
            [nombre, email, hashedPassword, 1] // Asignamos el rol de "Participante" (rol_id = 1)
        );

        res.status(201).json({ message: "Usuario registrado correctamente" });
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
        const [users] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: "Credenciales inválidas" });
        }

        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.contrasena);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Credenciales inválidas" });
        }

        const token = jwt.sign({ id: user.id, email: user.email, rol_id: user.rol_id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al iniciar sesión" });
    }
};

module.exports = { registerUser, loginUser };

