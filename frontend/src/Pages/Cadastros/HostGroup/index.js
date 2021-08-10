import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import clsx from "clsx";
import Corpo from "../../../Components/CorpoPagina";
import useStyles from "./styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import FormTab from "./Form";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AddHostTab from "./AddHost";
import MyAlert from "../../../Components/Alerta/Padrao";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Group(props) {
  const classes = useStyles();
  const { id } = useParams();
  const [aba, setAba] = useState(props.location.state ? 1 : 0);
  const alertaCadastro = useRef(null);

  const handleChange = (event, newValue) => {
    setAba(newValue);
  };

  const alertar = (message) => {
    alertaCadastro.current.handleOpenMessage(message);
  };

  return (
    <Corpo hostgroup={true}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={clsx(classes.paper, classes.paperPadding)}>
            <Typography variant="h4">Grupo de Host</Typography>
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
                label="Adicionar Host"
                {...a11yProps(1)}
              />
            </Tabs>

            <FormTab
              value={aba}
              index={0}
              setAba={setAba}
              alertaCadastro={alertar}
            />
            <AddHostTab value={aba} index={1} />
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
