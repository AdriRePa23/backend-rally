const Rally = require("../models/Rally");

const createRally = async (req, res) => {
    const { nombre, descripcion, fecha_inicio, fecha_fin, categorias, cantidad_fotos_max } = req.body;

    if (!nombre || !fecha_inicio || !fecha_fin || !cantidad_fotos_max) {
        return res.status(400).json({ message: "Todos los campos obligatorios deben ser completados" });
    }

    try {
        const rallyId = await Rally.create({
            nombre,
            descripcion,
            fecha_inicio,
            fecha_fin,
            categorias,
            estado: "activo",
            creador_id: req.user.id,
            cantidad_fotos_max,
        });

        res.status(201).json({ message: "Rally creado correctamente", rallyId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear el rally" });
    }
};

const getRallies = async (req, res) => {
    try {
        const rallies = await Rally.findAll();
        res.status(200).json(rallies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los rallies" });
    }
};

const getRalliesConImagen = async (req, res) => {
    try {
        // Llamar al método findAllWithImages para obtener todos los rallies con sus imágenes
        const rallies = await Rally.findAllWithImages();

        // Enviar la respuesta con todos los rallies
        res.status(200).json(rallies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los rallies" });
    }
};

const updateRally = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, fecha_inicio, fecha_fin, categorias, estado, cantidad_fotos_max } = req.body;

    try {
        // Verificar si el rally existe
        const rally = await Rally.findById(id);
        if (!rally) {
            return res.status(404).json({ message: "Rally no encontrado" });
        }

        // Verificar permisos (solo el creador o un administrador puede modificar)
        if (rally.creador_id !== req.user.id && req.user.rol_id !== 2) {
            return res.status(403).json({ message: "No tienes permiso para modificar este rally" });
        }

        // Actualizar el rally con los valores enviados o mantener los valores actuales
        await Rally.update(id, {
            nombre: nombre || rally.nombre,
            descripcion: descripcion || rally.descripcion,
            fecha_inicio: fecha_inicio || rally.fecha_inicio,
            fecha_fin: fecha_fin || rally.fecha_fin,
            categorias: categorias || rally.categorias,
            estado: estado || rally.estado,
            cantidad_fotos_max: cantidad_fotos_max || rally.cantidad_fotos_max,
        });

        res.status(200).json({ message: "Rally actualizado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar el rally" });
    }
};

const deleteRally = async (req, res) => {
    const { id } = req.params;

    try {
        const rally = await Rally.findById(id);
        if (!rally) {
            return res.status(404).json({ message: "Rally no encontrado" });
        }

        if (rally.creador_id !== req.user.id && req.user.rol_id !== 2) {
            return res.status(403).json({ message: "No tienes permiso para eliminar este rally" });
        }

        await Rally.delete(id);

        res.status(200).json({ message: "Rally eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar el rally" });
    }
};

const getRallyById = async (req, res) => {
    const { id } = req.params;
    try {
        const rally = await Rally.findById(id);
        if (!rally) {
            return res.status(404).json({ message: "Rally no encontrado" });
        }
        res.status(200).json(rally);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el rally" });
    }
};

const getRalliesByUsuario = async (req, res) => {
    const { usuario_id } = req.params;
    try {
        const rallies = await Rally.findAllByUsuarioId(usuario_id);
        res.status(200).json(rallies);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los rallies del usuario" });
    }
};

module.exports = { createRally, getRallies, updateRally, deleteRally, getRalliesConImagen, getRallyById, getRalliesByUsuario };