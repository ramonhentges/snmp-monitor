const db = require("../config/database");
const camelcaseKeys = require("camelcase-keys");
const validacao = require("../util/validacao.bd");

// ==> Método responsável por criar um novo 'Trigger':
exports.createTrigger = async (req, res) => {
  const {
    descricao,
    idSensor,
    idSeveridade,
    ativo,
    enviarEmail,
    valorComparado,
    comparacao,
  } = req.body;
  let erros = {};

  (await validacao.triggerJaCadastrado(idSensor, "descricao", descricao)) &&
    (erros["descricao"] = "Esta descrição já está cadastrada neste Sensor!");

  if (Object.keys(erros).length == 0) {
    const {
      rowCount,
    } = await db.query(
      "INSERT INTO trigger (descricao, id_sensor, id_severidade, ativo, enviar_email, valor_comparado, comparacao) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [
        descricao,
        idSensor,
        idSeveridade,
        ativo,
        enviarEmail,
        valorComparado,
        comparacao,
      ]
    );
    rowCount == 1
      ? res.status(201).send({ message: "successfull" })
      : res.status(500).send({ message: "Erro ao salvar dados." });
  } else {
    res.status(422).send(erros);
  }
};

// ==> Método responsável por listar todos os 'Triggers' de um Template:
exports.listAllTriggers = async (req, res) => {
  const { idTemplate } = req.params;
  const response = await db.query(
    'SELECT t.id_trigger, t.descricao AS "descricaoTrigger", sv.descricao AS "descricaoSeveridade", s.descricao AS "descricaoSensor", t.ativo, t.enviar_email, t.valor_comparado, t.comparacao ' +
    'FROM trigger t, sensor s, severidade sv WHERE s.id_template = $1 AND t.id_sensor = s.id_sensor AND t.id_severidade = sv.id_severidade ORDER BY t.descricao ASC',
    [idTemplate]
  );
  res.status(200).send(camelcaseKeys(response.rows));
};

// ==> Método responsável por selecionar 'Trigger' pelo 'Id':
exports.findTriggerById = async (req, res) => {
  const idTrigger = parseInt(req.params.id);
  const response = await db.query(
    "SELECT * FROM trigger WHERE id_trigger = $1",
    [idTrigger]
  );
  res.status(200).send(camelcaseKeys(response.rows));
};

// ==> Método responsável por atualizar um 'Trigger' pelo 'Id':
exports.updateTriggerById = async (req, res) => {
  const idTrigger = parseInt(req.params.id);
  const {
    descricao,
    idSensor,
    idSeveridade,
    ativo,
    enviarEmail,
    valorComparado,
    comparacao,
  } = req.body;
  let erros = {};

  (await validacao.triggerJaCadastradoUpdate(
    idSensor,
    "descricao",
    descricao,
    idTrigger
  )) &&
    (erros["descricao"] = "Esta descrição já está cadastrada neste Sensor!");

  if (Object.keys(erros).length == 0) {
    const response = await db.query(
      "UPDATE trigger SET descricao = $1, id_sensor = $2, id_severidade = $3, ativo = $4, enviar_email = $5, valor_comparado = $6, comparacao = $7 WHERE id_trigger = $8",
      [
        descricao,
        idSensor,
        idSeveridade,
        ativo,
        enviarEmail,
        valorComparado,
        comparacao,
        idTrigger,
      ]
    );

    res.status(200).send({ message: "successfull" });
  } else {
    res.status(422).send(erros);
  }
};

// ==> Método responsável por excluir um 'Trigger' pelo 'Id':
exports.deleteTriggerById = async (req, res) => {
  const idTrigger = parseInt(req.params.id);
  await db.query("DELETE FROM trigger WHERE id_trigger = $1", [idTrigger]);

  res.status(204).send();
};
