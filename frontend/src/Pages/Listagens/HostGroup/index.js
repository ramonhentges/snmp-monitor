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

export default function GroupList(values) {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [valores, setGroups] = useState([]);

  useEffect(() => {
    CommonService.listAll("groups").then((response) => {
      let data = [];
      response.data.map((group) =>
        data.push({
          id: group.idGrupo,
          primary: group.descricao,
        })
      );
      setGroups(data);
    });
  }, []);

  return (
    <Corpo hostgroup={true}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={fixedHeightPaper}>
            <Typography variant="h4">Grupos de Hosts</Typography>
            <Itens
              valores={valores}
              view={true}
              tipo="group"
              message="Grupo de Host deletado com Sucesso!"
              deleteMessage="Grupo de Host"
              viewLink="dashboard"
            />
          </Paper>
        </Grid>
        <Fab
          className={classes.fab}
          color="primary"
          aria-label="add"
          component={Link}
          to="/groupform"
        >
          <AddIcon />
        </Fab>
      </Grid>
    </Corpo>
  );
}
