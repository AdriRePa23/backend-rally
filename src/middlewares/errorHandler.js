// Middleware centralizado de manejo de errores para Express
module.exports = (err, req, res, next) => {
    // Log interno (no exponer detalles en producción)
    if (process.env.NODE_ENV !== 'production') {
        console.error(err);
    }
    // Si el error tiene un status, úsalo; si no, 500
    const status = err.status || 500;
    // Mensaje seguro para el cliente
    const message = err.message || 'Error interno del servidor';
    // Opcional: puedes devolver más info en desarrollo
    res.status(status).json({
        message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
};
