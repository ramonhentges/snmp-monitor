const { Mutex } = require("await-semaphore");
const consDb = require("./consulta.db");
const mailer = require("../mailer/mailer");
const locale = JSON.parse(process.env.LOCALE);

const mutex = new Mutex();
let hostsIndisponiveis = [];

const setHostsIndisponiveis = (indisponiveis) => {
  hostsIndisponiveis = indisponiveis;
};

function add(idHost, enviarEmail) {
  mutex.use(async () => {
    if (!existe(idHost)) {
      let dataHoraInicial = new Date().toLocaleString(locale.locale, { timezone: locale.timezone });
      const idIndisponibilidade = await consDb.inserirHostIndisponivel(
        idHost,
        dataHoraInicial
      );
      hostsIndisponiveis.push({
        idIndisponibilidade: idIndisponibilidade,
        idHost: idHost,
        dataHoraInicial: dataHoraInicial,
      });
      if (enviarEmail) {
        let dadosEnvio = await consDb.obterDescricaoHost(idHost);
        mailer.enviarEmail(
          `Aviso Indisponibilidade: ${dadosEnvio.descricao}`,
          `O host ${dadosEnvio.descricao} está indisponível desde ${dataHoraInicial}`
        );
      }
    }
  });
}

const existe = (idHost) => {
  return get(idHost) === undefined ? false : true;
};

const get = (idHost) => {
  return hostsIndisponiveis.find((host) => host.idHost === idHost);
};

const remove = async (idHost) => {
  if (existe(idHost)) {
    let idIndisponibilidade = get(idHost).idIndisponibilidade;
    consDb
      .finalizarIndisponibilidade(
        idIndisponibilidade,
        new Date().toLocaleString(locale.locale, { timezone: locale.timezone })
      )
      .then(() => {
        hostsIndisponiveis = hostsIndisponiveis.filter(
          (host) => host.idHost !== idHost
        );
      });
  }
};

module.exports = {
  add,
  remove,
  setHostsIndisponiveis,
};
