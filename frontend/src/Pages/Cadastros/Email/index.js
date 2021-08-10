import React, { useState, useEffect, useRef } from "react";
import Corpo from "../../../Components/CorpoPagina";
import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AlertModal from "../../../Components/Modal/Alert";
import MyAlert from "../../../Components/Alerta/Padrao";
import Switch from "@material-ui/core/Switch";
import FormLabel from "@material-ui/core/FormLabel";
import EmailService from "../../../Services/email";
import useStyles from "./styles";

export default function EmailForm() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const refAlert = useRef(null);
  const refMyAlert = useRef(null);
  const [campos, setCampos] = useState({
    descricao: "",
    emailOrigem: "",
    emailDestino: "",
    hostSmtp: "",
    portaSmtp: 0,
    criptografia: false,
    usuario: "",
    senha: "",
  });

  const [erros, setErros] = useState({});

  const informaErro = (mensagem) => {
    refAlert.current.handleOpen(mensagem);
  };

  const informaSucesso = () => {
    refMyAlert.current.handleOpen();
  };

  useEffect(() => {
    async function getEmail() {
      await EmailService.get()
        .then((response) => {
          delete response.data["idEmail"];
          setCampos(response.data);
        })
        .catch(function (error) {
          console.log(error);
          informaErro({
            titulo: "Erro de conexão!",
            mensagem: ["Não foi possível receber os dados do servidor!"],
          });
        });
    }
    getEmail();
  }, []);

  function handleInputChange(event) {
    let name = event.target.name;
    let value = event.target.value;
    //setTheArray(oldArray => [...oldArray, newElement]); //add new element to the array
    setCampos((campos) => ({ ...campos, [name]: value })); //update value array
  }

  const handleChange = (event) => {
    setCampos({ ...campos, [event.target.name]: event.target.checked });
  };

  function handleFormSubmit(event) {
    event.preventDefault();
    EmailService.update(campos).then((response) => {
      if (response.status === 200) {
        informaSucesso();
      } else {
        setErros(response.data);
        informaErro({
          titulo: "Erro!",
          mensagem: response.data,
        });
      }
    });
  }
  return (
    <Corpo email={true}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={fixedHeightPaper}>
            <form
              onSubmit={handleFormSubmit}
              autoComplete="off"
              className={classes.field}
            >
              <Typography variant="h4">Email</Typography>

              <TextField
                fullWidth
                required
                id="descricao"
                name="descricao"
                label="Descricao do Email"
                type="text"
                value={campos["descricao"]}
                onChange={handleInputChange}
                error={erros.descricao}
                helperText={erros.descricao}
              />
              <Grid container justify="center" spacing={3}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    required
                    id="emailOrigem"
                    name="emailOrigem"
                    label="Email de origem"
                    type="text"
                    value={campos["emailOrigem"]}
                    onChange={handleInputChange}
                    error={erros.emailOrigem}
                    helperText={erros.emailOrigem}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    required
                    id="emailDestino"
                    name="emailDestino"
                    label="Email de destino"
                    type="text"
                    value={campos["emailDestino"]}
                    onChange={handleInputChange}
                    error={erros.emailDestino}
                    helperText={erros.emailDestino}
                  />
                </Grid>
              </Grid>

              <Grid container justify="center" spacing={3}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    required
                    id="hostSmtp"
                    name="hostSmtp"
                    label="Host SMTP"
                    type="text"
                    value={campos["hostSmtp"]}
                    onChange={handleInputChange}
                    error={erros.hostSmtp}
                    helperText={erros.hostSmtp}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    required
                    id="portaSmtp"
                    name="portaSmtp"
                    label="Porta SMTP"
                    type="number"
                    value={campos["portaSmtp"]}
                    onChange={handleInputChange}
                    error={erros.portaSmtp}
                    helperText={erros.portaSmtp}
                  />
                </Grid>
              </Grid>
              <Grid container justify="center" spacing={3}>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
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
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    required
                    id="senha"
                    name="senha"
                    label="Senha"
                    type="password"
                    value={campos["senha"]}
                    onChange={handleInputChange}
                    error={erros.senha}
                    helperText={erros.senha}
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormLabel component="legend">Usar Criptografia</FormLabel>
                  <Switch
                    checked={campos["criptografia"]}
                    onChange={handleChange}
                    name="criptografia"
                    inputProps={{ "aria-label": "secondary checkbox" }}
                  />
                </Grid>
              </Grid>
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
      <MyAlert
        ref={refMyAlert}
        aberto={false}
        message={"Email atualizado com sucesso!"}
      />
    </Corpo>
  );
}
