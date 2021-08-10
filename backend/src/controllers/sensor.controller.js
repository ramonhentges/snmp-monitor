const db = require("../config/database");
const camelcaseKeys = require("camelcase-keys");
const validacao = require("../util/validacao.bd");
const validator = require("validator");
const {
  intervaloValido,
  intervaloEmSegundos,
} = require("../util/validacao.geral");
const taskManager = require("../cron/task.manager");

// ==> Método responsável por criar um novo 'Sensor':
exports.createSensor = async (req, res) => {
  const { descricao, oid, tipo, ativo, intervalo, idTemplate, expressao, diasArmazenado } = req.body;
  let erros = {};
  let intervaloSegundos = "";
  (await validacao.sensorJaCadastrado(idTemplate, "descricao", descricao)) &&
    (erros["descricao"] = "Esta descrição já está cadastrada neste Template!");
  (await validacao.sensorJaCadastrado(idTemplate, "oid", oid)) &&
    (erros["oid"] = "Esta OID já está cadastrada neste Template!");
  if (intervaloValido(intervalo)) {
    intervaloSegundos = intervaloEmSegundos(intervalo);
  } else {
    erros["intervalo"] = "Intervalo Inválido!";
  }
  if (!validator.isInt(diasArmazenado + "", { min: 1 })) {
    erros["diasArmazenado"] = "Especifique um número inteiro maior que zero.";
  }
  if (Object.keys(erros).length == 0) {
    const {
      rowCount,
    } = await db.query(
      "INSERT INTO sensor (descricao, oid, tipo, ativo, intervalo, id_template, expressao, dias_armazenado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [descricao, oid, tipo, ativo, intervaloSegundos, idTemplate, expressao, diasArmazenado]
    );
    if (rowCount == 1) {
      res.status(201).send({ message: "successfull" });
      ativo && taskManager.criarTaskPorTempo(intervaloSegundos);
    } else {
      res.status(500).send({ message: "Erro ao salvar dados." });
    }
  } else {
    res.status(422).send(erros);
  }
};

// ==> Método responsável por listar todos os 'Sensores' de um Template:
exports.listAllSensores = async (req, res) => {
  const { idTemplate } = req.params;
  const response = await db.query(
    "SELECT * FROM sensor s WHERE s.id_template = $1 ORDER BY descricao ASC",
    [idTemplate]
  );
  res.status(200).send(camelcaseKeys(response.rows));
};

// ==> Método responsável por selecionar 'Sensor' pelo 'Id':
exports.findSensorById = async (req, res) => {
  const idSensor = parseInt(req.params.id);
  const response = await db.query("SELECT * FROM sensor WHERE id_sensor = $1", [
    idSensor,
  ]);
  res.status(200).send(camelcaseKeys(response.rows[0]));
};

// ==> Método responsável por atualizar um 'Sensor' pelo 'Id':
exports.updateSensorById = async (req, res) => {
  const idSensor = parseInt(req.params.id);
  const { descricao, oid, tipo, ativo, intervalo, idTemplate, expressao, diasArmazenado } = req.body;
  let erros = {};
  let intervaloSegundos = "";
  (await validacao.sensorJaCadastradoUpdate(
    idTemplate,
    "descricao",
    descricao,
    idSensor
  )) &&
    (erros["descricao"] = "Esta descrição já está cadastrada neste Template!");

  (await validacao.sensorJaCadastradoUpdate(
    idTemplate,
    "oid",
    oid,
    idSensor
  )) && (erros["oid"] = "Esta OID já está cadastrada neste Template!");
  if (intervaloValido(intervalo)) {
    intervaloSegundos = intervaloEmSegundos(intervalo);
  } else {
    erros["intervalo"] = "Intervalo Inválido!";
  }

  if (!validator.isInt(diasArmazenado + "", { min: 1 })) {
    erros["diasArmazenado"] = "Especifique um número inteiro maior que zero.";
  }

  if (Object.keys(erros).length == 0) {
    const response = await db.query(
      "UPDATE sensor SET descricao = $1, oid = $2, tipo = $3, ativo = $4, intervalo = $5, expressao = $6, dias_armazenado = $7 WHERE id_sensor = $8",
      [descricao, oid, tipo, ativo, intervaloSegundos, expressao, diasArmazenado , idSensor]
    );

    res.status(200).send({ message: "successfull" });
    ativo && taskManager.criarTaskPorTempo(intervaloSegundos);
  } else {
    res.status(422).send(erros);
  }
};

// ==> Método responsável por excluir um 'Sensor' pelo 'Id':
exports.deleteSensorById = async (req, res) => {
  const idSensor = parseInt(req.params.id);
  await db.query("DELETE FROM sensor WHERE id_sensor = $1", [idSensor]);

  res.status(204).send();
};
