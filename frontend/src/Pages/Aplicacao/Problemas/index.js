import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import VisibilityIcon from "@material-ui/icons/Visibility";
import IconButton from "@material-ui/core/IconButton";
import Corpo from "../../../Components/CorpoPagina";
import CommonService from "../../../Services/common";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import DateFnsUtils from "@date-io/date-fns";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import useStyles from "./styles";
import {
  descricaoSecundariaProblema,
  descricaoSecundariaIndisponibilidade,
} from "../../../Util/transforma.texto";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

export default function Problemas() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [problemas, setProblemas] = useState({
    problemas: [],
    indisponibilidade: [],
  });
  const [grupos, setGrupos] = useState([]);
  const [hosts, setHosts] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [selectedDateInicial, setSelectedDateInicial] = useState(new Date());
  const [selectedDateFinal, setSelectedDateFinal] = useState(new Date());
  const [grupoSelecionado, setGrupoSelecionado] = useState(null);
  const [hostSelecionado, setHostSelecionado] = useState(null);
  const [opcao, setOpcao] = useState("Host");

  const handleDateChangeInicial = (date) => {
    setSelectedDateInicial(date);
  };

  const handleDateChangeFinal = (date) => {
    setSelectedDateFinal(date);
  };

  const dataFormatada = (data) => {
    return data.toLocaleString().replaceAll("/", "-");
  };

  function handlePeriodChange(event) {
    event.preventDefault();
    setOpcao(event.target.value);
  }

  function buscarPorHost() {
    CommonService.listAll(
      `problemasHost/${dataFormatada(selectedDateInicial)}/${dataFormatada(
        selectedDateFinal
      )}/${hostSelecionado.idHost}`
    ).then((response) => {
      setProblemas(response.data);
      setIsloading(false);
    });
  }

  function buscarPorGrupo() {
    CommonService.listAll(
      `problemasGrupo/${dataFormatada(selectedDateInicial)}/${dataFormatada(
        selectedDateFinal
      )}/${grupoSelecionado.idGrupo}`
    ).then((response) => {
      setProblemas(response.data);
      setIsloading(false);
    });
  }

  function buscarGeral() {
    CommonService.listAll(
      `problemas/${dataFormatada(selectedDateInicial)}/${dataFormatada(
        selectedDateFinal
      )}`
    ).then((response) => {
      setProblemas(response.data);
      setIsloading(false);
    });
  }

  const buscarProblemas = () => {
    setIsloading(true);
    opcao === "Host"
      ? hostSelecionado === null
        ? buscarGeral()
        : buscarPorHost()
      : grupoSelecionado === null
      ? buscarGeral()
      : buscarPorGrupo();
  };

  useEffect(() => {
    CommonService.listAll(`groups`).then((response) => {
      setGrupos(response.data);
    });
    CommonService.listAll(`hosts`).then((response) => {
      setHosts(response.data);
    });
  }, []);

  return (
    <Corpo problemas={true}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={fixedHeightPaper}>
            <Typography variant="h4">Problemas</Typography>
            <Grid container direction="column" className={classes.container}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Buscar por:</FormLabel>
                <RadioGroup
                  row
                  aria-label="position"
                  name="opcao"
                  defaultValue="top"
                  value={opcao}
                  onChange={handlePeriodChange}
                >
                  <FormControlLabel
                    value="Host"
                    control={<Radio color="primary" />}
                    label="Host"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    value="Grupo"
                    control={<Radio color="primary" />}
                    label="Grupo"
                    labelPlacement="end"
                  />
                </RadioGroup>
              </FormControl>
              <Grid container>
                {opcao === "Host" ? (
                  <Grid item xs={4} className={classes.paddingRight}>
                    <Autocomplete
                      fullWidth
                      id="Host"
                      name="Host"
                      options={hosts}
                      getOptionLabel={(option) => option.nome}
                      value={hostSelecionado}
                      onChange={(event, value) => setHostSelecionado(value)}
                      renderInput={(params) => (
                        <TextField {...params} label="Host" />
                      )}
                    />
                  </Grid>
                ) : (
                  <Grid item xs={4} className={classes.paddingRight}>
                    <Autocomplete
                      fullWidth
                      id="Grupo"
                      name="Grupo"
                      options={grupos}
                      getOptionLabel={(option) => option.descricao}
                      value={grupoSelecionado}
                      onChange={(event, value) => setGrupoSelecionado(value)}
                      renderInput={(params) => (
                        <TextField {...params} label="Grupo" />
                      )}
                    />
                  </Grid>
                )}
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
                <Grid className={classes.button}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    onClick={buscarProblemas}
                  >
                    Buscar
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Typography variant="h6">Lista de Problemas/Avisos</Typography>
            {isLoading ? (
              <>
                <Grid item xs={12} className={classes.centralizar}>
                  <Typography
                    variant="h6"
                    color="textPrimary"
                    className={classes.padding}
                  >
                    Carregando dados
                  </Typography>
                  <CircularProgress />
                </Grid>
              </>
            ) : (
              <>
                {problemas.problemas.length === 0 &&
                problemas.indisponibilidade.length === 0 ? (
                  <Typography variant="subtitle1">
                    Não há Problemas :D
                  </Typography>
                ) : (
                  <List>
                    {problemas.problemas.map((problema) => (
                      <ListItem
                        key={"p" + problema.idProblemas}
                        className={
                          problema.severidade === "Aviso"
                            ? classes.warningBackground
                            : classes.errorBackground
                        }
                        divider
                      >
                        <ListItemText
                          primary={`${problema.nome} ${problema.trigger} - ${problema.descricaoSensor}`}
                          secondary={descricaoSecundariaProblema(problema)}
                        />
                        <IconButton
                          edge="end"
                          aria-label="view"
                          component={Link}
                          to={`/sensoreshost/${problema.idHost}`}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </ListItem>
                    ))}
                    {problemas.indisponibilidade.map((host) => (
                      <ListItem
                        key={"i" + host.idIndisponibilidade}
                        className={classes.errorBackground}
                        divider
                      >
                        <ListItemText
                          primary={
                            host.dataHoraFinal === (undefined || null)
                              ? `${host.nome} está indisponível`
                              : `${host.nome} estava indisponível`
                          }
                          secondary={descricaoSecundariaIndisponibilidade(host)}
                        />
                        <IconButton
                          edge="end"
                          aria-label="view"
                          component={Link}
                          to={`/sensoreshost/${host.idHost}`}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                )}
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Corpo>
  );
}
