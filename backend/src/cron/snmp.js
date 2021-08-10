const { parse, eval } = require("expression-eval");
const consDb = require("./consulta.db");
const problemas = require("./problem.manager");
const hostsIndisponiveis = require("./indisponibilidade.manager");
const snmp = require("net-snmp");
const validator = require("validator");
const bpsConverter = require("../util/bps");
/*dados = { idHost: -1,
          ip: 0,
          porta: 0,
          comunidade: "",
          sensores: [],  {idSensor, oid, tipo}
*/

function arrayOidsConsulta(sensores) {
  let oids = [];
  sensores.map((sensor) => {
    oids.push(sensor.oid);
  });
  oids = [...new Set(oids)]; //remove duplicados
  return oids;
}

function obterDadosSNMP(dadosHost) {
  const options = {
    port: dadosHost.porta,
    retries: 3,
    timeout: 3000,
    backoff: 1.0,
    transport: "udp4",
    trapPort: 162,
    version: snmp.Version2c,
    backwardsGetNexts: true,
    idBitsSize: 32,
  };
  const session = snmp.createSession(
    dadosHost.ip,
    dadosHost.comunidade,
    options
  );
  const consulta = arrayOidsConsulta(dadosHost.sensores);
  session.get(consulta, function (error, varbinds) {
    if (error) {
      adicionaHostIndisponivel(dadosHost);
    } else {
      hostsIndisponiveis.remove(dadosHost.idHost);
      for (var i = 0; i < varbinds.length; i++)
        if (snmp.isVarbindError(varbinds[i]))
          console.log(snmp.varbindError(varbinds[i]));
        else
          verificaDados(
            dadosHost,
            varbinds[i].oid,
            varbinds[i].value,
            varbinds[i].type
          );
    }
    session.close();
  });
}

function adicionaHostIndisponivel(dadosHost) {
  hostsIndisponiveis.add(dadosHost.idHost, dadosHost.emailIndiponibilidade);
}

async function verificaDados(dadosHost, oid, retorno, tipoRetornoSnmp) {
  let sensores = dadosHost.sensores.filter((sensor) => sensor.oid === oid);
  sensores.map(async (sensor) => {
    let triggers = await consDb.triggersSensor(sensor.idSensor);
    let valor = valorConvertido(sensor.tipo, retorno, tipoRetornoSnmp);
    if (sensor.expressao !== "")
      valor = valorExpressao(sensor.expressao, valor);
    let idDadosSensorHost = -1;
    consDb
      .inserirDadosSnmp(dadosHost.idHost, sensor.idSensor, valor)
      .then(async (res) => {
        idDadosSensorHost = res;
        if (sensor.tipo === "bps") {
          valor = await consDb.obterUltimoValorBps(
            dadosHost.idHost,
            sensor.idSensor,
            2
          );
        }
        if (valor !== "ERROR!!!") {
          verificaTriggersSensor(
            triggers,
            dadosHost.idHost,
            sensor.idSensor,
            valor,
            idDadosSensorHost,
            sensor.tipo
          );
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });
}

function valorExpressao(expressao, valor) {
  const expressaoParseada = parse(expressao);
  return eval(expressaoParseada, { retorno: valor });
}

function valorConvertido(tipo, valor, tipoRetornoSnmp) {
  if (
    tipo === "bps" ||
    tipo === "BP" ||
    tipo === "%" ||
    tipo === "Uptime" ||
    tipo === "Numero"
  ) {
    if (tipoRetornoSnmp === 70) {
      return parseInt(valor.toString("hex"), 16);
    }
    if (validator.isInt(valor.toString())) {
      return parseInt(valor.toString());
    }
    if (validator.isFloat(valor.toString())) {
      return parseFloat(valor.toString());
    }
  }
  return valor.toString();
}

async function verificaTriggersSensor(
  triggers,
  idHost,
  idSensor,
  valorAtual,
  idDadosSensorHost,
  tipo
) {
  triggers.map(async (trigger) => {
    let ativar = false;
    let valorComparado = await pegaValorComparado(
      trigger.valorComparado,
      idHost,
      idSensor,
      tipo
    );
    if (valorComparado !== "ERROR!!!") {
      trigger.comparacao === ">" &&
        valorAtual > valorComparado &&
        (ativar = true);

      trigger.comparacao === "<" &&
        valorAtual < valorComparado &&
        (ativar = true);

      trigger.comparacao === "==" &&
        valorAtual === valorComparado &&
        (ativar = true);

      trigger.comparacao === "!=" &&
        valorAtual !== valorComparado &&
        (ativar = true);

      ativar
        ? problemas.add(
            trigger.idTrigger,
            idDadosSensorHost,
            idHost,
            idSensor,
            valorAtual,
            trigger.enviarEmail
          )
        : problemas.remove(trigger.idTrigger, idHost, idSensor);
    }
  });
}

async function pegaValorComparado(valor, idHost, idSensor, tipo) {
  if (valor === "ultimo" && tipo === "bps") {
    return await consDb.obterUltimoValorBps(idHost, idSensor, 3);
  }
  if (valor === "ultimo") {
    return await consDb.obterUltimoValor(idHost, idSensor);
  }
  if (tipo === "bps" || tipo === "BP") {
    return converteParaBps(valor, tipo);
  }
  return valor;
}

function converteParaBps(valor, tipo) {
  if (validator.isInt(valor) || validator.isFloat(valor, "en-US")) {
    return valor;
  }
  if (tipo === "bps") {
    return bpsConverter.stringToBps(valor);
  }
  if (tipo === "BP") {
    return bpsConverter.stringToBytes(valor);
  }
}

module.exports = {
  obterDadosSNMP,
};
