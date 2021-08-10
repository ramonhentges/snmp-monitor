const db = require("../config/database");
const camelcaseKeys = require("camelcase-keys");
const locale = JSON.parse(process.env.LOCALE);

exports.dashboardInfo = async (req, res) => {
  let information = {
    qtdHosts: 0,
    hostsOK: 0,
    avisos: 0,
    problemas: 0,
    listaProblemas: { problemas: [], indisponibilidade: [] },
  };
  information.qtdHosts = parseInt(
    (await db.query('SELECT COUNT(*) AS "qtdHosts" FROM host')).rows[0].qtdHosts
  );

  const selectAvisoProblema =
    'SELECT COUNT(*) AS "qtd" FROM problemas p, trigger t, severidade s ' +
    "WHERE p.data_hora_final ISNULL AND p.id_trigger = t.id_trigger AND t.id_severidade = s.id_severidade AND s.descricao = $1";

  information.avisos = parseInt(
    (await db.query(selectAvisoProblema, ["Aviso"])).rows[0].qtd
  );

  information.problemas = parseInt(
    (await db.query(selectAvisoProblema, ["Problema"])).rows[0].qtd
  );

  information.problemas =
    information.problemas +
    parseInt(
      (
        await db.query(
          "SELECT COUNT(*) AS qtdindisponivel FROM indisponibilidade i " +
            "WHERE i.data_hora_final ISNULL"
        )
      ).rows[0].qtdindisponivel
    );

  information.hostsOK = parseInt(
    (
      await db.query(
        'SELECT COUNT(DISTINCT h.id_host) AS "hostsok" FROM host h WHERE h.id_host NOT IN(' +
          "SELECT DISTINCT i.id_host FROM indisponibilidade i " +
          "WHERE i.data_hora_final ISNULL) " +
          "AND h.id_host NOT IN(SELECT DISTINCT h.id_host FROM host h, dados_sensor_host dsh, problemas p " +
          "WHERE dsh.id_host = h.id_host AND dsh.id_dados_sensor_host = p.id_dados_sensor_host AND p.data_hora_final ISNULL)"
      )
    ).rows[0].hostsok
  );

  let dataHoraFinal = new Date();
  let milisegundosDataHoraFinal = new Date().setHours(
    dataHoraFinal.getHours() - 3
  );
  let dataHoraInicial = new Date(milisegundosDataHoraFinal);

  const {
    rows: problemas,
  } = await db.query(
    'SELECT h.id_host, p.id_problemas, h.nome, TO_CHAR(p.data_hora_inicial, \'DD/MM/YYYY - HH24:MI:SS\') AS "data_hora_inicial", TO_CHAR(p.data_hora_final, \'DD/MM/YYYY - HH24:MI:SS\') AS "data_hora_final",t.descricao AS "trigger", h.ip, s.descricao AS "severidade", sr.tipo, t.comparacao, t.valor_comparado, sr.descricao AS "descricaoSensor" ' +
      "FROM host h, problemas p, trigger t, dados_sensor_host dsh, severidade s, sensor sr " +
      "WHERE h.id_host = dsh.id_host AND dsh.id_dados_sensor_host = p.id_dados_sensor_host AND p.id_trigger = t.id_trigger " +
      "AND t.id_severidade = s.id_severidade AND dsh.id_sensor = sr.id_sensor AND (p.data_hora_final ISNULL OR p.data_hora_inicial BETWEEN $1 AND $2) " +
      "ORDER BY data_hora_final DESC, data_hora_inicial DESC",
    [
      dataHoraInicial.toLocaleString(locale.locale, { timezone: locale.timezone }),
      dataHoraFinal.toLocaleString(locale.locale, { timezone: locale.timezone }),
    ]
  );

  information.listaProblemas.problemas.push(...problemas);

  const {
    rows: indisponiveis,
  } = await db.query(
    "SELECT h.id_host, i.id_indisponibilidade, h.nome, TO_CHAR(i.data_hora_inicial, 'DD/MM/YYYY - HH24:MI:SS') AS \"data_hora_inicial\", TO_CHAR(i.data_hora_final, 'DD/MM/YYYY - HH24:MI:SS') AS \"data_hora_final\", h.ip " +
      "FROM host h, indisponibilidade i " +
      "WHERE h.id_host = i.id_host AND (i.data_hora_final ISNULL OR i.data_hora_inicial BETWEEN $1 AND $2) " +
      "ORDER BY data_hora_final DESC, data_hora_inicial DESC",
    [
      dataHoraInicial.toLocaleString(locale.locale, { timezone: locale.timezone }),
      dataHoraFinal.toLocaleString(locale.locale, { timezone: locale.timezone }),
    ]
  );

  information.listaProblemas.indisponibilidade.push(...indisponiveis);

  res.status(200).send(camelcaseKeys(information, { deep: true }));
};

exports.problemas = async (req, res) => {
  const dataHoraInicial = req.params.dataInicial;
  const dataHoraFinal = req.params.dataFinal;
  let information = {
    problemas: [],
    indisponibilidade: [],
  };

  const {
    rows: problemas,
  } = await db.query(
    'SELECT h.id_host, p.id_problemas, h.nome, TO_CHAR(p.data_hora_inicial, \'DD/MM/YYYY - HH24:MI:SS\') AS "data_hora_inicial", TO_CHAR(p.data_hora_final, \'DD/MM/YYYY - HH24:MI:SS\') AS "data_hora_final", t.descricao AS "trigger", h.ip, s.descricao AS "severidade", sr.tipo, t.comparacao, t.valor_comparado, sr.descricao AS "descricaoSensor" ' +
      "FROM host h, problemas p, trigger t, dados_sensor_host dsh, severidade s, sensor sr " +
      "WHERE h.id_host = dsh.id_host AND dsh.id_dados_sensor_host = p.id_dados_sensor_host AND p.id_trigger = t.id_trigger " +
      "AND t.id_severidade = s.id_severidade AND dsh.id_sensor = sr.id_sensor AND p.data_hora_inicial BETWEEN $1 AND $2",
    [dataHoraInicial, dataHoraFinal]
  );

  information.problemas.push(...problemas);

  const {
    rows: indisponiveis,
  } = await db.query(
    "SELECT h.id_host, i.id_indisponibilidade, h.nome, TO_CHAR(i.data_hora_inicial, 'DD/MM/YYYY - HH24:MI:SS') AS \"data_hora_inicial\", TO_CHAR(i.data_hora_final, 'DD/MM/YYYY - HH24:MI:SS') AS \"data_hora_final\", h.ip " +
      "FROM host h, indisponibilidade i " +
      "WHERE h.id_host = i.id_host AND i.data_hora_inicial BETWEEN $1 AND $2",
    [dataHoraInicial, dataHoraFinal]
  );

  information.indisponibilidade.push(...indisponiveis);

  res.status(200).send(camelcaseKeys(information, { deep: true }));
};

exports.problemasGrupo = async (req, res) => {
  const dataHoraInicial = req.params.dataInicial;
  const dataHoraFinal = req.params.dataFinal;
  const idGrupo = req.params.idGrupo;
  let information = {
    problemas: [],
    indisponibilidade: [],
  };

  const {
    rows: problemas,
  } = await db.query(
    'SELECT h.id_host, p.id_problemas, h.nome, TO_CHAR(p.data_hora_inicial, \'DD/MM/YYYY - HH24:MI:SS\') AS "data_hora_inicial", TO_CHAR(p.data_hora_final, \'DD/MM/YYYY - HH24:MI:SS\') AS "data_hora_final", t.descricao AS "trigger", h.ip, s.descricao AS "severidade", sr.tipo, t.comparacao, t.valor_comparado, sr.descricao AS "descricaoSensor" ' +
      "FROM host h, problemas p, trigger t, dados_sensor_host dsh, severidade s, sensor sr, grupo_host gh " +
      "WHERE h.id_host = dsh.id_host AND dsh.id_dados_sensor_host = p.id_dados_sensor_host AND p.id_trigger = t.id_trigger " +
      "AND t.id_severidade = s.id_severidade AND dsh.id_sensor = sr.id_sensor AND h.id_host = gh.id_host AND gh.id_grupo = $1 AND p.data_hora_inicial BETWEEN $2 AND $3",
    [idGrupo, dataHoraInicial, dataHoraFinal]
  );

  information.problemas.push(...problemas);

  const {
    rows: indisponiveis,
  } = await db.query(
    "SELECT h.id_host, i.id_indisponibilidade, h.nome, TO_CHAR(i.data_hora_inicial, 'DD/MM/YYYY - HH24:MI:SS') AS \"data_hora_inicial\", TO_CHAR(i.data_hora_final, 'DD/MM/YYYY - HH24:MI:SS') AS \"data_hora_final\", h.ip " +
      "FROM host h, indisponibilidade i, grupo_host gh " +
      "WHERE h.id_host = i.id_host AND h.id_host = gh.id_host AND gh.id_grupo = $1 AND i.data_hora_inicial BETWEEN $2 AND $3",
    [idGrupo, dataHoraInicial, dataHoraFinal]
  );

  information.indisponibilidade.push(...indisponiveis);

  res.status(200).send(camelcaseKeys(information, { deep: true }));
};

exports.problemasHost = async (req, res) => {
  const dataHoraInicial = req.params.dataInicial;
  const dataHoraFinal = req.params.dataFinal;
  const idHost = req.params.idHost;
  let information = {
    problemas: [],
    indisponibilidade: [],
  };

  const {
    rows: problemas,
  } = await db.query(
    'SELECT h.id_host, p.id_problemas, h.nome, TO_CHAR(p.data_hora_inicial, \'DD/MM/YYYY - HH24:MI:SS\') AS "data_hora_inicial", TO_CHAR(p.data_hora_final, \'DD/MM/YYYY - HH24:MI:SS\') AS "data_hora_final", t.descricao AS "trigger", h.ip, s.descricao AS "severidade", sr.tipo, t.comparacao, t.valor_comparado, sr.descricao AS "descricaoSensor" ' +
      "FROM host h, problemas p, trigger t, dados_sensor_host dsh, severidade s, sensor sr " +
      "WHERE h.id_host = dsh.id_host AND dsh.id_dados_sensor_host = p.id_dados_sensor_host AND p.id_trigger = t.id_trigger " +
      "AND t.id_severidade = s.id_severidade AND dsh.id_sensor = sr.id_sensor AND h.id_host = $1 AND p.data_hora_inicial BETWEEN $2 AND $3",
    [idHost, dataHoraInicial, dataHoraFinal]
  );

  information.problemas.push(...problemas);

  const {
    rows: indisponiveis,
  } = await db.query(
    "SELECT h.id_host, i.id_indisponibilidade, h.nome, TO_CHAR(i.data_hora_inicial, 'DD/MM/YYYY - HH24:MI:SS') AS \"data_hora_inicial\", TO_CHAR(i.data_hora_final, 'DD/MM/YYYY - HH24:MI:SS') AS \"data_hora_final\", h.ip " +
      "FROM host h, indisponibilidade i " +
      "WHERE h.id_host = i.id_host AND h.id_host = $1 AND i.data_hora_inicial BETWEEN $2 AND $3",
    [idHost, dataHoraInicial, dataHoraFinal]
  );

  information.indisponibilidade.push(...indisponiveis);

  res.status(200).send(camelcaseKeys(information, { deep: true }));
};

exports.historico = async (req, res) => {
  const { idHost, periodo, idSensor } = req.params;
  let dataHoraFinal = new Date();
  let milisegundosDataHoraFinal = new Date().setHours(
    dataHoraFinal.getHours() - periodo
  );
  let dataHoraInicial = new Date(milisegundosDataHoraFinal);

  const { rows: dados } = await db.query(
    "SELECT dsh.valor, dsh.data_hora " +
      "FROM dados_sensor_host dsh " +
      "WHERE dsh.id_host = $1 AND dsh.id_sensor = $2 AND dsh.data_hora BETWEEN $3 AND $4 " +
      "ORDER BY dsh.data_hora",
    [
      idHost,
      idSensor,
      dataHoraInicial.toLocaleString(locale.locale, { timezone: locale.timezone }),
      dataHoraFinal.toLocaleString(locale.locale, { timezone: locale.timezone }),
    ]
  );

  const {
    rows: indisponibilidade,
  } = await db.query(
    'SELECT data_hora_inicial AS "data_hora" ' +
      "FROM indisponibilidade " +
      "WHERE id_host = $1 AND data_hora_inicial BETWEEN $2 AND $3 " +
      "ORDER BY data_hora",
    [
      idHost,
      dataHoraInicial.toLocaleString(locale.locale, { timezone: locale.timezone }),
      dataHoraFinal.toLocaleString(locale.locale, { timezone: locale.timezone }),
    ]
  );

  const dadosRetorno = { dados: dados, indisponibilidade: indisponibilidade };

  res.status(200).send(camelcaseKeys(dadosRetorno, { deep: true }));
};

exports.historicoData = async (req, res) => {
  const { idHost, idSensor, dataInicial, dataFinal } = req.params;

  const { rows: dados } = await db.query(
    "SELECT dsh.valor, dsh.data_hora " +
      "FROM dados_sensor_host dsh " +
      "WHERE dsh.id_host = $1 AND dsh.id_sensor = $2 AND dsh.data_hora BETWEEN $3 AND $4 " +
      "ORDER BY dsh.data_hora",
    [idHost, idSensor, dataInicial, dataFinal]
  );

  const {
    rows: indisponibilidade,
  } = await db.query(
    'SELECT data_hora_inicial AS "data_hora" ' +
      "FROM indisponibilidade " +
      "WHERE id_host = $1 AND data_hora_inicial BETWEEN $2 AND $3 " +
      "ORDER BY data_hora",
    [idHost, dataInicial, dataFinal]
  );

  const dadosRetorno = { dados: dados, indisponibilidade: indisponibilidade };

  res.status(200).send(camelcaseKeys(dadosRetorno, { deep: true }));
};

exports.dashboardGroup = async (req, res) => {
  const idGrupo = parseInt(req.params.idGrupo);
  let information = {
    qtdHosts: 0,
    hostsOK: 0,
    avisos: 0,
    problemas: 0,
    listaProblemas: { problemas: [], indisponibilidade: [] },
  };
  information.qtdHosts = parseInt(
    (
      await db.query(
        'SELECT COUNT(*) AS "qtdHosts" FROM host h, grupo_host gh WHERE h.id_host = gh.id_host AND gh.id_grupo = $1',
        [idGrupo]
      )
    ).rows[0].qtdHosts
  );

  const selectAvisoProblema =
    'SELECT COUNT(*) AS "qtd" FROM problemas p, trigger t, severidade s, grupo_host gh, dados_sensor_host dsh, host h ' +
    "WHERE p.data_hora_final ISNULL AND p.id_trigger = t.id_trigger AND t.id_severidade = s.id_severidade AND h.id_host = gh.id_host AND s.descricao = $1 AND gh.id_grupo = $2 AND p.id_dados_sensor_host = dsh.id_dados_sensor_host AND dsh.id_host = h.id_host";

  information.avisos = parseInt(
    (await db.query(selectAvisoProblema, ["Aviso", idGrupo])).rows[0].qtd
  );

  information.problemas = parseInt(
    (await db.query(selectAvisoProblema, ["Problema", idGrupo])).rows[0].qtd
  );

  information.problemas =
    information.problemas +
    parseInt(
      (
        await db.query(
          "SELECT COUNT(*) AS qtdindisponivel FROM indisponibilidade i, grupo_host gh " +
            "WHERE i.data_hora_final ISNULL AND i.id_host = gh.id_host AND gh.id_grupo = $1",
          [idGrupo]
        )
      ).rows[0].qtdindisponivel
    );

  information.hostsOK = parseInt(
    (
      await db.query(
        'SELECT COUNT(DISTINCT h.id_host) AS "hostsok" FROM host h, grupo_host gh WHERE h.id_host = gh.id_host AND gh.id_grupo = $1 AND h.id_host NOT IN(' +
          "SELECT DISTINCT i.id_host FROM indisponibilidade i " +
          "WHERE i.data_hora_final ISNULL) " +
          "AND h.id_host NOT IN(SELECT DISTINCT h.id_host FROM host h, dados_sensor_host dsh, problemas p " +
          "WHERE dsh.id_host = h.id_host AND dsh.id_dados_sensor_host = p.id_dados_sensor_host AND p.data_hora_final ISNULL)",
        [idGrupo]
      )
    ).rows[0].hostsok
  );

  let dataHoraFinal = new Date();
  let milisegundosDataHoraFinal = new Date().setHours(
    dataHoraFinal.getHours() - 3
  );
  let dataHoraInicial = new Date(milisegundosDataHoraFinal);

  const {
    rows: problemas,
  } = await db.query(
    'SELECT p.id_problemas, h.nome, TO_CHAR(p.data_hora_inicial, \'DD/MM/YYYY - HH24:MI:SS\') AS "data_hora_inicial", TO_CHAR(p.data_hora_final, \'DD/MM/YYYY - HH24:MI:SS\') AS "data_hora_final", t.descricao AS "trigger", h.ip, s.descricao AS "severidade", sr.tipo, t.comparacao, t.valor_comparado, sr.descricao AS "descricaoSensor" ' +
      "FROM host h, problemas p, trigger t, dados_sensor_host dsh, severidade s, sensor sr, grupo_host gh " +
      "WHERE h.id_host = dsh.id_host AND dsh.id_dados_sensor_host = p.id_dados_sensor_host AND p.id_trigger = t.id_trigger " +
      "AND t.id_severidade = s.id_severidade AND dsh.id_sensor = sr.id_sensor AND (p.data_hora_final ISNULL OR p.data_hora_inicial BETWEEN $1 AND $2) AND h.id_host = gh.id_host AND gh.id_grupo = $3 " +
      "ORDER BY data_hora_final DESC, data_hora_inicial DESC",
    [
      dataHoraInicial.toLocaleString(locale.locale, { timezone: locale.timezone }),
      dataHoraFinal.toLocaleString(locale.locale, { timezone: locale.timezone }),
      idGrupo,
    ]
  );

  information.listaProblemas.problemas.push(...problemas);

  const {
    rows: indisponiveis,
  } = await db.query(
    "SELECT i.id_indisponibilidade, h.nome, TO_CHAR(i.data_hora_inicial, 'DD/MM/YYYY - HH24:MI:SS') AS \"data_hora_inicial\", TO_CHAR(i.data_hora_final, 'DD/MM/YYYY - HH24:MI:SS') AS \"data_hora_final\", h.ip " +
      "FROM host h, indisponibilidade i, grupo_host gh " +
      "WHERE h.id_host = i.id_host AND (i.data_hora_final ISNULL OR i.data_hora_inicial BETWEEN $1 AND $2) AND i.id_host = gh.id_host AND gh.id_grupo = $3 " +
      "ORDER BY data_hora_final DESC, data_hora_inicial DESC",
    [
      dataHoraInicial.toLocaleString(locale.locale, { timezone: locale.timezone }),
      dataHoraFinal.toLocaleString(locale.locale, { timezone: locale.timezone }),
      idGrupo,
    ]
  );

  information.listaProblemas.indisponibilidade.push(...indisponiveis);

  res.status(200).send(camelcaseKeys(information, { deep: true }));
};
