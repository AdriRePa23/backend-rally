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
- [Tu Nombre]
- Proyecto Integrado 2025

---

> Para más detalles, consulta la documentación técnica incluida en el repositorio.
