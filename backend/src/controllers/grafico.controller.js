const db = require("../config/database");

// ==> Método responsável por listar todos os 'Products':
exports.listAllGrafico = async (req, res) => {
    const response = await db.query(
      "SELECT * FROM grafico ORDER BY datahora ASC"
    );
    res.status(200).send(response.rows);
  };