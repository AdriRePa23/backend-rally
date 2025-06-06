// Configuración de Cloudinary para gestión de imágenes
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config();

// Configurar Cloudinary con las credenciales del archivo .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Exportar la instancia de Cloudinary para usar en el proyecto
module.exports = cloudinary;