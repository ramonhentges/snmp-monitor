const db = require("../config/database");
const camelcaseKeys = require("camelcase-keys");
const mailer = require("../mailer/mailer");

// ==> Método responsável por atualizar email:
exports.updateEmail = async (req, res) => {
  const id = parseInt(req.params.id);
  const {
    descricao,
    emailOrigem,
    emailDestino,
    hostSmtp,
    portaSmtp,
    criptografia,
    usuario,
    senha,
  } = req.body;

  const {
    rowCount,
  } = await db.query(
    "UPDATE email SET descricao = $1, email_origem = $2, email_destino = $3, host_smtp = $4, porta_smtp = $5, criptografia = $6, usuario = $7, senha = $8 WHERE id_email = 1",
    [
      descricao,
      emailOrigem,
      emailDestino,
      hostSmtp,
      portaSmtp,
      criptografia,
      usuario,
      senha,
    ]
  );
  if (rowCount == 1) {
    mailer.atualizarEmail();
    res.status(200).send({ message: "successfull" });
  } else {
    res.status(500).send({ message: "Erro ao salvar dados." });
  }
};

// ==> Método responsável por selecionar email:
exports.findEmail = async (req, res) => {
  const response = await db.query("SELECT * FROM email WHERE id_email = 1");
  res.status(200).send(camelcaseKeys(response.rows[0]));
};
