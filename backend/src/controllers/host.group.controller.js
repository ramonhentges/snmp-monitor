const db = require("../config/database");
const camelcaseKeys = require('camelcase-keys');

// ==> Método responsável por criar um novo:
exports.createHostGroup = async (req, res) => {
  const { idHost, idGrupo } = req.body;
  if (await jaCadastrado(idHost, idGrupo)) {
    res.status(409).send({ message: "Este host já pertence ao grupo!" });
  } else {
    const {
      rowCount,
    } = await db.query(
      "INSERT INTO grupo_host (id_host, id_grupo) VALUES ($1, $2)",
      [idHost, idGrupo]
    );
    if (rowCount == 1) {
      res.status(201).send({ message: "successfull" });
    } else {
      res.status(500).send({ message: "Erro ao salvar dados." });
    }
  }
};

// ==> Método responsável por pegar todos os hosts do grupo pelo Id
exports.findGroupHostById = async (req, res) => {
  const id = parseInt(req.params.id);
  const response = await db.query(
    "SELECT h.id_host, h.nome FROM host h, grupo_host gh WHERE gh.id_grupo = $1 AND h.id_host = gh.id_host",
    [id]
  );
  res.status(200).send(camelcaseKeys(response.rows));
};

// ==> Método responsável por pegar todos os hosts do grupo pelo Id
exports.findHostGroupById = async (req, res) => {
  const id = parseInt(req.params.id);
  const response = await db.query(
    "SELECT g.id_grupo, g.descricao FROM grupo g, grupo_host gh WHERE gh.id_host = $1 AND g.id_grupo = gh.id_grupo",
    [id]
  );
  res.status(200).send(camelcaseKeys(response.rows));
};

// ==> Método responsável por excluir pelo 'Id':
exports.deleteHostGroup = async (req, res) => {
  const idHost = parseInt(req.params.idHost);
  const idGrupo = parseInt(req.params.idGrupo);
  await db.query(
    "DELETE FROM grupo_host WHERE id_host = $1 AND id_grupo = $2",
    [idHost, idGrupo]
  );

  res.status(204).send();
};

exports.deleteGroupHost = async (req, res) => {
  const idHost = parseInt(req.params.idHost);
  const idGrupo = parseInt(req.params.idGrupo);
  await db.query(
    "DELETE FROM grupo_host WHERE id_host = $1 AND id_grupo = $2",
    [idHost, idGrupo]
  );

  res.status(204).send();
};

async function jaCadastrado(idHost, idGrupo) {
  const response = await db.query(
    "SELECT * FROM grupo_host WHERE id_host = $1 AND id_grupo = $2",
    [idHost, idGrupo]
  );
  if (response.rowCount == 0) {
    return false;
  } else {
    return true;
  }
}
