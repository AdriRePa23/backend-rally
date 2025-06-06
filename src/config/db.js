// Configuración de la conexión a la base de datos MySQL
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

// Crear un pool de conexiones para MySQL usando variables de entorno
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Exportar el pool para usarlo en el resto del proyecto
module.exports = pool;