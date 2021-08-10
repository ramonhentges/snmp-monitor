import React, { useState, useEffect } from "react";
import Header from "../Header";
import Footer from "../Footer";
import Container from "@material-ui/core/Container";
import useStyles from "./styles";
import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import { ConfirmProvider } from "material-ui-confirm";

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
export default function CorpoPagina(props) {
  const classes = useStyles();
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
  }, []);

  return (
    <ThemeProvider theme={appliedTheme}>
      <ConfirmProvider>
        <div className={classes.root}>
        <Header selected={props} setTheme={setTheme} theme={theme} />
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container className={classes.container}>
              {props.children}
            </Container>
            <Footer />
          </main>
        </div>
      </ConfirmProvider>
    </ThemeProvider>
  );
}
