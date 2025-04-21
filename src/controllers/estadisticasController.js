const pool = require("../config/db");

const getEstadisticas = async (req, res) => {
    try {
        // Consultar el número total de usuarios
        const [usuarios] = await pool.query("SELECT COUNT(*) AS total_usuarios FROM usuarios");

        // Consultar el número total de rallies
        const [rallies] = await pool.query("SELECT COUNT(*) AS total_rallies FROM rallies");

        // Consultar el número total de publicaciones
        const [publicaciones] = await pool.query("SELECT COUNT(*) AS total_publicaciones FROM publicaciones");

        // Consultar el número total de votos
        const [votos] = await pool.query("SELECT COUNT(*) AS total_votos FROM votaciones");

        // Consultar el número total de comentarios
        const [comentarios] = await pool.query("SELECT COUNT(*) AS total_comentarios FROM comentarios");

        // Consultar los usuarios más activos (con más publicaciones)
        const [usuariosActivos] = await pool.query(`
            SELECT u.id, u.nombre, COUNT(p.id) AS total_publicaciones
            FROM usuarios u
            LEFT JOIN publicaciones p ON u.id = p.usuario_id
            GROUP BY u.id
            ORDER BY total_publicaciones DESC
            LIMIT 5
        `);

        res.status(200).json({
            total_usuarios: usuarios[0].total_usuarios,
            total_rallies: rallies[0].total_rallies,
            total_publicaciones: publicaciones[0].total_publicaciones,
            total_votos: votos[0].total_votos,
            total_comentarios: comentarios[0].total_comentarios,
            usuarios_mas_activos: usuariosActivos,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener las estadísticas" });
    }
};

module.exports = { getEstadisticas };