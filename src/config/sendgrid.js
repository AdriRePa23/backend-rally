// Configuración de SendGrid para envío de emails
const sgMail = require("@sendgrid/mail");
const dotenv = require("dotenv");

dotenv.config();

// Establecer la API Key de SendGrid desde el archivo .env
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Función para enviar un email
const sendEmail = async (to, subject, html) => {
    try {
        await sgMail.send({
            to,
            from: process.env.EMAIL_USER, // Remitente
            subject,
            html,
        });
        
    } catch (error) {
        
    }
};

// Exportar la función para usarla en el proyecto
module.exports = sendEmail;