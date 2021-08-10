exports.validaIP = (ipaddress) => {
  if (
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      ipaddress
    )
  ) {
    return true;
  }
  return false;
};

exports.isInt = (value) => {
  var x;
  return isNaN(value) ? !1 : ((x = parseFloat(value)), (0 | x) === x);
};

exports.intervaloEmSegundos = (intervalo) => {
  const { dias, horas, minutos, segundos } = diasHorasMinutosSegundosIntervalo(intervalo);
  let segundosMinutos = minutos * 60;
  let segundosHoras = horas * 60 * 60;
  let segundosDias = dias * 24 * 60 * 60;
  return segundos + segundosMinutos + segundosHoras + segundosDias;
}

exports.intervaloValido = (intervalo) => {
  if (intervalo.length !== 11) {
    return false;
  }
  const diasHorasMinutosSegundos = diasHorasMinutosSegundosIntervalo(intervalo);
  if (!diasHorasMinutosSegundos) {
    return false;
  }
  const { dias, horas, minutos, segundos } = diasHorasMinutosSegundos;
  if (
    dias > 99 ||
    dias < 0 ||
    horas > 24 ||
    horas < 0 ||
    minutos > 59 ||
    minutos < 0 ||
    segundos > 59 ||
    segundos < 0
  ) {
    return false;
  }
  return true;
};

function diasHorasMinutosSegundosIntervalo(intervalo) {
  try {
    let dias = parseInt(intervalo.substring(0, 2));
    let horas = parseInt(intervalo.substring(3, 5));
    let minutos = parseInt(intervalo.substring(6, 8));
    let segundos = parseInt(intervalo.substring(9, 11));
    if (
      !Number.isInteger(dias) ||
      !Number.isInteger(horas) ||
      !Number.isInteger(minutos) ||
      !Number.isInteger(segundos)
    ) {
      return false;
    }
    return { dias: dias, horas: horas, minutos: minutos, segundos: segundos };
  } catch (e) {
    return false;
  }
}
