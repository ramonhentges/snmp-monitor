import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    "& .MuiTextField-root": {
      marginBottom: theme.spacing(2),
    },
    padding: theme.spacing(2),
    margin: "auto",
  },
  typography: {
    padding: theme.spacing(2),
    textAlign: "center",
  },
  button: {
    float: "right",
  },
  grid: {
    minHeight: "95vh"
  }
}));

export default useStyles;
