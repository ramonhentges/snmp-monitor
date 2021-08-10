import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import CommonService from "../../../Services/common";
import Corpo from "../../../Components/CorpoPagina";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import useStyles from "./styles";
import Carregando from "../../../Components/Carregando";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Grafico from "../../../Components/Grafico";
import DateFnsUtils from "@date-io/date-fns";
import Tabela from "../../../Components/Tabela";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

function HistoricoSensor() {
  const [isLoadingHost, setIsLoadingHost] = useState(true);
  const [isLoadingSensor, setIsLoadingSensor] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [host, setHost] = useState();
  const [sensor, setSensor] = useState();
  const [dados, setDados] = useState();
  const [periodo, setPeriodo] = useState("1");
  const classes = useStyles();
  const { idHost, idSensor } = useParams();
  const [opcao, setOpcao] = useState("Periodo");
  const [selectedDateInicial, setSelectedDateInicial] = useState(new Date());
  const [selectedDateFinal, setSelectedDateFinal] = useState(new Date());

  const getDadosData = useCallback(
    async (dataInicial, dataFinal) => {
      let sensores = idSensor.split("&");
      sensores = sensores.map(async (sensor) => {
        let resposta = await CommonService.listAll(
          `historicodata/${idHost}/${sensor}/${dataFormatada(
            dataInicial
          )}/${dataFormatada(dataFinal)}`
        );
        return { idSensor: sensor, dados: resposta.data };
      });
      const data = await Promise.all(sensores);
      setDados(data);
      setIsLoadingData(false);
    },
    [idHost, idSensor]
  );

  const getDadosPeriodo = useCallback(
    async (periodo) => {
      let sensores = idSensor.split("&");
      sensores = sensores.map(async (sensor) => {
        let resposta = await CommonService.listAll(
          `historico/${idHost}/${sensor}/${periodo}`
        );
        return { idSensor: sensor, dados: resposta.data };
      });
      const data = await Promise.all(sensores);
      setDados(data);
      setIsLoadingData(false);
    },
    [idHost, idSensor]
  );

  const handleDateChangeInicial = (date) => {
    setSelectedDateInicial(date);
    if (date.toString() !== "Invalid Date") {
      getDadosData(date, selectedDateFinal);
    }
  };

  const handleDateChangeFinal = (date) => {
    setSelectedDateFinal(date);
    if (date.toString() !== "Invalid Date") {
      getDadosData(selectedDateInicial, date);
    }
  };

  const dataFormatada = (data) => {
    return data.toLocaleString().replaceAll("/", "-");
  };

  const getData = useCallback(
    (opcao) => {
      if (opcao === "Periodo") {
        getDadosPeriodo(periodo);
      } else {
        getDadosData(selectedDateInicial, selectedDateFinal);
      }
    },
    [
      periodo,
      selectedDateInicial,
      selectedDateFinal,
      getDadosPeriodo,
      getDadosData,
    ]
  );

  function handlePeriodChange(event) {
    event.preventDefault();
    setPeriodo(event.target.value);
    getDadosPeriodo(event.target.value);
  }

  function handleOptionChange(event) {
    event.preventDefault();
    setOpcao(event.target.value);
    getData(event.target.value);
  }

  useEffect(() => {
    const atualizarDados = setInterval(() => {
      getData(opcao);
    }, 60000);
    return () => clearInterval(atualizarDados);
  }, [opcao, getData]);

  useEffect(() => {
    async function inicializar() {
      getDadosPeriodo(1);
      CommonService.getById(`host`, idHost).then((response) => {
        setHost(response.data);
        setIsLoadingHost(false);
      });
      let sensores = idSensor.split("&");
      sensores = sensores.map(async (sensor) => {
        let resposta = await CommonService.getById(`sensor`, sensor);
        return resposta.data;
      });
      const sensorResposta = await Promise.all(sensores);
      setSensor(sensorResposta);
      setIsLoadingSensor(false);
    }
    inicializar();
  }, [idHost, idSensor, getDadosPeriodo]);

  return (
    <Corpo hosts={true}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={clsx(classes.paper, classes.padding)}>
            {isLoadingHost || isLoadingSensor ? (
              <Carregando texto="Carregando Host" />
            ) : (
              <>
                <Typography variant="h4">
                  {host.nome} -{" "}
                  {sensor.length > 1 ? "Vários" : sensor[0].descricao}
                </Typography>
                <Typography variant="subtitle1">
                  IP: {host.ip}, OID:{" "}
                  {sensor.length > 1 ? "Vários" : sensor[0].oid}
                </Typography>
              </>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Grid item xs={12} className={classes.padding}>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Buscar por:</FormLabel>
                  <RadioGroup
                    row
                    aria-label="position"
                    name="opcao"
                    defaultValue="top"
                    value={opcao}
                    onChange={handleOptionChange}
                  >
                    <FormControlLabel
                      value="Periodo"
                      control={<Radio color="primary" />}
                      label="Período"
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value="Data"
                      control={<Radio color="primary" />}
                      label="Data"
                      labelPlacement="end"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              {opcao === "Periodo" ? (
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    aria-label="position"
                    name="periodo"
                    defaultValue="top"
                    value={periodo}
                    onChange={handlePeriodChange}
                  >
                    <FormControlLabel
                      value="1"
                      control={<Radio color="primary" />}
                      label="1 hora"
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value="3"
                      control={<Radio color="primary" />}
                      label="3 horas"
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value="6"
                      control={<Radio color="primary" />}
                      label="6 horas"
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value="24"
                      control={<Radio color="primary" />}
                      label="1 dia"
                      labelPlacement="end"
                    />
                  </RadioGroup>
                </FormControl>
              ) : (
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    required
                    margin="normal"
                    id="data_inicial"
                    label="Data inicial"
                    format="dd/MM/yyyy HH:mm:ss"
                    value={selectedDateInicial}
                    onChange={handleDateChangeInicial}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                  <KeyboardDatePicker
                    required
                    margin="normal"
                    id="date_final"
                    label="Data Final"
                    format="dd/MM/yyyy HH:mm:ss"
                    value={selectedDateFinal}
                    onChange={handleDateChangeFinal}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              )}
            </Grid>
            {isLoadingData || isLoadingSensor ? (
              <Carregando texto="Carregando Sensores" />
            ) : ["bps", "BP", "%", "Numero"].indexOf(sensor[0].tipo) !== -1 ? (
              <Grafico dados={dados} formato={sensor[0].tipo} titulo={sensor} />
            ) : (
              <Tabela dados={dados[0]} formato={sensor[0].tipo} />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Corpo>
  );
}
export default HistoricoSensor;
