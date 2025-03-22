const pool = require("../config/db");

const createRally = async (req, res) => {
    const { nombre, descripcion, fecha_inicio, fecha_fin, categorias } = req.body;

    if (!nombre || !fecha_inicio || !fecha_fin) {
        return res.status(400).json({ message: "Todos los campos obligatorios deben ser completados" });
    }

    try {
        const [result] = await pool.query(
            "INSERT INTO rallies (nombre, descripcion, fecha_inicio, fecha_fin, categorias, estado, creador_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [nombre, descripcion, fecha_inicio, fecha_fin, categorias, "activo", req.user.id]
        );

        res.status(201).json({ message: "Rally creado correctamente", rallyId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear el rally" });
    }
};

const getRallies = async (req, res) => {
    try {
        const [rallies] = await pool.query("SELECT * FROM rallies");
        res.status(200).json(rallies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los rallies" });
    }
};

const updateRally = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, fecha_inicio, fecha_fin, categorias, estado } = req.body;

    try {
        const [rally] = await pool.query("SELECT * FROM rallies WHERE id = ?", [id]);
        if (rally.length === 0) {
            return res.status(404).json({ message: "Rally no encontrado" });
        }

        if (rally[0].creador_id !== req.user.id && req.user.rol_id !== 2) {
            return res.status(403).json({ message: "No tienes permiso para modificar este rally" });
        }

        await pool.query(
            "UPDATE rallies SET nombre = ?, descripcion = ?, fecha_inicio = ?, fecha_fin = ?, categorias = ?, estado = ? WHERE id = ?",
            [nombre, descripcion, fecha_inicio, fecha_fin, categorias, estado, id]
        );

        res.status(200).json({ message: "Rally actualizado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar el rally" });
    }
};

const deleteRally = async (req, res) => {
    const { id } = req.params;

    try {
        const [rally] = await pool.query("SELECT * FROM rallies WHERE id = ?", [id]);
        if (rally.length === 0) {
            return res.status(404).json({ message: "Rally no encontrado" });
        }

        if (rally[0].creador_id !== req.user.id && req.user.rol_id !== 2) {
            return res.status(403).json({ message: "No tienes permiso para eliminar este rally" });
        }

        await pool.query("DELETE FROM rallies WHERE id = ?", [id]);

        res.status(200).json({ message: "Rally eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar el rally" });
    }
};

module.exports = { createRally, getRallies, updateRally, deleteRally };