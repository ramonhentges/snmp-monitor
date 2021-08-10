const app = require("./src/app");
const port = process.env.PORT || 3010;
const cronj = require("./src/cron/cron");
const mailer = require("./src/mailer/mailer");

app.listen(port, () => {
  console.log("Aplicação executando na porta ", port);
});

cronj.inicializar();

mailer.atualizarEmail();