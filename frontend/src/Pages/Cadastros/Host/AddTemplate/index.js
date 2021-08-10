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
  const [templatesDisponiveis, setTemplatesDisponiveis] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
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

  async function adicionarTemplate() {
    if (selectedTemplate !== null) {
      let enviar = {
        idHost: idHost,
        idTemplate: selectedTemplate.id,
      };
      CommonService.create("hosttemplate", enviar).then((response) => {
        if (response.status === 201) {
          informaSucesso();
          let novoItem = {
            id1: selectedTemplate.id,
            id2: idHost,
            primary: selectedTemplate.descricao,
          };
          setSelectedTemplate(null);
          setTemplateHost((templateHost) => [...templateHost, novoItem]);
        } else {
          informaErro({
            titulo: "Erro!",
            mensagem: response.data,
          });
        }
      });
      setTemplatesDisponiveis(
        templatesDisponiveis.filter((m) => m["id"] !== enviar.idTemplate)
      );
    }
  }

  function addTemplateDisponivel(id, descricao) {
    setTemplatesDisponiveis((templatesDisponiveis) => [
      ...templatesDisponiveis,
      { id: id, descricao: descricao },
    ]);
  }

  useEffect(() => {
    async function getTemplates() {
      let templatesAdicionados;
      await CommonService.getById(`hosttemplate/host`, idHost).then(
        (response) => {
          templatesAdicionados = response.data;
          let data = [];
          response.data.map((template) =>
            data.push({
              id1: template.idTemplate,
              id2: idHost,
              primary: template.descricao,
            })
          );
          setTemplateHost(data);
        }
      );

      await CommonService.listAll("templates").then((response) => {
        let templates = [];
        let templatesNaoAdicnionados = response.data.filter(
          (m) =>
            !templatesAdicionados.some((e) => e.idTemplate === m.idTemplate)
        );
        templatesNaoAdicnionados.map((template) =>
          templates.push({
            id: template.idTemplate,
            descricao: template.descricao,
          })
        );
        setTemplatesDisponiveis(templates);
      });
    }

    idHost !== undefined && getTemplates();
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
              options={templatesDisponiveis}
              getOptionLabel={(option) => option.descricao}
              style={{ width: 300 }}
              value={selectedTemplate}
              onChange={(event, value) => setSelectedTemplate(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Escolha um template para adicionar"
                />
              )}
            />
            <Fab
              color="primary"
              aria-label="Adicionar Template"
              onClick={adicionarTemplate}
            >
              <AddIcon />
            </Fab>
          </Grid>
          <Typography className={classes.typography} variant="h6">
            Templates Adicionados ao Host
          </Typography>
          <Listagem
            valores={templateHost}
            tipo="templatehost"
            message="Template removido!"
            deleteMessage="Template do Host"
            alertaExclusao={addTemplateDisponivel}
            setValores={setTemplateHost}
          />

          <AlertErrorModal ref={refAlert} />
          <SuccessAlert
            ref={refSuccess}
            aberto={false}
            message={"Template adicionado ao Host com Sucesso!"}
          />
        </Fragment>
      )}
    </div>
  );
}
