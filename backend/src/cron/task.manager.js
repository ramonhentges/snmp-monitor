const snmp = require("./snmp");
const consDb = require("./consulta.db");
let tasks = [];
const add = (time, task) => {
  tasks.push({ time: time, task: task });
  return tasks.length;
};

const criarTaskPorTempo = (time) => {
  const MILISEGUNDOSEMUMSEGUNDO = 1000;
  if (!existe(time)) {
    let task = setInterval(async () => {
      let consultas = await consDb.sensoresHostsPorOidIntervalo(time);
      if (consultas.length > 0) {
        let consultaSnmp = {
          idHost: -1,
          ip: 0,
          porta: 0,
          comunidade: "",
          sensores: [], //idSensor, oid, tipo, expressao
          emailIndisponibilidade: false,
        };
        consultas.map((consulta) => {
          if (consultaSnmp.idHost === -1) {
            consultaSnmp.idHost = consulta.idHost;
            consultaSnmp.ip = consulta.ip;
            consultaSnmp.porta = consulta.porta;
            consultaSnmp.comunidade = consulta.comunidade;
            consultaSnmp.emailIndisponibilidade =
              consulta.emailIndisponibilidade;
          } else if (consultaSnmp.idHost !== consulta.idHost) {
            snmp.obterDadosSNMP(Object.assign({}, consultaSnmp));
            consultaSnmp.idHost = consulta.idHost;
            consultaSnmp.ip = consulta.ip;
            consultaSnmp.porta = consulta.porta;
            consultaSnmp.comunidade = consulta.comunidade;
            consultaSnmp.sensores = [];
            consultaSnmp.emailIndisponibilidade =
              consulta.emailIndisponibilidade;
          }
          consultaSnmp.sensores.push({
            idSensor: consulta.idSensor,
            oid: consulta.oid,
            tipo: consulta.tipo,
            expressao: consulta.expressao,
          });
        });
        snmp.obterDadosSNMP(consultaSnmp);
      } else {
        remove(time);
      }
    }, time * MILISEGUNDOSEMUMSEGUNDO);
    add(time, task);
  }
};

const get = (time) => {
  let task = tasks.find((task) => task.time === time);
  return task === undefined ? undefined : task.task;
};

const existe = (time) => {
  return tasks.find((task) => task.time === time) === undefined ? false : true;
};

const remove = (time) => {
  let task = get(time);
  if (task !== undefined) {
    clearInterval(task);
    tasks = tasks.filter((task) => task["time"] !== time);
    return true;
  }
  return false;
};

module.exports = {
  criarTaskPorTempo,
};
