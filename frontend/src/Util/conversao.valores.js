const getDivisaoUnidadeBytes = (valorEmBps) => {
  let i = -1;
  let divisao = 1;
  let byteUnitsTotal = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  do {
    valorEmBps = valorEmBps / 1024;
    divisao *= 1024;
    i++;
  } while (valorEmBps > 1024);

  return [divisao, byteUnitsTotal[i]];
};

const getDivisaoUnidadeBits = (valorEmBps) => {
  let i = -1;
  let divisao = 1;
  let bitsUnits = [
    "Kbps",
    "Mbps",
    "Gbps",
    "Tbps",
    "Pbps",
    "Ebps",
    "Zbps",
    "Ybps",
  ];
  do {
    valorEmBps = valorEmBps / 1000;
    divisao *= 1000;
    i++;
  } while (valorEmBps > 1000);

  return [divisao, bitsUnits[i]];
};

function getBitsPorSegundoLegivel(fileSizeInBytes) {
  var i = -1;
  var byteUnits = [
    " Kbps",
    " Mbps",
    " Gbps",
    " Tbps",
    "Pbps",
    "Ebps",
    "Zbps",
    "Ybps",
  ];
  do {
    fileSizeInBytes = fileSizeInBytes / 1000;
    i++;
  } while (fileSizeInBytes > 1000);

  return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
}

function bytesParaTamanho(a, b = 2) {
  if (0 === a) return "0 Bytes";
  const c = 0 > b ? 0 : b,
    d = Math.floor(Math.log(a) / Math.log(1024));
  return (
    parseFloat((a / Math.pow(1024, d)).toFixed(c)) +
    " " +
    ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]
  );
}

function uptimeParaTexto(seconds) {
  let dias = Math.floor(seconds / (3600 * 24));
  let horas = Math.floor((seconds % (3600 * 24)) / 3600);
  let minutos = Math.floor((seconds % 3600) / 60);
  let segundos = Math.floor(seconds % 60);

  let dDisplay = dias > 0 ? dias + (dias === 1 ? " dia, " : " dias, ") : "";
  let hDisplay =
    horas > 0 ? horas + (horas === 1 ? " hora, " : " horas, ") : "";
  let mDisplay =
    minutos > 0 ? minutos + (minutos === 1 ? " minuto, " : " minutos, ") : "";
  let sDisplay =
    segundos > 0 ? segundos + (segundos === 1 ? " segundo" : " segundos") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
}

function segundosParaIntervalo(seg) {
  let seconds = Number(seg);
  let dias = Math.floor(seconds / (3600 * 24));
  let horas = Math.floor((seconds % (3600 * 24)) / 3600);
  let minutos = Math.floor((seconds % 3600) / 60);
  let segundos = Math.floor(seconds % 60);

  let dDisplay = dias > 9 ? dias : `0${dias}`;
  let hDisplay = horas > 9 ? horas : `0${horas}`;
  let mDisplay = minutos > 9 ? minutos : `0${minutos}`;
  let sDisplay = segundos > 9 ? segundos : `0${segundos}`;
  return `${dDisplay}-${hDisplay}:${mDisplay}:${sDisplay}`;
}

module.exports = {
  bytesParaTamanho,
  getBitsPorSegundoLegivel,
  uptimeParaTexto,
  getDivisaoUnidadeBytes,
  getDivisaoUnidadeBits,
  segundosParaIntervalo,
};
