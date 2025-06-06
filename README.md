# 🚀 Backend Rally Fotográfico

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)
![Express](https://img.shields.io/badge/Express.js-4.x-blue?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![Cloudinary](https://img.shields.io/badge/Cloudinary-API-blue?logo=cloudinary)
![SendGrid](https://img.shields.io/badge/SendGrid-API-blue?logo=sendgrid)
![License](https://img.shields.io/badge/Licencia-MIT-lightgrey)

> API REST segura y profesional para la gestión de rallies fotográficos.

---

## 📑 Tabla de Contenidos
- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Uso](#uso)
- [Endpoints principales](#endpoints-principales)
- [Seguridad](#seguridad)
- [Recursos externos](#recursos-externos)
- [Autor](#autor)
- [Base de datos y script SQL](#base-de-datos-y-script-sql)
- [Configuración del archivo .env](#-configuración-del-archivo-env)

---

## 📖 Descripción
Backend robusto para una aplicación de rallies fotográficos. Permite gestionar usuarios, rallies, publicaciones, comentarios y votaciones, integrando servicios externos como Cloudinary y SendGrid. Listo para producción, seguro y documentado.

## 🛠️ Tecnologías
- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **Cloudinary** (imágenes)
- **SendGrid** (emails)
- **Helmet** (seguridad HTTP)
- **Express-rate-limit** (rate limiting)
- **CORS**
- **Dotenv**

## ⚡ Instalación
1. Clona el repositorio:
   ```bash
   git clone <url-del-repo>
   cd backend-rally
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Configura el archivo `.env` (ver `.env.example`).
4. Inicia el servidor:
   - Desarrollo: `npm run dev`
   - Producción: `npm start`

## ▶️ Uso rápido
- El backend corre por defecto en `http://localhost:3000`
- Documentación completa en [`DOCUMENTACION_BACKEND.md`](./DOCUMENTACION_BACKEND.md)
- Prueba los endpoints con la colección Postman incluida: `backend-rally.postman_collection.json`

## 🔗 Endpoints principales
| Método | Ruta                  | Descripción                | Auth |
|--------|-----------------------|----------------------------|------|
| POST   | /api/auth/login       | Login de usuario           | No   |
| POST   | /api/auth/register    | Registro de usuario        | No   |
| GET    | /api/rallies          | Listar rallies             | No   |
| POST   | /api/rallies          | Crear rally                | Sí   |
| GET    | /api/publicaciones    | Listar publicaciones       | No   |
| POST   | /api/publicaciones    | Crear publicación          | Sí   |
| POST   | /api/votaciones       | Votar publicación          | Sí   |
| POST   | /api/comentarios      | Comentar publicación       | Sí   |
| GET    | /api/estadisticas     | Estadísticas generales     | Sí   |
| GET    | /api/usuarios/me      | Perfil del usuario         | Sí   |

> **Nota:** Endpoints protegidos requieren token JWT en el header `Authorization`.

## 🛡️ Seguridad
- CORS restringido a orígenes permitidos
- Headers de seguridad con Helmet
- Rate limiting en autenticación
- Validación y sanitización de entradas
- Manejo centralizado de errores
- Sin logs de errores en producción

## ☁️ Recursos externos
- **Cloudinary:** Gestión segura de imágenes
- **SendGrid:** Envío de emails

## 👤 Autor
- Adrián Real Palacios
- Proyecto Integrado 2025 - IES VELÁZQUEZ

## 🗄️ Base de datos y script SQL

El archivo `basededatos.sql` incluido en el proyecto contiene todo el esquema necesario para inicializar la base de datos del backend. Incluye la creación de tablas, relaciones, inserción de roles y un usuario administrador por defecto.

### ¿Cómo usar el script?
1. Abre tu gestor de base de datos SQL (por ejemplo, MySQL Workbench, DBeaver, phpMyAdmin, etc.).
2. Ejecuta el contenido de `basededatos.sql` para crear la base de datos, las tablas y los datos iniciales.
3. Configura la conexión a la base de datos en el archivo `.env` del backend (por ejemplo, `SQL_URI` o los parámetros de conexión).

### Tablas principales creadas
- **roles**: Tipos de usuario (Participante, Administrador)
- **usuarios**: Datos de usuario, rol, email, contraseña, etc.
- **rallies**: Información de cada rally fotográfico
- **publicaciones**: Fotografías subidas por los usuarios
- **votaciones**: Votos a publicaciones
- **comentarios**: Comentarios en publicaciones

> El script también inserta un usuario administrador por defecto para facilitar el acceso inicial.

## ⚙️ Configuración del archivo .env

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido (ajusta los valores según tu entorno):

```env
DB_HOST=           # Host de la base de datos SQL
DB_USER=              # Usuario de la base de datos
DB_PASSWORD=  # Contraseña de la base de datos
DB_NAME=           # Nombre de la base de datos
DB_PORT=3306                # Puerto de la base de datos (por defecto 3306 para MySQL)

JWT_SECRET=...              # Clave secreta para firmar los JWT

CLOUDINARY_CLOUD_NAME=...   # Nombre de tu cuenta Cloudinary
CLOUDINARY_API_KEY=...      # API Key de Cloudinary
CLOUDINARY_API_SECRET=...   # API Secret de Cloudinary

SENDGRID_API_KEY=...        # API Key de SendGrid
EMAIL_USER=...              # Email remitente para notificaciones

FRONTEND_URL=... # URL permitida para CORS (frontend)
```
---


