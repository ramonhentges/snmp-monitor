const snmp = require("net-snmp");

function getSNMP(oid, ip, porta, comunidade, tipo) {
  const oids = [oid];
  const options = {
    port: porta,
    retries: 1,
    timeout: 3000,
    backoff: 1.0,
    transport: "udp4",
    trapPort: 162,
    version: snmp.Version2c,
    backwardsGetNexts: true,
    idBitsSize: 32,
  };
  const promise = new Promise((resolve, reject) => {
    let session = snmp.createSession(ip, comunidade, options);
    let resp = {};
    session.get(oids, function (error, varbinds) {
      if (error) {
        resp["message"] = "Erro";
        resp["erro"] = error;
        reject(resp);
      } else {
        resp["message"] = "Sucesso";
        for (var i = 0; i < varbinds.length; i++)
          if (snmp.isVarbindError(varbinds[i]))
            resp[varbinds[i].oid] = "Erro ao buscar esta OID";
          else
            resp[varbinds[i].oid] = retornoParaString(
              varbinds[i].value,
              varbinds[i].type
            );
        resolve(resp);
      }
      session.close();
    });
  });
  return promise;
}

function retornoParaString(valor, tipoRetornoSnmp) {
  if (tipoRetornoSnmp === 70) {
    return parseInt(valor.toString("hex"), 16);
  }
  return valor.toString();
}

exports.testSnmpOid = async (req, res) => {
  const { oid, ip, porta, comunidade, tipo } = req.body;
  const response = await getSNMP(oid, ip, porta, comunidade, tipo)
    .then((result) => result)
    .catch((error) => error);
  res.status(200).send(response);
};
