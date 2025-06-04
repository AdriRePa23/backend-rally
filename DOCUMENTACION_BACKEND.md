# Backend Rally Fotográfico

## Portada
- **Proyecto:** Backend Rally Fotográfico
- **Autor:** Adrián Real Palacios
- **Descripción:** API REST segura y profesional para la gestión de rallies fotográficos.

---

## Índice
1. [Introducción](#introducción)
2. [Tecnologías utilizadas](#tecnologías-utilizadas)
3. [Instalación y despliegue](#instalación-y-despliegue)
4. [Estructura del proyecto](#estructura-del-proyecto)
5. [Seguridad](#seguridad)
6. [Endpoints principales](#endpoints-principales)
7. [Gestión de recursos externos](#gestión-de-recursos-externos)
8. [Manejo de errores](#manejo-de-errores)
9. [Pruebas](#pruebas)
10. [Consideraciones finales](#consideraciones-finales)
11. [Anexos](#anexos)
12. [Base de datos y script SQL](#base-de-datos-y-script-sql)

---

## Introducción
Este backend proporciona la lógica y seguridad necesarias para una aplicación de rallies fotográficos, permitiendo la gestión de usuarios, rallies, publicaciones, comentarios y votaciones, así como la integración con servicios externos como Cloudinary y SendGrid.

## Justificación de tecnologías elegidas

### ¿Por qué Node.js con Express?
- **Rendimiento y escalabilidad:** Node.js utiliza un modelo de I/O no bloqueante y orientado a eventos, lo que lo hace muy eficiente para aplicaciones con muchas conexiones simultáneas, como una API REST.
- **Gran ecosistema:** La comunidad de Node.js es enorme y existen miles de paquetes útiles (npm), lo que acelera el desarrollo y facilita la integración de funcionalidades modernas (autenticación, seguridad, validación, etc.).
- **Desarrollo rápido y flexible:** Express es minimalista y permite estructurar el backend a medida, sin la rigidez de frameworks más pesados como Spring (Java) o Laravel (PHP).
- **JavaScript fullstack:** Permite usar el mismo lenguaje (JavaScript) en frontend y backend, facilitando la colaboración y el mantenimiento.
- **Comparativa:**
  - *Spring Boot* es robusto pero más complejo y requiere Java, lo que puede ralentizar el desarrollo y aumentar la curva de aprendizaje.
  - *Laravel* es potente en PHP, pero Node.js ofrece mejor rendimiento en tiempo real y mayor compatibilidad con herramientas modernas de frontend.

### ¿Por qué Cloudinary y no almacenamiento local?
- **Escalabilidad y fiabilidad:** Cloudinary es un servicio en la nube especializado en gestión de imágenes, lo que garantiza alta disponibilidad, backups y escalabilidad automática.
- **Optimización automática:** Permite transformar, comprimir y servir imágenes optimizadas para cada dispositivo y red, mejorando la experiencia de usuario.
- **Seguridad:** Las imágenes no se almacenan en el servidor, reduciendo riesgos de seguridad y problemas de espacio en disco.
- **Integración sencilla:** Cloudinary ofrece SDKs y APIs fáciles de usar, y se integra perfectamente con Node.js.
- **Comparativa:**
  - *Almacenamiento local* puede saturar el servidor, complica los backups y la migración, y no ofrece optimización automática ni CDN.

## Tecnologías utilizadas
- Node.js + Express
- Base de datos SQL (por ejemplo, MySQL, PostgreSQL, SQLite)
- Cloudinary (almacenamiento de imágenes)
- SendGrid (envío de emails)
- Helmet (headers de seguridad)
- Express-rate-limit (rate limiting)
- CORS
- Dotenv

## Instalación y despliegue
1. **Requisitos previos:**
   - Node.js >= 16
   - npm
   - Base de datos SQL (MySQL, PostgreSQL, SQLite, etc.) configurada y accesible
   - Cuenta en Cloudinary y SendGrid
2. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repo>
   cd backend-rally
   ```
3. **Instalar dependencias:**
   ```bash
   npm install
   ```
4. **Configurar variables de entorno:**
   - Copia `.env.example` a `.env` y rellena los valores:
     - `SQL_URI` o los datos de conexión a tu base de datos SQL
     - `CLOUDINARY_URL`, `SENDGRID_API_KEY`, `EMAIL_USER`, `FRONTEND_URL`, etc.
5. **Iniciar el servidor:**
   - Desarrollo: `npm run dev`
   - Producción: `npm start`

## Estructura del proyecto
- `src/server.js`: Punto de entrada principal.
- `src/routes/`: Definición de rutas de la API.
- `src/controllers/`: Lógica de negocio de cada recurso.
- `src/models/`: Modelos y consultas SQL.
- `src/middlewares/`: Middlewares de autenticación, errores, etc.
- `src/config/`: Configuración de servicios externos y base de datos.
- `uploads/`: Carpeta para archivos temporales (si aplica).

## Seguridad
- **CORS** restringido a orígenes permitidos (`localhost:5173` y `FRONTEND_URL`).
- **Helmet** para headers de seguridad HTTP.
- **Rate limiting** en endpoints de autenticación (5 intentos/minuto).
- **Validación y sanitización** de entradas en todos los endpoints críticos.
- **Manejo centralizado de errores** con mensajes genéricos.
- **Control de recursos externos** (Cloudinary, SendGrid).
- **Sin logs de errores en producción**.

## Endpoints principales
| Método | Ruta                        | Descripción                        | Auth |
|--------|-----------------------------|------------------------------------|------|
| POST   | /api/auth/login             | Login de usuario                   | No   |
| POST   | /api/auth/register          | Registro de usuario                | No   |
| GET    | /api/rallies                | Listar rallies                     | No   |
| POST   | /api/rallies                | Crear rally                        | Sí   |
| GET    | /api/publicaciones          | Listar publicaciones               | No   |
| POST   | /api/publicaciones          | Crear publicación                  | Sí   |
| POST   | /api/votaciones             | Votar publicación                  | Sí   |
| POST   | /api/comentarios            | Comentar publicación               | Sí   |
| GET    | /api/estadisticas           | Estadísticas generales             | Sí   |
| GET    | /api/usuarios/me            | Perfil del usuario autenticado     | Sí   |

> **Nota:** Todos los endpoints protegidos requieren token JWT en el header `Authorization`.

### Ejemplo de login
```http
POST /api/auth/login
Content-Type: application/json
{
  "email": "usuario@ejemplo.com",
  "password": "********"
}
```
Respuesta:
```json
{
  "token": "...jwt...",
  "usuario": { "nombre": "...", ... }
}
```

## Gestión de recursos externos
- **Cloudinary:** Almacena y elimina imágenes de publicaciones y rallies de forma segura.
- **SendGrid:** Envía emails de verificación y notificaciones.

## Manejo de errores
- Todos los errores se gestionan de forma centralizada.
- Los mensajes enviados al cliente son genéricos y no exponen detalles internos.
- Ejemplo de error:
```json
{
  "message": "Error interno del servidor"
}
```

## Pruebas
- Se recomienda usar Postman para probar los endpoints.
- Incluye la colección `backend-rally.postman_collection.json` para facilitar las pruebas.

## Consideraciones finales
- El backend sigue buenas prácticas de seguridad y limpieza de código.
- Listo para producción.
- Mejoras futuras: tests automáticos, documentación Swagger, integración continua.

## Anexos
- [Enlace a Cloudinary](https://cloudinary.com/)
- [Enlace a SendGrid](https://sendgrid.com/)
- [Documentación Express](https://expressjs.com/)

## Base de datos y script SQL

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

---

> **Defiende tu proyecto mostrando la seguridad, la estructura y la claridad de la API.**
