const db = require("../config/database");
const camelcaseKeys = require("camelcase-keys");

// ==> Método responsável por criar um novo:
exports.createGroup = async (req, res) => {
  const { descricao } = req.body;
  if (await descricaoValida(descricao)) {
    const {
      rowCount,
      rows,
    } = await db.query(
      "INSERT INTO grupo (descricao) VALUES ($1) RETURNING id_grupo",
      [descricao]
    );
    if (rowCount == 1) {
      res.status(201).send({ message: "successfull", id: rows[0].id_grupo });
    } else {
      res.status(500).send({ message: "Erro ao salvar dados." });
    }
  } else {
    res.status(409).send({
      descricao: "Já existe um grupo com esta descrição.",
    });
  }
};

// ==> Método responsável por listar todos:
exports.listAllGroups = async (req, res) => {
  const response = await db.query("SELECT * FROM grupo ORDER BY descricao ASC");
  res.status(200).send(camelcaseKeys(response.rows));
};

// ==> Método responsável por selecionar pelo 'Id':
exports.findGroupById = async (req, res) => {
  const id = parseInt(req.params.id);
  const response = await db.query("SELECT * FROM grupo WHERE id_grupo = $1", [
    id,
  ]);
  res.status(200).send(camelcaseKeys(response.rows[0]));
};

// ==> Método responsável por atualizar pelo 'Id':
exports.updateGroupById = async (req, res) => {
  const id = parseInt(req.params.id);
  const { descricao } = req.body;

  if (await descricaoValidaUpdate(descricao, id)) {
    const {
      rowCount,
    } = await db.query("UPDATE grupo SET descricao = $1 WHERE id_grupo = $2", [
      descricao,
      id,
    ]);
    if (rowCount == 1) {
      res.status(200).send({ message: "successfull" });
    } else {
      res.status(500).send({ message: "Erro ao salvar dados." });
    }
  } else {
    res.status(409).send({
      descricao: "Já existe um grupo com esta descrição.",
    });
  }
};

// ==> Método responsável por excluir pelo 'Id':
exports.deleteGroupById = async (req, res) => {
  const id = parseInt(req.params.id);
  await db.query("DELETE FROM grupo WHERE id_grupo = $1", [id]);

  res.status(204).send();
};

async function descricaoValida(descricao) {
  const response = await db.query(
    "SELECT * FROM grupo WHERE descricao ilike $1",
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
    "SELECT * FROM grupo WHERE descricao ilike $1 and id_grupo != $2",
    [descricao, id]
  );
  if (response.rowCount == 0) {
    return true;
  } else {
    return false;
  }
}
