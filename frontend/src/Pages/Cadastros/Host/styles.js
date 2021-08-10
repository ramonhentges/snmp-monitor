import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  paper: {
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
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
  paperPadding: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  tabs: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

export default useStyles;
