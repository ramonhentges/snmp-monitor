const consDb = require("./consulta.db");
const mailer = require("../mailer/mailer");
const locale = JSON.parse(process.env.LOCALE);
let problems = [];

const setProblems = (problem) => {
  problems = problem;
};

const add = (
  idTrigger,
  idDadosSensorHost,
  idHost,
  idSensor,
  valor,
  enviarEmail
) => {
  if (!existe(idTrigger, idHost, idSensor)) {
    let dataHoraInicial = new Date().toLocaleString(locale.locale, { timezone: locale.timezone });
    consDb
      .inserirProblema(idTrigger, idDadosSensorHost, dataHoraInicial)
      .then(async (res) => {
        problems.push({
          idProblemas: res,
          idTrigger: idTrigger,
          idDadosSensorHost: idDadosSensorHost,
          idHost: idHost,
          idSensor: idSensor,
          valor: valor,
          dataHoraInicial: dataHoraInicial,
        });
        if (enviarEmail) {
          let dadosEnvio = await consDb.obterDadosEnviarEmail(
            idTrigger,
            idHost
          );
          mailer.enviarEmail(
            `${dadosEnvio.descSeveridade}: ${dadosEnvio.descTrigger}`,
            `A trigger ${dadosEnvio.descTrigger} do host ${
              dadosEnvio.nome
            } disparou na data ${dataHoraInicial} pois seu valor ficou ${descricaoComparacao(
              dadosEnvio.comparacao
            )} ${dadosEnvio.valorComparado}`
          );
        }
      });
  }
};

const existe = (idTrigger, idHost, idSensor) => {
  return get(idTrigger, idHost, idSensor) === undefined ? false : true;
};

const get = (idTrigger, idHost, idSensor) => {
  return problems.find(
    (problem) =>
      problem.idTrigger === idTrigger &&
      problem.idHost === idHost &&
      problem.idSensor === idSensor
  );
};

const remove = async (idTrigger, idHost, idSensor) => {
  if (existe(idTrigger, idHost, idSensor)) {
    let idProblema = get(idTrigger, idHost, idSensor).idProblemas;
    consDb
      .finalizarProblema(idProblema, new Date().toLocaleString(locale.locale, { timezone: locale.timezone }))
      .then(() => {
        problems = problems.filter(
          (problem) =>
            !(
              problem.idTrigger === idTrigger &&
              problem.idHost === idHost &&
              problem.idSensor === idSensor
            )
        );
      });
  }
};

function descricaoComparacao(comparacao) {
  let texto;
  if (comparacao === ">") {
    texto = "maior que";
  } else if (comparacao === "<") {
    texto = "menor que";
  } else if (comparacao === "==") {
    texto = "igual a";
  } else if (comparacao === "!=") {
    texto = "diferente de";
  }
  return texto;
}

module.exports = {
  add,
  remove,
  setProblems,
};
