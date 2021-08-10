const db = require("../config/database");

exports.triggerJaCadastrado = async (id, campo, dado) => {
  const response = await db.query(
    `SELECT * FROM trigger WHERE id_sensor = $1 AND ${campo} ilike $2`,
    [id, dado]
  );
  if (response.rowCount == 0) {
    return false;
  } else {
    return true;
  }
};

exports.triggerJaCadastradoUpdate = async (idSensor, campo, dado, idTrigger) => {
    const response = await db.query(
      `SELECT * FROM trigger WHERE id_sensor = $1 AND ${campo} ilike $2 AND id_trigger != $3`,
      [idSensor, dado, idTrigger]
    );
    if (response.rowCount == 0) {
      return false;
    } else {
      return true;
    }
  };

exports.sensorJaCadastrado = async (id, campo, dado) => {
  const response = await db.query(
    `SELECT * FROM sensor WHERE id_template = $1 AND ${campo} ilike $2`,
    [id, dado]
  );
  if (response.rowCount == 0) {
    return false;
  } else {
    return true;
  }
};

exports.sensorJaCadastradoUpdate = async (idTemplate, campo, dado, idSensor) => {
    const response = await db.query(
      `SELECT * FROM sensor WHERE id_template = $1 AND ${campo} ilike $2 AND id_sensor != $3`,
      [idTemplate, dado, idSensor]
    );
    if (response.rowCount == 0) {
      return false;
    } else {
      return true;
    }
  };

exports.campoRepetido = async (tabela, campo, valor) => {
  const response = await db.query(
    `SELECT * FROM ${tabela} WHERE ${campo} ilike $1`,
    [valor]
  );
  if (response.rowCount == 0) {
    return false;
  } else {
    return true;
  }
};

exports.campoRepetidoUpdate = async (tabela, campo, valor, id) => {
  const response = await db.query(
    `SELECT * FROM ${tabela} WHERE ${campo} ilike $1 AND id_${tabela} != $2`,
    [valor, id]
  );
  if (response.rowCount == 0) {
    return false;
  } else {
    return true;
  }
};
