import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import useStyles from "./styles";

function Carregando(props) {
  const classes = useStyles();
  return (
    <>
      <Grid item xs={12} className={classes.centralizar}>
        <Typography
          variant="h6"
          color="textPrimary"
          className={classes.padding}
        >
          {props.texto}
        </Typography>
        <CircularProgress />
      </Grid>
    </>
  );
}
export default Carregando;
