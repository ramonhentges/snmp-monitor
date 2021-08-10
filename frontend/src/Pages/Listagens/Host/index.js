import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Corpo from "../../../Components/CorpoPagina";
import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Itens from "../../../Components/Listagens/ItensUmId";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import CommonService from "../../../Services/common";
import useStyles from "./styles";

export default function HostList(values) {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [valores, setHosts] = useState([]);

  useEffect(() => {
    CommonService.listAll("hosts").then((response) => {
      let data = [];
      response.data.map((host) =>
        data.push({
          id: host.idHost,
          primary: host.nome,
          secondary: "IP: " + host.ip + ", Porta: " + host.porta,
        })
      );
      setHosts(data);
    });
  }, []);

  return (
    <Corpo hosts={true}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={fixedHeightPaper}>
            <Typography variant="h4">Hosts</Typography>
            <Itens
              valores={valores}
              view={true}
              tipo="host"
              message="Host deletado com Sucesso!"
              deleteMessage="Host"
              viewLink="sensoreshost"
            />
          </Paper>
        </Grid>
        <Fab
          className={classes.fab}
          color="primary"
          aria-label="add"
          component={Link}
          to="/hostform"
        >
          <AddIcon />
        </Fab>
      </Grid>
    </Corpo>
  );
}
