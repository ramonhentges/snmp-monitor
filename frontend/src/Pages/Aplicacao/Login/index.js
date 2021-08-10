import React, { useState, useRef, useEffect } from "react";
import { useHistory, Redirect } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Footer from "../../../Components/Footer";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import useStyles from "./styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Auth from "../../../Services/auth.service";
import Alerta from "../../../Components/Alerta/Padrao";
import crypto from "crypto-js";
import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";

export const light = {
  palette: {
    type: "light",
  },
};

export const dark = {
  palette: {
    type: "dark",
    primary: {
      main: "#ff5722",
    },
  },
};

export default function Login(props) {
  const [usuario, setUsuario] = useState({ usuario: "", senha: "" });
  const classes = useStyles();
  const history = useHistory();
  const refAlerta = useRef(null);
  const abreAlerta = (message) => {
    refAlerta.current.handleOpenMessage(message);
  };
  const [theme, setTheme] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const appliedTheme = createMuiTheme(theme ? dark : light);

  useEffect(() => {
    if (localStorage.getItem("darkMode") === null) {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        localStorage.setItem("darkMode", true);
      } else {
        localStorage.setItem("darkMode", false);
      }
    }
    setTheme(localStorage.getItem("darkMode") === "true");
    if (localStorage.getItem("messageLogin") !== null) {
      abreAlerta(localStorage.getItem("messageLogin"));
      localStorage.removeItem("messageLogin");
    }
  }, []);

  function handleInputChange(event) {
    let name = event.target.name;
    let value = event.target.value;
    setUsuario((usuario) => ({ ...usuario, [name]: value }));
  }
  function handleFormSubmit(event) {
    event.preventDefault();
    let usuarioEnvio = Object.assign({}, usuario);
    let senha = crypto.MD5(usuario.senha).toString(crypto.enc.MD5);
    usuarioEnvio = { ...usuario, senha: senha };
    Auth.login(usuarioEnvio)
      .then((response) => {
        if (response.auth) {
          if (props.location.state) {
            history.push(props.location.state.from.pathname);
          } else {
            history.push("/");
          }
        } else {
          abreAlerta(response);
        }
      })
  }
  return Auth.isLoggedIn() ? (
    <Redirect
      to={{
        pathname: "/",
      }}
    />
  ) : (
    <ThemeProvider theme={appliedTheme}>
      <CssBaseline />
      <Grid
        container
        spacing={1}
        direction="column"
        justify="center"
        alignItems="center"
        alignContent="center"
        className={classes.grid}
      >
        <Grid item>
          <Typography
            className={classes.typography}
            variant="h2"
            color="initial"
          >
            Monitoramento SNMP
          </Typography>
          <Paper className={classes.paper}>
            <form onSubmit={handleFormSubmit} autoComplete="off">
              <TextField
                fullWidth
                id="usuario"
                name="usuario"
                label="Usuário"
                value={usuario.usuario}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                id="senha"
                name="senha"
                label="Senha"
                type="password"
                value={usuario.senha}
                onChange={handleInputChange}
              />
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                type="submit"
              >
                Login
              </Button>
            </form>
          </Paper>
        </Grid>
        <Footer />
      </Grid>
      <Alerta ref={refAlerta} aberto={false} />
    </ThemeProvider>
  );
}
