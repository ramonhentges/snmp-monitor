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

export default function TemplateList(values) {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [valores, setTemplates] = useState([]);

  useEffect(() => {
    CommonService.listAll("templates").then((response) => {
      let data = [];
      response.data.map((template) =>
        data.push({
          id: template.idTemplate,
          primary: template.descricao,
        })
      );
      setTemplates(data);
    });
  }, []);

  return (
    <Corpo templates={true}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={fixedHeightPaper}>
            <Typography variant="h4">Templates</Typography>
            <Itens
              valores={valores}
              tipo="template"
              message="Template deletado com Sucesso!"
              deleteMessage="Template"
            />
          </Paper>
        </Grid>
        <Fab
          className={classes.fab}
          color="primary"
          aria-label="add"
          component={Link}
          to="/templateform"
        >
          <AddIcon />
        </Fab>
      </Grid>
    </Corpo>
  );
}
