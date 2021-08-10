import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    padding: theme.spacing(1),
  },
  padding: {
    padding: theme.spacing(2),
  },
}));
export default useStyles;