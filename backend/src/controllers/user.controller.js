const db = require("../config/database");
const validacaoBd = require("../util/validacao.bd");
const validator = require('validator');
const camelcaseKeys = require("camelcase-keys");

exports.createUser = async (req, res) => {
  const { nomeCompleto, usuario, senha } = req.body;
  let erros = {};
  if (await validacaoBd.campoRepetido("usuario", "usuario", usuario)) {
    erros["usuario"] = "Este nome de usuário já existe.";
  }
  if (!validator.isMD5(senha)) {
    erros["senha"] = "Senha inválida.";
  }
  if(!validator.isAlphanumeric(usuario,'en-US')){
    erros["usuario"] = "O usuário não pode ter caracteres especiais.";
  }
  if (Object.keys(erros).length == 0) {
    const {
      rowCount,
    } = await db.query(
      "INSERT INTO usuario (nome_completo, usuario, senha) VALUES ($1, $2, $3)",
      [nomeCompleto, usuario, senha]
    );
    if (rowCount == 1) {
      res.status(201).send({ message: "successfull" });
    } else {
      res.status(500).send({ message: "Erro ao salvar dados." });
    }
  } else {
    res.status(422).send(erros);
  }
};

exports.listAllUsers = async (req, res) => {
  const response = await db.query(
    "SELECT id_usuario, nome_completo, usuario FROM usuario ORDER BY nome_completo ASC"
  );
  res.status(200).send(camelcaseKeys(response.rows));
};

exports.findUserById = async (req, res) => {
  const id = parseInt(req.params.id);
  const response = await db.query(
    "SELECT id_usuario, nome_completo, usuario FROM usuario WHERE id_usuario = $1",
    [id]
  );
  res.status(200).send(camelcaseKeys({ ...response.rows[0], senha: "" }));
};

exports.updateUserById = async (req, res) => {
  const id = parseInt(req.params.id);
  const { nomeCompleto, usuario, senha } = req.body;
  let erros = {};
  if (
    await validacaoBd.campoRepetidoUpdate("usuario", "usuario", usuario, id)
  ) {
    erros["usuario"] = "Este nome de usuário já existe.";
  }
  if (senha.length > 0 && !validator.isMD5(senha)) {
    erros["senha"] = "Senha inválida.";
  }
  if(!validator.isAlphanumeric(usuario,'en-US')){
    erros["usuario"] = "O usuário não pode ter caracteres especiais.";
  }

  if (Object.keys(erros).length == 0) {
    if (senha.length === 0) {
      const {
        rowCount,
      } = await db.query(
        "UPDATE usuario SET nome_completo = $1, usuario = $2 WHERE id_usuario = $3",
        [nomeCompleto, usuario, id]
      );
      if (rowCount == 1) {
        res.status(200).send({ message: "successfull" });
      } else {
        res.status(500).send({ message: "Erro ao salvar dados." });
      }
    } else {
      const {
        rowCount,
      } = await db.query(
        "UPDATE usuario SET nome_completo = $1, usuario = $2, senha = $3 WHERE id_usuario = $4",
        [nomeCompleto, usuario, senha, id]
      );
      if (rowCount == 1) {
        res.status(200).send({ message: "successfull" });
      } else {
        res.status(500).send({ message: "Erro ao salvar dados." });
      }
    }
  } else {
    res.status(422).send(erros);
  }
};

exports.deleteUserById = async (req, res) => {
  const id = parseInt(req.params.id);
  await db.query("DELETE FROM usuario WHERE id_usuario = $1", [id]);

  res.status(204).send();
};
