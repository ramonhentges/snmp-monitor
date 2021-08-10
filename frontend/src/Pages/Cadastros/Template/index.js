import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import CommonService from "../../../Services/common";
import Corpo from "../../../Components/CorpoPagina";
import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import useStyles from "./styles";
import FormTab from "./Form";
import AddHostTab from "./AddHost";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import SensoresTab from "./AddSensor";
import TriggersTab from "./AddTrigger";
import MyAlert from "../../../Components/Alerta/Padrao";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function TemplateForm(props) {
  const classes = useStyles();
  const { id } = useParams();
  const [aba, setAba] = useState(props.location.state ? 1 : 0);
  const [sensores, setSensores] = useState([]);
  const alertaCadastro = useRef(null);

  const alertar = (message) => {
    alertaCadastro.current.handleOpenMessage(message);
  };

  const getSensores = useCallback(async () => {
    id !== undefined &&
      (await CommonService.getById(`sensores`, id).then((response) => {
        setSensores(response.data);
      }));
  }, [id]);

  useEffect(() => {
    getSensores();
  }, [getSensores]);

  const handleChange = (event, newValue) => {
    setAba(newValue);
  };

  return (
    <Corpo templates={true}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={clsx(classes.paper, classes.paperPadding)}>
            <Typography variant="h4">Template</Typography>
          </Paper>

          <Paper className={classes.paper}>
            <Tabs
              value={aba}
              onChange={handleChange}
              aria-label="template tab"
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
              <Tab
                disabled={id === undefined}
                label="Sensores"
                {...a11yProps(2)}
              />
              <Tab
                disabled={id === undefined}
                label="Triggers"
                {...a11yProps(2)}
              />
            </Tabs>

            <FormTab
              value={aba}
              index={0}
              setAba={setAba}
              alertaCadastro={alertar}
            />
            <AddHostTab value={aba} index={1} />
            <SensoresTab
              value={aba}
              index={2}
              sensores={sensores}
              atualizar={getSensores}
              setSensores={setSensores}
            />
            <TriggersTab value={aba} index={3} sensores={sensores} />
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
