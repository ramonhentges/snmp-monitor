require("dotenv-safe").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();

// ==> Rotas da API:
const graficoRoute = require("./routes/grafico.routes");
const snmpRoute = require("./routes/snmp.routes");
const groupRoute = require("./routes/group.routes");
const hostRoute = require("./routes/host.routes");
const templateRoute = require("./routes/template.routes");
const emailRoute = require("./routes/email.routes");
const hostgroupRoute = require("./routes/host.group.routes");
const hosttemplateRoute = require("./routes/host.template.routes");
const sensorRoute = require("./routes/sensor.routes");
const triggerRoute = require("./routes/trigger.routes");
const severidadeRoute = require("./routes/severidade.routes");
const informationRoutes = require("./routes/information.routes");
const userRoutes = require("./routes/user.routes");
const authenticationRoutes = require("./routes/authentication.routes");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ type: "application/vnd.api+json" }));
app.use(cors());

app.use("/api/", verifyJWT);
app.use("/api/", groupRoute);
app.use("/api/", hostRoute);
app.use("/api/", graficoRoute);
app.use("/api/", snmpRoute);
app.use("/api/", templateRoute);
app.use("/api/", emailRoute);
app.use("/api/", hostgroupRoute);
app.use("/api/", hosttemplateRoute);
app.use("/api/", sensorRoute);
app.use("/api/", triggerRoute);
app.use("/api/", severidadeRoute);
app.use("/api/", informationRoutes);
app.use("/api/", userRoutes);
app.use("/auth/", authenticationRoutes);

module.exports = app;

function verifyJWT(req, res, next) {
  const token = req.headers["x-access-token"];
  if (!token)
    return res.status(401).json({ auth: false, message: "No token provided." });

  jwt.verify(token, process.env.SECRET, function (err, decoded) {
    if (err)
      return res
        .status(401)
        .json({ auth: false, message: "Failed to authenticate token." });
    req.userId = decoded.id;
    next();
  });
}
