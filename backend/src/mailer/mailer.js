const nodemailer = require("nodemailer");
const db = require("../config/database");
const camelcaseKeys = require("camelcase-keys");
let email = {};
let transporter;

async function atualizarEmail() {
  const { rows } = await db.query("SELECT * FROM email");
  email = camelcaseKeys(rows[0]);
  transporter = nodemailer.createTransport({
    host: email.hostSmtp,
    port: email.portaSmtp,
    secure: email.criptografia,
    auth: {
      user: email.usuario,
      pass: email.senha,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}
async function enviarEmail(titulo, corpo) {
  // send mail with defined transport object
  await transporter
    .sendMail({
      from: `${email.descricao} <${email.emailOrigem}>`, // sender address
      to: email.emailDestino, // list of receivers
      subject: titulo, // Subject line
      text: corpo, // plain text body
      html: `<b>${corpo}</b>`, // html body
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = {
  atualizarEmail,
  enviarEmail,
};
