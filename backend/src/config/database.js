const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

// ==> Conexão com a Base de Dados:
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
