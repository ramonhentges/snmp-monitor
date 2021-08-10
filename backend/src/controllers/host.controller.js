const db = require("../config/database");
const validacaoBd = require("../util/validacao.bd");
const validator = require("validator");
const camelcaseKeys = require("camelcase-keys");
const { diferencaEntreDatasSegundo } = require("../util/datas");

exports.createHost = async (req, res) => {
  const { nome, ip, porta, comunidade, emailIndisponibilidade } = req.body;
  let erros = {};
  if (await validacaoBd.campoRepetido("host", "nome", nome)) {
    erros["nome"] = "Este nome de host já existe.";
  }
  if (!validator.isIP(ip, 4)) {
    erros["ip"] = "Endereço IP inválido.";
  } else if (await validacaoBd.campoRepetido("host", "ip", ip)) {
    erros["ip"] = "Este IP já está cadastrado.";
  }
  if (!validator.isPort(porta + "")) {
    erros["porta"] = "Porta especificada inválida.";
  }
  if (Object.keys(erros).length == 0) {
    const {
      rowCount,
      rows,
    } = await db.query(
      "INSERT INTO host (nome, ip, porta, comunidade, email_indisponibilidade) VALUES ($1, $2, $3, $4, $5) RETURNING id_host",
      [nome, ip, porta, comunidade, emailIndisponibilidade]
    );
    if (rowCount == 1) {
      res.status(201).send({ message: "successfull", id: rows[0].id_host });
    } else {
      res.status(500).send({ message: "Erro ao salvar dados." });
    }
  } else {
    res.status(422).send(erros);
  }
};

exports.listAllHosts = async (req, res) => {
  const response = await db.query("SELECT * FROM host ORDER BY nome ASC");
  res.status(200).send(camelcaseKeys(response.rows));
};

exports.findHostById = async (req, res) => {
  const id = parseInt(req.params.id);
  const response = await db.query("SELECT * FROM host WHERE id_host = $1", [
    id,
  ]);
  res.status(200).send(camelcaseKeys(response.rows[0]));
};

exports.sensoresByHostId = async (req, res) => {
  const id = parseInt(req.params.id);
  let {
    rows: sensores,
  } = await db.query(
    "SELECT s.id_sensor, s.descricao, s.oid, s.tipo, s.ativo " +
      "FROM template t, template_host th, sensor s, host h " +
      "WHERE s.id_template = t.id_template AND th.id_template = t.id_template " +
      "AND th.id_host = h.id_host AND h.id_host = $1",
    [id]
  );

  sensores = sensores.map(async (sensor) => {
    if (sensor.tipo === "bps") {
      let {
        rows: ultimoValor,
      } = await db.query(
        'SELECT dsh.valor, TO_CHAR(dsh.data_hora, \'DD/MM/YYYY - HH24:MI:SS\') AS "data_hora", dsh.data_hora AS "date" ' +
          "FROM dados_sensor_host dsh " +
          "WHERE dsh.id_sensor = $1 AND dsh.id_host = $2 " +
          "ORDER BY dsh.id_dados_sensor_host DESC " +
          "LIMIT 2",
        [sensor.id_sensor, id]
      );
      try {
        let diferencaEmSegundos = diferencaEntreDatasSegundo(
          ultimoValor[1].date,
          ultimoValor[0].date
        );
        let valorEmBps =
          (ultimoValor[0].valor - ultimoValor[1].valor) / diferencaEmSegundos;
        return {
          ...sensor,
          ...{ valor: valorEmBps, data_hora: ultimoValor[0].data_hora },
        };
      } catch (e) {
        return {
          ...sensor,
        };
        //Ainda não é possível obter velocidade
      }
    } else {
      let {
        rows: ultimoValor,
      } = await db.query(
        "SELECT dsh.valor, TO_CHAR(dsh.data_hora, 'DD/MM/YYYY - HH24:MI:SS') AS \"data_hora\" " +
          "FROM dados_sensor_host dsh " +
          "WHERE dsh.id_sensor = $1 AND dsh.id_host = $2 " +
          "ORDER BY dsh.id_dados_sensor_host DESC " +
          "LIMIT 1",
        [sensor.id_sensor, id]
      );
      if (ultimoValor.length > 0) {
        return { ...sensor, ...ultimoValor[0] };
      }
      return { ...sensor };
    }
  });
  (async () => {
    const sensoresComUltimoValor = await Promise.all(sensores);
    res.status(200).send(camelcaseKeys(sensoresComUltimoValor, { deep: true }));
  })();
};

exports.updateHostById = async (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, ip, porta, comunidade, emailIndisponibilidade } = req.body;
  let erros = {};
  if (await validacaoBd.campoRepetidoUpdate("host", "nome", nome, id)) {
    erros["nome"] = "Este nome de host já existe.";
  }
  if (!validator.isIP(ip, 4)) {
    erros["ip"] = "Endereço IP inválido.";
  } else if (await validacaoBd.campoRepetidoUpdate("host", "ip", ip, id)) {
    erros["ip"] = "Este IP já está cadastrado.";
  }
  if (!validator.isPort(porta + "")) {
    erros["porta"] = "Porta especificada inválida.";
  }
  if (Object.keys(erros).length == 0) {
    const {
      rowCount,
    } = await db.query(
      "UPDATE host SET nome = $1, ip = $2, porta = $3, comunidade = $4, email_indisponibilidade =$5 WHERE id_host = $6",
      [nome, ip, porta, comunidade, emailIndisponibilidade, id]
    );
    if (rowCount == 1) {
      res.status(200).send({ message: "successfull" });
    } else {
      res.status(500).send({ message: "Erro ao salvar dados." });
    }
  } else {
    res.status(422).send(erros);
  }
};

exports.deleteHostById = async (req, res) => {
  const id = parseInt(req.params.id);
  await db.query("DELETE FROM host WHERE id_host = $1", [id]);

  res.status(204).send();
};
