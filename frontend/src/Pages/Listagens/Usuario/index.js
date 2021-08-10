import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Corpo from "../../../Components/CorpoPagina";
import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Itens from "../../../Components/Listagens/ItensUmId";
import MyAlert from "../../../Components/Alerta/Padrao";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import CommonService from "../../../Services/common";
import useStyles from "./styles";

export default function UserList(values) {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    CommonService.listAll("users").then((response) => {
      let data = [];
      response.data.map((usuario) =>
        data.push({
          id: usuario.idUsuario,
          primary: usuario.nomeCompleto,
          secondary: usuario.usuario,
        })
      );
      setUsuarios(data);
    });
  }, []);

  return (
    <Corpo usuarios={true}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={fixedHeightPaper}>
            <Typography variant="h4">Usuários</Typography>
            <Itens
              valores={usuarios}
              tipo="user"
              message="Usuário deletado com Sucesso!"
              deleteMessage="Usuário"
            />
          </Paper>
        </Grid>
        <Fab
          className={classes.fab}
          color="primary"
          aria-label="add"
          component={Link}
          to="/userform"
        >
          <AddIcon />
        </Fab>
      </Grid>
      <MyAlert
        aberto={values.location.state && values.location.state.abrir}
        message={values.location.state && values.location.state.message}
      />
    </Corpo>
  );
}
