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

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
