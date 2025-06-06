// Middleware centralizado para manejo de errores en Express
module.exports = (err, req, res, next) => {
    // Log interno solo en desarrollo (no exponer detalles en producción)
    if (process.env.NODE_ENV !== 'production') {
        console.error(err);
    }
    // Usa el status del error si existe, si no 500
    const status = err.status || 500;
    // Mensaje seguro para el cliente
    const message = err.message || 'Error interno del servidor';
    // En desarrollo, incluye el stack trace
    res.status(status).json({
        message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
};
