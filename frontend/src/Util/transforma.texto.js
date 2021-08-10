const {
  bytesParaTamanho,
  getBitsPorSegundoLegivel,
  uptimeParaTexto,
} = require("./conversao.valores");

const descricaoSecundariaProblema = (problema) => {
  if (problema.dataHoraFinal === null || problema.dataHoraFinal === undefined) {
    return descricaoProblemaNaoFinalizada(problema);
  }
  return descricaoProblemaFinalizada(problema);
};

const descricaoSecundariaIndisponibilidade = (hostIndisponivel) => {
  if (
    hostIndisponivel.dataHoraFinal === null ||
    hostIndisponivel.dataHoraFinal === undefined
  ) {
    return `${hostIndisponivel.ip} está indisponível desde ${hostIndisponivel.dataHoraInicial}`;
  }
  return `${hostIndisponivel.ip} estava indisponível desde ${hostIndisponivel.dataHoraInicial} até ${hostIndisponivel.dataHoraFinal}`;
};

function descricaoProblemaFinalizada(problema) {
  return `${problema.ip} ${retornaTextoTipo(
    problema.comparacao,
    problema.valorComparado,
    true
  )} desde ${problema.dataHoraInicial} até ${problema.dataHoraFinal}`;
}

function descricaoProblemaNaoFinalizada(problema) {
  return `${problema.ip} ${retornaTextoTipo(
    problema.comparacao,
    problema.valorComparado,
    false
  )} desde ${problema.dataHoraInicial}`;
}

function retornaTextoTipo(comparacao, valor, finalizado) {
  let texto;
  if (finalizado) {
    texto = "esteve com";
  } else {
    texto = "está com";
  }
  if (comparacao === ">") {
    texto = texto + " o valor maior que";
  } else if (comparacao === "<") {
    texto = texto + " o valor menor que";
  } else if (comparacao === "==") {
    texto = texto + " o valor igual a";
  } else if (comparacao === "!=") {
    texto = texto + " o valor diferente de";
  }
  return texto + " " + valor;
}

function valorTipo(valor, tipo) {
  if(valor === undefined){
    return "";
  }
  if (tipo === "BP") {
    return bytesParaTamanho(valor);
  }
  if (tipo === "bps") {
    return getBitsPorSegundoLegivel(valor);
  }
  if (tipo === "%") {
    return `${valor}%`;
  }
  if (tipo === "Uptime") {
    return uptimeParaTexto(parseInt(valor));
  }
  return valor;
}

module.exports = {
  descricaoSecundariaProblema,
  descricaoSecundariaIndisponibilidade,
  valorTipo,
};
