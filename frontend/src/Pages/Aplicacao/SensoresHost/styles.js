import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "auto",
  },
  padding: {
    padding: theme.spacing(2),
  },
  button: {
    float: "right",
  }
}));
export default useStyles;
