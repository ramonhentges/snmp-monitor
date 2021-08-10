function diferencaEntreDatasSegundo(dataInicial, dataFinal) {
    const diff = Math.abs(new Date(Date.parse(dataInicial)).getTime() - new Date(Date.parse(dataFinal)).getTime());
    return Math.ceil(diff / 1000);
  }
  
  module.exports = {
    diferencaEntreDatasSegundo,
  };
  