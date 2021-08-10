const db = require("../config/database");
const datas = require("../util/datas");
const camelcaseKeys = require("camelcase-keys");
const locale = JSON.parse(process.env.LOCALE);

const consutlaIntervalos = async () => {
  return (
    await db.query("SELECT DISTINCT intervalo FROM sensor WHERE ativo = true")
  ).rows;
};

const sensoresHostsPorOidIntervalo = async (intervalo) => {
  const {
    rows,
  } = await db.query(
    "SELECT s.id_sensor, s.tipo, s.oid, s.expressao, h.id_host, h.email_indisponibilidade, h.ip, h.porta, h.comunidade FROM sensor s, host h, template t, template_host th WHERE intervalo = $1 AND s.id_template = t.id_template AND t.id_template = th.id_template AND h.id_host = th.id_host AND s.ativo = true ORDER BY h.id_host",
    [intervalo]
  );
  return camelcaseKeys(rows);
};

const triggersSensor = async (idSensor) => {
  const {
    rows,
  } = await db.query(
    "SELECT t.id_trigger, t.enviar_email, t.valor_comparado, t.comparacao FROM sensor s, trigger t WHERE t.id_sensor = s.id_sensor AND t.ativo = true AND s.id_sensor = $1",
    [idSensor]
  );
  return camelcaseKeys(rows);
};

const inserirDadosSnmp = async (idHost, idSensor, valor) => {
  const data = new Date();
  const {
    rows,
  } = await db.query(
    "INSERT INTO dados_sensor_host (id_host, id_sensor, valor, data_hora) VALUES ($1, $2, $3, $4) RETURNING id_dados_sensor_host",
    [idHost, idSensor, valor, data.toLocaleString(locale.locale, { timezone: locale.timezone })]
  );
  return rows[0].id_dados_sensor_host;
};

const inserirProblema = async (
  idTrigger,
  idDadosSensorHost,
  dataHoraInicial
) => {
  const {
    rows,
  } = await db.query(
    "INSERT INTO problemas (id_trigger, id_dados_sensor_host, data_hora_inicial) VALUES ($1, $2, $3) RETURNING id_problemas",
    [idTrigger, idDadosSensorHost, dataHoraInicial]
  );
  return rows[0].id_problemas;
};

const finalizarProblema = async (idProblema, dataHoraFinal) => {
  await db.query(
    "UPDATE problemas SET data_hora_final = $1 WHERE id_problemas = $2",
    [dataHoraFinal, idProblema]
  );
};

const obterProblemas = async () => {
  const { rows } = await db.query(
    "SELECT p.id_problemas, p.id_trigger, p.id_dados_sensor_host, p.data_hora_inicial, dsh.id_host, dsh.id_sensor, dsh.valor " +
      "FROM problemas p, dados_sensor_host dsh " +
      "WHERE p.id_dados_sensor_host = dsh.id_dados_sensor_host AND p.data_hora_final ISNULL"
  );
  return camelcaseKeys(rows);
};

const obterHostsIndisponiveis = async () => {
  const { rows } = await db.query(
    "SELECT id_indisponibilidade, id_host, data_hora_inicial " +
      "FROM indisponibilidade " +
      "WHERE data_hora_final ISNULL"
  );
  return camelcaseKeys(rows);
};

const obterDadosEnviarEmail = async (idTrigger, idHost) => {
  const {
    rows,
  } = await db.query(
    'SELECT t.descricao AS "descTrigger", s.descricao AS "descSeveridade", h.nome, t.comparacao, t.valor_comparado FROM trigger t, severidade s, host h ' +
      "WHERE t.id_trigger = $1 AND t.id_severidade = s.id_severidade AND h.id_host = $2",
    [idTrigger, idHost]
  );
  return camelcaseKeys(rows[0]);
};

const obterUltimoValor = async (idHost, idSensor) => {
  //pega o penúltimo para comparação, pois o último é o comparado
  try {
    const {
      rows,
    } = await db.query(
      "SELECT valor FROM dados_sensor_host WHERE id_host = $1 AND id_sensor = $2 ORDER BY id_dados_sensor_host DESC LIMIT 2",
      [idHost, idSensor]
    );
    return camelcaseKeys(rows[1].valor);
  } catch (e) {
    return "ERROR!!!";
  }
};

const obterUltimoValorBps = async (idHost, idSensor, limit) => {
  //pega o penúltimo para comparação, pois o último é o comparado
  try {
    const {
      rows,
    } = await db.query(
      "SELECT valor, data_hora FROM dados_sensor_host WHERE id_host = $1 AND id_sensor = $2 ORDER BY id_dados_sensor_host DESC LIMIT $3",
      [idHost, idSensor, limit]
    );
    let diferencaEmSegundos = datas.diferencaEntreDatasSegundo(
      rows[limit - 1].data_hora,
      rows[limit - 2].data_hora
    );
    let bps =
      (rows[limit - 2].valor - rows[limit - 1].valor) / diferencaEmSegundos;
    return bps;
  } catch (e) {
    return "ERROR!!!";
  }
};

const inserirHostIndisponivel = async (idHost, dataHoraInicial) => {
  const {
    rows,
  } = await db.query(
    "INSERT INTO indisponibilidade (id_host, data_hora_inicial) VALUES ($1, $2) RETURNING id_indisponibilidade",
    [idHost, dataHoraInicial]
  );
  return rows[0].id_indisponibilidade;
};

const finalizarIndisponibilidade = async (
  idIndisponibilidade,
  dataHoraFinal
) => {
  await db.query(
    "UPDATE indisponibilidade SET data_hora_final = $1 WHERE id_indisponibilidade = $2",
    [dataHoraFinal, idIndisponibilidade]
  );
};

const obterDescricaoHost = async (idHost) => {
  const { rows } = await db.query(
    "SELECT descricao " + "FROM host " + "WHERE id_host = $1",
    [idHost]
  );
  return camelcaseKeys(rows);
};

const diasArmazenamento = async () => {
  const { rows } = await db.query("SELECT DISTINCT dias_armazenado FROM sensor");
  return camelcaseKeys(rows);
}

const removerDadosAntigosBanco = async (dias) => {
  let milisegundosDataHoraFinal = new Date().setHours(
    new Date().getHours() - 24 * dias
  );
  let dataHoraFinal = new Date(milisegundosDataHoraFinal);
  dataHoraFinal.setMinutes(0);
  dataHoraFinal.setHours(0);
  dataHoraFinal.setSeconds(0);

  db.query("DELETE FROM dados_sensor_host dsh WHERE dsh.id_dados_sensor_host IN "+
  "(SELECT dsh.id_dados_sensor_host FROM dados_sensor_host dsh, sensor s " +
  "WHERE s.id_sensor = dsh.id_sensor AND s.dias_armazenado = $1 AND dsh.data_hora < $2)", [dias, dataHoraFinal.toLocaleString(locale.locale, { timezone: locale.timezone })])
  .catch(err => {
    console.log(err)
  })
}

module.exports = {
  consutlaIntervalos,
  sensoresHostsPorOidIntervalo,
  inserirDadosSnmp,
  triggersSensor,
  inserirProblema,
  finalizarProblema,
  obterProblemas,
  obterDadosEnviarEmail,
  obterUltimoValor,
  inserirHostIndisponivel,
  finalizarIndisponibilidade,
  obterDescricaoHost,
  obterHostsIndisponiveis,
  obterUltimoValorBps,
  diasArmazenamento,
  removerDadosAntigosBanco,
};
