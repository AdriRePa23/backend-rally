// Middleware de autenticación JWT: protege rutas privadas
const jwt = require("jsonwebtoken");

// Verifica el token JWT y añade el usuario decodificado a req.user
const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No autorizado, falta el token" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Usuario autenticado disponible en req.user
        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido" });
    }
};

// Exporta el middleware de protección
module.exports = { protect };