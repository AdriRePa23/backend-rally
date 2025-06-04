const pool = require("../config/db");
const Rally = require("../models/Rally");

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
        // No log de error en producción para evitar fuga de información
        res.status(500).json({ message: "Error al obtener las estadísticas" });
    }
};

// Estadísticas de un rally (solo dueño o admin)
// Valida permisos y existencia de rally antes de mostrar estadísticas
const getEstadisticasRally = async (req, res) => {
    const { id } = req.params;
    try {
        // Obtener el rally y verificar permisos
        const rally = await Rally.findById(id);
        if (!rally) {
            return res.status(404).json({ message: "Rally no encontrado" });
        }
        if (req.user.id !== rally.creador_id && req.user.rol_id !== 2 && req.user.rol_id !== 3) {
            return res.status(403).json({ message: "No tienes permiso para ver las estadísticas de este rally" });
        }
        // Estadísticas: total publicaciones, total votos, total participantes, votos por publicación, publicaciones por usuario
        const [totalPublicaciones] = await pool.query("SELECT COUNT(*) AS total FROM publicaciones WHERE rally_id = ?", [id]);
        const [totalVotos] = await pool.query(`SELECT COUNT(*) AS total FROM votaciones v JOIN publicaciones p ON v.publicacion_id = p.id WHERE p.rally_id = ?`, [id]);
        const [participantes] = await pool.query("SELECT COUNT(DISTINCT usuario_id) AS total FROM publicaciones WHERE rally_id = ?", [id]);
        const [votosPorPublicacion] = await pool.query(`SELECT p.id, p.descripcion, COUNT(v.id) AS votos FROM publicaciones p LEFT JOIN votaciones v ON p.id = v.publicacion_id WHERE p.rally_id = ? GROUP BY p.id ORDER BY votos DESC`, [id]);
        const [publicacionesPorUsuario] = await pool.query(`SELECT u.id, u.nombre, COUNT(p.id) AS publicaciones FROM usuarios u JOIN publicaciones p ON u.id = p.usuario_id WHERE p.rally_id = ? GROUP BY u.id ORDER BY publicaciones DESC`, [id]);
        res.status(200).json({
            total_publicaciones: totalPublicaciones[0].total,
            total_votos: totalVotos[0].total,
            total_participantes: participantes[0].total,
            votos_por_publicacion: votosPorPublicacion,
            publicaciones_por_usuario: publicacionesPorUsuario
        });
    } catch (error) {
        // No log de error en producción para evitar fuga de información
        res.status(500).json({ message: "Error al obtener estadísticas del rally" });
    }
};

module.exports = { getEstadisticas, getEstadisticasRally };