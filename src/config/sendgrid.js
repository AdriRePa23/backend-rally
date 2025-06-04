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
        // Log eliminado para producción
    } catch (error) {
        // Log eliminado para producción
    }
};

module.exports = sendEmail;