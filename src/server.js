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
const helmet = require("helmet");

dotenv.config();

const app = express();

const allowedOrigins = [
    'http://localhost:5173', // Desarrollo
    process.env.FRONTEND_URL, // Producción (debe estar definida en .env)
    'https://picmetogether.vercel.app' // Dominio de Vercel
].filter(Boolean); // Elimina undefined/null

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); // Permitir Postman y llamadas internas
        // Permitir localhost y cualquier subdominio de picmetogether.vercel.app
        const allowed = /^https?:\/\/(localhost:5173|([a-z0-9-]+\.)?picmetogether\.vercel\.app)$/i;
        if (allowed.test(origin)) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true
}));

// Responder a preflight OPTIONS para todas las rutas
app.options('*', cors());

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
app.use(helmet());

// Rutas de autenticación
app.use("/api/auth", authRoutes);

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
