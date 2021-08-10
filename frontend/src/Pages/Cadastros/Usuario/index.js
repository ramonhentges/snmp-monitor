import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import Corpo from "../../../Components/CorpoPagina";
import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AlertModal from "../../../Components/Modal/Alert";
import CommonService from "../../../Services/common";
import crypto from "crypto-js";
import useStyles from "./styles";

export default function HostForm() {
  const { id } = useParams();
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  let history = useHistory();
  const refAlert = useRef(null);
  const [campos, setCampos] = useState({
    nomeCompleto: "",
    usuario: "",
    senha: "",
  });

  const [erros, setErros] = useState({});

  const informaErro = (mensagem) => {
    refAlert.current.handleOpen(mensagem);
  };

  useEffect(() => {
    async function getUser() {
      if (id !== undefined) {
        await CommonService.getById("user", id)
          .then((response) => {
            delete response.data["idUsuario"];
            setCampos(response.data);
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }
    getUser();
  }, [id]);

  function handleInputChange(event) {
    let name = event.target.name;
    let value = event.target.value;
    setCampos((campos) => ({ ...campos, [name]: value }));
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    let usuarioEnvio = Object.assign({}, campos);
    let senha = crypto.MD5(campos.senha).toString(crypto.enc.MD5)
    usuarioEnvio = ({ ...campos, senha: senha})
    if (id === undefined) {
      CommonService.create("user", usuarioEnvio).then((response) => {
        if (response.status === 201) {
          history.push({
            pathname: "/userlist",
            state: {
              abrir: true,
              message: "Usuário cadastrado com sucesso!",
            },
          });
        } else {
          setErros(response.data);
          informaErro({
            titulo: "Erro!",
            mensagem: response.data,
          });
        }
      });
    } else {
      CommonService.update("user", id, usuarioEnvio).then((response) => {
        if (response.status === 200) {
          history.push({
            pathname: "/userlist",
            state: {
              abrir: true,
              message: "Usuário editado com Sucesso!",
            },
          });
        } else {
          setErros(response.data);
          informaErro({
            titulo: "Erro!",
            mensagem: response.data,
          });
        }
      });
    }
  }
  return (
    <Corpo usuarios={true}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={fixedHeightPaper}>
            <form
              onSubmit={handleFormSubmit}
              autoComplete="off"
              className={classes.field}
            >
              <Typography variant="h4">Cadastro de Usuário</Typography>

              <TextField
                required
                id="nomeCompleto"
                name="nomeCompleto"
                label="Nome Completo"
                type="text"
                value={campos["nomeCompleto"]}
                onChange={handleInputChange}
                error={erros.nomeCompleto}
                helperText={erros.nomeCompleto}
              />

              <TextField
                required
                id="usuario"
                name="usuario"
                label="Nome de Usuário"
                type="text"
                value={campos["usuario"]}
                onChange={handleInputChange}
                error={erros.usuario}
                helperText={erros.usuario}
              />

              <TextField
                required={!id}
                id="senha"
                name="senha"
                label="Senha"
                type="password"
                value={campos["senha"]}
                onChange={handleInputChange}
                error={erros.senha}
                helperText={erros.senha}
              />

              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                type="submit"
              >
                Salvar
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
      <AlertModal ref={refAlert} />
    </Corpo>
  );
}
