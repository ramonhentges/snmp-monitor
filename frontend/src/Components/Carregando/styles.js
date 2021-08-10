import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  centralizar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  padding: {
    padding: theme.spacing(2),
  },
}));

export default useStyles;
