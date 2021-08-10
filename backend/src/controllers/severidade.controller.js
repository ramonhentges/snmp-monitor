const db = require("../config/database");
const camelcaseKeys = require("camelcase-keys");
// ==> Método responsável por listar todos:
exports.listAllSeveridades = async (req, res) => {
  const response = await db.query("SELECT * FROM severidade ORDER BY descricao ASC");
  res.status(200).send(camelcaseKeys(response.rows));
};