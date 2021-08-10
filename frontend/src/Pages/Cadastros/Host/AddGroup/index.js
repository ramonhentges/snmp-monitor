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
  const [grupoHost, setGrupoHost] = useState([]);
  const [gruposDisponiveis, setGruposDisponiveis] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const { id: idHost } = useParams();
  const classes = useStyles();
  const refAlert = useRef(null);
  const refSuccess = useRef(null);

  const informaErro = (mensagem) => {
    refAlert.current.handleOpen(mensagem);
  };

  const informaSucesso = () => {
    refSuccess.current.handleOpen();
  };

  async function adicionarGrupo() {
    if (selectedGroup !== null && idHost !== undefined) {
      let enviar = {
        idHost: idHost,
        idGrupo: selectedGroup.id,
      };
      CommonService.create("hostgroup", enviar).then((response) => {
        if (response.status === 201) {
          informaSucesso();
          let novoItem = {
            id1: selectedGroup.id,
            id2: idHost,
            primary: selectedGroup.descricao,
          };
          setSelectedGroup(null);
          setGrupoHost((grupoHost) => [...grupoHost, novoItem]);
        } else {
          informaErro({
            titulo: "Erro!",
            mensagem: response.data,
          });
        }
      });
      setGruposDisponiveis(
        gruposDisponiveis.filter((m) => m["id"] !== enviar.idGrupo)
      );
    }
  }

  function addGrupoDisponivel(id, descricao) {
    setGruposDisponiveis((gruposDisponiveis) => [
      ...gruposDisponiveis,
      { id: id, descricao: descricao },
    ]);
  }

  useEffect(() => {
    async function getGrupos() {
      if (idHost !== undefined) {
        let gruposAdicionados;
        await CommonService.getById(`hostgroup/host`, idHost).then(
          (response) => {
            gruposAdicionados = response.data;
            let data = [];
            response.data.map((grupo) =>
              data.push({
                id1: grupo.idGrupo,
                id2: idHost,
                primary: grupo.descricao,
              })
            );
            setGrupoHost(data);
          }
        );

        await CommonService.listAll("groups").then((response) => {
          let grupos = [];
          let gruposNaoAdicnionados = response.data.filter(
            (m) => !gruposAdicionados.some((e) => e.idGrupo === m.idGrupo)
          );
          gruposNaoAdicnionados.map((grupo) =>
            grupos.push({
              id: grupo.idGrupo,
              descricao: grupo.descricao,
            })
          );
          setGruposDisponiveis(grupos);
        });
      }
    }
    getGrupos();
  }, [idHost]);

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
              options={gruposDisponiveis}
              getOptionLabel={(option) => option.descricao}
              style={{ width: 300 }}
              value={selectedGroup}
              onChange={(event, value) => setSelectedGroup(value)}
              renderInput={(params) => (
                <TextField {...params} label="Escolha um grupo para adicionar" />
              )}
            />
            <Fab
              color="primary"
              aria-label="Adicionar Grupo"
              onClick={adicionarGrupo}
            >
              <AddIcon />
            </Fab>
          </Grid>
          <Typography className={classes.typography} variant="h6">
            Grupos Adicionados ao Host
          </Typography>
          <Listagem
            valores={grupoHost}
            tipo="grouphost"
            message="Grupo removido!"
            deleteMessage="Grupo do Host"
            alertaExclusao={addGrupoDisponivel}
            setValores={setGrupoHost}
          />
          <AlertErrorModal ref={refAlert} />
          <SuccessAlert
            ref={refSuccess}
            aberto={false}
            message={"Grupo adicionado ao Host com Sucesso!"}
          />
        </Fragment>
      )}
    </div>
  );
}
