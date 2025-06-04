const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const rallyRoutes = require("./routes/rallyRoutes");
const publicacionRoutes = require("./routes/publicacionRoutes");
const votacionRoutes = require("./routes/votacionRoutes");
const comentarioRoutes = require("./routes/comentarioRoutes");
const estadisticasRoutes = require("./routes/estadisticasRoutes");
const userRoutes = require("./routes/userRoutes");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

dotenv.config();

const app = express();

const allowedOrigins = [
    'http://localhost:5173', // Desarrollo
    process.env.FRONTEND_URL // Producción (debe estar definida en .env)
];
app.use(cors({
    origin: function (origin, callback) {
        // Permitir peticiones sin origen (como Postman) o si está en la lista
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(helmet());

// Rate limiting para endpoints de autenticación
const authLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 5, // máximo 5 intentos por IP
    message: { message: "Demasiados intentos, espera un minuto e inténtalo de nuevo." },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rutas de autenticación
app.use("/api/auth", authLimiter, authRoutes);

// Rutas de rallies
app.use("/api/rallies", rallyRoutes);

// Rutas de publicaciones
app.use("/api/publicaciones", publicacionRoutes);

// Rutas de votaciones
app.use("/api/votaciones", votacionRoutes);

// Rutas de comentarios
app.use("/api/comentarios", comentarioRoutes);

// Rutas de estadísticas
app.use("/api/estadisticas", estadisticasRoutes);

// Rutas de usuarios
app.use("/api/usuarios", userRoutes);

app.get("/", (req, res) => {
    res.send("¡Bienvenido a la API del Rally Fotográfico!");
});

app.use(require("./middlewares/errorHandler"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
