import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: "auto",
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  field: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
  },
  button: {
    float: "right",
  },
  width: {
    width: "48.4%",
  },
  fullWidth: {
    width: "98.5%",
  },
}));

export default useStyles;
