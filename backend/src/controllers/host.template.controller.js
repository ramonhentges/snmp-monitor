const db = require("../config/database");
const camelcaseKeys = require('camelcase-keys');

// ==> Método responsável por criar um novo:
exports.createHostTemplate = async (req, res) => {
  const { idHost, idTemplate } = req.body;
  if (await jaCadastrado(idHost, idTemplate)) {
    res.status(409).send({ message: "Este host já pertence ao template!" });
  } else {
    const {
      rowCount,
    } = await db.query(
      "INSERT INTO template_host (id_host, id_template) VALUES ($1, $2)",
      [idHost, idTemplate]
    );
    if (rowCount == 1) {
      res.status(201).send({ message: "successfull" });
    } else {
      res.status(500).send({ message: "Erro ao salvar dados." });
    }
  }
};

// ==> Método responsável por pegar todos os hosts do template pelo Id
exports.findTemplateHostById = async (req, res) => {
  const id = parseInt(req.params.id);
  const response = await db.query(
    "SELECT h.id_host, h.nome FROM host h, template_host th WHERE th.id_template = $1 AND h.id_host = th.id_host",
    [id]
  );
  res.status(200).send(camelcaseKeys(response.rows));
};

exports.findHostTemplateById = async (req, res) => {
  const id = parseInt(req.params.id);
  const response = await db.query(
    "SELECT t.id_template, t.descricao FROM template t, template_host th WHERE th.id_host = $1 AND t.id_template = th.id_template",
    [id]
  );
  res.status(200).send(camelcaseKeys(response.rows));
};

exports.deleteHostTemplate = async (req, res) => {
  const idHost = parseInt(req.params.idHost);
  const idTemplate = parseInt(req.params.idTemplate);
  await db.query(
    "DELETE FROM template_host WHERE id_host = $1 AND id_template = $2",
    [idHost, idTemplate]
  );

  res.status(204).send();
};

exports.deleteTemplateHost = async (req, res) => {
  const idHost = parseInt(req.params.idHost);
  const idTemplate = parseInt(req.params.idTemplate);
  await db.query(
    "DELETE FROM template_host WHERE id_host = $1 AND id_template = $2",
    [idHost, idTemplate]
  );

  res.status(204).send();
};

async function jaCadastrado(idHost, idTemplate) {
  const response = await db.query(
    "SELECT * FROM template_host WHERE id_host = $1 AND id_template = $2",
    [idHost, idTemplate]
  );
  if (response.rowCount == 0) {
    return false;
  } else {
    return true;
  }
}
