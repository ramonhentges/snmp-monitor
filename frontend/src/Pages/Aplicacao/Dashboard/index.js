import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Corpo from "../../../Components/CorpoPagina";
import CommonService from "../../../Services/common";
import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Carregando from "../../../Components/Carregando";
import VisibilityIcon from "@material-ui/icons/Visibility";
import IconButton from "@material-ui/core/IconButton";
import useStyles from "./styles";
import {
  descricaoSecundariaIndisponibilidade,
  descricaoSecundariaProblema,
} from "../../../Util/transforma.texto";

function App() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const { idGrupo } = useParams();
  const [informacoes, setInformacoes] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [isLoadingGrupo, setIsloadingGrupo] = useState(true);
  const [dados, setDados] = useState();

  function obterInformacaoGrupo(idGrupo) {
    CommonService.getById("dashboard", idGrupo).then((response) => {
      setInformacoes(response.data);
      setIsloading(false);
    });
    CommonService.getById("group", idGrupo).then((response) => {
      setDados({
        titulo: response.data.descricao,
        informacao: "grupo",
      });
      setIsloadingGrupo(false);
    });
  }

  useEffect(() => {
    function buscarDados() {
      idGrupo === undefined
        ? CommonService.listAll("dashboard").then((response) => {
            setInformacoes(response.data);
            setDados({
              titulo: "Geral",
              informacao: "sistema",
            });
            setIsloading(false);
            setIsloadingGrupo(false);
          })
        : obterInformacaoGrupo(idGrupo);
    }
    buscarDados();
    const atualizarDados = setInterval(buscarDados, 60000);
    return () => clearInterval(atualizarDados);
  }, [idGrupo]);
  return (
    <Corpo dashboard={true}>
      <Grid container spacing={3}>
        {isLoadingGrupo || isLoading ? (
          <Carregando texto="Carregando dados" />
        ) : (
          <>
            <Grid item xs={12}>
              <Paper className={fixedHeightPaper}>
                <Typography variant="h4">Dashboard {dados.titulo}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={3} sm={6}>
              <Paper className={classes.paper}>
                <Typography variant="h6">
                  Existem {informacoes.qtdHosts} Hosts cadastrados no{" "}
                  {dados.informacao}
                </Typography>
                <Typography variant="subtitle1">
                  {informacoes.qtdHosts - informacoes.hostsOk} hosts necessitam
                  observação
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={3} sm={2}>
              <Paper className={clsx(classes.okPaper, classes.okBackground)}>
                <Typography variant="h6" align="center">
                  {informacoes.hostsOk}
                </Typography>
                <Typography variant="subtitle1" align="center">
                  OK
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={3} sm={2}>
              <Paper
                className={clsx(
                  classes.warningPaper,
                  classes.warningBackground
                )}
              >
                <Typography variant="h6" align="center">
                  {informacoes.avisos}
                </Typography>
                <Typography variant="subtitle1" align="center">
                  Avisos
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={3} sm={2}>
              <Paper
                className={clsx(classes.errorPaper, classes.errorBackground)}
              >
                <Typography variant="h6" align="center">
                  {informacoes.problemas}
                </Typography>
                <Typography variant="subtitle1" align="center">
                  Problemas
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography variant="h6">
                  Histórico recente de Problemas/Avisos
                </Typography>
                {informacoes.listaProblemas.problemas.length === 0 &&
                informacoes.listaProblemas.indisponibilidade.length === 0 ? (
                  <Typography variant="subtitle1">
                    Não há Problemas :D
                  </Typography>
                ) : (
                  <List>
                    {informacoes.listaProblemas.problemas.map((problema) => (
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
                    {informacoes.listaProblemas.indisponibilidade.map(
                      (host) => (
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
                            secondary={descricaoSecundariaIndisponibilidade(
                              host
                            )}
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
                      )
                    )}
                  </List>
                )}
              </Paper>
            </Grid>
          </>
        )}
      </Grid>
    </Corpo>
  );
}

export default App;
