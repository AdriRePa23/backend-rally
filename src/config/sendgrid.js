const sgMail = require("@sendgrid/mail");
const dotenv = require("dotenv");

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, html) => {
    try {
        await sgMail.send({
            to,
            from: process.env.EMAIL_USER, 
            subject,
            html,
        });
        console.log("Correo enviado exitosamente");
    } catch (error) {
        console.error("Error al enviar el correo:", error.response?.body || error.message);
    }
};

module.exports = sendEmail;