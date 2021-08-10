import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Corpo from "../../../Components/CorpoPagina";
import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import useStyles from "./styles";
import MyAlert from "../../../Components/Alerta/Padrao";
import FormTab from "./Form";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AddGroupTab from "./AddGroup";
import AddTemplateTab from "./AddTemplate";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Host(props) {
  const { id } = useParams();
  const [aba, setAba] = useState(props.location.state ? 1 : 0);
  const classes = useStyles();
  const alertaCadastro = useRef(null);

  const handleChange = (event, newValue) => {
    setAba(newValue);
  };

  const alertar = (message) => {
    alertaCadastro.current.handleOpenMessage(message);
  };

  return (
    <Corpo hosts={true}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={clsx(classes.paper, classes.paperPadding)}>
            <Typography variant="h4">Host</Typography>
          </Paper>

          <Paper className={classes.paper}>
            <Tabs
              value={aba}
              onChange={handleChange}
              aria-label="grupo tab"
              className={classes.tabs}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Cadastro" {...a11yProps(0)} />
              <Tab
                disabled={id === undefined}
                label="Adicionar Grupo"
                {...a11yProps(1)}
              />
              <Tab
                disabled={id === undefined}
                label="Adicionar Template"
                {...a11yProps(2)}
              />
            </Tabs>

            <FormTab
              value={aba}
              index={0}
              setAba={setAba}
              alertaCadastro={alertar}
            />
            <AddGroupTab value={aba} index={1} />
            <AddTemplateTab value={aba} index={2} />
          </Paper>
        </Grid>
      </Grid>
      <MyAlert
        aberto={props.location.state && props.location.state.abrir}
        message={props.location.state && props.location.state.message}
        ref={alertaCadastro}
      />
    </Corpo>
  );
}
