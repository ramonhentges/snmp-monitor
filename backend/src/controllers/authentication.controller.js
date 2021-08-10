const db = require("../config/database");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    const { usuario, senha } = req.body;
    const {
      rows,
      rowCount,
    } = await db.query(
      "SELECT id_usuario FROM usuario WHERE usuario = $1 AND senha = $2",
      [usuario, senha]
    );
    if (rowCount == 1) {
      const id = rows[0].id_usuario;
      const token = jwt.sign({ id }, process.env.SECRET, {
        expiresIn: "7 days",
      });
      return res.status(200).json({ auth: true, token: token });
    } else {
      res.status(401).json({ auth: false, token: null });
    }
  };
  
  exports.logout = async (req, res) => {
    res.status(200).json({ auth: false, token: null });
  };