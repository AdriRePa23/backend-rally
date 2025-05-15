require("dotenv").config(); 

console.log("SENDGRID_API_KEY:", process.env.SENDGRID_API_KEY);

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: "adrianreal234@gmail.com", // Cambia esto por tu destinatario
  from: "picmetogether@hotmail.com", // Cambia esto por tu correo verificado en SendGrid
  subject: "Sending with SendGrid is Fun",
  text: "and easy to do anywhere, even with Node.js",
  html: "<strong>and easy to do anywhere, even with Node.js</strong>",
};

sgMail
  .send(msg)
  .then(() => {
    console.log("Email sent");
  })
  .catch((error) => {
    console.error("Error al enviar el correo:", error.response?.body || error.message);
  });