import React, { useState, useEffect } from "react";
import { useHistory, Link, useParams } from "react-router-dom";
import CommonService from "../../../Services/common";
import Corpo from "../../../Components/CorpoPagina";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import useStyles from "./styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { valorTipo } from "../../../Util/transforma.texto";
import Carregando from "../../../Components/Carregando";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";

function SensoresHost() {
  const [isLoadingHost, setIsLoadingHost] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [host, setHost] = useState();
  const [tipoSelecionado, setTipoSelecionado] = useState(null);
  const [sensoresSelecionados, setSensoresSelecionados] = useState([]);
  const [sensores, setSensores] = useState();
  const history = useHistory();
  const classes = useStyles();
  const { idHost } = useParams();

  function handleCheckedChange(event) {
    let valor = JSON.parse(event.target.value);
    if (event.target.checked) {
      setSensoresSelecionados((sensoresSelecionados) => [
        ...sensoresSelecionados,
        valor.id,
      ]);
      setTipoSelecionado(valor.tipo);
    } else {
      let selecionados = sensoresSelecionados.filter((id) => {
        return id !== valor.id;
      });
      setSensoresSelecionados(selecionados);
      if (selecionados.length === 0) {
        setTipoSelecionado(null);
      }
    }
  }

  function gerarGrafico(event){
    event.preventDefault();
    history.push({
      pathname: `/historico/${idHost}/${sensoresSelecionados.toString().replaceAll(',', "&")}`,
    });
  }

  useEffect(() => {
    function getData() {
      CommonService.getById(`host/sensores`, idHost).then((response) => {
        setSensores(response.data);
        setIsLoadingData(false);
      });
      CommonService.getById(`host`, idHost).then((response) => {
        setHost(response.data);
        setIsLoadingHost(false);
      });
    }
    getData();
  }, [idHost]);

  return (
    <Corpo hosts={true}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={clsx(classes.paper, classes.padding)}>
            {isLoadingHost ? (
              <Carregando texto="Carregando Host" />
            ) : (
              <>
                <Typography variant="h4">{host.nome}</Typography>
                <Typography variant="subtitle1">{host.ip}</Typography>
              </>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            {isLoadingData ? (
              <Carregando texto="Carregando Sensores" />
            ) : (
              <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Descrição Sensor</TableCell>
                      <TableCell>Data Checagem</TableCell>
                      <TableCell>Valor</TableCell>
                      <TableCell align="center">Visualizar</TableCell>
                      <TableCell align="center">Selecionar</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sensores.map((sensor) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={sensor.idSensor}
                        >
                          <TableCell>{sensor.descricao}</TableCell>
                          <TableCell>{sensor.dataHora}</TableCell>
                          <TableCell>
                            {valorTipo(sensor.valor, sensor.tipo)}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              edge="end"
                              aria-label="view"
                              component={Link}
                              to={`/historico/${idHost}/${sensor.idSensor}`}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell align="center">
                            {["bps", "%", "BP", "Numero"].indexOf(
                              sensor.tipo
                            ) !== -1 &&
                            (sensor.tipo === tipoSelecionado ||
                              tipoSelecionado === null) ? (
                              <Checkbox
                                size="small"
                                value={JSON.stringify({
                                  tipo: sensor.tipo,
                                  id: sensor.idSensor,
                                })}
                                onChange={handleCheckedChange}
                                color="primary"
                                inputProps={{
                                  "aria-label": "Selecionar para gráfico",
                                }}
                              />
                            ) : (
                              <></>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            <Grid item className={classes.padding}>
              <Button
                disabled={sensoresSelecionados.length === 0}
                className={classes.button}
                variant="contained"
                color="primary"
                onClick={gerarGrafico}
              >
                Gerar Gráfico
              </Button>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Corpo>
  );
}
export default SensoresHost;
