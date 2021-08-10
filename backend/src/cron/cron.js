const taskManager = require("./task.manager");
const consDb = require("./consulta.db");
const problemas = require("./problem.manager");
const hostsIndisponiveis = require("./indisponibilidade.manager");
const schedule = require("node-schedule");
const locale = JSON.parse(process.env.LOCALE);

exports.inicializar = async () => {
  const intervalos = await consDb.consutlaIntervalos();
  const problems = await consDb.obterProblemas();
  const indisponiveis = await consDb.obterHostsIndisponiveis();
  problemas.setProblems(problems);
  hostsIndisponiveis.setHostsIndisponiveis(indisponiveis);
  intervalos.map((row) => {
    taskManager.criarTaskPorTempo(row.intervalo);
  });
  schedule.scheduleJob("0 1 * * *", async function () {
    removerDadosAntigos();
  });
};

async function removerDadosAntigos() {
  console.log(
    "Removendo dados antigos do postgres" + new Date().toLocaleString(locale.locale, { timezone: locale.timezone })
  );
  let diasArmazenamento = await consDb.diasArmazenamento();
  diasArmazenamento.forEach((dias) => {
    consDb.removerDadosAntigosBanco(dias.diasArmazenado);
  });
}
