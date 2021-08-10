const db = require("../config/database");
const camelcaseKeys = require('camelcase-keys');

// ==> Método responsável por criar um novo:
exports.createTemplate = async (req, res) => {
  const { descricao } = req.body;
  if (await descricaoValida(descricao)) {
    const {
      rowCount,
      rows,
    } = await db.query("INSERT INTO template (descricao) VALUES ($1) RETURNING id_template", [
      descricao,
    ]);
    if (rowCount == 1) {
      res.status(201).send({ message: "successfull", id: rows[0].id_template });
    } else {
      res.status(500).send({ message: "Erro ao salvar dados." });
    }
  } else {
    res.status(409).send({
      descricao: "Já existe um template com esta descrição.",
    });
  }
};

// ==> Método responsável por listar todos:
exports.listAllTemplates = async (req, res) => {
  const response = await db.query(
    "SELECT * FROM template ORDER BY descricao ASC"
  );
  res.status(200).send(camelcaseKeys(response.rows));
};

// ==> Método responsável por selecionar pelo 'Id':
exports.findTemplateById = async (req, res) => {
  const id = parseInt(req.params.id);
  const response = await db.query(
    "SELECT * FROM template WHERE id_template = $1",
    [id]
  );
  res.status(200).send(camelcaseKeys(response.rows));
};

// ==> Método responsável por atualizar pelo 'Id':
exports.updateTemplateById = async (req, res) => {
  const id = parseInt(req.params.id);
  const { descricao } = req.body;

  if (await descricaoValidaUpdate(descricao, id)) {
    const {
      rowCount,
    } = await db.query(
      "UPDATE template SET descricao = $1 WHERE id_template = $2",
      [descricao, id]
    );
    if (rowCount == 1) {
      res.status(200).send({ message: "successfull" });
    } else {
      res.status(500).send({ message: "Erro ao salvar dados." });
    }
  } else {
    res.status(409).send({
      descricao: "Já existe um template com esta descrição.",
    });
  }
};

// ==> Método responsável por excluir pelo 'Id':
exports.deleteTemplateById = async (req, res) => {
  const id = parseInt(req.params.id);
  await db.query("DELETE FROM template WHERE id_template = $1", [id]);

  res.status(204).send();
};

async function descricaoValida(descricao) {
  const response = await db.query(
    "SELECT * FROM template WHERE descricao ilike $1",
    [descricao]
  );
  if (response.rowCount == 0) {
    return true;
  } else {
    return false;
  }
}

async function descricaoValidaUpdate(descricao, id) {
  const response = await db.query(
    "SELECT * FROM template WHERE descricao ilike $1 and id_template != $2",
    [descricao, id]
  );
  if (response.rowCount == 0) {
    return true;
  } else {
    return false;
  }
}
