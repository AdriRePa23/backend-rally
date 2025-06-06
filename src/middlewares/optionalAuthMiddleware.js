// Middleware de autenticación opcional JWT
const jwt = require("jsonwebtoken");

// Si hay token, verifica y añade el usuario a req.user; si no, continúa como anónimo
const optionalAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Usuario autenticado disponible en req.user
        } catch (error) {
            // Token inválido o expirado, se ignora y continúa como no autenticado
            console.warn("Token inválido o expirado, continuando como no autenticado.");
        }
    }
    next(); // Continúa la petición, autenticado o no
};

// Exporta el middleware de autenticación opcional
module.exports = optionalAuth;