import React, { useState, useEffect, useRef, Fragment } from "react";
import { useParams } from "react-router-dom";
import AlertErrorModal from "../../../../Components/Modal/Alert";
import CommonService from "../../../../Services/common";
import useStyles from "./styles";
import Listagem from "../../../../Components/Listagens/doisIdsRetornaExclusao";
import { Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SuccessAlert from "../../../../Components/Alerta/Padrao";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Grid from "@material-ui/core/Grid";

export default function TemplateAddHostTab(props) {
  const { children, value, index, ...other } = props;
  const [templateHost, setTemplateHost] = useState([]);
  const [hostsDisponiveis, setHostsDisponiveis] = useState([]);
  const [selectedHost, setSelectedHost] = useState(null);
  const { id: idTemplate } = useParams();
  const classes = useStyles();
  const refAlert = useRef(null);
  const refSuccess = useRef(null);

  const informaErro = (mensagem) => {
    refAlert.current.handleOpen(mensagem);
  };

  const informaSucesso = () => {
    refSuccess.current.handleOpen();
  };

  async function adicionarHost() {
    if (selectedHost !== null) {
      let enviar = {
        idHost: selectedHost.id,
        idTemplate: idTemplate,
      };
      CommonService.create("hosttemplate", enviar).then((response) => {
        if (response.status === 201) {
          informaSucesso();
          let novoItem = {
            id1: selectedHost.id,
            id2: idTemplate,
            primary: selectedHost.nome,
          };
          setSelectedHost(null);
          setTemplateHost((templateHost) => [...templateHost, novoItem]);
        } else {
          informaErro({
            titulo: "Erro!",
            mensagem: response.data,
          });
        }
      });
      setHostsDisponiveis(
        hostsDisponiveis.filter((m) => m["id"] !== enviar.idHost)
      );
    }
  }

  function addHostDisponivel(id, nome) {
    setHostsDisponiveis((hostsDisponiveis) => [
      ...hostsDisponiveis,
      { id: id, nome: nome },
    ]);
  }

  useEffect(() => {
    async function getHosts() {
      let hostsAdicionados;
      await CommonService.getById(`hosttemplate/template`, idTemplate).then(
        (response) => {
          hostsAdicionados = response.data;
          let data = [];
          response.data.map((host) =>
            data.push({
              id1: host.idHost,
              id2: idTemplate,
              primary: host.nome,
            })
          );
          setTemplateHost(data);
        }
      );

      await CommonService.listAll("hosts").then((response) => {
        let hosts = [];
        let hostsNaoAdicnionados = response.data.filter(
          (m) => !hostsAdicionados.some((e) => e.idHost === m.idHost)
        );
        hostsNaoAdicnionados.map((host) =>
          hosts.push({
            id: host.idHost,
            nome: host.nome,
          })
        );
        setHostsDisponiveis(hosts);
      });
    }

    idTemplate !== undefined && getHosts();
  }, [idTemplate]);

  return (
    <div
      className={classes.root}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Fragment>
          <Grid className={classes.margin} container direction="row">
            <Autocomplete
              className={classes.grid}
              id="combo-box"
              options={hostsDisponiveis}
              getOptionLabel={(option) => option.nome}
              style={{ width: 300 }}
              value={selectedHost}
              onChange={(event, value) => setSelectedHost(value)}
              renderInput={(params) => (
                <TextField {...params} label="Escolha um host para adicionar" />
              )}
            />
            <Fab
              color="primary"
              aria-label="Adicionar Host"
              onClick={adicionarHost}
            >
              <AddIcon />
            </Fab>
          </Grid>

          <Typography className={classes.typography} variant="h6">
            Hosts Adicionados ao Template
          </Typography>

          <Listagem
            valores={templateHost}
            tipo="hosttemplate"
            message="Host removido!"
            deleteMessage="Host da Template"
            alertaExclusao={addHostDisponivel}
            setValores={setTemplateHost}
          />

          <AlertErrorModal ref={refAlert} />
          <SuccessAlert
            ref={refSuccess}
            aberto={false}
            message={"Host adicionado ao Template com Sucesso!"}
          />
        </Fragment>
      )}
    </div>
  );
}
