const jwt = require("jsonwebtoken");

const optionalAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Adjuntar el usuario decodificado al objeto `req`
        } catch (error) {
            console.warn("Token inválido o expirado, continuando como no autenticado.");
        }
    }

    next(); // Continuar con la solicitud, autenticado o no
};

module.exports = optionalAuth;