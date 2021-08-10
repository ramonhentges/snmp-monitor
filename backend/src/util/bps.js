const validator = require("validator");

function stringToBps(valor) {
  const valorSeparado = valor.split(" ");
  const velocidade = valorSeparado[0];
  const medida = valorSeparado[1];
  if (validator.isInt(velocidade) || validator.isFloat(velocidade, "en-US")) {
    if (medida === "Kbps") {
      return velocidade * 1000;
    }
    if (medida === "Mbps") {
      return velocidade * 1000000;
    }
    if (medida === "Gbps") {
      return velocidade * 1000000000;
    }
    if (medida === "Tbps") {
      return velocidade * 1000000000000;
    }
  }
  return 0;
}

function stringToBytes(valor) {
    const valorSeparado = valor.split(" ");
    const velocidade = valorSeparado[0];
    const medida = valorSeparado[1];
    if (validator.isInt(velocidade) || validator.isFloat(velocidade, "en-US")) {
      if (medida === "KB") {
        return velocidade * 1024;
      }
      if (medida === "MB") {
        return velocidade * 1048576;
      }
      if (medida === "GB") {
        return velocidade * 1073741824;
      }
      if (medida === "TB") {
        return velocidade * 1099511627776;
      }
    }
    return 0;
  }

module.exports = {
  stringToBps,
  stringToBytes,
};
