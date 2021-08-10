import React, { useState, useEffect } from "react";
import Chart from "react-google-charts";
import Typography from "@material-ui/core/Typography";
import {
  getDivisaoUnidadeBytes,
  getDivisaoUnidadeBits,
} from "../../Util/conversao.valores";
import { diferencaEntreDatasSegundo } from "../../Util/datas";
import { useTheme } from "@material-ui/styles";

const DIVISOR_PORCENTAGEM = 100;

function comparaData(a, b) {
  if (new Date(Date.parse(a.dataHora)) < new Date(Date.parse(b.dataHora)))
    return -1;
  if (new Date(Date.parse(a.dataHora)) > new Date(Date.parse(b.dataHora)))
    return 1;
  return 0;
}

function adicionaIndisponibilidade(dados, indisponibilidade) {
  indisponibilidade.forEach((indisponivel) => {
    dados.push({
      valor: undefined,
      dataHora: indisponivel.dataHora,
    });
  });
  dados.sort(comparaData);
}

function Grafico(props) {
  const [dados, setDados] = useState();
  const [chartTextStyle, setChartTextStyle] = useState({ color: "black" });
  const [colors, setColors] = useState(["blue"]);
  const theme = useTheme();

  useEffect(() => {
    if (theme.palette.type === "dark") {
      setChartTextStyle({ color: "#FFF" });
      setColors(["#ff5722"]);
    } else {
      setChartTextStyle({ color: "black" });
      setColors(["#3f51b5"]);
    }
  }, [theme.palette.type]);

  useEffect(() => {
    function dadosPorcentagemGrafico(dados) {
      const colunas = [
        { type: "datetime", label: "Data" },
        { type: "number", label: "%" },
      ];
      const dadosConvertidos = [];
      dados.forEach((sensor) => {
        adicionaIndisponibilidade(sensor.dados.dados, sensor.dados.indisponibilidade);
        let linhas = [];
        for (let linha of sensor.dados.dados) {
          linhas.push([
            new Date(Date.parse(linha.dataHora)),
            linha.valor / DIVISOR_PORCENTAGEM,
          ]);
        }
        let chartData = [colunas, ...linhas];
        dadosConvertidos.push({
          formato: `# %`,
          tituloVAxis: "Percentual",
          dados: chartData,
          titulo: props.titulo.find((titulo) => {
            return titulo.idSensor === parseInt(sensor.idSensor);
          }).descricao,
        });
      });
      setDados(dadosConvertidos);
    }

    function dadosNumericosGrafico(dados) {
      const colunas = [
        { type: "datetime", label: "Data" },
        { type: "number", label: "Valor" },
      ];
      const dadosConvertidos = [];
      dados.forEach((sensor) => {
        adicionaIndisponibilidade(
          sensor.dados.dados,
          sensor.dados.indisponibilidade
        );
        let linhas = [];
        for (let linha of sensor.dados.dados) {
          linhas.push([new Date(Date.parse(linha.dataHora)), linha.valor]);
        }
        let chartData = [colunas, ...linhas];
        dadosConvertidos.push({
          formato: `#`,
          tituloVAxis: "Valor",
          dados: chartData,
          titulo: props.titulo.find((titulo) => {
            return titulo.idSensor === parseInt(sensor.idSensor);
          }).descricao,
        });
      });
      setDados(dadosConvertidos);
    }

    function dadosConsumoGrafico(dados) {
      const columns = [
        { type: "datetime", label: "Hora" },
        { type: "number", label: "Consumo" },
      ];
      const dadosConvertidos = [];
      dados.forEach((sensor) => {
        let maiorValor = -1;
        for (let dado of sensor.dados.dados) {
          if (dado.valor > maiorValor) {
            maiorValor = dado.valor;
          }
        }
        let divisao = getDivisaoUnidadeBytes(maiorValor);
        adicionaIndisponibilidade(
          sensor.dados.dados,
          sensor.dados.indisponibilidade
        );
        let linhas = [];
        for (let linha of sensor.dados.dados) {
          linhas.push([
            new Date(Date.parse(linha.dataHora)),
            (linha.valor / divisao[0]).toFixed(2),
          ]);
        }
        let chartData = [columns, ...linhas];
        dadosConvertidos.push({
          formato: `# ${divisao[1]}`,
          tituloVAxis: divisao[1],
          dados: chartData,
          titulo: props.titulo.find((titulo) => {
            return titulo.idSensor === parseInt(sensor.idSensor);
          }).descricao,
        });
      });
      setDados(dadosConvertidos);
    }

    function dadosConsumoPorSegundoGrafico(dados) {
      const columns = [
        { type: "datetime", label: "Hora" },
        { type: "number", label: "Consumo" },
      ];
      const dadosConvertidos = [];
      dados.forEach((sensor) => {
        let maiorValor = -1;
        let dadosEmBps = [];
        let ultimoValor = {
          valor: sensor.dados.dados[0].valor,
          dataHora: sensor.dados.dados[0].dataHora,
        };
        sensor.dados.dados.shift();
        for (let dado of sensor.dados.dados) {
          if (
            parseInt(ultimoValor.valor) < parseInt(dado.valor) &&
            ultimoValor.valor !== null &&
            dado.valor !== null
          ) {
            let valorEmBps =
              (dado.valor - ultimoValor.valor) /
              diferencaEntreDatasSegundo(ultimoValor.dataHora, dado.dataHora);
            if (valorEmBps > maiorValor) {
              maiorValor = valorEmBps;
            }
            dadosEmBps.push({ valor: valorEmBps, dataHora: dado.dataHora });
          }
          ultimoValor.valor = dado.valor;
          ultimoValor.dataHora = dado.dataHora;
        }
        let divisao = getDivisaoUnidadeBits(maiorValor);
        adicionaIndisponibilidade(dadosEmBps, sensor.dados.indisponibilidade);
        let linhas = [];
        for (let linha of dadosEmBps) {
          linhas.push([
            new Date(Date.parse(linha.dataHora)),
            (linha.valor / divisao[0]).toFixed(2),
          ]);
        }
        let chartData = [columns, ...linhas];
        dadosConvertidos.push({
          formato: `# ${divisao[1]}`,
          tituloVAxis: divisao[1],
          dados: chartData,
          titulo: props.titulo.find((titulo) => {
            return titulo.idSensor === parseInt(sensor.idSensor);
          }).descricao,
        });
      });
      setDados(dadosConvertidos);
    }
    
    let contemDados = false;
    props.dados.forEach((dado) => {
      if (dado.dados.dados.length > 0) {
        contemDados = true;
      }
    });
    if (contemDados) {
      if (props.formato === "%") {
        dadosPorcentagemGrafico(props.dados);
      } else if (props.formato === "BP") {
        dadosConsumoGrafico(props.dados);
      } else if (props.formato === "bps") {
        dadosConsumoPorSegundoGrafico(props.dados);
      } else if (props.formato === "Numero") {
        dadosNumericosGrafico(props.dados);
      }
    } else {
      setDados(null);
    }
  }, [props.formato, props.dados, props.titulo]);

  return (
    <>
      {dados === null || dados === undefined ? (
        <Typography variant="subtitle1" color="initial">
          Sem Dados.
        </Typography>
      ) : (
        <>
          {dados.map((dado, i) => {
            return (
              <Chart
                key={i}
                chartType="AreaChart"
                data={dado.dados}
                options={{
                  colors: colors,
                  backgroundColor: { fill: "transparent" },
                  hAxis: {
                    textStyle: chartTextStyle,
                    titleTextStyle: chartTextStyle,
                    format: "HH:mm:ss\ndd/MM/YYYY",
                  },
                  vAxis: {
                    textStyle: chartTextStyle,
                    titleTextStyle: chartTextStyle,
                    format: dado.formato,
                    title: dado.tituloVAxis,
                  },
                  title: dado.titulo,
                  titleTextStyle: chartTextStyle,
                  legend: { position: "none", textStyle: chartTextStyle },
                }}
                rootProps={{ "data-testid": "2" }}
              />
            );
          })}
        </>
      )}
    </>
  );
}

export default Grafico;
